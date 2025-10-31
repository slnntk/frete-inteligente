"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { inscricaoService, type InscricaoDTO } from "@/services/inscricao.service"
import { checkinService } from "@/services/checkin.service"
import { useToast } from "@/hooks/use-toast"

export default function ViagensPage() {
  const { usuario } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [inscricoes, setInscricoes] = useState<InscricaoDTO[]>([])
  const [checked, setChecked] = useState<Record<number, boolean>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!usuario) {
      router.push("/login")
      return
    }
    carregarInscricoes()
  }, [usuario, router])

  const carregarInscricoes = async () => {
    try {
      setLoading(true)
      const data = await inscricaoService.listarPorCliente(usuario!.id!)
      setInscricoes(data)
    } catch (e) {
      toast({ title: "Erro ao carregar viagens", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const handleCheckin = async (viagemId: number) => {
    if (!usuario?.id) return
    try {
      await checkinService.criar(viagemId, usuario.id)
      setChecked((prev) => ({ ...prev, [viagemId]: true }))
      toast({ title: "Check-in confirmado!" })
    } catch (e) {
      toast({ title: "Erro ao realizar check-in", variant: "destructive" })
    }
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Minhas Viagens</h1>

      {loading ? (
        <Card className="bg-card border-border"><CardContent className="pt-6">Carregando...</CardContent></Card>
      ) : inscricoes.length === 0 ? (
        <Card className="bg-card border-border"><CardContent className="pt-6">Nenhuma viagem encontrada.</CardContent></Card>
      ) : (
        inscricoes.map((i) => (
          <Card key={i.id} className="bg-card border-border mb-4">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-foreground">Viagem #{i.viagem.id}</h3>
                  <p className="text-sm text-muted-foreground">Destino e horário exibidos quando disponíveis</p>
                </div>
                <Button
                  className={"min-w-[120px] " + (checked[i.viagem.id] ? "bg-green-600 hover:bg-green-600" : "bg-primary hover:bg-primary/90")}
                  onClick={() => handleCheckin(i.viagem.id)}
                  disabled={checked[i.viagem.id]}
                >
                  {checked[i.viagem.id] ? "CHECK-IN FEITO" : "CHECK-IN"}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                Após o check-in, sua presença é confirmada para a viagem.
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </main>
  )
}


