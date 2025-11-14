# 📋 CRUD Completo de Usuários

Sistema de gerenciamento completo (CRUD) para **Clientes**, **Autônomos** e **Empresas** com formulário dinâmico que se adapta ao tipo de usuário selecionado.

---

## 🎯 Funcionalidades

### ✅ Operações CRUD Completas
- **Create** - Criar novos usuários (Cliente, Autônomo ou Empresa)
- **Read** - Listar e visualizar usuários
- **Update** - Editar dados de usuários existentes
- **Delete** - Excluir usuários com confirmação

### ✅ Recursos Especiais
- 📝 **Formulário Dinâmico** - Campos mudam conforme o tipo selecionado
- 🔍 **Filtros por Tipo** - Filtrar visualização por tipo de usuário
- 📊 **Dashboard com Estatísticas** - Cards com contadores por tipo
- 🎨 **Interface Moderna** - Design responsivo e intuitivo
- ⚡ **Feedback Visual** - Toasts de sucesso/erro
- 🔒 **Confirmação de Exclusão** - Dialog de segurança antes de deletar

---

## 🏗️ Arquitetura

### Backend (Spring Boot)

#### DTOs Criados
```
src/main/java/frete_inteligente/com/frete_inteligente/dto/
├── UsuarioDTO.java      # DTO base
├── ClienteDTO.java      # Cliente/Estudante
├── AutonomoDTO.java     # Motorista Autônomo
└── EmpresaDTO.java      # Empresa de Transporte
```

#### Services
```
src/main/java/frete_inteligente/com/frete_inteligente/service/
├── ClienteService.java   # Lógica de negócio Cliente
├── AutonomoService.java  # Lógica de negócio Autônomo
└── EmpresaService.java   # Lógica de negócio Empresa
```

#### Controllers REST
```
src/main/java/frete_inteligente/com/frete_inteligente/controller/
├── ClienteController.java   # API REST /api/clientes
├── AutonomoController.java  # API REST /api/autonomos
└── EmpresaController.java   # API REST /api/empresas
```

### Frontend (Next.js + TypeScript)

#### Serviços de API
```
transport-app/services/
├── cliente.service.ts    # Chamadas API Cliente
├── autonomo.service.ts   # Chamadas API Autônomo
└── empresa.service.ts    # Chamadas API Empresa
```

#### Componentes
```
transport-app/components/
└── dynamic-user-form.tsx  # Formulário dinâmico
```

#### Páginas
```
transport-app/app/
└── usuarios/
    └── page.tsx  # Página principal de gerenciamento
```

---

## 📡 Endpoints da API

### Cliente (Estudante)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/api/clientes` | Listar todos os clientes |
| `GET` | `/api/clientes/{id}` | Buscar cliente por ID |
| `POST` | `/api/clientes` | Criar novo cliente |
| `PUT` | `/api/clientes/{id}` | Atualizar cliente |
| `DELETE` | `/api/clientes/{id}` | Excluir cliente |

**Exemplo de Payload (Cliente):**
```json
{
  "nome": "João Silva",
  "email": "joao@email.com",
  "cpf": "123.456.789-00",
  "telefone": "(85) 98765-4321",
  "senha": "senha123",
  "matricula": "2024001",
  "instituicao": "Universidade Federal",
  "curso": "Engenharia de Software"
}
```

### Autônomo (Motorista)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/api/autonomos` | Listar todos os autônomos |
| `GET` | `/api/autonomos/{id}` | Buscar autônomo por ID |
| `POST` | `/api/autonomos` | Criar novo autônomo |
| `PUT` | `/api/autonomos/{id}` | Atualizar autônomo |
| `DELETE` | `/api/autonomos/{id}` | Excluir autônomo |

**Exemplo de Payload (Autônomo):**
```json
{
  "nome": "Carlos Motorista",
  "email": "carlos@email.com",
  "cpf": "987.654.321-00",
  "telefone": "(85) 91234-5678",
  "senha": "senha123",
  "cnh": "12345678901",
  "categoriaCnh": "D",
  "ear": true
}
```

### Empresa

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/api/empresas` | Listar todas as empresas |
| `GET` | `/api/empresas/{id}` | Buscar empresa por ID |
| `POST` | `/api/empresas` | Criar nova empresa |
| `PUT` | `/api/empresas/{id}` | Atualizar empresa |
| `DELETE` | `/api/empresas/{id}` | Excluir empresa |

**Exemplo de Payload (Empresa):**
```json
{
  "nome": "Transportes XYZ",
  "email": "contato@xyz.com",
  "telefone": "(85) 3000-0000",
  "senha": "senha123",
  "cnpj": "12.345.678/0001-00",
  "razaoSocial": "Transportes XYZ LTDA"
}
```

---

## 🎨 Interface do Usuário

### Página de Gerenciamento (`/usuarios`)

#### 1. **Dashboard com Estatísticas**
- Total de usuários
- Contador de Clientes
- Contador de Autônomos
- Contador de Empresas

#### 2. **Filtros**
- Dropdown para filtrar por tipo (Todos, Cliente, Autônomo, Empresa)

#### 3. **Tabela de Listagem**
Colunas:
- ID
- Tipo (Badge colorido com ícone)
- Nome
- E-mail
- Telefone
- Documento (CPF ou CNPJ)
- Ações (Editar, Excluir)

#### 4. **Botão "Novo Usuário"**
- Abre modal com formulário dinâmico

### Formulário Dinâmico

O formulário se adapta automaticamente ao tipo selecionado:

#### **Cliente (Estudante)**
Campos:
- ✅ Tipo de Usuário (seletor)
- ✅ Nome
- ✅ E-mail
- ✅ CPF
- ✅ Telefone
- ✅ Matrícula
- ✅ Instituição
- ✅ Curso
- ✅ Senha

#### **Autônomo (Motorista)**
Campos:
- ✅ Tipo de Usuário (seletor)
- ✅ Nome
- ✅ E-mail
- ✅ CPF
- ✅ Telefone
- ✅ CNH
- ✅ Categoria CNH (A, B, AB, C, D, E)
- ✅ EAR (checkbox)
- ✅ Senha

#### **Empresa**
Campos:
- ✅ Tipo de Usuário (seletor)
- ✅ Nome Fantasia
- ✅ E-mail
- ✅ Telefone
- ✅ CNPJ
- ✅ Razão Social
- ✅ Senha

---

## 🚀 Como Usar

### 1. **Acessar a Página**

Navegue para: **http://localhost:3000/usuarios**

Ou use a navegação: **http://localhost:3000/navegacao** → "Gerenciar Usuários (CRUD)"

### 2. **Criar Novo Usuário**

1. Clique no botão **"+ Novo Usuário"**
2. Selecione o **Tipo de Usuário** (Cliente, Autônomo ou Empresa)
3. O formulário se adaptará automaticamente
4. Preencha os campos
5. Clique em **"Cadastrar"**
6. Aguarde a confirmação via toast

### 3. **Filtrar Usuários**

1. Use o dropdown de filtros
2. Selecione o tipo desejado (Todos, Cliente, Autônomo, Empresa)
3. A tabela será atualizada automaticamente

### 4. **Editar Usuário**

1. Clique no botão de **Editar** (ícone de lápis)
2. O modal abrirá com os dados preenchidos
3. Modifique os campos desejados
4. Clique em **"Atualizar"**
5. Aguarde a confirmação

### 5. **Excluir Usuário**

1. Clique no botão de **Excluir** (ícone de lixeira vermelho)
2. Confirme a exclusão no dialog de alerta
3. O usuário será removido permanentemente

---

## 🎯 Recursos Visuais

### Badges de Tipo

| Tipo | Cor | Ícone |
|------|-----|-------|
| Cliente | Azul (`bg-blue-500`) | 🎓 GraduationCap |
| Autônomo | Verde (`bg-green-500`) | 🚗 Car |
| Empresa | Roxo (`bg-purple-500`) | 🏢 Building2 |

### Toasts de Feedback

- ✅ **Sucesso** - "Cliente cadastrado com sucesso!"
- ✅ **Sucesso** - "Autônomo atualizado com sucesso!"
- ❌ **Erro** - "Erro ao salvar. Tente novamente."
- ✅ **Sucesso** - "Usuário excluído com sucesso!"

---

## 🧪 Testando

### Teste Manual Completo

#### 1. **Criar Cliente**
```bash
# Abra: http://localhost:3000/usuarios
# Clique em "Novo Usuário"
# Selecione "Cliente"
# Preencha:
Nome: Maria Santos
E-mail: maria@email.com
CPF: 111.222.333-44
Telefone: (85) 99999-9999
Matrícula: 2024001
Instituição: UFC
Curso: Ciência da Computação
Senha: senha123
# Clique em "Cadastrar"
```

#### 2. **Criar Autônomo**
```bash
# Clique em "Novo Usuário"
# Selecione "Autônomo"
# Preencha:
Nome: José Motorista
E-mail: jose@email.com
CPF: 555.666.777-88
Telefone: (85) 98888-8888
CNH: 12345678901
Categoria CNH: D
EAR: ✓ (marcado)
Senha: senha123
# Clique em "Cadastrar"
```

#### 3. **Criar Empresa**
```bash
# Clique em "Novo Usuário"
# Selecione "Empresa"
# Preencha:
Nome Fantasia: Transportes ABC
E-mail: contato@abc.com
Telefone: (85) 3333-3333
CNPJ: 11.222.333/0001-44
Razão Social: Transportes ABC LTDA
Senha: senha123
# Clique em "Cadastrar"
```

#### 4. **Testar Filtros**
```bash
# No dropdown de filtros, selecione:
- "Clientes" → Deve mostrar apenas clientes
- "Autônomos" → Deve mostrar apenas autônomos
- "Empresas" → Deve mostrar apenas empresas
- "Todos" → Deve mostrar todos os tipos
```

#### 5. **Editar Usuário**
```bash
# Clique no botão de editar de qualquer usuário
# Modifique algum campo (ex: telefone)
# Clique em "Atualizar"
# Verifique se a tabela foi atualizada
```

#### 6. **Excluir Usuário**
```bash
# Clique no botão de excluir (vermelho)
# Confirme a exclusão no dialog
# Verifique se o usuário sumiu da lista
```

### Teste via API (PowerShell)

```powershell
# Criar Cliente
$cliente = @{
    nome = "Maria Santos"
    email = "maria@email.com"
    cpf = "11122233344"
    telefone = "(85) 99999-9999"
    senha = "senha123"
    matricula = "2024001"
    instituicao = "UFC"
    curso = "Ciência da Computação"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:8080/api/clientes" `
    -Method POST `
    -Body $cliente `
    -ContentType "application/json"

# Listar Clientes
Invoke-RestMethod -Uri "http://localhost:8080/api/clientes"

# Criar Autônomo
$autonomo = @{
    nome = "José Motorista"
    email = "jose@email.com"
    cpf = "55566677788"
    telefone = "(85) 98888-8888"
    senha = "senha123"
    cnh = "12345678901"
    categoriaCnh = "D"
    ear = $true
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:8080/api/autonomos" `
    -Method POST `
    -Body $autonomo `
    -ContentType "application/json"

# Criar Empresa
$empresa = @{
    nome = "Transportes ABC"
    email = "contato@abc.com"
    telefone = "(85) 3333-3333"
    senha = "senha123"
    cnpj = "11222333000144"
    razaoSocial = "Transportes ABC LTDA"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:8080/api/empresas" `
    -Method POST `
    -Body $empresa `
    -ContentType "application/json"
```

---

## 🔧 Tecnologias Utilizadas

### Backend
- **Java 21**
- **Spring Boot 3.x**
- **Spring Data JPA**
- **Lombok** - Redução de boilerplate
- **H2/MySQL** - Banco de dados

### Frontend
- **Next.js 16** - Framework React
- **TypeScript 5** - Tipagem estática
- **Tailwind CSS 4** - Estilização
- **Radix UI** - Componentes acessíveis
- **Sonner** - Toasts
- **Lucide React** - Ícones

---

## 📊 Estrutura de Dados

### Relacionamentos

```
Usuario (tabela base)
├── id (PK)
├── tipo (CLIENTE | AUTONOMO | EMPRESA)
├── nome
├── email
├── cpf
├── telefone
└── senhaHash

Cliente
└── Herda de Usuario (tipo = CLIENTE)

Autonomo (OneToOne com Usuario)
├── id (PK, FK → Usuario.id)
├── usuario (OneToOne)
├── cnh
├── categoriaCnh
└── ear

Empresa (OneToOne com Usuario)
├── id (PK, FK → Usuario.id)
├── usuario (OneToOne)
├── cnpj
└── razaoSocial
```

---

## ✨ Destaques do Sistema

### 1. **Formulário Inteligente**
O formulário detecta automaticamente o tipo e exibe apenas os campos relevantes:
- Cliente → Campos de estudante
- Autônomo → Campos de motorista
- Empresa → Campos empresariais

### 2. **Validação em Tempo Real**
- Campos obrigatórios marcados
- Validação de e-mail
- Campos de senha seguros

### 3. **Feedback Imediato**
- Loading states durante operações
- Toasts de sucesso/erro
- Confirmação de ações destrutivas

### 4. **Design Responsivo**
- Mobile-first
- Adaptável a tablets e desktops
- Tabela responsiva com scroll horizontal

### 5. **Acessibilidade**
- Componentes Radix UI (WAI-ARIA)
- Labels descritivos
- Navegação por teclado

---

## 🎉 Conclusão

Este CRUD completo oferece:

✅ **3 tipos de usuário** completamente funcionais  
✅ **Formulário dinâmico** que se adapta ao tipo  
✅ **Interface moderna** e responsiva  
✅ **API REST** completa e documentada  
✅ **Operações CRUD** completas (Create, Read, Update, Delete)  
✅ **Filtros e estatísticas** em tempo real  
✅ **Feedback visual** com toasts  
✅ **Segurança** com confirmação de exclusão  

**Pronto para uso em produção!** 🚀

---

**Desenvolvido para o projeto Frete Inteligente** 🚚

