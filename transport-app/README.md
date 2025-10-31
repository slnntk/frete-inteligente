# 🚐 Frete Inteligente - Frontend

Frontend da aplicação Frete Inteligente construído com Next.js, React e TypeScript.

## 🚀 Início Rápido

### Pré-requisitos

- Node.js 18+ ou 20+
- pnpm (recomendado) ou npm
- Backend rodando em `http://localhost:8080`

### Instalação

```bash
# Instalar dependências
pnpm install

# Criar arquivo de variáveis de ambiente
cp .env.example .env.local

# Executar em modo de desenvolvimento
pnpm dev
```

Acesse [http://localhost:3000](http://localhost:3000) no navegador.

## 📁 Estrutura de Pastas

```
transport-app/
├── app/                    # Páginas e rotas Next.js
│   ├── feed/              # Feed de postagens
│   ├── login/             # Página de login
│   ├── navegacao/         # Navegação
│   ├── profile/           # Perfil do usuário
│   └── layout.tsx         # Layout raiz
├── components/            # Componentes React
│   ├── ui/               # Componentes de UI (Radix/shadcn)
│   ├── feed-layout.tsx   # Layout do feed
│   ├── login-form.tsx    # Formulário de login
│   ├── registration-form.tsx  # Formulário de registro
│   └── create-post-modal.tsx  # Modal de criar postagem
├── contexts/             # Contextos React
│   └── AuthContext.tsx   # Contexto de autenticação
├── services/             # Serviços de API
│   ├── usuario.service.ts
│   ├── postagem.service.ts
│   ├── viagem.service.ts
│   └── checkin.service.ts
├── lib/                  # Utilitários
│   ├── api-client.ts    # Cliente HTTP
│   └── utils.ts         # Funções auxiliares
├── types/               # Tipos TypeScript
│   └── index.ts         # Tipos das entidades
├── hooks/               # Custom hooks
├── public/              # Arquivos estáticos
└── styles/              # Estilos globais
```

## 🔧 Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

## 🎨 Tecnologias

- **Framework:** Next.js 16.0.0
- **UI Library:** React 19.2.0
- **Linguagem:** TypeScript 5
- **Estilização:** Tailwind CSS 4.1.9
- **Componentes:** Radix UI
- **Formulários:** React Hook Form
- **Validação:** Zod
- **Notificações:** Sonner
- **Gerenciador:** pnpm

## 📦 Scripts Disponíveis

```bash
# Desenvolvimento
pnpm dev

# Build para produção
pnpm build

# Executar build de produção
pnpm start

# Linting
pnpm lint
```

## 🔐 Autenticação

O sistema usa um contexto de autenticação (`AuthContext`) que gerencia:

- Login/Logout
- Estado do usuário
- Persistência no localStorage
- Proteção de rotas

### Exemplo de uso:

```tsx
import { useAuth } from '@/contexts/AuthContext'

function MyComponent() {
  const { usuario, login, logout } = useAuth()

  // Usar o usuário autenticado
  if (usuario) {
    return <div>Olá, {usuario.nome}!</div>
  }
}
```

## 🌐 Serviços de API

Os serviços estão organizados por entidade:

### UsuarioService
```typescript
import { usuarioService } from '@/services/usuario.service'

// Login
await usuarioService.login({ email, password })

// Criar usuário
await usuarioService.criar(usuarioData)

// Listar usuários
const usuarios = await usuarioService.listar()
```

### PostagemService
```typescript
import { postagemService } from '@/services/postagem.service'

// Criar postagem
await postagemService.criar({
  autorId: usuario.id,
  titulo: "Oferta de transporte",
  regiao: "Fortaleza",
  descricao: "Descrição da oferta",
  preco: 15.00
})

// Listar postagens
const postagens = await postagemService.listar()
```

## 🎨 Componentes UI

O projeto usa componentes do Radix UI estilizados com Tailwind CSS:

- `Button`
- `Card`
- `Dialog`
- `Input`
- `Label`
- `Avatar`
- `Toast`
- E muitos outros...

Todos os componentes estão em `components/ui/`.

## 🚦 Rotas

- `/` - Página inicial (registro)
- `/login` - Login
- `/feed` - Feed de postagens (requer autenticação)
- `/profile` - Perfil do usuário
- `/navegacao` - Navegação

## 🐛 Troubleshooting

### Erro de conexão com o backend
- Verifique se o backend está rodando em `http://localhost:8080`
- Confirme que o `.env.local` está configurado corretamente
- Verifique erros de CORS no console do navegador

### Erro ao fazer login
- Certifique-se de que o usuário foi criado no sistema
- Verifique o console do navegador para erros de API

### Componentes não aparecem
- Limpe o cache do Next.js: `rm -rf .next`
- Reinstale as dependências: `pnpm install`

## 📝 Boas Práticas

- Use TypeScript para type safety
- Componentes devem ser "use client" se usarem hooks
- Mantenha componentes pequenos e reutilizáveis
- Use o AuthContext para autenticação
- Sempre trate erros nas chamadas de API
- Use toasts para feedback ao usuário

## 🤝 Contribuindo

1. Crie uma branch para sua feature
2. Faça commits descritivos
3. Escreva código limpo e tipado
4. Teste suas alterações
5. Abra um Pull Request

## 📄 Licença

MVP Educacional

---

**Versão:** 2.0.0  
**Última Atualização:** Outubro 2025

