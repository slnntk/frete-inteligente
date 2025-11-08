"use client"

import { useEffect, useRef, useState, useMemo, useCallback } from "react"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"
import { MapPin, Navigation } from "lucide-react"
import type { RotaResponse, Waypoint } from "@/services/rota.service"

interface TripMapProps {
  pontoPartida?: {
    latitude: number
    longitude: number
    endereco?: string
  }
  passageiros?: Array<{
    id: number
    nome: string
    endereco?: string
    latitude?: number
    longitude?: number
    checkedIn?: boolean
    coletado?: boolean
  }>
  motorista?: {
    latitude: number
    longitude: number
  }
  rota?: RotaResponse | null
  height?: string
  showRoute?: boolean
}

export function TripMap({ 
  pontoPartida, 
  passageiros = [], 
  motorista,
  rota,
  height = "400px",
  showRoute = true 
}: TripMapProps) {
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const markersRef = useRef<mapboxgl.Marker[]>([])
  const [mounted, setMounted] = useState(false)
  const boundsInitializedRef = useRef(false)
  const lastDataRef = useRef<string>("")

  // Calcular centro inicial
  const getInitialCenter = (): [number, number] => {
    if (pontoPartida?.latitude && pontoPartida?.longitude) {
      return [pontoPartida.longitude, pontoPartida.latitude]
    }
    if (passageiros.length > 0 && passageiros[0].latitude && passageiros[0].longitude) {
      return [passageiros[0].longitude, passageiros[0].latitude]
    }
    return [-38.5433, -3.7172] // Fortaleza, CE
  }

  const initialCenter = useMemo(() => getInitialCenter(), [pontoPartida, passageiros])
  const initialZoom = pontoPartida ? 13 : 12

  // Gerar GeoJSON para a rota (prioriza rota real do Mapbox se disponível)
  const routeGeoJson = useMemo(() => {
    if (!rota || !showRoute) return null

    // Se houver rota real do Mapbox, usar ela (seguindo as ruas)
    if (rota.rotaReal && rota.rotaReal.coordinates && rota.rotaReal.coordinates.length > 0) {
      return {
        type: "Feature" as const,
        geometry: {
          type: "LineString" as const,
          coordinates: rota.rotaReal.coordinates
        },
        properties: {}
      }
    }

    // Caso contrário, usar linha reta entre os pontos
    const coordinates: Array<[number, number]> = []

    if (rota.pontoPartida) {
      coordinates.push([rota.pontoPartida.longitude, rota.pontoPartida.latitude])
    }

    rota.waypoints.forEach(wp => {
      coordinates.push([wp.longitude, wp.latitude])
    })

    if (coordinates.length < 2) return null

    return {
      type: "Feature" as const,
      geometry: {
        type: "LineString" as const,
        coordinates
      },
      properties: {}
    }
  }, [rota, showRoute])

  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN

  useEffect(() => {
    setMounted(true)
  }, [])

  // Inicializar o mapa (apenas uma vez)
  useEffect(() => {
    if (!mapContainerRef.current || !mapboxToken || !mounted || mapRef.current) return

    mapboxgl.accessToken = mapboxToken

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: initialCenter,
      zoom: initialZoom
    })

    // Cleanup apenas ao desmontar
    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
        boundsInitializedRef.current = false
        lastDataRef.current = ""
      }
      // Remover todos os markers
      markersRef.current.forEach(marker => marker.remove())
      markersRef.current = []
    }
  }, [mapboxToken, mounted]) // Removido initialCenter e initialZoom para não recriar o mapa

  // Serializar dados para comparar mudanças
  // IMPORTANTE: Incluir status de coleta na comparação para detectar mudanças
  const dataKey = useMemo(() => {
    // Criar uma chave única incluindo TODOS os dados relevantes, especialmente o status de coleta
    const passageirosKey = passageiros.map(p => 
      `${p.id}-${p.latitude}-${p.longitude}-${p.checkedIn || false}-${p.coletado || false}`
    ).join('|')
    const pontoKey = pontoPartida ? `${pontoPartida.latitude}-${pontoPartida.longitude}` : ''
    const motoristaKey = motorista ? `${motorista.latitude}-${motorista.longitude}` : ''
    // Incluir status de coleta dos waypoints na rota também
    const waypointsKey = rota?.waypoints?.map(wp => 
      `${wp.id}-${wp.coletado || false}`
    ).join('|') || ''
    const rotaKey = rota ? JSON.stringify(rota.rotaReal?.coordinates?.slice(0, 10)) : '' // Primeiros 10 pontos para comparação
    return `${passageirosKey}|${pontoKey}|${motoristaKey}|${waypointsKey}|${rotaKey}`
  }, [passageiros, pontoPartida, motorista, rota])

  // Adicionar markers e rota quando o mapa estiver carregado
  useEffect(() => {
    if (!mapRef.current) {
      console.log("[TripMap] Mapa não está disponível ainda")
      return
    }
    
    if (dataKey === lastDataRef.current) {
      console.log("[TripMap] Dados não mudaram, pulando atualização")
      return // Dados não mudaram, não atualizar
    }

    console.log("[TripMap] Dados mudaram! Atualizando mapa...")
    console.log("[TripMap] dataKey anterior:", lastDataRef.current?.substring(0, 100))
    console.log("[TripMap] dataKey nova:", dataKey.substring(0, 100))
    console.log("[TripMap] Passageiros com coletado:", passageiros.map(p => `${p.nome}: coletado=${p.coletado}`))

    const map = mapRef.current
    lastDataRef.current = dataKey

    const setupMap = () => {
      // Limpar markers anteriores
      markersRef.current.forEach(marker => marker.remove())
      markersRef.current = []

      // Criar mapeamento de ordem baseado nos waypoints da rota
      const ordemMap = new Map<number, number>() // Map<passageiroId, ordem>
      if (rota && rota.waypoints) {
        rota.waypoints.forEach((wp, index) => {
          ordemMap.set(wp.id, index + 1) // Ordem começa em 1
        })
      }

      // Adicionar marker de partida
      if (pontoPartida?.latitude && pontoPartida?.longitude) {
        const el = document.createElement("div")
        el.className = "custom-marker"
        el.innerHTML = `
          <div style="background-color: #2563eb; color: white; padding: 8px 12px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.3); display: flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 600;">
            <div style="width: 24px; height: 24px; background-color: rgba(255,255,255,0.3); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 12px;">
              🚩
            </div>
            <span>Partida</span>
          </div>
        `

        const marker = new mapboxgl.Marker({ element: el, anchor: 'bottom' })
          .setLngLat([pontoPartida.longitude, pontoPartida.latitude])
          .addTo(map)

        markersRef.current.push(marker)
      }

      // Ordenar passageiros pela ordem dos waypoints
      const passageirosOrdenados = [...passageiros].sort((a, b) => {
        const ordemA = ordemMap.get(a.id) || 999
        const ordemB = ordemMap.get(b.id) || 999
        return ordemA - ordemB
      })

      // Adicionar marcador do motorista
      if (motorista?.latitude && motorista?.longitude) {
        const elMotorista = document.createElement("div")
        elMotorista.className = "custom-marker"
        elMotorista.innerHTML = `
          <div style="background-color: #7c3aed; color: white; padding: 10px 14px; border-radius: 12px; box-shadow: 0 4px 12px rgba(124,58,237,0.5); display: flex; align-items: center; gap: 8px; font-size: 12px; font-weight: 700; border: 3px solid white;">
            <div style="width: 32px; height: 32px; background-color: rgba(255,255,255,0.3); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 18px;">
              🚗
            </div>
            <span>Motorista</span>
          </div>
        `
        const markerMotorista = new mapboxgl.Marker({ element: elMotorista, anchor: 'bottom' })
          .setLngLat([motorista.longitude, motorista.latitude])
          .addTo(map)
        markersRef.current.push(markerMotorista)
      }

      // Adicionar markers de passageiros com números de ordem
      console.log("[TripMap] Criando markers para passageiros:", passageirosOrdenados.map(p => ({
        nome: p.nome,
        id: p.id,
        coletado: p.coletado,
        checkedIn: p.checkedIn
      })))
      
      passageirosOrdenados.forEach((p) => {
        if (!p.latitude || !p.longitude) {
          console.warn(`[TripMap] Passageiro ${p.nome} não tem coordenadas`)
          return
        }

        const ordem = ordemMap.get(p.id)
        const nomeEscapado = p.nome.replace(/"/g, '&quot;').replace(/'/g, '&#39;')
        
        // Determinar cor e status baseado no estado
        // IMPORTANTE: Verificar status de coleta primeiro
        let bgColor = "#f97316" // Laranja (pendente)
        let statusText = "Aguardando"
        let borderColor = "rgba(255,255,255,0.5)"
        
        console.log(`[TripMap] Passageiro ${p.nome}: coletado=${p.coletado}, checkedIn=${p.checkedIn}`)
        
        if (p.coletado === true) {
          bgColor = "#6b7280" // Cinza (coletado)
          statusText = "✓ Coletado"
          borderColor = "rgba(107,114,128,0.8)"
          console.log(`[TripMap] Marker ${p.nome} será CINZA (coletado)`)
        } else if (p.checkedIn) {
          // Verificar se é o próximo baseado na ordem da rota
          // O próximo é o primeiro não coletado na ordem da rota
          let isProximo = false
          if (ordem) {
            // Encontrar o primeiro passageiro não coletado na ordem
            const passageirosNaoColetados = passageirosOrdenados
              .filter(pp => !pp.coletado && pp.checkedIn && ordemMap.get(pp.id))
              .sort((a, b) => {
                const ordemA = ordemMap.get(a.id) || 999
                const ordemB = ordemMap.get(b.id) || 999
                return ordemA - ordemB
              })
            
            if (passageirosNaoColetados.length > 0) {
              const primeiroNaoColetado = passageirosNaoColetados[0]
              isProximo = primeiroNaoColetado.id === p.id
            }
          }
          
          if (isProximo) {
            bgColor = "#3b82f6" // Azul (próximo)
            statusText = "👉 Próximo"
            borderColor = "rgba(59,130,246,0.8)"
          } else {
            bgColor = "#16a34a" // Verde (check-in feito, aguardando)
            statusText = "✓ Check-in"
            borderColor = "rgba(22,163,74,0.8)"
          }
        }
        
        const el = document.createElement("div")
        el.className = "custom-marker"
        el.innerHTML = `
          <div style="background-color: ${bgColor}; color: white; padding: 8px 10px; border-radius: 10px; box-shadow: 0 3px 10px rgba(0,0,0,0.4); display: flex; align-items: center; gap: 8px; font-size: 11px; min-width: 120px; position: relative; border: 2px solid ${borderColor};">
            ${ordem ? `
              <div style="width: 28px; height: 28px; background-color: rgba(255,255,255,0.25); border: 2px solid rgba(255,255,255,0.5); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 14px; flex-shrink: 0;">
                ${ordem}
              </div>
            ` : ''}
            <div style="display: flex; flex-direction: column; flex: 1; min-width: 0;">
              <span style="font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${nomeEscapado}</span>
              <span style="font-size: 9px; opacity: 0.9; white-space: nowrap;">${statusText}</span>
            </div>
          </div>
        `

        const marker = new mapboxgl.Marker({ element: el, anchor: 'bottom' })
          .setLngLat([p.longitude, p.latitude])
          .addTo(map)

        markersRef.current.push(marker)
      })

      // Adicionar rota se existir
      if (map.getSource("route")) {
        map.removeLayer("route-line")
        map.removeSource("route")
      }

      if (routeGeoJson) {
        try {
          map.addSource("route", {
            type: "geojson",
            data: routeGeoJson
          })

          map.addLayer({
            id: "route-line",
            type: "line",
            source: "route",
            layout: {
              "line-join": "round",
              "line-cap": "round"
            },
            paint: {
              "line-color": "#3b82f6",
              "line-width": 4,
              "line-opacity": 0.7
            }
          })
        } catch (error) {
          console.error("Erro ao adicionar rota:", error)
        }
      }

      // Ajustar bounds para mostrar todos os pontos (incluindo motorista)
      const points: Array<[number, number]> = []
      
      if (pontoPartida?.latitude && pontoPartida?.longitude) {
        points.push([pontoPartida.longitude, pontoPartida.latitude])
      }
      
      if (motorista?.latitude && motorista?.longitude) {
        points.push([motorista.longitude, motorista.latitude])
      }
      
      passageiros.forEach(p => {
        if (p.latitude && p.longitude) {
          points.push([p.longitude, p.latitude])
        }
      })

      // Ajustar bounds apenas na primeira vez (evitar piscar)
      if (points.length > 0 && !boundsInitializedRef.current) {
        const bounds = new mapboxgl.LngLatBounds()
        points.forEach(([lng, lat]) => bounds.extend([lng, lat]))
        map.fitBounds(bounds, { padding: 50, duration: 1000 })
        boundsInitializedRef.current = true
      }
    }

    // Aguardar o mapa carregar antes de adicionar markers
    if (map.loaded()) {
      setupMap()
    } else {
      const loadHandler = () => {
        setupMap()
        boundsInitializedRef.current = true
      }
      map.once("load", loadHandler)
      
      return () => {
        map.off("load", loadHandler)
      }
    }
  }, [dataKey, rota, routeGeoJson, showRoute, passageiros, pontoPartida, motorista]) // Incluir dependências explícitas para garantir atualização

  if (!mapboxToken) {
    return (
      <div className="w-full rounded border border-dashed flex items-center justify-center bg-muted" style={{ height }}>
        <div className="text-center p-4">
          <p className="text-muted-foreground mb-2">Mapbox token não configurado</p>
          <p className="text-sm text-muted-foreground">
            Adicione NEXT_PUBLIC_MAPBOX_TOKEN no arquivo .env.local
          </p>
        </div>
      </div>
    )
  }

  if (!mounted) {
    return (
      <div className="w-full rounded border border-dashed flex items-center justify-center bg-muted" style={{ height }}>
        <div className="text-center p-4">
          <p className="text-muted-foreground">Carregando mapa...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full rounded-lg overflow-hidden border" style={{ height }}>
      <div ref={mapContainerRef} style={{ width: "100%", height: "100%" }} />
    </div>
  )
}
