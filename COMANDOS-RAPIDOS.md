# ⚡ Comandos Rápidos - Frete Inteligente

## 🐳 Docker

### Iniciar Tudo
```bash
.\scripts\docker-start.bat
# Escolha: 1 (Dev) ou 2 (Completo)
```

### Parar Tudo
```bash
# Via script
.\scripts\docker-start.bat  # Opção 3

# Ou manual
docker-compose -f docker/docker-compose.dev.yml down
docker-compose -f docker/docker-compose.full.yml down
```

### Ver Logs
```bash
# Todos os serviços
docker-compose -f docker/docker-compose.dev.yml logs -f

# Apenas backend
docker-compose -f docker/docker-compose.dev.yml logs -f backend

# Apenas frontend
docker-compose -f docker/docker-compose.dev.yml logs -f frontend
```

### Reconstruir
```bash
docker-compose -f docker/docker-compose.dev.yml up -d --build
```

### Limpar Tudo
```bash
docker-compose -f docker/docker-compose.dev.yml down -v
docker-compose -f docker/docker-compose.full.yml down -v
```

---

## 💻 Execução Local

### Backend

```bash
# Maven Wrapper (Windows)
mvnw.cmd spring-boot:run

# Maven Wrapper (Linux/Mac)
./mvnw spring-boot:run

# Maven instalado
mvn spring-boot:run

# Com perfil H2
mvnw.cmd spring-boot:run -Dspring-boot.run.profiles=h2

# Com perfil MySQL
mvnw.cmd spring-boot:run -Dspring-boot.run.profiles=mysql
```

### Frontend

```bash
cd transport-app

# Instalar dependências
npm install

# Executar
npm run dev

# Build para produção
npm run build
npm start
```

---

## 🧪 Testes

### Testar API
```powershell
.\scripts\TESTAR-API.ps1
```

### Diagnóstico
```powershell
.\scripts\DIAGNOSTICAR-ERRO.ps1
```

### Teste Manual
```powershell
# Status do sistema
Invoke-RestMethod http://localhost:8080/api/test/status

# Listar usuários
Invoke-RestMethod http://localhost:8080/api/usuarios

# Criar dados de exemplo
Invoke-RestMethod -Uri http://localhost:8080/api/test/dados-exemplo -Method POST
```

---

## 🔍 Verificações

### Verificar Java
```bash
java -version
```

### Verificar Node
```bash
node --version
npm --version
```

### Verificar Docker
```bash
docker --version
docker-compose --version
docker ps
```

### Verificar Portas
```bash
# Windows
netstat -ano | findstr :8080
netstat -ano | findstr :3000

# Linux/Mac
lsof -i :8080
lsof -i :3000
```

---

## 📦 Banco de Dados

### H2 Console
```
URL: http://localhost:8080/h2-console
JDBC URL: jdbc:h2:mem:frete_inteligente
User: sa
Password: (vazio)
```

### MySQL (Docker)
```
Host: localhost
Port: 3307
Database: frete_inteligente
User: frete
Password: frete
```

### MySQL via Docker CLI
```bash
docker exec -it frete-inteligente-mysql mysql -u frete -p
# Senha: frete
```

---

## 🛠️ Manutenção

### Limpar Build Backend
```bash
mvnw.cmd clean
```

### Limpar node_modules Frontend
```bash
cd transport-app
rm -rf node_modules
rm package-lock.json
npm install
```

### Recompilar Backend
```bash
mvnw.cmd clean package -DskipTests
```

---

## 📊 Monitoramento

### Ver Processos Java
```bash
# Windows
tasklist | findstr java

# Linux/Mac
ps aux | grep java
```

### Ver Containers Docker
```bash
docker ps
docker ps -a
```

### Uso de Recursos
```bash
docker stats
```

---

## 🔄 Git

### Status
```bash
git status
```

### Criar Branch
```bash
git checkout -b feature/nova-funcionalidade
```

### Commit
```bash
git add .
git commit -m "Descrição das mudanças"
```

### Push
```bash
git push origin main
```

---

## 🚀 Deploy

### Build Docker Images
```bash
# Backend
docker build -t frete-backend:1.0 -f docker/Dockerfile .

# Frontend
docker build -t frete-frontend:1.0 -f transport-app/Dockerfile ./transport-app
```

---

## 📍 URLs Importantes

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080/api
- **H2 Console**: http://localhost:8080/h2-console
- **Swagger** (se configurado): http://localhost:8080/swagger-ui.html

---

## 🆘 Ajuda Rápida

| Problema | Solução |
|----------|---------|
| Backend não inicia | `java -version` e veja logs |
| Frontend não inicia | `node --version` e reinstale deps |
| Porta em uso | Veja processo com `netstat` |
| Docker não funciona | Verifique Docker Desktop |
| Erro 500 na API | Veja logs do backend |
| Erro CORS | Verifique CorsConfig.java |

---

## 📚 Mais Informações

- Guia Completo: [`docs/QUICK_START.md`](./docs/QUICK_START.md)
- Docker: [`docs/DOCKER-GUIA.md`](./docs/DOCKER-GUIA.md)
- API: [`docs/EXEMPLOS-JSON.md`](./docs/EXEMPLOS-JSON.md)
- Problemas: [`docs/COMO-EXECUTAR-SOLUCOES.md`](./docs/COMO-EXECUTAR-SOLUCOES.md)

