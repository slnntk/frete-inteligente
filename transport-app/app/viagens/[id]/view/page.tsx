"use client"

import { useEffect, useState, useMemo, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { viagemService } from "@/services/viagem.service"
import { rotaService, type RotaResponse } from "@/services/rota.service"
import { checkinService } from "@/services/checkin.service"
import { pagamentoService, type PagamentoResponse } from "@/services/pagamento.service"
import { TripMap } from "@/components/map/TripMap"
import { CheckInLocationModal } from "@/components/modals/CheckInLocationModal"
import { PaymentModal } from "@/components/modals/PaymentModal"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Clock, Users, Navigation, CheckCircle2, Package, Loader2, ArrowLeft, DollarSign } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { Viagem } from "@/types"
import Link from "next/link"

interface ParticipanteInfo {
  id: number
  nome: string
  checkedIn: boolean
  coletado: boolean
  ordem?: number
}

export default function ViagemViewPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const { usuario } = useAuth()
  const { toast } = useToast()
  const [viagem, setViagem] = useState<Viagem | null>(null)
  const [loading, setLoading] = useState(true)
  const [rota, setRota] = useState<RotaResponse | null>(null)
  const [participanteInfo, setParticipanteInfo] = useState<ParticipanteInfo | null>(null)
  const [isCheckInModalOpen, setIsCheckInModalOpen] = useState(false)
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [minhaOrdem, setMinhaOrdem] = useState<number | null>(null)
  const [totalParticipantes, setTotalParticipantes] = useState(0)
  const [pagamento, setPagamento] = useState<PagamentoResponse | null>(null)

  const carregar = useCallback(async (silent = false) => {
    try {
      if (!silent) setLoading(true)
      
      const v = await viagemService.buscarPorId(Number(params.id))
      setViagem(v)

      // Carregar participantes para verificar status do usuário atual
      const participantes = await viagemService.listarParticipantes(Number(params.id))
      setTotalParticipantes(participantes.length)

      // Encontrar informações do usuário atual
      const meuParticipante = participantes.find(p => p.id === usuario?.id)
      if (!meuParticipante) {
        // Se o usuário não está inscrito, redirecionar para o feed
        toast({
          title: "Você não está inscrito nesta viagem",
          description: "Faça a inscrição primeiro",
          variant: "destructive",
        })
        router.push("/feed")
        return
      }

      // Atualizar informações do participante (incluindo status de coleta)
      // Usar função de atualização para comparar com estado anterior
      setParticipanteInfo(prev => {
        const novoInfo: ParticipanteInfo = {
          id: meuParticipante.id,
          nome: meuParticipante.nome,
          checkedIn: meuParticipante.checkedIn,
          coletado: meuParticipante.coletado,
        }

        // Verificar se houve mudança no status de coleta
        const coletadoMudou = prev?.coletado !== novoInfo.coletado
        if (coletadoMudou && novoInfo.coletado && !silent) {
          console.log("[ViagemView] Status de coleta atualizado: coletado = true")
          // Usar setTimeout para evitar problemas com toast durante render
          setTimeout(() => {
            toast({
              title: "Você foi coletado!",
              description: "O motorista marcou sua coleta",
            })
          }, 100)
        }

        return novoInfo
      })

      // Carregar status de pagamento
      if (usuario?.id) {
        try {
          const pagamentoData = await pagamentoService.buscarPorViagemEUsuario(Number(params.id), usuario.id)
          setPagamento(pagamentoData)
        } catch (error) {
          console.warn("[ViagemView] Erro ao carregar pagamento:", error)
        }
      }

      // Carregar rota se houver participantes e ponto de partida
      // Recalcular rota sempre para refletir mudanças nas coletas
      if (participantes.length > 0 && v.latitudePartida && v.longitudePartida) {
        try {
          const rotaData = await rotaService.calcularRota(Number(params.id))
          setRota(rotaData)

          // Encontrar ordem do usuário na rota
          if (rotaData && rotaData.waypoints && usuario?.id) {
            const minhaPosicao = rotaData.waypoints.findIndex(wp => wp.id === usuario.id)
            if (minhaPosicao !== -1) {
              const novaOrdem = minhaPosicao + 1
              
              // Atualizar ordem usando função de atualização para comparar com anterior
              setMinhaOrdem(prev => {
                const ordemMudou = prev !== novaOrdem
                if (ordemMudou && prev !== null && !silent) {
                  console.log(`[ViagemView] Ordem na rota mudou: ${prev}º → ${novaOrdem}º`)
                }
                return novaOrdem
              })
              
              setParticipanteInfo(prev => prev ? { ...prev, ordem: novaOrdem } : prev)
            } else {
              setMinhaOrdem(null)
            }
          }
        } catch (error) {
          console.warn("[ViagemView] Não foi possível carregar rota:", error)
        }
      }

    } catch (error: any) {
      console.error("Erro ao carregar viagem:", error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar a viagem",
        variant: "destructive",
      })
    } finally {
      if (!silent) setLoading(false)
    }
  }, [params.id, usuario?.id, router, toast])

  // Carregar dados iniciais
  useEffect(() => {
    if (!usuario) {
      router.push("/login")
      return
    }

    if (usuario.tipo !== "CLIENTE") {
      router.push(`/viagens/${params.id}`)
      return
    }

    carregar()
  }, [usuario, params.id, router, carregar])

  // Atualizar automaticamente quando viagem estiver em andamento ou aberta (para ver coletas)
  useEffect(() => {
    // Não atualizar se não houver viagem ou se estiver encerrada
    if (!viagem || viagem.status === "ENCERRADA") {
      return
    }

    // Atualizar mais frequentemente quando em andamento (a cada 5 segundos)
    // Atualizar menos frequentemente quando aberta (a cada 10 segundos) para ver coletas
    const intervalTime = viagem.status === "EM_ANDAMENTO" ? 5000 : 10000

    console.log(`[ViagemView] Iniciando atualização automática (intervalo: ${intervalTime}ms, status: ${viagem.status})`)

    const interval = setInterval(() => {
      console.log("[ViagemView] Atualizando dados automaticamente...")
      carregar(true)
    }, intervalTime)

    return () => {
      console.log("[ViagemView] Limpando intervalo de atualização")
      clearInterval(interval)
    }
  }, [viagem?.status, viagem?.id, params.id, carregar])

  const handleCheckInSuccess = () => {
    setIsCheckInModalOpen(false)
    carregar()
    toast({
      title: "Check-in realizado!",
      description: "Você fez check-in na viagem com sucesso",
    })
  }

  // Memoizar dados para o mapa
  const pontoPartidaMemo = useMemo(() => 
    viagem?.latitudePartida && viagem?.longitudePartida
      ? {
          latitude: viagem.latitudePartida,
          longitude: viagem.longitudePartida,
          endereco: viagem.enderecoPartida
        }
      : undefined
  , [viagem?.latitudePartida, viagem?.longitudePartida, viagem?.enderecoPartida])

  const passageirosMemo = useMemo(() => {
    if (!rota || !rota.waypoints) return []
    
    // Mapear waypoints para passageiros, garantindo que o status de coleta seja incluído
    return rota.waypoints.map(wp => ({
      id: wp.id,
      nome: wp.nome || "Passageiro",
      endereco: wp.endereco,
      latitude: wp.latitude,
      longitude: wp.longitude,
      checkedIn: wp.checkedIn !== undefined ? wp.checkedIn : true, // Se não definido, assume true (está na rota)
      coletado: wp.coletado === true, // Garantir que seja boolean explícito
    }))
  }, [rota]) // Depender apenas da rota, que já contém todos os dados atualizados

  const motoristaMemo = useMemo(() =>
    viagem && (viagem as any).latitudeMotorista && (viagem as any).longitudeMotorista
      ? {
          latitude: (viagem as any).latitudeMotorista,
          longitude: (viagem as any).longitudeMotorista
        }
      : undefined
  , [viagem, (viagem as any)?.latitudeMotorista, (viagem as any)?.longitudeMotorista])

  const getStatusBadge = () => {
    if (!viagem) return null
    
    switch (viagem.status) {
      case "ABERTA":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Aberta</Badge>
      case "EM_ANDAMENTO":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Em Andamento</Badge>
      case "ENCERRADA":
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">Encerrada</Badge>
      default:
        return <Badge variant="outline">{viagem.status}</Badge>
    }
  }

  if (loading) {
    return (
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </main>
    )
  }

  if (!viagem) {
    return (
      <main className="max-w-6xl mx-auto px-4 py-8">
        <Card>
          <CardContent className="pt-6">
            <p>Viagem não encontrada</p>
            <Link href="/feed">
              <Button variant="outline" className="mt-4">
                Voltar para o Feed
              </Button>
            </Link>
          </CardContent>
        </Card>
      </main>
    )
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <Link href="/feed">
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para o Feed
          </Button>
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Viagem #{viagem.id}</h1>
            <p className="text-muted-foreground">{viagem.destino || "Destino a definir"}</p>
          </div>
          {getStatusBadge()}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna principal - Mapa e informações */}
        <div className="lg:col-span-2 space-y-6">
          {/* Informações da Viagem */}
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Informações da Viagem</h2>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Horário de Partida</p>
                    <p className="font-medium">{viagem.horarioPartida || "—"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Capacidade</p>
                    <p className="font-medium">{viagem.capacidade || "—"} passageiros</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Ponto de Partida</p>
                    <p className="font-medium text-sm">{viagem.enderecoPartida || "—"}</p>
                  </div>
                </div>
                {viagem.postagem && (
                  <div className="flex items-center gap-3">
                    <Package className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Preço</p>
                      <p className="font-medium">R$ {viagem.postagem.preco?.toFixed(2) || "—"}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Mapa */}
          {pontoPartidaMemo && (
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold">Rota da Viagem</h2>
              </CardHeader>
              <CardContent>
                <TripMap
                  pontoPartida={pontoPartidaMemo}
                  passageiros={passageirosMemo}
                  motorista={motoristaMemo}
                  rota={rota}
                  height="500px"
                  showRoute={true}
                />
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar - Status e ações */}
        <div className="space-y-6">
          {/* Status do Passageiro */}
          <Card 
            style={{ backgroundColor: '#ffffff', opacity: 1 }}
            className="!bg-white !opacity-100"
          >
            <CardHeader>
              <h2 className="text-xl font-semibold">Meu Status</h2>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Check-in Status */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Check-in</span>
                  {participanteInfo?.checkedIn ? (
                    <Badge className="bg-green-100 text-green-800 border-green-200">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Realizado
                    </Badge>
                  ) : (
                    <Badge variant="outline">Pendente</Badge>
                  )}
                </div>
                {!participanteInfo?.checkedIn && (
                  <Button
                    onClick={() => setIsCheckInModalOpen(true)}
                    className="w-full"
                    size="sm"
                  >
                    Fazer Check-in
                  </Button>
                )}
              </div>

              {/* Status de Pagamento */}
              <div className="space-y-2 pt-4 border-t">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Pagamento</span>
                  {pagamento?.status === "PAGO" ? (
                    <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                      <DollarSign className="h-3 w-3 mr-1" />
                      Pagamento ok
                    </Badge>
                  ) : (
                    <Badge variant="outline">Pendente</Badge>
                  )}
                </div>
                {pagamento?.status !== "PAGO" && viagem.postagem?.preco && (
                  <Button
                    onClick={() => setIsPaymentModalOpen(true)}
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                    size="sm"
                  >
                    <DollarSign className="h-4 w-4 mr-2" />
                    💰 Fazer Pagamento
                  </Button>
                )}
              </div>

              {/* Status de Coleta */}
              {participanteInfo?.checkedIn && (
                <div className="space-y-2 pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Coleta</span>
                    {participanteInfo?.coletado ? (
                      <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                        <Package className="h-3 w-3 mr-1" />
                        Coletado
                      </Badge>
                    ) : (
                      <Badge variant="outline">
                        Aguardando
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              {/* Ordem na Rota */}
              {minhaOrdem && (viagem.status === "EM_ANDAMENTO" || viagem.status === "ABERTA") && (
                <div className="pt-4 border-t">
                  <div className="bg-primary/10 rounded-lg p-4 text-center">
                    <p className="text-sm text-muted-foreground mb-1">Sua posição na rota</p>
                    <p className="text-3xl font-bold text-primary">{minhaOrdem}º</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      de {totalParticipantes} passageiros
                    </p>
                    {participanteInfo?.coletado && (
                      <p className="text-xs text-green-600 mt-2 font-medium">
                        ✓ Coletado
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Informação quando viagem está em andamento */}
              {viagem.status === "EM_ANDAMENTO" && motoristaMemo && (
                <div className="pt-4 border-t">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Navigation className="h-4 w-4 animate-pulse text-green-600" />
                    <span>Motorista em trânsito</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Informações do Motorista */}
          {viagem.postagem?.autor && (
            <Card 
              style={{ backgroundColor: '#ffffff', opacity: 1 }}
              className="!bg-white !opacity-100"
            >
              <CardHeader>
                <h2 className="text-xl font-semibold">Motorista</h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="font-medium">{viagem.postagem.autor.nome}</p>
                  <p className="text-sm text-muted-foreground">{viagem.postagem.autor.email}</p>
                  {viagem.postagem.autor.telefone && (
                    <p className="text-sm text-muted-foreground">{viagem.postagem.autor.telefone}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Descrição da Postagem */}
          {viagem.postagem?.descricao && (
            <Card 
              style={{ backgroundColor: '#ffffff', opacity: 1 }}
              className="!bg-white !opacity-100"
            >
              <CardHeader>
                <h2 className="text-xl font-semibold">Sobre o Transporte</h2>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground whitespace-pre-line">
                  {viagem.postagem.descricao}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Modal de Check-in */}
      {viagem && usuario && (
        <CheckInLocationModal
          open={isCheckInModalOpen}
          onOpenChange={setIsCheckInModalOpen}
          onLocationSelected={async (latitude, longitude, endereco) => {
            try {
              await checkinService.criar(Number(params.id), usuario.id, latitude, longitude)
              handleCheckInSuccess()
            } catch (error: any) {
              toast({
                title: "Erro ao fazer check-in",
                description: error.message || "Não foi possível realizar o check-in",
                variant: "destructive",
              })
            }
          }}
          enderecoCadastrado={usuario.endereco}
          latitudeCadastrada={usuario.latitude || undefined}
          longitudeCadastrada={usuario.longitude || undefined}
        />
      )}

      {/* Modal de Pagamento */}
      {viagem && usuario && viagem.postagem?.preco && (
        <PaymentModal
          open={isPaymentModalOpen}
          onOpenChange={setIsPaymentModalOpen}
          viagemId={Number(params.id)}
          valor={viagem.postagem.preco}
          onPaymentConfirmed={async () => {
            try {
              // Criar ou buscar pagamento
              let pagamentoData = await pagamentoService.buscarPorViagemEUsuario(Number(params.id), usuario.id)
              
              if (!pagamentoData) {
                // Criar novo pagamento
                pagamentoData = await pagamentoService.criar({
                  viagemId: Number(params.id),
                  usuarioId: usuario.id,
                  valor: viagem.postagem!.preco!,
                  metodo: "PIX"
                })
              }
              
              // Confirmar pagamento
              pagamentoData = await pagamentoService.confirmarPagamento(pagamentoData.id)
              setPagamento(pagamentoData)
              
              toast({
                title: "Pagamento confirmado!",
                description: "Seu pagamento foi processado com sucesso",
              })
              
              carregar()
            } catch (error: any) {
              toast({
                title: "Erro ao processar pagamento",
                description: error.message || "Não foi possível processar o pagamento",
                variant: "destructive",
              })
            }
          }}
        />
      )}
    </main>
  )
}

