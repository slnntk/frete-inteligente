"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CreateTripForm } from "@/components/forms/CreateTripForm"
import { viagemService } from "@/services/viagem.service"
import { useToast } from "@/hooks/use-toast"
import type { CreateViagemRequest } from "@/types"

interface CreateTripModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  postagemId: number
  onTripCreated?: () => void
}

export function CreateTripModal({ open, onOpenChange, postagemId, onTripCreated }: CreateTripModalProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (data: CreateViagemRequest) => {
    setLoading(true)
    try {
      await viagemService.criar(data)
      toast({ title: "Viagem criada com sucesso!" })
      onOpenChange(false)
      if (onTripCreated) {
        onTripCreated()
      }
    } catch (error: any) {
      console.error("Erro ao criar viagem:", error)
      toast({ title: "Erro ao criar viagem", description: error.message, variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        style={{ backgroundColor: '#ffffff', opacity: 1 }}
        className="max-w-2xl max-h-[90vh] overflow-y-auto !bg-white !opacity-100"
      >
        <DialogHeader>
          <DialogTitle>Criar Nova Viagem</DialogTitle>
        </DialogHeader>
        <CreateTripForm
          postagemId={postagemId}
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  )
}

