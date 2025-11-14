# 🐳 Guia Docker - Frete Inteligente

## 📋 Pré-requisitos

### 1. Instalar Docker Desktop

**Windows:**
1. Baixe: https://www.docker.com/products/docker-desktop/
2. Execute o instalador
3. Reinicie o computador
4. Abra o Docker Desktop e aguarde iniciar

**Verificar instalação:**
```bash
docker --version
docker-compose --version
```

---

## 🚀 Como Usar

### Método 1: Script Automático (Recomendado)

Basta executar:
```bash
docker-start.bat
```

E escolher uma opção:
1. **Desenvolvimento** - Backend (H2) + Frontend
2. **Completo** - MySQL + Backend + Frontend
3. Parar todos os containers
4. Ver logs
5. Limpar tudo e reiniciar

---

### Método 2: Comandos Manuais

#### Opção A: Modo Desenvolvimento (sem MySQL)

```bash
# Construir e iniciar
docker-compose -f docker-compose.dev.yml up -d --build

# Ver logs
docker-compose -f docker-compose.dev.yml logs -f

# Parar
docker-compose -f docker-compose.dev.yml down
```

#### Opção B: Modo Completo (com MySQL)

```bash
# Construir e iniciar
docker-compose -f docker-compose.full.yml up -d --build

# Ver logs
docker-compose -f docker-compose.full.yml logs -f

# Parar
docker-compose -f docker-compose.full.yml down

# Parar e remover volumes (limpar banco)
docker-compose -f docker-compose.full.yml down -v
```

---

## 🌐 Acessando a Aplicação

Depois de iniciar os containers:

### Frontend
```
http://localhost:3000
```

### Backend API
```
http://localhost:8080/api
```

### H2 Console (modo dev)
```
http://localhost:8080/h2-console
```

**Configurações H2:**
- JDBC URL: `jdbc:h2:mem:frete_inteligente`
- User: `sa`
- Password: (vazio)

### MySQL (modo completo)
```
Host: localhost
Port: 3307
Database: frete_inteligente
User: frete
Password: frete
```

---

## 📊 Comandos Úteis

### Ver containers rodando
```bash
docker ps
```

### Ver logs de um serviço específico
```bash
# Modo Dev
docker-compose -f docker-compose.dev.yml logs -f backend
docker-compose -f docker-compose.dev.yml logs -f frontend

# Modo Completo
docker-compose -f docker-compose.full.yml logs -f backend
docker-compose -f docker-compose.full.yml logs -f frontend
docker-compose -f docker-compose.full.yml logs -f mysql
```

### Entrar em um container
```bash
docker exec -it frete-inteligente-backend sh
docker exec -it frete-inteligente-frontend sh
docker exec -it frete-inteligente-mysql bash
```

### Reconstruir apenas um serviço
```bash
# Reconstruir backend
docker-compose -f docker-compose.dev.yml up -d --build backend

# Reconstruir frontend
docker-compose -f docker-compose.dev.yml up -d --build frontend
```

### Parar um serviço específico
```bash
docker-compose -f docker-compose.dev.yml stop backend
docker-compose -f docker-compose.dev.yml stop frontend
```

### Remover tudo
```bash
# Parar e remover containers
docker-compose -f docker-compose.dev.yml down
docker-compose -f docker-compose.full.yml down

# Remover volumes também (limpar dados)
docker-compose -f docker-compose.full.yml down -v

# Remover imagens construídas
docker rmi frete-inteligente-backend
docker rmi frete-inteligente-frontend
```

---

## 🔄 Ciclo de Desenvolvimento

### Desenvolvimento Local com Hot Reload

Se você quer desenvolver localmente mas usar apenas o banco MySQL do Docker:

```bash
# Iniciar apenas o MySQL
docker-compose up mysql

# Em outro terminal, executar backend local
mvnw.cmd spring-boot:run -Dspring-boot.run.profiles=mysql

# Em outro terminal, executar frontend local
cd transport-app
npm run dev
```

### Testar Mudanças no Docker

Depois de fazer mudanças no código:

```bash
# Reconstruir e reiniciar
docker-compose -f docker-compose.dev.yml up -d --build
```

---

## 📁 Arquivos Docker

### `Dockerfile` (Backend)
- Localização: raiz do projeto
- Compilação em duas etapas (multi-stage)
- Usa Maven para build
- Imagem final leve com JRE

### `transport-app/Dockerfile` (Frontend)
- Localização: pasta transport-app
- Build otimizado Next.js
- Modo standalone para produção
- Usa Node.js Alpine

### `docker-compose.dev.yml`
- Backend + Frontend
- Banco H2 em memória
- Ideal para desenvolvimento rápido

### `docker-compose.full.yml`
- MySQL + Backend + Frontend
- Persistência de dados
- Mais próximo de produção

---

## ⚙️ Variáveis de Ambiente

### Backend

**Modo Dev (H2):**
```yaml
SPRING_PROFILES_ACTIVE: h2
```

**Modo MySQL:**
```yaml
SPRING_PROFILES_ACTIVE: mysql
SPRING_DATASOURCE_URL: jdbc:mysql://mysql:3306/frete_inteligente
SPRING_DATASOURCE_USERNAME: frete
SPRING_DATASOURCE_PASSWORD: frete
```

### Frontend

```yaml
NEXT_PUBLIC_API_URL: http://localhost:8080/api
```

---

## 🐛 Troubleshooting

### Container não inicia

**Ver logs:**
```bash
docker-compose -f docker-compose.dev.yml logs backend
```

**Verificar se a porta está em uso:**
```bash
netstat -ano | findstr :8080
netstat -ano | findstr :3000
```

### Erro "port is already allocated"

Algum serviço já está usando a porta. Opções:
1. Parar o serviço que está usando
2. Mudar a porta no docker-compose.yml

### Backend não conecta no MySQL

1. Aguarde ~30 segundos para o MySQL inicializar
2. Verifique os logs: `docker-compose -f docker-compose.full.yml logs mysql`
3. Verifique se o healthcheck passou: `docker ps`

### Frontend não consegue chamar backend

1. Certifique-se que o backend está rodando: `http://localhost:8080/api/test/status`
2. Verifique a variável `NEXT_PUBLIC_API_URL`
3. Reconstrua o frontend: `docker-compose -f docker-compose.dev.yml up -d --build frontend`

### Mudanças no código não aparecem

Docker usa o código da hora do build. Para ver mudanças:
```bash
docker-compose -f docker-compose.dev.yml up -d --build
```

---

## 🎯 Comparação: Docker vs Local

| Aspecto | Docker | Local |
|---------|--------|-------|
| Setup inicial | Mais demorado | Rápido |
| Portabilidade | ✅ Excelente | ❌ Dependente do SO |
| Hot Reload | ❌ Não (precisa rebuild) | ✅ Sim |
| Isolamento | ✅ Completo | ❌ Usa ambiente local |
| Performance | Pode ser mais lento | Mais rápido |
| Deploy | ✅ Mesmo ambiente | ❌ Pode variar |

### Recomendação:

- **Desenvolvimento ativo**: Use local para hot reload
- **Testes de integração**: Use Docker
- **Demonstração**: Use Docker
- **Deploy**: Use Docker

---

## 📦 Build para Produção

Para criar imagens otimizadas para produção:

```bash
# Backend
docker build -t frete-backend:1.0 .

# Frontend
docker build -t frete-frontend:1.0 ./transport-app

# Push para registry (exemplo)
docker tag frete-backend:1.0 seu-registry/frete-backend:1.0
docker push seu-registry/frete-backend:1.0
```

---

## 🔐 Segurança

### Não usar em produção sem:

1. ✅ Mudar senhas padrão do MySQL
2. ✅ Adicionar autenticação JWT real
3. ✅ Configurar HTTPS
4. ✅ Usar secrets do Docker
5. ✅ Limitar CORS a domínios específicos
6. ✅ Configurar firewall

---

## 📚 Links Úteis

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Next.js Docker](https://nextjs.org/docs/deployment#docker-image)
- [Spring Boot Docker](https://spring.io/guides/topicals/spring-boot-docker/)

---

**Desenvolvido com ❤️ para facilitar o transporte universitário!**

