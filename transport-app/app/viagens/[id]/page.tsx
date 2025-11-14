"use client"

import { useEffect, useState, useMemo, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { viagemService } from "@/services/viagem.service"
import { rotaService, type RotaResponse } from "@/services/rota.service"
import { pagamentoService, type PagamentoResponse } from "@/services/pagamento.service"
import { TripMap } from "@/components/map/TripMap"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Route, CheckCircle2, Navigation, DollarSign } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { coletaService } from "@/services/coleta.service"
import { apiClient } from "@/lib/api-client"
import type { Viagem, ViagemStatus } from "@/types"

interface Participante {
  id: number
  nome: string
  email: string
  telefone: string
  checkedIn: boolean
  coletado: boolean
  endereco?: string
  latitude?: number
  longitude?: number
  pagamentoStatus?: "PENDENTE" | "PAGO" | "FALHOU"
}

export default function ViagemGestaoPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const { usuario } = useAuth()
  const { toast } = useToast()
  const [participantes, setParticipantes] = useState<Participante[]>([])
  const [loading, setLoading] = useState(true)
  const [viagem, setViagem] = useState<Viagem | null>(null)
  const [iniciadaEm, setIniciadaEm] = useState<string | null>(null)
  const [rota, setRota] = useState<RotaResponse | null>(null)
  const [loadingRota, setLoadingRota] = useState(false)
  const [marcandoColeta, setMarcandoColeta] = useState<number | null>(null)
  const [rastreandoLocalizacao, setRastreandoLocalizacao] = useState(false)
  const [pagamentos, setPagamentos] = useState<Map<number, PagamentoResponse>>(new Map())

  useEffect(() => {
    // Verificar se há usuário no localStorage primeiro (para evitar redirecionamento desnecessário)
    const storedUsuario = localStorage.getItem('usuario')
    if (!storedUsuario && !usuario) {
      router.push("/login")
      return
    }
    
    if (usuario) {
      if (usuario.tipo === "CLIENTE") {
        // clientes não podem acessar gestão de viagem
        router.push("/feed")
        return
      }
      carregar()
    } else if (storedUsuario) {
      // Se não há usuário no estado mas há no localStorage, aguardar um pouco
      setTimeout(() => {
        if (usuario) {
          if (usuario.tipo === "CLIENTE") {
            router.push("/feed")
            return
          }
          carregar()
        }
      }, 100)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usuario, params.id])

  // Atualizar automaticamente quando viagem estiver em andamento (com debounce)
  useEffect(() => {
    if (viagem?.status !== "EM_ANDAMENTO") return

    // Usar um intervalo maior para evitar atualizações muito frequentes
    const interval = setInterval(() => {
      carregar(true) // Atualizar silenciosamente (sem mostrar loading)
    }, 10000) // Atualizar a cada 10 segundos (ao invés de 5)

    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viagem?.status, params.id])

  // Memoizar dados para o mapa (sempre chamado no topo, antes de qualquer condição)
  const pontoPartidaMemo = useMemo(() => 
    viagem?.latitudePartida && viagem?.longitudePartida
      ? {
          latitude: viagem.latitudePartida,
          longitude: viagem.longitudePartida,
          endereco: viagem.enderecoPartida
        }
      : undefined
  , [viagem?.latitudePartida, viagem?.longitudePartida, viagem?.enderecoPartida])

  const passageirosMemo = useMemo(() => participantes.map(p => ({
    id: p.id,
    nome: p.nome,
    endereco: p.endereco,
    latitude: p.latitude,
    longitude: p.longitude,
    checkedIn: p.checkedIn,
    coletado: p.coletado
  })), [participantes])

  const motoristaMemo = useMemo(() =>
    viagem && (viagem as any).latitudeMotorista && (viagem as any).longitudeMotorista
      ? {
          latitude: (viagem as any).latitudeMotorista,
          longitude: (viagem as any).longitudeMotorista
        }
      : undefined
  , [viagem, (viagem as any)?.latitudeMotorista, (viagem as any)?.longitudeMotorista])

  const carregar = async (silent = false) => {
    try {
      if (!silent) setLoading(true)
      const v = await viagemService.buscarPorId(Number(params.id))
      setViagem(v)
      const data = await viagemService.listarParticipantes(Number(params.id))
      
      // Carregar pagamentos
      try {
        const pagamentosData = await pagamentoService.buscarPorViagem(Number(params.id))
        const pagamentosMap = new Map<number, PagamentoResponse>()
        pagamentosData.forEach(p => {
          pagamentosMap.set(p.usuarioId, p)
        })
        setPagamentos(pagamentosMap)
        
        // Adicionar status de pagamento aos participantes
        data.forEach(p => {
          const pagamento = pagamentosMap.get(p.id)
          if (pagamento) {
            (p as any).pagamentoStatus = pagamento.status
          }
        })
      } catch (error) {
        console.warn("Erro ao carregar pagamentos:", error)
      }
      
      // Carregar rota se houver participantes
      if (data.length > 0) {
        try {
          const rotaData = await rotaService.calcularRota(Number(params.id))
          setRota(rotaData)
          
          // Ordenar participantes pela ordem da rota
          if (rotaData && rotaData.waypoints) {
            const ordemMap = new Map<number, number>()
            rotaData.waypoints.forEach((wp, index) => {
              ordemMap.set(wp.id, index + 1)
            })
            const participantesOrdenados = [...data].sort((a, b) => {
              const ordemA = ordemMap.get(a.id) ?? 999
              const ordemB = ordemMap.get(b.id) ?? 999
              return ordemA - ordemB
            })
            // Só atualizar se realmente mudou
            setParticipantes(prev => {
              const prevKey = prev.map(p => `${p.id}-${p.checkedIn}-${p.coletado}-${p.pagamentoStatus}`).join('|')
              const newKey = participantesOrdenados.map(p => `${p.id}-${p.checkedIn}-${p.coletado}-${p.pagamentoStatus}`).join('|')
              return prevKey === newKey ? prev : participantesOrdenados
            })
          } else {
            setParticipantes(data)
          }
        } catch (error) {
          // Se não conseguir carregar rota, apenas carregar participantes
          setParticipantes(data)
        }
      } else {
        setParticipantes(data)
      }
    } finally {
      if (!silent) setLoading(false)
    }
  }

  const carregarRota = async () => {
    try {
      setLoadingRota(true)
      const rotaData = await rotaService.calcularRota(Number(params.id))
      setRota(rotaData)
    } catch (error) {
      console.error("Erro ao carregar rota:", error)
      // Se não houver ponto de partida, não é erro crítico
    } finally {
      setLoadingRota(false)
    }
  }

  const iniciarViagem = async () => {
    try {
      if (!viagem) {
        toast({ title: "Erro", description: "Viagem não carregada", variant: "destructive" })
        return
      }
      
      await viagemService.atualizar(Number(params.id), { status: "EM_ANDAMENTO" as ViagemStatus })
      const agora = new Date()
      setIniciadaEm(agora.toLocaleTimeString())
      
      // atualizar viagem para refletir status
      const v = await viagemService.buscarPorId(Number(params.id))
      setViagem(v)
      
      toast({ title: "Viagem iniciada!", description: "Status atualizado para EM_ANDAMENTO" })
    } catch (error: any) {
      console.error("Erro ao iniciar viagem:", error)
      toast({ 
        title: "Erro ao iniciar viagem", 
        description: error?.message || "Não foi possível atualizar o status da viagem",
        variant: "destructive" 
      })
    }
  }

  const marcarColeta = async (clienteId: number) => {
    try {
      setMarcandoColeta(clienteId)
      const participante = participantes.find(p => p.id === clienteId)
      
      if (!participante) {
        toast({ 
          title: "Erro", 
          description: "Participante não encontrado",
          variant: "destructive" 
        })
        return
      }

      // Verificar se o participante fez check-in (precisa ter coordenadas)
      if (!participante.checkedIn) {
        toast({ 
          title: "Erro", 
          description: "O participante precisa fazer check-in antes de ser coletado",
          variant: "destructive" 
        })
        return
      }
      
      // Usar localização do passageiro (do check-in) ou do motorista se disponível
      let lat = participante.latitude
      let lng = participante.longitude
      
      // Se tiver localização do motorista e não tiver do participante, usar do motorista
      if ((!lat || !lng) && viagem && (viagem as any).latitudeMotorista && (viagem as any).longitudeMotorista) {
        lat = (viagem as any).latitudeMotorista
        lng = (viagem as any).longitudeMotorista
      }

      // Se ainda não tiver coordenadas, usar coordenadas padrão ou avisar
      if (!lat || !lng) {
        toast({ 
          title: "Aviso", 
          description: "Coleta marcada sem coordenadas. Ative o rastreamento GPS para melhor precisão.",
          variant: "default" 
        })
      }
      
      console.log("[Marcar Coleta] Dados:", {
        viagemId: Number(params.id),
        clienteId,
        latitude: lat,
        longitude: lng,
        participante: participante.nome
      })
      
      await coletaService.criar(Number(params.id), clienteId, lat, lng)
      
      console.log("[Marcar Coleta] Sucesso!")
      
      // Recarregar participantes para atualizar status
      await carregar(true) // Carregar silenciosamente para não mostrar loading
      
      toast({ 
        title: "Coleta marcada!", 
        description: `${participante.nome} foi marcado como coletado` 
      })
    } catch (error: any) {
      console.error("[Marcar Coleta] Erro completo:", error)
      console.error("[Marcar Coleta] Erro message:", error?.message)
      console.error("[Marcar Coleta] Erro status:", error?.status)
      console.error("[Marcar Coleta] Erro stack:", error?.stack)
      
      const errorMessage = error?.message || "Não foi possível marcar a coleta"
      
      // Mensagens de erro mais específicas
      let userMessage = errorMessage
      if (errorMessage.includes("já foi coletado") || errorMessage.includes("já foi coletado")) {
        userMessage = "Este participante já foi coletado nesta viagem"
      } else if (errorMessage.includes("não encontrado") || errorMessage.includes("não encontrada")) {
        userMessage = "Dados não encontrados. Recarregue a página."
      } else if (errorMessage.includes("obrigatório") || errorMessage.includes("obrigatória")) {
        userMessage = `Dados inválidos: ${errorMessage}`
      } else if (error?.status === 400) {
        userMessage = `Erro de validação: ${errorMessage}`
      } else if (error?.status === 404) {
        userMessage = "Recurso não encontrado. Recarregue a página."
      } else if (error?.status === 500) {
        userMessage = "Erro no servidor. Tente novamente."
      }
      
      toast({ 
        title: "Erro ao marcar coleta", 
        description: userMessage,
        variant: "destructive" 
      })
    } finally {
      setMarcandoColeta(null)
    }
  }

  const iniciarRastreamento = () => {
    if (!navigator.geolocation) {
      toast({ title: "Erro", description: "Geolocalização não suportada pelo navegador", variant: "destructive" })
      return
    }

    setRastreandoLocalizacao(true)
    
    const watchId = navigator.geolocation.watchPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        try {
          await apiClient.put(`/viagens/${params.id}/motorista/localizacao`, { latitude, longitude })
          
          // Atualizar viagem localmente
          const v = await viagemService.buscarPorId(Number(params.id))
          setViagem(v)
        } catch (error) {
          console.error("Erro ao atualizar localização:", error)
        }
      },
      (error) => {
        console.error("Erro ao obter localização:", error)
        toast({ title: "Erro", description: "Não foi possível obter a localização", variant: "destructive" })
        setRastreandoLocalizacao(false)
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    )

    // Armazenar watchId para poder parar depois
    ;(window as any).__geoWatchId = watchId
  }

  const pararRastreamento = () => {
    const watchId = (window as any).__geoWatchId
    if (watchId) {
      navigator.geolocation.clearWatch(watchId)
      ;(window as any).__geoWatchId = null
    }
    setRastreandoLocalizacao(false)
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Participantes da Viagem #{params.id}</h1>
      {loading ? (
        <Card className="bg-card border-border"><CardContent className="pt-6">Carregando...</CardContent></Card>
      ) : (
        <div className="space-y-6">
          {/* Controles da viagem */}
          <Card className="bg-card border-border">
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div className="space-y-1">
                  <h2 className="font-semibold">Viagem #{params.id}</h2>
                  <div className="text-sm text-muted-foreground flex flex-wrap gap-4">
                    <span>Horário previsto: {viagem?.horarioPartida || "—"}</span>
                    <span>Capacidade: {viagem?.capacidade ?? "—"}</span>
                    <span>Status: <Badge>{viagem?.status || "—"}</Badge></span>
                    <span>Iniciada em: {iniciadaEm || "—"}</span>
                  </div>
                </div>
                <Button 
                  className="bg-primary text-primary-foreground hover:bg-primary/90" 
                  onClick={iniciarViagem}
                  disabled={viagem?.status === "EM_ANDAMENTO" || viagem?.status === "ENCERRADA"}
                >
                  {viagem?.status === "EM_ANDAMENTO" ? "VIAGEM EM ANDAMENTO" : 
                   viagem?.status === "ENCERRADA" ? "VIAGEM ENCERRADA" : 
                   "INICIAR VIAGEM"}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Mapa com rota */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-base font-semibold flex items-center gap-2 text-foreground">
                    <Route className="h-5 w-5 text-primary" />
                    Mapa da Viagem
                  </h3>
                  {rota && (
                    <Badge variant="outline" className="text-sm">
                      📍 {rota.distanciaEstimada} km · {rota.totalPontos} pontos
                    </Badge>
                  )}
                </div>
                <div className="rounded-lg overflow-hidden border-2 border-border shadow-sm">
                  <TripMap
                    pontoPartida={pontoPartidaMemo}
                    passageiros={passageirosMemo}
                    motorista={motoristaMemo}
                    rota={rota}
                    height="500px"
                    showRoute={true}
                  />
                </div>
                
                {/* Controles de rastreamento */}
                {viagem?.status === "EM_ANDAMENTO" && (
                  <div className="flex gap-3 mt-4 pt-4 border-t border-border">
                    {!rastreandoLocalizacao ? (
                      <Button
                        variant="outline"
                        onClick={iniciarRastreamento}
                        className="flex items-center gap-2 hover:bg-blue-50 hover:border-blue-300"
                      >
                        <Navigation className="h-4 w-4 text-blue-600" />
                        <span>Iniciar Rastreamento GPS</span>
                      </Button>
                    ) : (
                      <Button
                        variant="destructive"
                        onClick={pararRastreamento}
                        className="flex items-center gap-2"
                      >
                        <Navigation className="h-4 w-4" />
                        <span>Parar Rastreamento</span>
                      </Button>
                    )}
                    <div className="flex-1" />
                    <div className="text-sm text-muted-foreground flex items-center gap-2">
                      <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span>Atualizando a cada 10s</span>
                    </div>
                  </div>
                )}
              </div>
              
              {viagem?.enderecoPartida && (
                <div className="text-sm text-muted-foreground flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  <span>Ponto de partida: {viagem.enderecoPartida}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Participantes */}
          <Card className="bg-card border-border">
            <CardHeader>
              <div className="flex justify-between">
                <h2 className="font-semibold">Participantes ({participantes.length})</h2>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-3">
                {participantes.map((p, index) => {
                  // Obter ordem da rota se disponível
                  const ordem = rota?.waypoints?.findIndex(wp => wp.id === p.id) ?? -1
                  const numeroOrdem = ordem >= 0 ? ordem + 1 : null
                  
                  return (
                    <div key={p.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-card">
                      <div className="flex items-start gap-4">
                        {numeroOrdem && (
                          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg shadow-md">
                            {numeroOrdem}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <div className="flex-1 min-w-0">
                              <div className="font-semibold text-lg text-foreground mb-1">{p.nome}</div>
                              <div className="text-sm text-muted-foreground flex flex-wrap gap-2">
                                <span>{p.email}</span>
                                {p.telefone && <span>· {p.telefone}</span>}
                              </div>
                            </div>
                            <div className="flex-shrink-0">
                              {p.coletado ? (
                                <Badge className="bg-gray-600 text-white">✓ Coletado</Badge>
                              ) : (() => {
                                // Determinar se é o próximo baseado na ordem da rota
                                if (viagem?.status === "EM_ANDAMENTO" && p.checkedIn && !p.coletado && rota?.waypoints) {
                                  const passageirosNaoColetados = participantes
                                    .filter(pp => !pp.coletado && pp.checkedIn)
                                    .map(pp => ({
                                      ...pp,
                                      ordem: rota.waypoints?.findIndex(wp => wp.id === pp.id) ?? 999
                                    }))
                                    .sort((a, b) => a.ordem - b.ordem)
                                  
                                  if (passageirosNaoColetados.length > 0 && passageirosNaoColetados[0].id === p.id) {
                                    return <Badge className="bg-blue-600 text-white animate-pulse">👉 Próximo</Badge>
                                  }
                                }
                                return (
                                  <Badge className={p.checkedIn ? "bg-green-600 text-white" : "bg-orange-500 text-white"}>
                                    {p.checkedIn ? "✓ Check-in" : "⏳ Pendente"}
                                  </Badge>
                                )
                              })()}
                            </div>
                          </div>
                          {p.endereco && (
                            <div className="text-sm text-muted-foreground mt-2 flex items-start gap-2">
                              <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                              <span className="break-words">{p.endereco}</span>
                            </div>
                          )}
                          <div className="mt-2 flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">Pagamento:</span>
                            {p.pagamentoStatus === "PAGO" ? (
                              <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                                <DollarSign className="h-3 w-3 mr-1" />
                                Pagamento ok
                              </Badge>
                            ) : (
                              <Badge variant="outline">Pendente</Badge>
                            )}
                          </div>
                          {viagem?.status === "EM_ANDAMENTO" && !p.coletado && p.checkedIn && (
                            <div className="mt-4 pt-3 border-t border-border">
                              <Button
                                size="sm"
                                onClick={() => marcarColeta(p.id)}
                                disabled={marcandoColeta === p.id}
                                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
                              >
                                <CheckCircle2 className="h-4 w-4" />
                                {marcandoColeta === p.id ? "Marcando..." : "Marcar como Coletado"}
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
                {participantes.length === 0 && (
                  <div className="text-muted-foreground">Nenhum participante inscrito nesta viagem.</div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </main>
  )
}


