"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2, MapPin } from "lucide-react"
import { geocodingService, type CepResult } from "@/services/geocoding.service"
import { useToast } from "@/hooks/use-toast"

interface CepInputProps {
  value: string
  onChange: (cep: string) => void
  onCepFound: (result: CepResult & { latitude?: number; longitude?: number }) => void
  label?: string
  placeholder?: string
  required?: boolean
}

export function CepInput({
  value,
  onChange,
  onCepFound,
  label = "CEP",
  placeholder = "00000-000",
  required = false
}: CepInputProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [enderecoEncontrado, setEnderecoEncontrado] = useState<string | null>(null)

  const formatarCep = (cep: string) => {
    const apenasNumeros = cep.replace(/\D/g, "")
    if (apenasNumeros.length <= 5) {
      return apenasNumeros
    }
    return `${apenasNumeros.slice(0, 5)}-${apenasNumeros.slice(5, 8)}`
  }

  const buscarCep = async () => {
    if (!value || value.replace(/\D/g, "").length !== 8) {
      toast({ title: "CEP inválido", description: "CEP deve ter 8 dígitos", variant: "destructive" })
      return
    }

    setLoading(true)
    try {
      const resultado = await geocodingService.buscarPorCep(value.replace(/\D/g, ""))
      
      if (resultado.erro) {
        toast({ title: "CEP não encontrado", variant: "destructive" })
        setEnderecoEncontrado(null)
        return
      }

      setEnderecoEncontrado(resultado.endereco)

      // Tentar buscar coordenadas usando o endereço completo
      const coordenadas = await geocodingService.buscarCoordenadas(resultado.endereco)
      
      onCepFound({
        ...resultado,
        latitude: coordenadas?.latitude,
        longitude: coordenadas?.longitude
      })

      toast({ title: "Endereço encontrado!", description: resultado.endereco })
    } catch (error) {
      console.error("Erro ao buscar CEP:", error)
      toast({ title: "Erro ao buscar CEP", description: "Tente novamente", variant: "destructive" })
      setEnderecoEncontrado(null)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatarCep(e.target.value)
    onChange(formatted)
    setEnderecoEncontrado(null)
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      buscarCep()
    }
  }

  return (
    <div className="space-y-2">
      {label && (
        <label className="text-sm font-medium">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            value={value}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            maxLength={9}
            className="pl-9"
            disabled={loading}
          />
        </div>
        <Button
          type="button"
          onClick={buscarCep}
          disabled={loading || !value || value.replace(/\D/g, "").length !== 8}
          variant="outline"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Buscar"
          )}
        </Button>
      </div>
      {enderecoEncontrado && (
        <p className="text-sm text-muted-foreground flex items-center gap-1">
          <MapPin className="h-3 w-3" />
          {enderecoEncontrado}
        </p>
      )}
    </div>
  )
}

