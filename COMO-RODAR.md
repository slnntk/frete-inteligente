# 🚀 Como Rodar o Projeto Frete Inteligente

Este guia fornece instruções detalhadas de como configurar e executar o projeto Frete Inteligente completo, incluindo o backend (Spring Boot) e o frontend (Next.js).

## 📋 Índice

1. [Pré-requisitos](#pré-requisitos)
2. [Estrutura do Projeto](#estrutura-do-projeto)
3. [Opção 1: Executar com Docker (Recomendado)](#opção-1-executar-com-docker-recomendado)
4. [Opção 2: Executar Localmente](#opção-2-executar-localmente)
5. [Verificando a Instalação](#verificando-a-instalação)
6. [Acessando a Aplicação](#acessando-a-aplicação)
7. [Testando a API](#testando-a-api)
8. [Solução de Problemas](#solução-de-problemas)

---

## Pré-requisitos

### Para executar com Docker (Mais fácil)
- **Docker**: versão 20.10 ou superior
- **Docker Compose**: versão 2.0 ou superior
- **Git**: para clonar o repositório

### Para executar localmente (Sem Docker)
- **Java**: versão 17 ou superior (OpenJDK ou Oracle JDK)
- **Maven**: versão 3.6 ou superior
- **Node.js**: versão 18 ou superior
- **npm** ou **pnpm**: versão 8 ou superior
- **MySQL**: versão 8.0 ou superior
- **Git**: para clonar o repositório

### Verificando as instalações

```bash
# Verificar Docker
docker --version
docker compose version

# Verificar Java e Maven
java -version
mvn -version

# Verificar Node.js e npm
node -v
npm -v

# Verificar MySQL (se instalado localmente)
mysql --version
```

---

## Estrutura do Projeto

O projeto Frete Inteligente é composto por duas partes principais:

```
frete-inteligente/
├── src/                     # Backend Spring Boot (Java)
│   └── main/
│       ├── java/           # Código fonte Java
│       └── resources/      # Configurações e recursos
├── transport-app/          # Frontend Next.js (React)
│   ├── app/               # Páginas e rotas do Next.js
│   ├── components/        # Componentes React
│   └── public/           # Arquivos estáticos
├── pom.xml                # Configuração Maven (Backend)
├── docker-compose.yml     # Configuração Docker
└── README.md             # Documentação principal
```

---

## Opção 1: Executar com Docker (Recomendado)

Esta é a maneira mais fácil e rápida de rodar o projeto, pois o Docker gerencia todas as dependências automaticamente.

### Passo 1: Clonar o Repositório

```bash
git clone https://github.com/slnntk/frete-inteligente.git
cd frete-inteligente
```

### Passo 2: Iniciar o Banco de Dados

O projeto usa MySQL. Inicie o banco de dados com Docker Compose:

```bash
docker compose up -d mysql
```

Aguarde alguns segundos para o MySQL inicializar completamente.

### Passo 3: Verificar se o MySQL está rodando

```bash
docker compose ps
```

Você deve ver o container `frete-inteligente-mysql` com status "Up".

### Passo 4: Executar o Backend (Spring Boot)

Em um novo terminal:

```bash
# Compilar o projeto
mvn clean package -DskipTests

# Executar a aplicação
mvn spring-boot:run
```

Ou usando o Maven wrapper incluído no projeto:

```bash
./mvnw spring-boot:run
```

O backend estará disponível em: **http://localhost:8080**

### Passo 5: Executar o Frontend (Next.js)

Em outro terminal:

```bash
cd transport-app

# Instalar dependências (apenas na primeira vez)
# Nota: use --legacy-peer-deps devido a conflitos de dependências do React 19
npm install --legacy-peer-deps

# Iniciar o servidor de desenvolvimento
npm run dev
```

O frontend estará disponível em: **http://localhost:3000**

---

## Opção 2: Executar Localmente

Se você preferir não usar Docker, pode executar tudo localmente.

### Passo 1: Clonar o Repositório

```bash
git clone https://github.com/slnntk/frete-inteligente.git
cd frete-inteligente
```

### Passo 2: Configurar o Banco de Dados MySQL

1. **Instalar e iniciar o MySQL**:

```bash
# No Ubuntu/Debian
sudo apt-get update
sudo apt-get install mysql-server
sudo systemctl start mysql

# No macOS com Homebrew
brew install mysql
brew services start mysql
```

2. **Criar o banco de dados e usuário**:

```bash
mysql -u root -p
```

Execute os seguintes comandos no MySQL:

```sql
CREATE DATABASE frete_inteligente;
CREATE USER 'frete'@'localhost' IDENTIFIED BY 'frete';
GRANT ALL PRIVILEGES ON frete_inteligente.* TO 'frete'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

3. **Atualizar a configuração** (se necessário):

Edite o arquivo `src/main/resources/application.yml` e ajuste a URL de conexão se necessário:

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/frete_inteligente?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
    username: frete
    password: frete
```

### Passo 3: Executar o Backend

```bash
# Compilar o projeto
mvn clean package -DskipTests

# Executar a aplicação
mvn spring-boot:run
```

O backend estará disponível em: **http://localhost:8080**

### Passo 4: Executar o Frontend

Em outro terminal:

```bash
cd transport-app

# Instalar dependências (apenas na primeira vez)
# Nota: use --legacy-peer-deps devido a conflitos de dependências do React 19
npm install --legacy-peer-deps

# Iniciar o servidor de desenvolvimento
npm run dev
```

O frontend estará disponível em: **http://localhost:3000**

---

## Verificando a Instalação

### Testar o Backend

1. **Verificar se o servidor está rodando**:

```bash
curl http://localhost:8080/api/test/status
```

2. **Criar dados de exemplo**:

```bash
curl -X POST http://localhost:8080/api/test/dados-exemplo
```

3. **Listar usuários**:

```bash
curl http://localhost:8080/api/usuarios
```

### Testar o Frontend

1. Abra o navegador e acesse: **http://localhost:3000**
2. Você deve ver a interface do aplicativo Frete Inteligente

---

## Acessando a Aplicação

Após iniciar tanto o backend quanto o frontend:

- **Frontend (Interface do Usuário)**: http://localhost:3000
- **Backend API**: http://localhost:8080
- **API de Status**: http://localhost:8080/api/test/status
- **MySQL** (se usando Docker): `localhost:3307`
  - Usuário: `root`
  - Senha: `root`
  - Banco: `frete_inteligente`

---

## Testando a API

### Usando cURL

#### 1. Verificar status do sistema
```bash
curl http://localhost:8080/api/test/status
```

#### 2. Criar dados de exemplo
```bash
curl -X POST http://localhost:8080/api/test/dados-exemplo
```

#### 3. Listar usuários
```bash
curl http://localhost:8080/api/usuarios
```

#### 4. Criar um novo usuário
```bash
curl -X POST http://localhost:8080/api/usuarios \
  -H "Content-Type: application/json" \
  -d '{
    "tipo": "CLIENTE",
    "nome": "João Silva",
    "email": "joao@email.com",
    "cpf": "12345678901",
    "telefone": "(85) 99999-9999",
    "senhaHash": "senha123"
  }'
```

### Usando Postman ou Insomnia

1. Importe a collection de exemplos (em breve)
2. Configure a variável `base_url` como `http://localhost:8080`
3. Execute os requests de teste

Para mais detalhes sobre os endpoints da API, consulte: [DOCUMENTACAO-TECNICA.md](./DOCUMENTACAO-TECNICA.md)

---

## Solução de Problemas

### Problema: Porta 8080 já está em uso

**Erro**: `Port 8080 is already in use`

**Solução**: 
1. Encontre o processo usando a porta:
```bash
# Linux/Mac
lsof -i :8080

# Windows
netstat -ano | findstr :8080
```

2. Pare o processo ou use outra porta editando `application.yml`:
```yaml
server:
  port: 8081
```

### Problema: Porta 3000 já está em uso (Frontend)

**Solução**: O Next.js automaticamente usará a próxima porta disponível (3001, 3002, etc.). Ou você pode especificar uma porta:

```bash
npm run dev -- -p 3001
```

### Problema: MySQL não conecta

**Erro**: `Communications link failure`

**Soluções**:

1. **Verifique se o MySQL está rodando**:
```bash
# Com Docker
docker compose ps

# Localmente
sudo systemctl status mysql  # Linux
brew services list | grep mysql  # Mac
```

2. **Verifique as credenciais** em `application.yml`

3. **Verifique a porta**:
   - Docker: porta `3307`
   - Local: porta `3306`

### Problema: Dependências do Frontend não instalam

**Erro**: `npm install` falha

**Solução**:

1. Use a flag --legacy-peer-deps (recomendado):
```bash
cd transport-app
npm install --legacy-peer-deps
```

2. Ou limpe o cache do npm:
```bash
cd transport-app
rm -rf node_modules package-lock.json
npm cache clean --force
npm install --legacy-peer-deps
```

3. Ou tente usar pnpm:
```bash
npm install -g pnpm
pnpm install
```

### Problema: Erro de compilação Maven

**Erro**: `Failed to execute goal`

**Solução**:

1. Limpe e reconstrua:
```bash
mvn clean install -DskipTests
```

2. Verifique a versão do Java:
```bash
java -version  # Deve ser 17 ou superior
```

3. Se necessário, configure a variável JAVA_HOME:
```bash
# Linux/Mac
export JAVA_HOME=/path/to/java-17

# Windows
set JAVA_HOME=C:\path\to\java-17
```

### Problema: Flyway migration errors

**Erro**: `FlywayException: Validate failed`

**Solução**: Se você está apenas testando, pode desabilitar o Flyway em `application.properties`:

```properties
spring.flyway.enabled=false
spring.jpa.hibernate.ddl-auto=update
```

### Problema: Containers Docker não iniciam

**Solução**:

1. Verifique os logs:
```bash
docker compose logs mysql
```

2. Recrie os containers:
```bash
docker compose down
docker compose up -d mysql
```

3. Limpe volumes antigos (ATENÇÃO: apaga dados):
```bash
docker compose down -v
docker compose up -d mysql
```

---

## Scripts Úteis

### Backend

```bash
# Compilar sem executar testes
mvn clean package -DskipTests

# Executar testes
mvn test

# Executar a aplicação
mvn spring-boot:run

# Gerar JAR e executar
mvn clean package
java -jar target/frete-inteligente-0.0.1-SNAPSHOT.jar
```

### Frontend

```bash
cd transport-app

# Instalar dependências
# Nota: use --legacy-peer-deps devido a conflitos de dependências do React 19
npm install --legacy-peer-deps

# Modo desenvolvimento
npm run dev

# Build para produção
npm run build

# Executar versão de produção
npm start

# Verificar problemas de código
npm run lint
```

### Docker

```bash
# Iniciar apenas o MySQL
docker compose up -d mysql

# Ver logs do MySQL
docker compose logs -f mysql

# Parar todos os containers
docker compose down

# Parar e remover volumes (apaga dados)
docker compose down -v

# Reconstruir e reiniciar
docker compose down
docker compose up -d --build
```

---

## Desenvolvimento em Equipe

### Configuração Recomendada

1. **Backend**: Cada desenvolvedor roda o backend localmente com `mvn spring-boot:run`
2. **Frontend**: Cada desenvolvedor roda o frontend localmente com `npm run dev`
3. **Banco de Dados**: Use o Docker Compose para o MySQL para evitar conflitos de configuração

### Variáveis de Ambiente

Para ambientes diferentes, você pode criar arquivos de configuração:

- `application-dev.yml` - Desenvolvimento
- `application-test.yml` - Testes
- `application-prod.yml` - Produção

Execute com um perfil específico:

```bash
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

---

## Próximos Passos

Após conseguir rodar o projeto:

1. 📖 Leia a [Documentação Técnica](./DOCUMENTACAO-TECNICA.md) para entender os endpoints da API
2. 🏗️ Consulte a [Arquitetura do Sistema](./architecture.md) para entender a estrutura
3. 📋 Veja os [Requisitos do Sistema](./briefing_iso_srs.md) para entender as funcionalidades
4. 🧪 Execute os testes com `mvn test`
5. 🚀 Comece a desenvolver!

---

## Recursos Adicionais

- [Documentação Spring Boot](https://docs.spring.io/spring-boot/docs/current/reference/html/)
- [Documentação Next.js](https://nextjs.org/docs)
- [Documentação React](https://react.dev/)
- [Documentação Maven](https://maven.apache.org/guides/)
- [Documentação Docker](https://docs.docker.com/)

---

## Suporte

Se você encontrar problemas não listados aqui:

1. Verifique os logs da aplicação
2. Consulte os issues no GitHub
3. Entre em contato com a equipe de desenvolvimento

---

**Última atualização**: Janeiro 2025  
**Versão**: 1.0.0
