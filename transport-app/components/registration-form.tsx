"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { usuarioService } from "@/services/usuario.service"
import { UsuarioTipo } from "@/types"

type UserType = "AUTONOMO" | "EMPRESA" | "CLIENTE"

export function RegistrationForm() {
  const router = useRouter()
  const { toast } = useToast()
  const [step, setStep] = useState<1 | 2>(1)
  const [userType, setUserType] = useState<UserType>("CLIENTE")
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    cpf: "",
    telefone: "",
    senha: "",
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleUserTypeSelect = (type: UserType) => {
    setUserType(type)
    setStep(2)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await usuarioService.criar({
        tipo: userType as UsuarioTipo,
        nome: formData.nome,
        email: formData.email,
        cpf: formData.cpf,
        telefone: formData.telefone,
        senhaHash: formData.senha, // Em produção, isso deveria ser hasheado no backend
      })

      toast({
        title: "Cadastro realizado com sucesso!",
        description: "Faça login para continuar",
      })
      router.push("/login")
    } catch (error) {
      toast({
        title: "Erro ao cadastrar",
        description: error instanceof Error ? error.message : "Tente novamente mais tarde",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md bg-card border-border">
      <CardHeader className="space-y-2">
        <CardTitle className="text-2xl font-bold text-foreground">Cadastro</CardTitle>
        <CardDescription className="text-muted-foreground">
          {step === 1 ? "Selecione seu tipo de perfil" : "Complete suas informações"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {step === 1 ? (
          <div className="space-y-3">
            <Button
              onClick={() => handleUserTypeSelect("AUTONOMO")}
              variant="outline"
              className="w-full h-14 text-base border-border hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"
            >
              Motorista Autônomo
            </Button>
            <Button
              onClick={() => handleUserTypeSelect("EMPRESA")}
              variant="outline"
              className="w-full h-14 text-base border-border hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"
            >
              Empresa de Transporte
            </Button>
            <Button
              onClick={() => handleUserTypeSelect("CLIENTE")}
              variant="outline"
              className="w-full h-14 text-base border-border hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"
            >
              Cliente/Estudante
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nome" className="text-foreground">
                Nome Completo
              </Label>
              <Input
                id="nome"
                type="text"
                placeholder="Seu nome completo"
                value={formData.nome}
                onChange={(e) => handleInputChange("nome", e.target.value)}
                required
                className="bg-input border-border text-foreground placeholder:text-muted-foreground focus:ring-primary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                required
                className="bg-input border-border text-foreground placeholder:text-muted-foreground focus:ring-primary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cpf" className="text-foreground">
                CPF
              </Label>
              <Input
                id="cpf"
                type="text"
                placeholder="000.000.000-00"
                value={formData.cpf}
                onChange={(e) => handleInputChange("cpf", e.target.value)}
                required
                className="bg-input border-border text-foreground placeholder:text-muted-foreground focus:ring-primary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefone" className="text-foreground">
                Telefone
              </Label>
              <Input
                id="telefone"
                type="tel"
                placeholder="(85) 99999-9999"
                value={formData.telefone}
                onChange={(e) => handleInputChange("telefone", e.target.value)}
                required
                className="bg-input border-border text-foreground placeholder:text-muted-foreground focus:ring-primary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="senha" className="text-foreground">
                Senha
              </Label>
              <Input
                id="senha"
                type="password"
                placeholder="••••••••"
                value={formData.senha}
                onChange={(e) => handleInputChange("senha", e.target.value)}
                required
                minLength={6}
                className="bg-input border-border text-foreground placeholder:text-muted-foreground focus:ring-primary"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(1)}
                className="flex-1 border-border hover:bg-secondary"
                disabled={isLoading}
              >
                Voltar
              </Button>
              <Button 
                type="submit" 
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                disabled={isLoading}
              >
                {isLoading ? "Cadastrando..." : "Cadastrar"}
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  )
}
