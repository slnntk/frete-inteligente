"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ImageIcon, VideoIcon, FileTextIcon } from "lucide-react"
import { api, type Postagem, type Usuario } from "@/lib/api"

interface CreatePostModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onPostCreated?: () => void
}

export function CreatePostModal({ open, onOpenChange, onPostCreated }: CreatePostModalProps) {
  const [formData, setFormData] = useState({
    titulo: "",
    regiao: "",
    descricao: "",
    preco: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handlePost = async () => {
    setLoading(true)
    setError(null)
    
    try {
      // Get current user from localStorage
      const userStr = localStorage.getItem("user")
      if (!userStr) {
        setError("Você precisa estar logado para criar uma postagem")
        return
      }
      
      const user: Usuario = JSON.parse(userStr)
      
      const postagem: Postagem = {
        autor: { id: user.id! },
        titulo: formData.titulo,
        regiao: formData.regiao,
        descricao: formData.descricao,
        preco: parseFloat(formData.preco) || 0,
      }
      
      await api.createPostagem(postagem)
      console.log("Postagem criada com sucesso")
      
      // Reset form
      setFormData({
        titulo: "",
        regiao: "",
        descricao: "",
        preco: "",
      })
      
      onOpenChange(false)
      
      // Notify parent to refresh posts
      if (onPostCreated) {
        onPostCreated()
      }
    } catch (err) {
      console.error("Erro ao criar postagem:", err)
      setError("Erro ao criar postagem. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-foreground">Criar publicação de frete</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md border border-red-200">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="titulo">Título da oferta</Label>
            <Input
              id="titulo"
              placeholder="Ex: Frete para Universitários - Unifor"
              value={formData.titulo}
              onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
              disabled={loading}
              className="bg-input border-border"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="regiao">Região</Label>
            <Input
              id="regiao"
              placeholder="Ex: Maranguape e Maracanaú"
              value={formData.regiao}
              onChange={(e) => setFormData({ ...formData, regiao: e.target.value })}
              disabled={loading}
              className="bg-input border-border"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea
              id="descricao"
              placeholder="Descreva os detalhes do serviço de frete..."
              value={formData.descricao}
              onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              disabled={loading}
              className="min-h-32 bg-input border-border text-foreground placeholder:text-muted-foreground resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="preco">Preço (R$)</Label>
            <Input
              id="preco"
              type="number"
              step="0.01"
              placeholder="15.00"
              value={formData.preco}
              onChange={(e) => setFormData({ ...formData, preco: e.target.value })}
              disabled={loading}
              className="bg-input border-border"
            />
          </div>

          <Button
            onClick={handlePost}
            disabled={!formData.titulo.trim() || !formData.descricao.trim() || loading}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            {loading ? "Publicando..." : "Publicar"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
