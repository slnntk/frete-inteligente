# 🐳 Como Atualizar o Docker com Alterações

Este guia mostra como enviar suas alterações para os containers Docker.

---

## 🚀 Método Rápido (Recomendado)

### Opção 1: Script Automático

Execute o script que criei:

```bash
.\scripts\ATUALIZAR-DOCKER.bat
```

**Escolha a opção 1** para reconstruir apenas o frontend (mais rápido, já que só alteramos arquivos do frontend).

---

## 📋 Métodos Manuais

### Método 1: Reconstruir Apenas o Frontend (Mais Rápido) ⭐

Como você alterou apenas arquivos do frontend, esta é a opção mais rápida:

```bash
# Parar apenas o frontend
docker-compose -f docker/docker-compose.dev.yml stop frontend

# Reconstruir apenas o frontend (sem cache)
docker-compose -f docker/docker-compose.dev.yml build --no-cache frontend

# Iniciar o frontend
docker-compose -f docker/docker-compose.dev.yml up -d frontend
```

**Tempo estimado:** 2-5 minutos

---

### Método 2: Reconstruir Tudo

Se você alterou arquivos do backend também:

```bash
# Parar todos os containers
docker-compose -f docker/docker-compose.dev.yml stop

# Reconstruir todas as imagens (sem cache)
docker-compose -f docker/docker-compose.dev.yml build --no-cache

# Iniciar todos os containers
docker-compose -f docker/docker-compose.dev.yml up -d
```

**Tempo estimado:** 5-10 minutos

---

### Método 3: Limpar Tudo e Reconstruir (Mais Lento)

Use apenas se os métodos anteriores não funcionarem:

```bash
# Parar e remover containers e volumes
docker-compose -f docker/docker-compose.dev.yml down -v

# Remover imagens antigas
docker rmi frete-inteligente-backend
docker rmi frete-inteligente-frontend

# Reconstruir tudo do zero
docker-compose -f docker/docker-compose.dev.yml build --no-cache

# Iniciar containers
docker-compose -f docker/docker-compose.dev.yml up -d
```

**Tempo estimado:** 10-15 minutos

---

## 🔍 Verificar se Funcionou

### 1. Ver Logs

```bash
# Ver logs do frontend
docker-compose -f docker/docker-compose.dev.yml logs -f frontend

# Ver logs de tudo
docker-compose -f docker/docker-compose.dev.yml logs -f
```

### 2. Verificar Status

```bash
# Ver containers rodando
docker ps

# Verificar se as portas estão abertas
# Backend: http://localhost:8080
# Frontend: http://localhost:3000
```

### 3. Testar no Navegador

1. Acesse: http://localhost:3000
2. Abra o modal "Criar Nova Oferta"
3. Abra o dropdown do perfil
4. Verifique se os backgrounds estão sólidos (não transparentes)

---

## ⚡ Comandos Rápidos

| Ação | Comando |
|------|---------|
| **Reconstruir Frontend** | `docker-compose -f docker/docker-compose.dev.yml build --no-cache frontend && docker-compose -f docker/docker-compose.dev.yml up -d frontend` |
| **Reconstruir Tudo** | `docker-compose -f docker/docker-compose.dev.yml build --no-cache && docker-compose -f docker/docker-compose.dev.yml up -d` |
| **Ver Logs** | `docker-compose -f docker/docker-compose.dev.yml logs -f` |
| **Parar Tudo** | `docker-compose -f docker/docker-compose.dev.yml down` |
| **Usar Script** | `.\scripts\ATUALIZAR-DOCKER.bat` |

---

## 💡 Dicas

1. **Use `--no-cache`** para garantir que as alterações sejam aplicadas
2. **Reconstrua apenas o frontend** se só alterou arquivos do frontend (mais rápido)
3. **Aguarde alguns minutos** após reconstruir para o Next.js compilar
4. **Verifique os logs** se algo não funcionar

---

## 🐛 Problemas Comuns

### Container não inicia

```bash
# Ver logs de erro
docker-compose -f docker/docker-compose.dev.yml logs frontend

# Verificar se a porta está livre
netstat -ano | findstr :3000
```

### Alterações não aparecem

1. Limpe o cache do navegador (Ctrl+F5)
2. Reconstrua com `--no-cache`
3. Verifique se o container foi realmente reconstruído:
   ```bash
   docker images | findstr frete-inteligente
   ```

### Erro de permissão

Execute o PowerShell como Administrador.

---

**Pronto! Agora suas alterações estarão no Docker! 🎉**

