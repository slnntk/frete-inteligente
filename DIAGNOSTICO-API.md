# 🔍 Diagnóstico de Problemas de API

## Problema: Não consigo fazer login nem cadastro

### ✅ Passo 1: Verificar se o Backend está rodando

Abra um terminal e execute:

```bash
# Verificar se o backend está respondendo
curl http://localhost:8080/api/test/status

# Ou no navegador, acesse:
http://localhost:8080/api/test/status
```

**Resposta esperada:**
```json
{
  "status": "ok",
  "message": "API funcionando"
}
```

**Se der erro de conexão:**
- O backend não está rodando
- Execute: `.\scripts\EXECUTAR-BACKEND.bat`
- Aguarde aparecer: `Started FreteInteligenteApplication`

---

### ✅ Passo 2: Verificar a URL da API no Frontend

1. Verifique se existe o arquivo `.env.local` em `transport-app/`:

```bash
cd transport-app
type .env.local
```

2. O arquivo deve conter:

```
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

3. Se não existir, crie:

```bash
echo NEXT_PUBLIC_API_URL=http://localhost:8080/api > .env.local
```

4. **IMPORTANTE:** Reinicie o servidor frontend após criar/modificar `.env.local`

---

### ✅ Passo 3: Verificar Console do Navegador

1. Abra o navegador
2. Pressione `F12` para abrir o DevTools
3. Vá na aba **Console**
4. Tente fazer login/cadastro
5. Procure por mensagens de erro começando com `[API Error]` ou `[API Request]`

**Mensagens esperadas:**
- `[API Request] POST http://localhost:8080/api/auth/login` - Requisição sendo feita
- `[API Error] ...` - Se houver erro, mostrará detalhes

---

### ✅ Passo 4: Verificar CORS

Se aparecer erro de CORS no console:

```
Access to fetch at 'http://localhost:8080/api/...' from origin 'http://localhost:3000' has been blocked by CORS policy
```

**Solução:**
1. Verifique se o `CorsConfig.java` está configurado corretamente
2. Reinicie o backend

---

### ✅ Passo 5: Testar a API Manualmente

#### Testar Login:

```bash
# PowerShell
$body = @{
    email = "teste@email.com"
    password = "senha123"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" `
    -Method POST `
    -Body $body `
    -ContentType "application/json"
```

#### Testar Cadastro:

```bash
# PowerShell
$body = @{
    tipo = "CLIENTE"
    nome = "João Silva"
    email = "joao@email.com"
    cpf = "12345678901"
    telefone = "(85) 98765-4321"
    senhaHash = "senha123"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:8080/api/usuarios" `
    -Method POST `
    -Body $body `
    -ContentType "application/json"
```

---

## 🐛 Problemas Comuns

### 1. Backend não inicia

**Sintomas:**
- Erro ao executar `.\scripts\EXECUTAR-BACKEND.bat`
- Porta 8080 já em uso

**Solução:**
```bash
# Verificar o que está usando a porta 8080
netstat -ano | findstr :8080

# Matar o processo (substitua PID pelo número)
taskkill /PID <numero_do_pid> /F
```

---

### 2. Frontend não conecta

**Sintomas:**
- Erro: "Não foi possível conectar ao servidor"
- Console mostra erro de rede

**Solução:**
1. Verifique se o backend está rodando (Passo 1)
2. Verifique o `.env.local` (Passo 2)
3. Reinicie o frontend:
   ```bash
   cd transport-app
   npm run dev
   ```

---

### 3. Erro 401 (Não autorizado)

**Sintomas:**
- Login falha mesmo com credenciais corretas

**Solução:**
1. Verifique se o usuário existe no banco
2. Verifique se a senha está correta
3. Tente criar um novo usuário pelo cadastro

---

### 4. Erro 404 (Não encontrado)

**Sintomas:**
- Endpoint não encontrado

**Solução:**
1. Verifique se o endpoint existe no backend
2. Verifique a URL: deve ser `http://localhost:8080/api/...`
3. Verifique se o backend está rodando com o perfil correto

---

### 5. Erro 500 (Erro interno do servidor)

**Sintomas:**
- Backend retorna erro 500

**Solução:**
1. Verifique os logs do backend
2. Verifique se o banco de dados está configurado corretamente
3. Verifique se as migrações foram executadas

---

## 🔧 Comandos de Diagnóstico

### Verificar Backend
```bash
# Status
curl http://localhost:8080/api/test/status

# Listar usuários
curl http://localhost:8080/api/usuarios
```

### Verificar Frontend
```bash
# Verificar variáveis de ambiente
cd transport-app
type .env.local

# Verificar se o servidor está rodando
# Acesse: http://localhost:3000
```

### Verificar Logs
```bash
# Backend - veja o terminal onde está rodando
# Procure por erros em vermelho

# Frontend - abra o console do navegador (F12)
# Procure por [API Error] ou [API Request]
```

---

## 📝 Checklist de Verificação

- [ ] Backend está rodando na porta 8080
- [ ] Frontend está rodando na porta 3000
- [ ] Arquivo `.env.local` existe e está configurado
- [ ] URL da API está correta: `http://localhost:8080/api`
- [ ] CORS está configurado no backend
- [ ] Banco de dados está rodando (se usar MySQL)
- [ ] Migrações foram executadas
- [ ] Console do navegador não mostra erros de CORS
- [ ] Logs do backend não mostram erros

---

## 🆘 Ainda com Problemas?

1. **Limpe o cache do navegador** (Ctrl+Shift+Delete)
2. **Reinicie ambos os servidores** (backend e frontend)
3. **Verifique os logs** no console do navegador e no terminal do backend
4. **Teste a API diretamente** usando curl ou Postman
5. **Verifique se há erros de compilação** no backend

---

## 📞 Informações para Debug

Ao reportar problemas, inclua:

1. **Mensagem de erro completa** do console
2. **Status do backend** (rodando ou não)
3. **URL da API** configurada no `.env.local`
4. **Logs do backend** (últimas 20 linhas)
5. **Logs do console do navegador** (erros relacionados à API)

---

## 🎯 Teste Rápido

Execute este teste para verificar se tudo está funcionando:

```bash
# 1. Inicie o backend
.\scripts\EXECUTAR-BACKEND.bat

# 2. Em outro terminal, inicie o frontend
.\scripts\INICIAR-FRONTEND.bat

# 3. Acesse no navegador
http://localhost:3000

# 4. Tente fazer cadastro
# 5. Tente fazer login com o usuário criado
```

Se todos os passos funcionarem, o problema está resolvido! 🎉

