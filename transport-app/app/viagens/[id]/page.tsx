"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { viagemService } from "@/services/viagem.service"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin } from "lucide-react"
import type { Viagem, ViagemStatus } from "@/types"

interface Participante {
  id: number
  nome: string
  email: string
  telefone: string
  checkedIn: boolean
  endereco?: string
  latitude?: number
  longitude?: number
}

export default function ViagemGestaoPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const { usuario } = useAuth()
  const [participantes, setParticipantes] = useState<Participante[]>([])
  const [loading, setLoading] = useState(true)
  const [viagem, setViagem] = useState<Viagem | null>(null)
  const [iniciadaEm, setIniciadaEm] = useState<string | null>(null)

  useEffect(() => {
    if (!usuario) {
      router.push("/login")
      return
    }
    if (usuario.tipo === "CLIENTE") {
      // clientes não podem acessar gestão de viagem
      router.push("/feed")
      return
    }
    carregar()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usuario])

  const carregar = async () => {
    try {
      setLoading(true)
      const v = await viagemService.buscarPorId(Number(params.id))
      setViagem(v)
      const data = await viagemService.listarParticipantes(Number(params.id))
      setParticipantes(data)
    } finally {
      setLoading(false)
    }
  }

  const iniciarViagem = async () => {
    try {
      await viagemService.atualizar(Number(params.id), { status: "EM_ANDAMENTO" as ViagemStatus })
      const agora = new Date()
      setIniciadaEm(agora.toLocaleTimeString())
      // atualizar viagem para refletir status
      const v = await viagemService.buscarPorId(Number(params.id))
      setViagem(v)
    } catch {
      // silencioso por enquanto
    }
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
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={iniciarViagem}>
                  INICIAR VIAGEM
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Placeholder do mapa */}
              <div className="h-72 w-full rounded border border-dashed flex items-center justify-center text-muted-foreground">
                Mapa em tempo real (em breve)
              </div>
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
                {participantes.map((p) => (
                  <div key={p.id} className="border rounded p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex-1">
                        <div className="font-medium">{p.nome}</div>
                        <div className="text-sm text-muted-foreground">{p.email} · {p.telefone || '-'}</div>
                        {p.endereco && (
                          <div className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            <span>{p.endereco}</span>
                          </div>
                        )}
                        {p.latitude && p.longitude && (
                          <div className="text-xs text-muted-foreground mt-1">
                            Coordenadas: {p.latitude.toFixed(6)}, {p.longitude.toFixed(6)}
                          </div>
                        )}
                      </div>
                      <Badge className={p.checkedIn ? "bg-green-600" : "bg-red-600"}>
                        {p.checkedIn ? "Check-in feito" : "Sem check-in"}
                      </Badge>
                    </div>
                  </div>
                ))}
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


