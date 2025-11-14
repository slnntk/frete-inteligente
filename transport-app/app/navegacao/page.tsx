import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Home, LogIn, UserPlus, User, Users } from "lucide-react"

export default function NavegacaoPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md bg-card border-border">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl font-bold text-foreground">Navegação do App</CardTitle>
          <CardDescription className="text-muted-foreground">Explore todas as páginas do aplicativo</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Link href="/" className="block">
            <Button
              variant="outline"
              className="w-full h-14 justify-start gap-3 border-border hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors bg-transparent"
            >
              <UserPlus className="h-5 w-5" />
              <span className="text-base">Cadastro</span>
            </Button>
          </Link>

          <Link href="/login" className="block">
            <Button
              variant="outline"
              className="w-full h-14 justify-start gap-3 border-border hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors bg-transparent"
            >
              <LogIn className="h-5 w-5" />
              <span className="text-base">Login</span>
            </Button>
          </Link>

          <Link href="/feed" className="block">
            <Button
              variant="outline"
              className="w-full h-14 justify-start gap-3 border-border hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors bg-transparent"
            >
              <Home className="h-5 w-5" />
              <span className="text-base">Feed Principal</span>
            </Button>
          </Link>

          <Link href="/profile" className="block">
            <Button
              variant="outline"
              className="w-full h-14 justify-start gap-3 border-border hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors bg-transparent"
            >
              <User className="h-5 w-5" />
              <span className="text-base">Perfil da Empresa</span>
            </Button>
          </Link>

          <Link href="/usuarios" className="block">
            <Button
              variant="outline"
              className="w-full h-14 justify-start gap-3 border-border hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors bg-transparent"
            >
              <Users className="h-5 w-5" />
              <span className="text-base">Gerenciar Usuários (CRUD)</span>
            </Button>
          </Link>

          <div className="pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground text-center">
              Use esta página para navegar entre todas as telas do aplicativo
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
