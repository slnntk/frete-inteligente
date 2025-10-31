"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/AuthContext"
import { postagemService } from "@/services/postagem.service"

interface CreatePostModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onPostCreated?: () => void
}

export function CreatePostModal({ open, onOpenChange, onPostCreated }: CreatePostModalProps) {
  const { usuario } = useAuth()
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    titulo: "",
    regiao: "",
    descricao: "",
    preco: "",
  })
  const [isLoading, setIsLoading] = useState(false)

  const handlePost = async () => {
    if (!usuario?.id) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para criar uma postagem",
        variant: "destructive",
      })
      return
    }

    // Restringir criação de postagens a EMPRESA ou AUTONOMO
    if (usuario?.tipo !== "EMPRESA" && usuario?.tipo !== "AUTONOMO") {
      toast({
        title: "Ação não permitida",
        description: "Apenas empresas e motoristas podem criar ofertas de transporte",
        variant: "destructive",
      })
      return
    }

    if (!formData.titulo || !formData.regiao || !formData.descricao || !formData.preco) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      await postagemService.criar({
        autorId: usuario.id,
        titulo: formData.titulo,
        regiao: formData.regiao,
        descricao: formData.descricao,
        preco: parseFloat(formData.preco),
      })

      toast({
        title: "Sucesso!",
        description: "Postagem criada com sucesso",
      })

      setFormData({ titulo: "", regiao: "", descricao: "", preco: "" })
      onOpenChange(false)
      
      if (onPostCreated) {
        onPostCreated()
      }
    } catch (error) {
      toast({
        title: "Erro ao criar postagem",
        description: error instanceof Error ? error.message : "Tente novamente",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-foreground">Criar publicação</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src="/diverse-user-avatars.png" />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {usuario?.nome.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <h4 className="font-semibold text-foreground">{usuario?.nome || "Usuário"}</h4>
              <p className="text-sm text-muted-foreground">Oferta de Transporte</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="titulo" className="text-foreground">
              Título da Oferta
            </Label>
            <Input
              id="titulo"
              placeholder="Ex: Frete para Universitários - Unifor"
              value={formData.titulo}
              onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
              className="bg-input border-border text-foreground"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="regiao" className="text-foreground">
              Região
            </Label>
            <Input
              id="regiao"
              placeholder="Ex: Maranguape e Maracanaú"
              value={formData.regiao}
              onChange={(e) => setFormData({ ...formData, regiao: e.target.value })}
              className="bg-input border-border text-foreground"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="preco" className="text-foreground">
              Preço (R$)
            </Label>
            <Input
              id="preco"
              type="number"
              step="0.01"
              placeholder="Ex: 15.00"
              value={formData.preco}
              onChange={(e) => setFormData({ ...formData, preco: e.target.value })}
              className="bg-input border-border text-foreground"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="descricao" className="text-foreground">
              Descrição
            </Label>
            <Textarea
              id="descricao"
              placeholder="Descreva os detalhes da oferta de transporte..."
              value={formData.descricao}
              onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              className="min-h-32 bg-input border-border text-foreground placeholder:text-muted-foreground resize-none"
            />
          </div>

          <Button
            onClick={handlePost}
            disabled={isLoading || !formData.titulo || !formData.regiao || !formData.descricao || !formData.preco}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            {isLoading ? "Publicando..." : "Publicar Oferta"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
