"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/AuthContext"
import { postagemService } from "@/services/postagem.service"
import { MapPin, DollarSign, FileText, Tag, Loader2 } from "lucide-react"

interface CreatePostModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onPostCreated?: () => void
  mode?: 'create' | 'edit'
  postagem?: {
    id: number
    titulo: string
    regiao: string
    descricao: string
    preco: number
  }
}

export function CreatePostModal({ open, onOpenChange, onPostCreated, mode = 'create', postagem }: CreatePostModalProps) {
  const { usuario } = useAuth()
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    titulo: "",
    regiao: "",
    descricao: "",
    preco: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)

  // Resetar formulário quando o modal abrir/fechar
  useEffect(() => {
    if (open) {
      if (mode === 'edit' && postagem) {
        setFormData({
          titulo: postagem.titulo || "",
          regiao: postagem.regiao || "",
          descricao: postagem.descricao || "",
          preco: postagem.preco ? postagem.preco.toFixed(2) : "",
        })
      } else {
        setFormData({
          titulo: "",
          regiao: "",
          descricao: "",
          preco: "",
        })
      }
      setErrors({})
    }
  }, [open, mode, postagem])

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.titulo.trim()) {
      newErrors.titulo = "O título é obrigatório"
    } else if (formData.titulo.trim().length < 5) {
      newErrors.titulo = "O título deve ter pelo menos 5 caracteres"
    } else if (formData.titulo.trim().length > 160) {
      newErrors.titulo = "O título deve ter no máximo 160 caracteres"
    }

    if (!formData.regiao.trim()) {
      newErrors.regiao = "A região é obrigatória"
    } else if (formData.regiao.trim().length > 160) {
      newErrors.regiao = "A região deve ter no máximo 160 caracteres"
    }

    if (!formData.descricao.trim()) {
      newErrors.descricao = "A descrição é obrigatória"
    } else if (formData.descricao.trim().length < 10) {
      newErrors.descricao = "A descrição deve ter pelo menos 10 caracteres"
    }

    if (!formData.preco.trim()) {
      newErrors.preco = "O preço é obrigatório"
    } else {
      const precoValue = parseFloat(formData.preco.replace(',', '.'))
      if (isNaN(precoValue) || precoValue <= 0) {
        newErrors.preco = "O preço deve ser um valor maior que zero"
      } else if (precoValue > 999999.99) {
        newErrors.preco = "O preço deve ser menor que R$ 1.000.000,00"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const formatPrice = (value: string): string => {
    // Remove tudo que não é número ou vírgula/ponto
    let cleaned = value.replace(/[^\d,.-]/g, '')
    
    // Substitui vírgula por ponto para processamento
    cleaned = cleaned.replace(',', '.')
    
    // Remove múltiplos pontos
    const parts = cleaned.split('.')
    if (parts.length > 2) {
      cleaned = parts[0] + '.' + parts.slice(1).join('')
    }
    
    // Limita a 2 casas decimais
    if (parts.length === 2 && parts[1].length > 2) {
      cleaned = parts[0] + '.' + parts[1].substring(0, 2)
    }
    
    return cleaned
  }

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPrice(e.target.value)
    setFormData({ ...formData, preco: formatted })
    if (errors.preco) {
      setErrors({ ...errors, preco: "" })
    }
  }

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

    if (!validateForm()) {
      toast({
        title: "Erro de validação",
        description: "Por favor, corrija os erros no formulário",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const precoValue = parseFloat(formData.preco.replace(',', '.'))
      
      if (mode === 'edit' && postagem?.id) {
        await postagemService.atualizar(postagem.id, {
          titulo: formData.titulo.trim(),
          regiao: formData.regiao.trim(),
          descricao: formData.descricao.trim(),
          preco: precoValue,
          autorId: usuario.id,
        })
        toast({ 
          title: "Sucesso!", 
          description: "Postagem atualizada com sucesso" 
        })
      } else {
        await postagemService.criar({
          autorId: usuario.id,
          titulo: formData.titulo.trim(),
          regiao: formData.regiao.trim(),
          descricao: formData.descricao.trim(),
          preco: precoValue,
        })
        toast({ 
          title: "Sucesso!", 
          description: "Postagem criada com sucesso" 
        })
      }

      setFormData({ titulo: "", regiao: "", descricao: "", preco: "" })
      setErrors({})
      onOpenChange(false)
      if (onPostCreated) onPostCreated()
    } catch (error) {
      toast({
        title: mode === 'edit' ? "Erro ao atualizar postagem" : "Erro ao criar postagem",
        description: error instanceof Error ? error.message : "Tente novamente",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const isFormValid = formData.titulo.trim() && 
                     formData.regiao.trim() && 
                     formData.descricao.trim() && 
                     formData.preco.trim() &&
                     Object.keys(errors).length === 0

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-foreground flex items-center gap-2">
            {mode === 'edit' ? (
              <>
                <FileText className="h-5 w-5" />
                Editar Publicação
              </>
            ) : (
              <>
                <Tag className="h-5 w-5" />
                Criar Nova Oferta de Transporte
              </>
            )}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {mode === 'edit' 
              ? "Atualize os detalhes da sua oferta de transporte"
              : "Compartilhe uma nova oferta de transporte com a comunidade"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header com avatar */}
          <div className="flex items-center gap-3 pb-4 border-b border-border">
            <Avatar className="h-12 w-12">
              <AvatarImage src="/diverse-user-avatars.png" />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {usuario?.nome.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <h4 className="font-semibold text-foreground">{usuario?.nome || "Usuário"}</h4>
              <p className="text-sm text-muted-foreground">
                {usuario?.tipo === "EMPRESA" ? "Empresa de Transporte" : "Motorista Autônomo"}
              </p>
            </div>
          </div>

          {/* Título */}
          <div className="space-y-2">
            <Label htmlFor="titulo" className="text-foreground flex items-center gap-2">
              <Tag className="h-4 w-4" />
              Título da Oferta *
            </Label>
            <Input
              id="titulo"
              placeholder="Ex: Transporte para Universitários - Unifor"
              value={formData.titulo}
              onChange={(e) => {
                setFormData({ ...formData, titulo: e.target.value })
                if (errors.titulo) {
                  setErrors({ ...errors, titulo: "" })
                }
              }}
              className={`bg-input border-border text-foreground ${errors.titulo ? 'border-red-500' : ''}`}
              maxLength={160}
            />
            <div className="flex justify-between items-center">
              {errors.titulo && (
                <p className="text-sm text-red-500">{errors.titulo}</p>
              )}
              <p className="text-xs text-muted-foreground ml-auto">
                {formData.titulo.length}/160 caracteres
              </p>
            </div>
          </div>

          {/* Região */}
          <div className="space-y-2">
            <Label htmlFor="regiao" className="text-foreground flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Região de Atuação *
            </Label>
            <Input
              id="regiao"
              placeholder="Ex: Maranguape, Maracanaú e Fortaleza"
              value={formData.regiao}
              onChange={(e) => {
                setFormData({ ...formData, regiao: e.target.value })
                if (errors.regiao) {
                  setErrors({ ...errors, regiao: "" })
                }
              }}
              className={`bg-input border-border text-foreground ${errors.regiao ? 'border-red-500' : ''}`}
              maxLength={160}
            />
            {errors.regiao && (
              <p className="text-sm text-red-500">{errors.regiao}</p>
            )}
          </div>

          {/* Preço */}
          <div className="space-y-2">
            <Label htmlFor="preco" className="text-foreground flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Preço por Passageiro (R$) *
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">R$</span>
              <Input
                id="preco"
                type="text"
                placeholder="0,00"
                value={formData.preco}
                onChange={handlePriceChange}
                className={`bg-input border-border text-foreground pl-10 ${errors.preco ? 'border-red-500' : ''}`}
              />
            </div>
            {errors.preco && (
              <p className="text-sm text-red-500">{errors.preco}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Informe o valor que será cobrado por passageiro nesta rota
            </p>
          </div>

          {/* Descrição */}
          <div className="space-y-2">
            <Label htmlFor="descricao" className="text-foreground flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Descrição Detalhada *
            </Label>
            <Textarea
              id="descricao"
              placeholder="Descreva os detalhes da oferta: horários, pontos de embarque, veículo, condições especiais, etc..."
              value={formData.descricao}
              onChange={(e) => {
                setFormData({ ...formData, descricao: e.target.value })
                if (errors.descricao) {
                  setErrors({ ...errors, descricao: "" })
                }
              }}
              className={`min-h-32 bg-input border-border text-foreground placeholder:text-muted-foreground resize-none ${errors.descricao ? 'border-red-500' : ''}`}
            />
            {errors.descricao && (
              <p className="text-sm text-red-500">{errors.descricao}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Seja detalhado para atrair mais passageiros
            </p>
          </div>

          {/* Botões */}
          <div className="flex gap-3 pt-4 border-t border-border">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              onClick={handlePost}
              disabled={isLoading || !isFormValid}
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {mode === 'edit' ? 'Salvando...' : 'Publicando...'}
                </>
              ) : (
                mode === 'edit' ? 'Salvar Alterações' : 'Publicar Oferta'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
