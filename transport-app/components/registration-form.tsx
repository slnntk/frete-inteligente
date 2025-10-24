"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { api, type Usuario } from "@/lib/api"

type UserType = "AUTONOMO" | "EMPRESA" | "CLIENTE"

export function RegistrationForm() {
  const router = useRouter()
  const [step, setStep] = useState<1 | 2>(1)
  const [userType, setUserType] = useState<UserType>("CLIENTE")
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    cpf: "",
    telefone: "",
    senha: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleUserTypeSelect = (type: UserType) => {
    setUserType(type)
    setStep(2)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    try {
      const usuario: Usuario = {
        tipo: userType,
        nome: formData.nome,
        email: formData.email,
        cpf: formData.cpf,
        telefone: formData.telefone,
        senhaHash: formData.senha, // In production, this should be hashed
      }
      
      const createdUser = await api.createUsuario(usuario)
      console.log("Usuário criado:", createdUser)
      
      // Store user info in localStorage
      localStorage.setItem("user", JSON.stringify(createdUser))
      
      router.push("/feed")
    } catch (err) {
      console.error("Erro ao criar usuário:", err)
      setError("Erro ao criar conta. Tente novamente.")
    } finally {
      setLoading(false)
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
              Autônomo
            </Button>
            <Button
              onClick={() => handleUserTypeSelect("EMPRESA")}
              variant="outline"
              className="w-full h-14 text-base border-border hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"
            >
              Empresa
            </Button>
            <Button
              onClick={() => handleUserTypeSelect("CLIENTE")}
              variant="outline"
              className="w-full h-14 text-base border-border hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"
            >
              Cliente/Aluno
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md border border-red-200">
                {error}
              </div>
            )}
            
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
                disabled={loading}
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
                disabled={loading}
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
                disabled={loading}
                className="bg-input border-border text-foreground placeholder:text-muted-foreground focus:ring-primary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefone" className="text-foreground">
                Telefone
              </Label>
              <Input
                id="telefone"
                type="text"
                placeholder="(00) 00000-0000"
                value={formData.telefone}
                onChange={(e) => handleInputChange("telefone", e.target.value)}
                required
                disabled={loading}
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
                disabled={loading}
                className="bg-input border-border text-foreground placeholder:text-muted-foreground focus:ring-primary"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(1)}
                disabled={loading}
                className="flex-1 border-border hover:bg-secondary"
              >
                Voltar
              </Button>
              <Button 
                type="submit" 
                disabled={loading}
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {loading ? "Cadastrando..." : "Cadastrar"}
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  )
}
