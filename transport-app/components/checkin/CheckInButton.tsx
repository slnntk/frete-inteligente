"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { CheckCircle2, MapPin, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { CheckInLocationModal } from "@/components/modals/CheckInLocationModal"
import { useAuth } from "@/contexts/AuthContext"

interface CheckInButtonProps {
  viagemId: number
  clienteId: number
  onCheckInSuccess?: () => void
  disabled?: boolean
}

export function CheckInButton({ viagemId, clienteId, onCheckInSuccess, disabled }: CheckInButtonProps) {
  const { toast } = useToast()
  const { usuario } = useAuth()
  const [loading, setLoading] = useState(false)
  const [checkedIn, setCheckedIn] = useState(false)
  const [showLocationModal, setShowLocationModal] = useState(false)

  // Verificar se já fez check-in
  useEffect(() => {
    const verificarCheckIn = async () => {
      try {
        const { checkinService } = await import("@/services/checkin.service")
        const checkins = await checkinService.buscarPorViagem(viagemId)
        const temCheckIn = checkins.some(c => c.cliente.id === clienteId)
        setCheckedIn(temCheckIn)
      } catch (error) {
        // Ignorar erro
      }
    }
    verificarCheckIn()
  }, [viagemId, clienteId])

  const handleLocationSelected = async (latitude: number, longitude: number, endereco?: string) => {
    setLoading(true)

    try {
      const { checkinService } = await import("@/services/checkin.service")
      await checkinService.criar(viagemId, clienteId, latitude, longitude)

      setCheckedIn(true)
      toast({ 
        title: "Check-in realizado com sucesso!",
        description: endereco || `Localização: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
      })

      if (onCheckInSuccess) {
        onCheckInSuccess()
      }
    } catch (error) {
      console.error("Erro no check-in:", error)
      toast({ 
        title: "Erro ao realizar check-in", 
        variant: "destructive" 
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCheckInClick = () => {
    setShowLocationModal(true)
  }

  if (checkedIn) {
    return (
      <Button
        disabled
        className="bg-green-600 hover:bg-green-600 text-white"
      >
        <CheckCircle2 className="h-4 w-4 mr-2" />
        Check-in Confirmado
      </Button>
    )
  }

  return (
    <>
      <Button
        onClick={handleCheckInClick}
        disabled={loading || disabled}
        className="bg-primary text-primary-foreground hover:bg-primary/90"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Processando...
          </>
        ) : (
          <>
            <MapPin className="h-4 w-4 mr-2" />
            Fazer Check-in
          </>
        )}
      </Button>

      <CheckInLocationModal
        open={showLocationModal}
        onOpenChange={setShowLocationModal}
        onLocationSelected={handleLocationSelected}
        enderecoCadastrado={usuario?.endereco}
        latitudeCadastrada={usuario?.latitude || undefined}
        longitudeCadastrada={usuario?.longitude || undefined}
      />
    </>
  )
}

