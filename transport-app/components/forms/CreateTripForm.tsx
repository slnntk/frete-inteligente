"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CepInput } from "./CepInput"
import { TripMap } from "@/components/map/TripMap"
import { geocodingService, type CepResult } from "@/services/geocoding.service"
import { useToast } from "@/hooks/use-toast"
import type { CreateViagemRequest, ViagemStatus } from "@/types"

const tripSchema = z.object({
  horarioPartida: z.string().min(1, "Horário é obrigatório"),
  destino: z.string().min(1, "Destino é obrigatório"),
  capacidade: z.number().min(1, "Capacidade deve ser pelo menos 1"),
})

interface CreateTripFormProps {
  postagemId: number
  onSubmit: (data: CreateViagemRequest) => Promise<void>
  onCancel?: () => void
}

export function CreateTripForm({ postagemId, onSubmit, onCancel }: CreateTripFormProps) {
  const { toast } = useToast()
  const [cep, setCep] = useState("")
  const [enderecoEncontrado, setEnderecoEncontrado] = useState<CepResult & { latitude?: number; longitude?: number } | null>(null)
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm<CreateViagemRequest>({
    resolver: zodResolver(tripSchema),
    defaultValues: {
      postagemId,
      status: "ABERTA" as ViagemStatus,
      capacidade: 20
    }
  })

  const capacidade = watch("capacidade")

  const handleCepFound = (result: CepResult & { latitude?: number; longitude?: number }) => {
    setEnderecoEncontrado(result)
    setValue("cepPartida", result.cep)
    setValue("enderecoPartida", result.endereco)
    if (result.latitude && result.longitude) {
      setValue("latitudePartida", result.latitude)
      setValue("longitudePartida", result.longitude)
    }
  }

  const onFormSubmit = async (data: CreateViagemRequest) => {
    if (!enderecoEncontrado) {
      toast({ title: "CEP necessário", description: "Por favor, busque um CEP válido primeiro", variant: "destructive" })
      return
    }

    setLoading(true)
    try {
      await onSubmit({
        ...data,
        cepPartida: enderecoEncontrado.cep,
        enderecoPartida: enderecoEncontrado.endereco,
        latitudePartida: enderecoEncontrado.latitude,
        longitudePartida: enderecoEncontrado.longitude,
      })
    } catch (error) {
      console.error("Erro ao criar viagem:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Criar Nova Viagem</h3>
        
        {/* CEP de Partida */}
        <CepInput
          value={cep}
          onChange={setCep}
          onCepFound={handleCepFound}
          label="CEP de Partida"
          required
        />

        {/* Preview do Mapa */}
        {enderecoEncontrado?.latitude && enderecoEncontrado?.longitude && (
          <div className="space-y-2">
            <Label>Localização de Partida</Label>
            <TripMap
              pontoPartida={{
                latitude: enderecoEncontrado.latitude,
                longitude: enderecoEncontrado.longitude,
                endereco: enderecoEncontrado.endereco
              }}
              height="300px"
              showRoute={false}
            />
          </div>
        )}

        {/* Horário de Partida */}
        <div className="space-y-2">
          <Label htmlFor="horarioPartida">
            Horário de Partida <span className="text-red-500">*</span>
          </Label>
          <Input
            id="horarioPartida"
            type="time"
            {...register("horarioPartida")}
            className={errors.horarioPartida ? "border-red-500" : ""}
          />
          {errors.horarioPartida && (
            <p className="text-sm text-red-500">{errors.horarioPartida.message}</p>
          )}
        </div>

        {/* Destino */}
        <div className="space-y-2">
          <Label htmlFor="destino">
            Destino <span className="text-red-500">*</span>
          </Label>
          <Input
            id="destino"
            {...register("destino")}
            placeholder="Ex: Universidade Federal do Ceará"
            className={errors.destino ? "border-red-500" : ""}
          />
          {errors.destino && (
            <p className="text-sm text-red-500">{errors.destino.message}</p>
          )}
        </div>

        {/* Capacidade */}
        <div className="space-y-2">
          <Label htmlFor="capacidade">
            Capacidade (passageiros) <span className="text-red-500">*</span>
          </Label>
          <Input
            id="capacidade"
            type="number"
            min="1"
            {...register("capacidade", { valueAsNumber: true })}
            className={errors.capacidade ? "border-red-500" : ""}
          />
          {errors.capacidade && (
            <p className="text-sm text-red-500">{errors.capacidade.message}</p>
          )}
        </div>
      </div>

      {/* Resumo */}
      {enderecoEncontrado && (
        <div className="p-4 bg-muted rounded-lg space-y-1 text-sm">
          <p><strong>Ponto de Partida:</strong> {enderecoEncontrado.endereco}</p>
          <p><strong>Capacidade:</strong> {capacidade} passageiros</p>
        </div>
      )}

      {/* Botões */}
      <div className="flex gap-3 justify-end">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
        )}
        <Button type="submit" disabled={loading || !enderecoEncontrado}>
          {loading ? "Criando..." : "Criar Viagem"}
        </Button>
      </div>
    </form>
  )
}

