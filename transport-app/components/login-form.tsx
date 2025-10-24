"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { api } from "@/lib/api"

export function LoginForm() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    try {
      // Get all users and find matching email/password
      const usuarios = await api.getUsuarios()
      const user = usuarios.find(
        (u) => u.email === formData.email && u.senhaHash === formData.password
      )
      
      if (user) {
        console.log("Login bem-sucedido:", user)
        // Store user info in localStorage
        localStorage.setItem("user", JSON.stringify(user))
        router.push("/feed")
      } else {
        setError("Email ou senha incorretos")
      }
    } catch (err) {
      console.error("Erro ao fazer login:", err)
      setError("Erro ao fazer login. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md bg-card border-border">
      <CardHeader className="space-y-2">
        <CardTitle className="text-2xl font-bold text-foreground">Login</CardTitle>
        <CardDescription className="text-muted-foreground">
          Entre com suas credenciais para acessar a plataforma
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md border border-red-200">
              {error}
            </div>
          )}
          
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
            <Label htmlFor="password" className="text-foreground">
              Senha
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              required
              disabled={loading}
              className="bg-input border-border text-foreground placeholder:text-muted-foreground focus:ring-primary"
            />
          </div>

          <Button 
            type="submit" 
            disabled={loading}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {loading ? "Entrando..." : "Entrar"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col gap-2 text-sm text-muted-foreground">
        <Link href="/forgot-password" className="hover:text-primary transition-colors">
          Esqueceu sua senha?
        </Link>
        <div>
          Não tem uma conta?{" "}
          <Link href="/" className="text-primary hover:underline">
            Cadastre-se
          </Link>
        </div>
      </CardFooter>
    </Card>
  )
}
