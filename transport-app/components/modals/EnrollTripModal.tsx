"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { CepInput } from "@/components/forms/CepInput"
import { TripMap } from "@/components/map/TripMap"
import { geocodingService, type CepResult } from "@/services/geocoding.service"
import { inscricaoService } from "@/services/inscricao.service"
import { rotaService } from "@/services/rota.service"
import { clienteService } from "@/services/cliente.service"
import { useAuth } from "@/contexts/AuthContext"
import { useToast } from "@/hooks/use-toast"
import type { Viagem } from "@/types"
import { Loader2 } from "lucide-react"

interface EnrollTripModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  viagem: Viagem
  onEnrollSuccess?: () => void
}

export function EnrollTripModal({ open, onOpenChange, viagem, onEnrollSuccess }: EnrollTripModalProps) {
  const { usuario } = useAuth()
  const { toast } = useToast()
  const [cep, setCep] = useState("")
  const [enderecoEncontrado, setEnderecoEncontrado] = useState<CepResult & { latitude?: number; longitude?: number } | null>(null)
  const [loading, setLoading] = useState(false)
  const [rota, setRota] = useState<any>(null)

  const handleCepFound = async (result: CepResult & { latitude?: number; longitude?: number }) => {
    setEnderecoEncontrado(result)

    // Tentar carregar rota para visualização
    if (viagem.id && result.latitude && result.longitude) {
      try {
        const rotaData = await rotaService.calcularRota(viagem.id)
        setRota(rotaData)
      } catch (error) {
        // Rota pode não estar disponível ainda
        console.log("Rota não disponível ainda")
      }
    }
  }

  const handleEnroll = async () => {
    if (!enderecoEncontrado) {
      toast({ title: "CEP necessário", description: "Por favor, busque um CEP válido primeiro", variant: "destructive" })
      return
    }

    if (!usuario?.id) {
      toast({ title: "Erro", description: "Usuário não autenticado", variant: "destructive" })
      return
    }

    setLoading(true)
    try {
      // Atualizar perfil do cliente com a localização se fornecida
      if (enderecoEncontrado.latitude && enderecoEncontrado.longitude && usuario.tipo === "CLIENTE") {
        try {
          await clienteService.atualizar(usuario.id, {
            endereco: enderecoEncontrado.endereco,
            latitude: enderecoEncontrado.latitude,
            longitude: enderecoEncontrado.longitude
          })
        } catch (error) {
          console.warn("Erro ao atualizar localização do cliente:", error)
          // Não é crítico, continua com a inscrição
        }
      }

      // Criar inscrição
      await inscricaoService.criar(viagem.id!, usuario.id)

      toast({ title: "Inscrição realizada com sucesso!" })
      onOpenChange(false)
      if (onEnrollSuccess) {
        onEnrollSuccess()
      }
    } catch (error: any) {
      console.error("Erro ao se inscrever:", error)
      toast({ title: "Erro ao se inscrever", description: error.message || "Tente novamente", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent style={{ backgroundColor: '#ffffff', opacity: 1 }} className="max-w-3xl max-h-[90vh] overflow-y-auto !bg-white !opacity-100">
        <DialogHeader>
          <DialogTitle>Inscrever-se na Viagem</DialogTitle>
          <DialogDescription>
            Informe seu CEP para que possamos calcular a melhor rota de embarque
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações da Viagem */}
          <div className="p-4 bg-muted rounded-lg space-y-2 text-sm">
            <p><strong>Horário:</strong> {viagem.horarioPartida}</p>
            <p><strong>Destino:</strong> {viagem.destino || "A definir"}</p>
            <p><strong>Capacidade:</strong> {viagem.capacidade} passageiros</p>
          </div>

          {/* CEP */}
          <CepInput
            value={cep}
            onChange={setCep}
            onCepFound={handleCepFound}
            label="Seu CEP de Embarque"
            required
          />

          {/* Mapa com Rota */}
          {enderecoEncontrado && viagem.latitudePartida && viagem.longitudePartida && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Visualização da Rota</h4>
              <TripMap
                pontoPartida={{
                  latitude: viagem.latitudePartida,
                  longitude: viagem.longitudePartida,
                  endereco: viagem.enderecoPartida
                }}
                passageiros={
                  enderecoEncontrado.latitude && enderecoEncontrado.longitude
                    ? [{
                      id: 0,
                      nome: "Você",
                      endereco: enderecoEncontrado.endereco,
                      latitude: enderecoEncontrado.latitude,
                      longitude: enderecoEncontrado.longitude,
                      checkedIn: false
                    }]
                    : []
                }
                rota={rota}
                height="400px"
                showRoute={true}
              />
            </div>
          )}

          {/* Botões */}
          <div className="flex gap-3 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleEnroll}
              disabled={loading || !enderecoEncontrado}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Inscrevendo...
                </>
              ) : (
                "Confirmar Inscrição"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

