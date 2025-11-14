"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Home, Users, Briefcase, MessageSquare, Bell, Search, Plus, LogOut, Briefcase as Luggage, User, Settings, Menu, X } from "lucide-react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { PostCard } from "@/components/post-card"
import { CreatePostModal } from "@/components/create-post-modal"
import { CreateTripModal } from "@/components/modals/CreateTripModal"
import { EnrollTripModal } from "@/components/modals/EnrollTripModal"
import { useAuth } from "@/contexts/AuthContext"
import { postagemService } from "@/services/postagem.service"
import { viagemService } from "@/services/viagem.service"
import { inscricaoService } from "@/services/inscricao.service"
import { useToast } from "@/hooks/use-toast"
import type { Postagem } from "@/types"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

export function FeedLayout() {
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false)
  const [isEditPostOpen, setIsEditPostOpen] = useState(false)
  const [isCreateTripOpen, setIsCreateTripOpen] = useState(false)
  const [isEnrollTripOpen, setIsEnrollTripOpen] = useState(false)
  const [selectedPostagemForTrip, setSelectedPostagemForTrip] = useState<number | null>(null)
  const [selectedViagemForEnroll, setSelectedViagemForEnroll] = useState<any>(null)
  const [postagens, setPostagens] = useState<Postagem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editingPost, setEditingPost] = useState<Postagem | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { usuario, logout } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!usuario) {
      router.push("/login")
      return
    }

    carregarPostagens()
  }, [usuario, router])

  const carregarPostagens = async () => {
    try {
      setIsLoading(true)
      const data = await postagemService.listar()
      setPostagens(data)
    } catch (error) {
      console.error("Erro ao carregar postagens:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  const getTipoUsuario = (tipo: string) => {
    switch (tipo) {
      case "EMPRESA":
        return "Empresa de Transporte"
      case "AUTONOMO":
        return "Motorista Autônomo"
      case "CLIENTE":
        return "Cliente/Estudante"
      default:
        return tipo
    }
  }

  const isActive = (path: string) => pathname === path

  return (
    <div className="min-h-screen bg-background">
        {/* Top Navigation */}
        <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="h-16 flex items-center justify-between gap-4">
              {/* Logo e Busca */}
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <Link href="/feed" className="flex items-center gap-2 flex-shrink-0">
                  <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                    <span className="text-primary-foreground font-bold text-lg">T</span>
                  </div>
                  <h1 className="text-xl font-bold text-primary hidden sm:block">TransportApp</h1>
                </Link>
                <div className="hidden md:flex items-center flex-1 max-w-md ml-4">
                  <div className="relative w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="Buscar viagens, motoristas..." 
                      className="pl-10 pr-4 bg-background border-border text-foreground focus:ring-2 focus:ring-primary/20" 
                    />
                  </div>
                </div>
              </div>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center gap-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link href="/feed">
                      <Button 
                        variant={isActive("/feed") ? "secondary" : "ghost"} 
                        size="icon" 
                        className={`h-10 w-10 ${isActive("/feed") ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-accent"}`}
                      >
                        <Home className="h-5 w-5" />
                      </Button>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>Início</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-10 w-10 text-muted-foreground hover:text-foreground hover:bg-accent relative">
                      <Users className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Conexões</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-10 w-10 text-muted-foreground hover:text-foreground hover:bg-accent">
                      <MessageSquare className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Mensagens</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-10 w-10 text-muted-foreground hover:text-foreground hover:bg-accent relative">
                      <Bell className="h-5 w-5" />
                      <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs bg-red-500 border-2 border-card">
                        3
                      </Badge>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Notificações</TooltipContent>
                </Tooltip>

                <div className="h-6 w-px bg-border mx-1" />

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link href="/viagens">
                      <Button 
                        variant={isActive("/viagens") ? "secondary" : "ghost"} 
                        size="icon" 
                        className={`h-10 w-10 ${isActive("/viagens") ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-accent"}`}
                      >
                        <Luggage className="h-5 w-5" />
                      </Button>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>Minhas Viagens</TooltipContent>
                </Tooltip>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="relative flex items-center gap-2 rounded-full focus:outline-none focus:ring-2 focus:ring-primary/20">
                      <Avatar className="h-9 w-9 cursor-pointer border-2 border-transparent hover:border-primary transition-all duration-200">
                        <AvatarImage src="/diverse-user-avatars.png" />
                        <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                          {usuario?.nome.charAt(0).toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent 
                    align="end" 
                    style={{ backgroundColor: '#ffffff', opacity: 1 }}
                    className="w-56 !bg-white !opacity-100"
                  >
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{usuario?.nome || "Usuário"}</p>
                        <p className="text-xs leading-none text-muted-foreground">{usuario?.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        <span>Meu Perfil</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/viagens" className="cursor-pointer">
                        <Luggage className="mr-2 h-4 w-4" />
                        <span>Minhas Viagens</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem disabled>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Configurações</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={handleLogout}
                      className="cursor-pointer text-red-600 focus:text-red-600"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Sair</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </nav>

              {/* Mobile Menu Button */}
              <div className="md:hidden flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                  {mobileMenuOpen ? (
                    <X className="h-5 w-5" />
                  ) : (
                    <Menu className="h-5 w-5" />
                  )}
                </Button>
              </div>
            </div>

            {/* Mobile Search */}
            <div className="md:hidden pb-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Buscar..." 
                  className="pl-10 bg-background border-border" 
                />
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-border bg-card">
              <div className="px-4 py-3 space-y-1">
                <Link href="/feed" onClick={() => setMobileMenuOpen(false)}>
                  <Button 
                    variant={isActive("/feed") ? "secondary" : "ghost"} 
                    className="w-full justify-start"
                  >
                    <Home className="mr-2 h-4 w-4" />
                    Início
                  </Button>
                </Link>
                <Link href="/viagens" onClick={() => setMobileMenuOpen(false)}>
                  <Button 
                    variant={isActive("/viagens") ? "secondary" : "ghost"} 
                    className="w-full justify-start"
                  >
                    <Luggage className="mr-2 h-4 w-4" />
                    Minhas Viagens
                  </Button>
                </Link>
                <Link href="/profile" onClick={() => setMobileMenuOpen(false)}>
                  <Button 
                    variant={isActive("/profile") ? "secondary" : "ghost"} 
                    className="w-full justify-start"
                  >
                    <User className="mr-2 h-4 w-4" />
                    Meu Perfil
                  </Button>
                </Link>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-red-600"
                  onClick={() => {
                    setMobileMenuOpen(false)
                    handleLogout()
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sair
                </Button>
              </div>
            </div>
          )}
        </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Sidebar */}
          <aside className="hidden lg:block lg:col-span-3">
            <Card className="bg-card border-border">
              <CardHeader className="text-center pb-0">
                <Avatar className="h-20 w-20 mx-auto mb-3">
                  <AvatarImage src="/user-profile-illustration.png" />
                  <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                    {usuario?.nome.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <h3 className="font-semibold text-foreground">{usuario?.nome || "Usuário"}</h3>
                <p className="text-sm text-muted-foreground">{getTipoUsuario(usuario?.tipo || "")}</p>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Conexões</span>
                    <span className="font-semibold text-primary">245</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Visualizações</span>
                    <span className="font-semibold text-primary">1,234</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* Center Feed */}
          <div className="lg:col-span-6 space-y-4">
            {/* Create Post Card - apenas para EMPRESA ou AUTONOMO */}
            {(usuario?.tipo === "EMPRESA" || usuario?.tipo === "AUTONOMO") && (
              <Card className="bg-card border-border">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src="/diverse-user-avatars.png" />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {usuario?.nome.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <Button
                      variant="outline"
                      className="flex-1 justify-start text-muted-foreground hover:bg-input bg-transparent"
                      onClick={() => setIsCreatePostOpen(true)}
                    >
                      Compartilhe uma nova oferta de transporte...
                    </Button>
                    <Button
                      size="icon"
                      className="bg-primary text-primary-foreground hover:bg-primary/90"
                      onClick={() => setIsCreatePostOpen(true)}
                    >
                      <Plus className="h-5 w-5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Posts */}
            {isLoading ? (
              <Card className="bg-card border-border">
                <CardContent className="pt-6 text-center text-muted-foreground">
                  Carregando postagens...
                </CardContent>
              </Card>
            ) : postagens.length === 0 ? (
              <Card className="bg-card border-border">
                <CardContent className="pt-6 text-center text-muted-foreground">
                  Nenhuma postagem disponível. Seja o primeiro a compartilhar!
                </CardContent>
              </Card>
            ) : (
              postagens.map((postagem: Postagem) => (
                <Card key={postagem.id} className="bg-card border-border">
                  <CardHeader>
                    <div className="flex items-start gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {typeof postagem.autor === 'object' && 'nome' in postagem.autor 
                            ? postagem.autor.nome.charAt(0).toUpperCase()
                            : "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground">
                          {typeof postagem.autor === 'object' && 'nome' in postagem.autor 
                            ? postagem.autor.nome
                            : "Usuário"}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {typeof postagem.autor === 'object' && 'tipo' in postagem.autor 
                            ? getTipoUsuario(postagem.autor.tipo)
                            : ""}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="text-xl font-bold text-foreground mb-2">{postagem.titulo}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                        <span>📍</span>
                        <span className="font-medium">{postagem.regiao}</span>
                      </div>
                    </div>
                    {postagem.descricao && (
                      <p className="text-foreground leading-relaxed">{postagem.descricao}</p>
                    )}
                    <div className="flex items-center justify-between pt-2 border-t border-border">
                      <span className="text-2xl font-bold text-primary">R$ {postagem.preco.toFixed(2)}</span>
                    </div>

                    {/* Ações do autor da postagem */}
                    {(usuario?.id && typeof postagem.autor === 'object' && 'id' in postagem.autor && postagem.autor.id === usuario.id) && (
                      <div className="flex gap-3 flex-wrap pt-2 border-t border-border">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => { setEditingPost(postagem); setIsEditPostOpen(true) }}
                          className="flex items-center gap-2"
                        >
                          <span>✏️</span>
                          Editar
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={async () => {
                            try {
                              const viagens = await viagemService.buscarPorPostagem(postagem.id!)
                              if (!viagens.length) {
                                toast({ 
                                  title: "Nenhuma viagem criada", 
                                  description: "Crie uma viagem primeiro para esta postagem",
                                  variant: "destructive" 
                                })
                                return
                              }
                              // Se houver apenas uma viagem, vai direto
                              if (viagens.length === 1) {
                                router.push(`/viagens/${viagens[0].id!}`)
                                return
                              }
                              // Se houver múltiplas viagens, mostrar a mais recente (última criada)
                              // Ordenar por ID descendente para pegar a mais recente
                              const viagensOrdenadas = viagens.sort((a, b) => (b.id || 0) - (a.id || 0))
                              const id = viagensOrdenadas[0].id!
                              router.push(`/viagens/${id}`)
                            } catch (e) {
                              toast({ title: "Erro ao abrir gestão da viagem", variant: "destructive" })
                            }
                          }}
                          className="flex items-center gap-2"
                        >
                          <span>🗺️</span>
                          Gerenciar viagem
                        </Button>
                        <Button
                          variant="default"
                          size="sm"
                          className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-2"
                          onClick={() => {
                            setSelectedPostagemForTrip(postagem.id!)
                            setIsCreateTripOpen(true)
                          }}
                        >
                          <span>➕</span>
                          Criar Viagem
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 flex items-center gap-2"
                          onClick={async () => {
                            if (!confirm("Tem certeza que deseja excluir esta postagem?")) return
                            try {
                              await postagemService.deletar(postagem.id!)
                              toast({ title: "Postagem excluída com sucesso" })
                              carregarPostagens()
                            } catch (e) {
                              toast({ title: "Erro ao excluir postagem", variant: "destructive" })
                            }
                          }}
                        >
                          <span>🗑️</span>
                          Excluir
                        </Button>
                      </div>
                    )}

                    {/* Botão Entrar visível apenas para CLIENTE */}
                    {usuario?.tipo === "CLIENTE" && (
                      <div className="pt-3 border-t border-border">
                        <Button
                          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 flex items-center justify-center gap-2"
                          onClick={async () => {
                            try {
                              // buscar viagens vinculadas à postagem
                              const viagens = await viagemService.buscarPorPostagem(postagem.id!)
                              if (!viagens || viagens.length === 0) {
                                toast({
                                  title: "Nenhuma viagem disponível",
                                  description: "Esta postagem ainda não possui viagens cadastradas.",
                                  variant: "destructive",
                                })
                                return
                              }
                              // Verificar se o usuário já está inscrito em alguma viagem desta postagem
                              try {
                                const { inscricaoService } = await import("@/services/inscricao.service")
                                const minhasInscricoes = await inscricaoService.listarPorCliente(usuario.id!)
                                
                                // Verificar se está inscrito em alguma viagem desta postagem
                                const viagemInscrito = viagens.find(v => 
                                  minhasInscricoes.some(insc => insc.viagem?.id === v.id)
                                )
                                
                                if (viagemInscrito) {
                                  // Se já está inscrito, redirecionar para visualização
                                  router.push(`/viagens/${viagemInscrito.id}/view`)
                                  return
                                }
                              } catch (checkError) {
                                // Em caso de erro ao verificar, continuar com inscrição
                                console.warn("Erro ao verificar inscrições:", checkError)
                              }
                              
                              // Se não está inscrito, mostrar modal de inscrição
                              const viagem = viagens[0]
                              setSelectedViagemForEnroll(viagem)
                              setIsEnrollTripOpen(true)
                            } catch (error) {
                              toast({ title: "Erro ao abrir inscrição", description: error instanceof Error ? error.message : "Tente novamente", variant: "destructive" })
                            }
                          }}
                        >
                          <span>📝</span>
                          Ver Viagem / Inscrever-se
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Right Sidebar */}
          <aside className="hidden lg:block lg:col-span-3">
            <Card className="bg-card border-border">
              <CardHeader>
                <h3 className="font-semibold text-foreground">Sugestões para você</h3>
              </CardHeader>
              <CardContent className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={`/user-.jpg?height=40&width=40&query=user+${i}`} />
                      <AvatarFallback className="bg-muted text-muted-foreground">U{i}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">Usuário {i}</p>
                      <p className="text-xs text-muted-foreground truncate">Motorista Profissional</p>
                    </div>
                    <Button size="sm" variant="outline" className="text-xs bg-transparent">
                      Seguir
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </aside>
        </div>
      </main>

      {/* Create Post Modal */}
      <CreatePostModal 
        open={isCreatePostOpen} 
        onOpenChange={setIsCreatePostOpen}
        onPostCreated={carregarPostagens}
      />
      {editingPost && (
        <CreatePostModal
          open={isEditPostOpen}
          onOpenChange={(o) => { setIsEditPostOpen(o); if (!o) setEditingPost(null) }}
          onPostCreated={carregarPostagens}
          mode="edit"
          postagem={{
            id: editingPost.id!,
            titulo: editingPost.titulo,
            regiao: editingPost.regiao,
            descricao: editingPost.descricao,
            preco: editingPost.preco,
          }}
        />
      )}
      
      {/* Create Trip Modal */}
      {selectedPostagemForTrip && (
        <CreateTripModal
          open={isCreateTripOpen}
          onOpenChange={(o) => { 
            setIsCreateTripOpen(o)
            if (!o) setSelectedPostagemForTrip(null)
          }}
          postagemId={selectedPostagemForTrip}
          onTripCreated={() => {
            carregarPostagens()
            toast({ title: "Viagem criada! Você pode gerenciá-la agora." })
          }}
        />
      )}

      {/* Enroll Trip Modal */}
      {selectedViagemForEnroll && (
        <EnrollTripModal
          open={isEnrollTripOpen}
          onOpenChange={(o) => {
            setIsEnrollTripOpen(o)
            if (!o) setSelectedViagemForEnroll(null)
          }}
          viagem={selectedViagemForEnroll}
          onEnrollSuccess={() => {
            carregarPostagens()
            toast({ title: "Inscrição realizada com sucesso!" })
          }}
        />
      )}
    </div>
  )
}
