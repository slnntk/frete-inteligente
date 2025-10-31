# 🚚 Frete Inteligente

Sistema de gerenciamento de transporte universitário conectando motoristas, empresas de transporte e estudantes.

---

## 📋 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Tecnologias](#tecnologias)
- [Início Rápido](#início-rápido)
- [Documentação](#documentação)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Como Usar](#como-usar)

---

## 🎯 Sobre o Projeto

O **Frete Inteligente** é uma plataforma web que facilita a conexão entre:
- 🎓 **Estudantes** que precisam de transporte
- 🚗 **Motoristas autônomos** oferecendo serviços
- 🏢 **Empresas de transporte** com frotas organizadas

### Funcionalidades Principais

✅ **CRUD Completo de Usuários** - Gerenciamento dinâmico de Clientes, Autônomos e Empresas  
✅ **Cadastro de usuários** (Estudante, Motorista, Empresa)  
✅ **Sistema de postagens** de ofertas de transporte  
✅ **Criação e gerenciamento de viagens**  
✅ **Check-in de passageiros**  
✅ **Histórico de viagens e pagamentos**  
✅ **Formulário Dinâmico** que muda conforme o tipo de usuário  
✅ **Dashboard com Estatísticas** em tempo real  
✅ **Interface moderna e responsiva**  

---

## 🛠️ Tecnologias

### Backend
- **Java 21** - Linguagem principal
- **Spring Boot 3.x** - Framework
- **MySQL 8.0** / **H2** - Bancos de dados
- **Maven** - Gerenciamento de dependências
- **JPA/Hibernate** - ORM

### Frontend
- **Next.js 16** - Framework React
- **TypeScript 5** - Tipagem estática
- **Tailwind CSS 4** - Estilização
- **Radix UI** - Componentes acessíveis
- **React Context** - Gerenciamento de estado

### DevOps
- **Docker** - Containerização
- **Docker Compose** - Orquestração de containers

---

## 🚀 Início Rápido

### Pré-requisitos

Escolha **UMA** das opções:

#### Opção 1: Docker (Recomendado)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)

#### Opção 2: Local
- Java 21+
- Node.js 22+
- MySQL 8.0 (opcional, pode usar H2)

---

### 🐳 Usando Docker (Mais Fácil)

```bash
# 1. Execute o script
.\scripts\docker-start.bat

# 2. Escolha: 1 (Desenvolvimento) ou 2 (Completo)

# 3. Aguarde o build (5-10 min na primeira vez)

# 4. Acesse:
# Frontend: http://localhost:3000
# Backend:  http://localhost:8080
```

---

### 💻 Executando Localmente

#### Backend

```bash
# Via Maven Wrapper (Windows)
mvnw.cmd spring-boot:run

# Via Maven instalado
mvn spring-boot:run

# Via IDE (IntelliJ IDEA, Eclipse, VS Code)
# Abra FreteInteligenteApplication.java e clique em Run
```

#### Frontend

```bash
# Instalar dependências
cd transport-app
npm install

# Criar arquivo .env.local
echo NEXT_PUBLIC_API_URL=http://localhost:8080/api > .env.local

# Executar
npm run dev

# Acesse: http://localhost:3000
```

---

## 📚 Documentação

Toda a documentação está organizada na pasta [`docs/`](./docs):

### Guias de Início

| Documento | Descrição |
|-----------|-----------|
| [`QUICK_START.md`](./docs/QUICK_START.md) | Guia rápido completo |
| [`GUIA-RAPIDO.md`](./docs/GUIA-RAPIDO.md) | Instruções passo a passo |
| [`COMO-EXECUTAR-SOLUCOES.md`](./docs/COMO-EXECUTAR-SOLUCOES.md) | Soluções para problemas comuns |

### Documentação Técnica

| Documento | Descrição |
|-----------|-----------|
| [`DOCUMENTACAO-TECNICA.md`](./docs/DOCUMENTACAO-TECNICA.md) | Documentação técnica completa |
| [`architecture.md`](./docs/architecture.md) | Arquitetura do sistema |
| [`srs.md`](./docs/srs.md) | Especificação de requisitos |
| [`CRUD-USUARIOS.md`](./docs/CRUD-USUARIOS.md) | **NOVO!** Documentação do CRUD Completo |
| [`CRUD-GUIA-RAPIDO.md`](./docs/CRUD-GUIA-RAPIDO.md) | **NOVO!** Guia rápido do CRUD |

### Docker

| Documento | Descrição |
|-----------|-----------|
| [`DOCKER-GUIA.md`](./docs/DOCKER-GUIA.md) | Guia completo de Docker |

### API

| Documento | Descrição |
|-----------|-----------|
| [`EXEMPLOS-JSON.md`](./docs/EXEMPLOS-JSON.md) | Exemplos de requisições JSON |

### Resumos

| Documento | Descrição |
|-----------|-----------|
| [`INTEGRACAO-RESUMO.md`](./docs/INTEGRACAO-RESUMO.md) | Resumo da integração |
| [`CHECKLIST-INTEGRACAO.md`](./docs/CHECKLIST-INTEGRACAO.md) | Checklist de verificação |
| [`RESUMO-EXECUTIVO.md`](./docs/RESUMO-EXECUTIVO.md) | Resumo executivo |

---

## 📁 Estrutura do Projeto

```
frete-inteligente/
├── 📂 src/                        # Código-fonte backend
│   ├── main/
│   │   ├── java/                  # Código Java
│   │   │   └── frete_inteligente/
│   │   │       ├── config/        # Configurações (CORS, etc)
│   │   │       ├── controller/    # Controllers REST
│   │   │       ├── domain/        # Entidades JPA
│   │   │       ├── repository/    # Repositórios
│   │   │       └── FreteInteligenteApplication.java
│   │   └── resources/             # Recursos
│   │       ├── application.yml    # Configuração principal
│   │       ├── application-h2.yml # Config H2
│   │       └── application-mysql.yml # Config MySQL
│   └── test/                      # Testes
│
├── 📂 transport-app/              # Código-fonte frontend
│   ├── app/                       # Páginas Next.js
│   ├── components/                # Componentes React
│   ├── contexts/                  # Context API
│   ├── services/                  # Serviços de API
│   ├── types/                     # Tipos TypeScript
│   ├── lib/                       # Utilitários
│   └── public/                    # Assets estáticos
│
├── 📂 docs/                       # 📚 Documentação
│   ├── QUICK_START.md
│   ├── GUIA-RAPIDO.md
│   ├── DOCUMENTACAO-TECNICA.md
│   ├── DOCKER-GUIA.md
│   ├── EXEMPLOS-JSON.md
│   └── ...
│
├── 📂 scripts/                    # 🔧 Scripts de automação
│   ├── docker-start.bat           # Gerenciar Docker
│   ├── SETUP-COMPLETO.bat         # Setup backend completo
│   ├── INICIAR-FRONTEND.bat       # Iniciar frontend
│   ├── EXECUTAR-BACKEND.bat       # Executar backend
│   ├── TESTAR-API.ps1             # Testar API
│   └── DIAGNOSTICAR-ERRO.ps1      # Diagnóstico
│
├── 📂 docker/                     # 🐳 Arquivos Docker
│   ├── Dockerfile                 # Imagem backend
│   ├── docker-compose.dev.yml     # Dev (H2)
│   └── docker-compose.full.yml    # Produção (MySQL)
│
├── pom.xml                        # Dependências Maven
├── mvnw, mvnw.cmd                 # Maven Wrapper
└── README.md                      # Este arquivo
```

---

## 🎮 Como Usar

### 1️⃣ Primeiro Acesso

1. **Inicie o sistema** (Docker ou local)

2. **Acesse:** http://localhost:3000

3. **Cadastre-se:**
   - Escolha seu perfil: Estudante, Motorista ou Empresa
   - Preencha seus dados
   - Clique em "Cadastrar"

4. **Faça login:**
   - Use o email e senha que cadastrou
   - Acesse o feed de postagens

### 🆕 Gerenciar Usuários (CRUD)

1. **Acesse:** http://localhost:3000/usuarios

2. **Visualize o Dashboard:**
   - Veja estatísticas de todos os tipos de usuário
   - Filtre por Cliente, Autônomo ou Empresa

3. **Criar Novo Usuário:**
   - Clique em "Novo Usuário"
   - Selecione o tipo (o formulário muda automaticamente!)
   - Preencha os campos e cadastre

4. **Editar/Excluir:**
   - Use os botões de ação na tabela
   - Edição com validação em tempo real
   - Exclusão com confirmação de segurança

### 2️⃣ Criar uma Postagem

1. Clique no botão **"+"** ou **"Nova Postagem"**
2. Preencha:
   - Título
   - Região
   - Descrição
   - Preço
3. Clique em **"Publicar"**

### 3️⃣ Gerenciar Viagens

- **Motoristas/Empresas:**
  - Crie viagens baseadas nas postagens
  - Defina horários e capacidade
  - Acompanhe check-ins

- **Estudantes:**
  - Visualize viagens disponíveis
  - Faça check-in
  - Acompanhe histórico

---

## 🧪 Testando a API

### Opção 1: Script Automático

```powershell
.\scripts\TESTAR-API.ps1
```

### Opção 2: Postman/Insomnia

Importe os exemplos de [`docs/EXEMPLOS-JSON.md`](./docs/EXEMPLOS-JSON.md)

### Opção 3: PowerShell Manual

```powershell
# Listar usuários
Invoke-RestMethod -Uri "http://localhost:8080/api/usuarios"

# Criar usuário
$usuario = @{
    tipo = "CLIENTE"
    nome = "João Silva"
    email = "joao@email.com"
    cpf = "12345678901"
    telefone = "(85) 98765-4321"
    senhaHash = "senha123"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:8080/api/usuarios" `
    -Method POST `
    -Body $usuario `
    -ContentType "application/json"
```

---

## 🐛 Solução de Problemas

### Backend não inicia

1. **Verifique Java:**
   ```bash
   java -version  # Deve ser 21+
   ```

2. **Verifique porta 8080:**
   ```bash
   netstat -ano | findstr :8080
   ```

3. **Veja os logs** e consulte [`docs/COMO-EXECUTAR-SOLUCOES.md`](./docs/COMO-EXECUTAR-SOLUCOES.md)

### Frontend não inicia

1. **Verifique Node.js:**
   ```bash
   node --version  # Deve ser 22+
   ```

2. **Verifique .env.local:**
   ```bash
   cat transport-app/.env.local
   # Deve ter: NEXT_PUBLIC_API_URL=http://localhost:8080/api
   ```

3. **Reinstale dependências:**
   ```bash
   cd transport-app
   rm -rf node_modules
   npm install
   ```

### Docker não funciona

1. **Verifique Docker Desktop está rodando**

2. **Execute o diagnóstico:**
   ```bash
   .\scripts\docker-start.bat
   # Escolha opção 4 (Ver logs)
   ```

3. **Consulte:** [`docs/DOCKER-GUIA.md`](./docs/DOCKER-GUIA.md)

---

## 📊 Status do Projeto

- ✅ Backend (Spring Boot) - **Funcional**
- ✅ Frontend (Next.js) - **Funcional**
- ✅ Autenticação - **Implementado (Simulado)**
- ✅ **CRUD Completo de Usuários** - **Funcional** ⭐ **NOVO!**
  - ✅ Cliente/Estudante
  - ✅ Motorista Autônomo
  - ✅ Empresa de Transporte
- ✅ **Formulário Dinâmico** - **Funcional** ⭐ **NOVO!**
- ✅ **Dashboard com Estatísticas** - **Funcional** ⭐ **NOVO!**
- ✅ Integração Frontend-Backend - **Funcional**
- ✅ Docker - **Funcional**
- ⏳ JWT Real - **Planejado**
- ⏳ Testes Automatizados - **Planejado**
- ⏳ Deploy em Produção - **Planejado**

---

## 🤝 Comandos Rápidos

| Ação | Comando |
|------|---------|
| **Iniciar tudo (Docker)** | `.\scripts\docker-start.bat` |
| **Backend (Local)** | `mvnw.cmd spring-boot:run` |
| **Frontend (Local)** | `cd transport-app && npm run dev` |
| **Testar API** | `.\scripts\TESTAR-API.ps1` |
| **Testar CRUD** | `.\scripts\TESTAR-CRUD.ps1` |
| **Ver logs Docker** | `docker-compose -f docker/docker-compose.dev.yml logs -f` |
| **Parar Docker** | `docker-compose -f docker/docker-compose.dev.yml down` |
| **Diagnóstico** | `.\scripts\DIAGNOSTICAR-ERRO.ps1` |

---

## 📞 Links Úteis

- **Frontend:** http://localhost:3000
- **CRUD Usuários:** http://localhost:3000/usuarios ⭐ **NOVO!**
- **Backend API:** http://localhost:8080/api
- **H2 Console:** http://localhost:8080/h2-console
- **Documentação API:** [`docs/EXEMPLOS-JSON.md`](./docs/EXEMPLOS-JSON.md)
- **Documentação CRUD:** [`docs/CRUD-USUARIOS.md`](./docs/CRUD-USUARIOS.md) ⭐ **NOVO!**
- **Guia Docker:** [`docs/DOCKER-GUIA.md`](./docs/DOCKER-GUIA.md)

---

## 📄 Licença

Este projeto é um MVP acadêmico desenvolvido para facilitar o transporte universitário.

---

**Desenvolvido com ❤️ para facilitar o transporte universitário!**
