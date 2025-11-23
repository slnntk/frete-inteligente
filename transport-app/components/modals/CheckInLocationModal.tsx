"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { MapPin, Navigation, Loader2 } from "lucide-react"
import { CepInput } from "@/components/forms/CepInput"
import { geocodingService } from "@/services/geocoding.service"

interface CheckInLocationModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onLocationSelected: (latitude: number, longitude: number, endereco?: string) => void
  enderecoCadastrado?: string
  latitudeCadastrada?: number
  longitudeCadastrada?: number
}

export function CheckInLocationModal({
  open,
  onOpenChange,
  onLocationSelected,
  enderecoCadastrado,
  latitudeCadastrada,
  longitudeCadastrada
}: CheckInLocationModalProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [cep, setCep] = useState("")
  const [endereco, setEndereco] = useState("")
  const [latitude, setLatitude] = useState<number | null>(null)
  const [longitude, setLongitude] = useState<number | null>(null)
  const [usandoLocalizacaoAtual, setUsandoLocalizacaoAtual] = useState(false)

  useEffect(() => {
    if (open) {
      setCep("")
      setEndereco("")
      setLatitude(null)
      setLongitude(null)
      setUsandoLocalizacaoAtual(false)
    }
  }, [open])

  const handleUseCurrentLocation = async () => {
    if (!navigator.geolocation) {
      toast({
        title: "Geolocalização não suportada",
        variant: "destructive"
      })
      return
    }

    setLoading(true)
    setUsandoLocalizacaoAtual(true)

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        })
      })

      const { latitude: lat, longitude: lng } = position.coords
      setLatitude(lat)
      setLongitude(lng)

      // Tentar obter endereço reverso
      try {
        const enderecoReverso = await geocodingService.geocodificarEndereco(
          `${lat},${lng}`
        )
        if (enderecoReverso) {
          setEndereco(enderecoReverso)
        } else {
          setEndereco(`Localização: ${lat.toFixed(6)}, ${lng.toFixed(6)}`)
        }
      } catch {
        setEndereco(`Localização: ${lat.toFixed(6)}, ${lng.toFixed(6)}`)
      }

      toast({
        title: "Localização obtida!",
        description: "Confirme para usar este local de embarque"
      })
    } catch (error: any) {
      if (error.code === error.PERMISSION_DENIED) {
        toast({
          title: "Permissão negada",
          description: "Por favor, permita o acesso à localização",
          variant: "destructive"
        })
      } else {
        toast({
          title: "Erro ao obter localização",
          variant: "destructive"
        })
      }
      setUsandoLocalizacaoAtual(false)
    } finally {
      setLoading(false)
    }
  }

  const handleCepChange = async (newCep: string, enderecoEncontrado?: string, lat?: number, lng?: number) => {
    setCep(newCep)
    if (enderecoEncontrado) {
      setEndereco(enderecoEncontrado)
    }
    if (lat && lng) {
      setLatitude(lat)
      setLongitude(lng)
      setUsandoLocalizacaoAtual(false)
    }
  }

  const handleConfirm = () => {
    if (!latitude || !longitude) {
      toast({
        title: "Localização necessária",
        description: "Por favor, escolha um local de embarque",
        variant: "destructive"
      })
      return
    }

    onLocationSelected(latitude, longitude, endereco || undefined)
    onOpenChange(false)
  }

  const handleUseRegisteredAddress = () => {
    if (latitudeCadastrada && longitudeCadastrada) {
      setLatitude(latitudeCadastrada)
      setLongitude(longitudeCadastrada)
      setEndereco(enderecoCadastrado || "Endereço cadastrado")
      setUsandoLocalizacaoAtual(false)
      toast({
        title: "Endereço cadastrado selecionado",
        description: "Você pode alterar se preferir outro local"
      })
    } else {
      toast({
        title: "Endereço não disponível",
        description: "Seu endereço cadastrado não possui localização",
        variant: "destructive"
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent style={{ backgroundColor: '#ffffff', opacity: 1 }} className="bg-card border-border max-w-md !bg-white !opacity-100">
        <DialogHeader>
          <DialogTitle className="text-foreground">Escolher Local de Embarque</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Escolha onde você quer ser buscado hoje. Pode ser diferente do seu endereço cadastrado.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {enderecoCadastrado && (
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">Seu endereço cadastrado:</p>
              <p className="text-sm font-medium text-foreground">{enderecoCadastrado}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={handleUseRegisteredAddress}
                className="mt-2 w-full"
              >
                <MapPin className="h-4 w-4 mr-2" />
                Usar este endereço
              </Button>
            </div>
          )}

          <div className="space-y-2">
            <Label className="text-foreground">Buscar por CEP</Label>
            <CepInput
              value={cep}
              onChange={handleCepChange}
              placeholder="Digite o CEP do local de embarque"
            />
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">ou</span>
            </div>
          </div>

          <Button
            onClick={handleUseCurrentLocation}
            disabled={loading}
            variant="outline"
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Obtendo localização...
              </>
            ) : (
              <>
                <Navigation className="h-4 w-4 mr-2" />
                Usar minha localização atual
              </>
            )}
          </Button>

          {(latitude && longitude) && (
            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <p className="text-sm font-medium text-foreground mb-1">Local selecionado:</p>
              <p className="text-sm text-muted-foreground">{endereco || `Lat: ${latitude.toFixed(6)}, Lng: ${longitude.toFixed(6)}`}</p>
              {usandoLocalizacaoAtual && (
                <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                  ✓ Usando sua localização atual
                </p>
              )}
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={!latitude || !longitude}
              className="flex-1 bg-primary text-primary-foreground"
            >
              Confirmar Local
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

