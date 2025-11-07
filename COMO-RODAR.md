# 🚀 Como Rodar o Projeto - Frete Inteligente

Este guia mostra como executar o projeto **Frete Inteligente** de forma rápida e simples.

---

## 📋 Pré-requisitos

Antes de começar, você precisa ter instalado:

- **Java 21+** (ou Java 17+)
- **Node.js 22+** (ou 18+)
- **Maven** (opcional, o projeto inclui Maven Wrapper)
- **MySQL 8.0** (opcional, pode usar H2 em memória)
- **Docker Desktop** (opcional, para usar Docker)

### Verificar Instalações

```bash
# Verificar Java
java -version

# Verificar Node.js
node --version
npm --version

# Verificar Maven (opcional)
mvn --version
```

---

## 🎯 Opção 1: Executar com Scripts Automáticos (RECOMENDADO)

### Windows

O projeto inclui scripts que fazem tudo automaticamente:

#### 1. Executar Backend

```bash
# Execute o script
.\scripts\EXECUTAR-BACKEND.bat
```

Este script:
- ✅ Compila o projeto
- ✅ Inicia o servidor Spring Boot
- ✅ Configura automaticamente o banco H2 (em memória)

**Aguardar:** O backend estará pronto quando aparecer: `Started FreteInteligenteApplication`

**URLs:**
- Backend: http://localhost:8080
- API: http://localhost:8080/api
- H2 Console: http://localhost:8080/h2-console

#### 2. Executar Frontend (em outro terminal)

```bash
# Execute o script
.\scripts\INICIAR-FRONTEND.bat
```

Este script:
- ✅ Verifica Node.js
- ✅ Instala dependências automaticamente
- ✅ Cria arquivo `.env.local` se necessário
- ✅ Inicia o servidor Next.js

**URL:** http://localhost:3000

---

## 🎯 Opção 2: Executar Manualmente

### Backend (Spring Boot)

```bash
# Na raiz do projeto

# Compilar (opcional)
mvnw.cmd clean package -DskipTests

# Executar
mvnw.cmd spring-boot:run
```

**Ou usando Maven instalado:**

```bash
mvn spring-boot:run
```

**Com perfil H2 (banco em memória):**

```bash
mvnw.cmd spring-boot:run -Dspring-boot.run.profiles=h2
```

**Com perfil MySQL:**

```bash
mvnw.cmd spring-boot:run -Dspring-boot.run.profiles=mysql
```

### Frontend (Next.js)

```bash
# Entrar na pasta do frontend
cd transport-app

# Instalar dependências (primeira vez)
npm install

# Criar arquivo de configuração
echo NEXT_PUBLIC_API_URL=http://localhost:8080/api > .env.local

# Executar
npm run dev
```

**URL:** http://localhost:3000

---

## 🐳 Opção 3: Executar com Docker (MAIS FÁCIL)

### Usando Docker Compose

```bash
# Execute o script
.\scripts\docker-start.bat

# Escolha a opção:
# 1 - Desenvolvimento (com H2)
# 2 - Completo (com MySQL)
```

Este script:
- ✅ Cria os containers Docker
- ✅ Configura o banco de dados
- ✅ Inicia backend e frontend automaticamente

**URLs:**
- Frontend: http://localhost:3000
- Backend: http://localhost:8080/api

### Comandos Docker Úteis

```bash
# Ver logs
docker-compose -f docker/docker-compose.dev.yml logs -f

# Parar containers
docker-compose -f docker/docker-compose.dev.yml down

# Reconstruir
docker-compose -f docker/docker-compose.dev.yml up -d --build
```

---

## ✅ Verificar se Está Funcionando

### 1. Backend

Abra no navegador ou use curl:

```bash
# Verificar status
curl http://localhost:8080/api/test/status

# Ou no navegador
http://localhost:8080/api/test/status
```

**Resposta esperada:**
```json
{
  "status": "ok",
  "message": "API funcionando"
}
```

### 2. Frontend

Abra no navegador:
```
http://localhost:3000
```

Você deve ver a página inicial de cadastro/login.

---

## 🎮 Primeiro Uso

### 1. Cadastrar um Usuário

1. Acesse: http://localhost:3000
2. Clique em **"Cadastre-se"**
3. Escolha o tipo:
   - 🎓 **Cliente/Estudante**
   - 🚗 **Motorista Autônomo**
   - 🏢 **Empresa de Transporte**
4. Preencha os dados:
   - Nome completo
   - Email
   - CPF
   - Telefone
   - **Localização** (novo campo) - Ex: "Fortaleza, CE, Brasil"
   - Senha (mínimo 6 caracteres)
5. Clique em **"Cadastrar"**

### 2. Fazer Login

1. Use o email e senha cadastrados
2. Você será redirecionado para o feed

### 3. Ver Perfil

1. Acesse: http://localhost:3000/profile
2. **A localização será exibida** no perfil do cliente

### 4. Gerenciar Viagens (Empresa/Motorista)

1. Acesse: http://localhost:3000/viagens/[id]
2. **A localização dos participantes será exibida** para cada cliente

---

## 🔧 Configuração do Banco de Dados

### Opção A: H2 (Padrão - Mais Fácil)

O H2 é um banco em memória, não precisa de configuração!

**Acessar console H2:**
- URL: http://localhost:8080/h2-console
- JDBC URL: `jdbc:h2:mem:frete_inteligente`
- User: `sa`
- Password: (vazio)

### Opção B: MySQL

1. **Instalar MySQL** (se ainda não tiver)
2. **Criar banco de dados:**

```sql
CREATE DATABASE frete_inteligente;
```

3. **Configurar** `src/main/resources/application-mysql.yml`:

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/frete_inteligente
    username: root
    password: sua_senha
```

4. **Executar com perfil MySQL:**

```bash
mvnw.cmd spring-boot:run -Dspring-boot.run.profiles=mysql
```

---

## 🐛 Solução de Problemas

### Backend não inicia

**Problema:** Porta 8080 já em uso

```bash
# Windows - Verificar processo
netstat -ano | findstr :8080

# Encontrar e matar processo
taskkill /PID <numero_do_pid> /F
```

**Problema:** Java não encontrado

```bash
# Verificar Java
java -version

# Se não encontrar, instale:
# https://adoptium.net/temurin/releases/
```

### Frontend não inicia

**Problema:** Porta 3000 já em uso

```bash
# Windows - Verificar processo
netstat -ano | findstr :3000

# Encontrar e matar processo
taskkill /PID <numero_do_pid> /F
```

**Problema:** Dependências não instaladas

```bash
cd transport-app
rm -rf node_modules
npm install
```

**Problema:** Erro de API não encontrada

Verifique se o arquivo `.env.local` existe em `transport-app/`:

```bash
cd transport-app
echo NEXT_PUBLIC_API_URL=http://localhost:8080/api > .env.local
```

### Docker não funciona

**Verificar Docker Desktop:**

```bash
docker --version
docker ps
```

**Se não estiver rodando:**
1. Abra o Docker Desktop
2. Aguarde inicializar
3. Tente novamente

---

## 📊 Estrutura de Pastas

```
frete-inteligente/
├── src/                    # Código backend (Java)
├── transport-app/          # Código frontend (Next.js)
├── scripts/                # Scripts de automação
│   ├── EXECUTAR-BACKEND.bat
│   ├── INICIAR-FRONTEND.bat
│   └── docker-start.bat
├── docker/                 # Arquivos Docker
├── docs/                   # Documentação
└── pom.xml                 # Dependências Maven
```

---

## 🚀 Comandos Rápidos

| Ação | Comando |
|------|---------|
| **Iniciar Backend** | `.\scripts\EXECUTAR-BACKEND.bat` |
| **Iniciar Frontend** | `.\scripts\INICIAR-FRONTEND.bat` |
| **Iniciar com Docker** | `.\scripts\docker-start.bat` |
| **Testar API** | `.\scripts\TESTAR-API.ps1` |
| **Ver logs Docker** | `docker-compose -f docker/docker-compose.dev.yml logs -f` |

---

## 📚 Mais Informações

- **Documentação Completa:** [`README.md`](./README.md)
- **Guia Rápido:** [`docs/QUICK_START.md`](./docs/QUICK_START.md)
- **Documentação Técnica:** [`docs/DOCUMENTACAO-TECNICA.md`](./docs/DOCUMENTACAO-TECNICA.md)
- **Docker:** [`docs/DOCKER-GUIA.md`](./docs/DOCKER-GUIA.md)
- **Solução de Problemas:** [`docs/COMO-EXECUTAR-SOLUCOES.md`](./docs/COMO-EXECUTAR-SOLUCOES.md)

---

## 🎯 Próximos Passos

1. ✅ Execute o backend e frontend
2. ✅ Cadastre um usuário
3. ✅ Veja a localização no perfil
4. ✅ Crie uma viagem e veja a localização dos participantes
5. ✅ Explore outras funcionalidades

---

## 💡 Dicas

- **Mantenha ambos os terminais abertos** (backend e frontend)
- **Use o navegador em modo desenvolvedor** (F12) para ver logs
- **Verifique os logs** se algo não funcionar
- **A migração de banco roda automaticamente** na primeira execução

---

**Pronto! Agora você pode rodar o projeto! 🎉**

Se tiver problemas, consulte a seção "Solução de Problemas" acima ou os arquivos de documentação.

