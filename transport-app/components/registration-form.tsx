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
import { geocodingService } from "@/services/geocoding.service"
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
    endereco: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [buscandoCoordenadas, setBuscandoCoordenadas] = useState(false)

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
      console.log('Tentando cadastrar usuário...', formData.email)
      
      // Se for CLIENTE e tiver endereço, buscar coordenadas
      let latitude: number | undefined;
      let longitude: number | undefined;
      
      if (userType === 'CLIENTE' && formData.endereco && formData.endereco.trim()) {
        try {
          const coords = await geocodingService.buscarCoordenadas(formData.endereco);
          if (coords) {
            latitude = coords.latitude;
            longitude = coords.longitude;
          }
        } catch (error) {
          console.warn('Não foi possível obter coordenadas:', error);
        }
      }
      
      const usuarioData: any = {
        tipo: userType as UsuarioTipo,
        nome: formData.nome,
        email: formData.email,
        cpf: formData.cpf,
        telefone: formData.telefone,
        senhaHash: formData.senha, // Em produção, isso deveria ser hasheado no backend
      };
      
      // Adicionar localização apenas para clientes
      if (userType === 'CLIENTE') {
        if (formData.endereco) usuarioData.endereco = formData.endereco;
        if (latitude) usuarioData.latitude = latitude;
        if (longitude) usuarioData.longitude = longitude;
      }
      
      await usuarioService.criar(usuarioData)

      toast({
        title: "Cadastro realizado com sucesso!",
        description: "Faça login para continuar",
      })
      router.push("/login")
    } catch (error: any) {
      console.error('Erro no cadastro:', error)
      const errorMessage = error?.message || error?.toString() || "Erro desconhecido"
      
      let userMessage = "Erro ao cadastrar. Tente novamente."
      if (errorMessage.includes('conectar') || errorMessage.includes('servidor') || error?.status === 0) {
        userMessage = "Backend não está rodando. Execute: .\\scripts\\EXECUTAR-BACKEND.bat e aguarde 'Started FreteInteligenteApplication'"
      } else if (errorMessage.includes('409') || errorMessage.includes('duplicado') || errorMessage.includes('já existe')) {
        userMessage = "Este email já está cadastrado. Tente fazer login."
      } else if (errorMessage.includes('400') || errorMessage.includes('inválido')) {
        userMessage = "Dados inválidos. Verifique os campos preenchidos."
      }
      
      toast({
        title: "Erro ao cadastrar",
        description: userMessage,
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

            {userType === "CLIENTE" && (
              <div className="space-y-2">
                <Label htmlFor="endereco" className="text-foreground">
                  Localização (Endereço) - Opcional
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="endereco"
                    type="text"
                    placeholder="Ex: Fortaleza, CE, Brasil"
                    value={formData.endereco}
                    onChange={(e) => handleInputChange("endereco", e.target.value)}
                    className="bg-input border-border text-foreground placeholder:text-muted-foreground focus:ring-primary"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    disabled={buscandoCoordenadas || !formData.endereco.trim()}
                    onClick={async () => {
                      if (!formData.endereco.trim()) return;
                      setBuscandoCoordenadas(true);
                      try {
                        const coords = await geocodingService.buscarCoordenadas(formData.endereco);
                        if (coords) {
                          toast({
                            title: "Coordenadas encontradas!",
                            description: `${coords.latitude.toFixed(6)}, ${coords.longitude.toFixed(6)}`,
                          });
                        } else {
                          toast({
                            title: "Endereço não encontrado",
                            description: "O endereço será salvo sem coordenadas",
                            variant: "destructive",
                          });
                        }
                      } catch (error) {
                        toast({
                          title: "Erro ao buscar coordenadas",
                          variant: "destructive",
                        });
                      } finally {
                        setBuscandoCoordenadas(false);
                      }
                    }}
                  >
                    {buscandoCoordenadas ? "Buscando..." : "Buscar"}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Informe o endereço para facilitar o mapeamento das viagens
                </p>
              </div>
            )}

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
