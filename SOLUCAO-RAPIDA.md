# ⚡ Solução Rápida - Erro de Conexão

## 🔴 Problema: "Não foi possível conectar ao servidor"

### ✅ Solução em 3 Passos:

#### 1️⃣ Iniciar o Backend

Abra um terminal e execute:

```bash
.\scripts\EXECUTAR-BACKEND.bat
```

**Aguarde até aparecer:**
```
Started FreteInteligenteApplication
```

**Isso significa que o backend está rodando na porta 8080!**

---

#### 2️⃣ Verificar se o Backend está Funcionando

Abra o navegador e acesse:

```
http://localhost:8080/api/test/status
```

**Você deve ver algo como:**
```json
{
  "status": "OK",
  "usuarios": 0,
  "postagens": 0,
  "viagens": 0,
  "checkins": 0
}
```

**Se aparecer isso, o backend está funcionando! ✅**

---

#### 3️⃣ Reiniciar o Frontend

No terminal do frontend, pressione `Ctrl+C` para parar e depois:

```bash
cd transport-app
npm run dev
```

**Agora tente fazer login novamente!**

---

## 🐛 Se Ainda Não Funcionar:

### Verificar Porta 8080

```bash
# Verificar se algo está usando a porta 8080
netstat -ano | findstr :8080
```

Se aparecer algo, mate o processo:
```bash
taskkill /PID <numero_do_pid> /F
```

### Verificar .env.local

```bash
cd transport-app
type .env.local
```

Deve conter:
```
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

Se não existir, crie:
```bash
echo NEXT_PUBLIC_API_URL=http://localhost:8080/api > .env.local
```

**IMPORTANTE:** Reinicie o frontend após criar/modificar o `.env.local`!

---

## ✅ Checklist Rápido

- [ ] Backend está rodando (terminal mostra "Started FreteInteligenteApplication")
- [ ] http://localhost:8080/api/test/status retorna JSON
- [ ] Arquivo `.env.local` existe em `transport-app/`
- [ ] Frontend foi reiniciado após criar `.env.local`
- [ ] Nenhum erro no console do navegador (F12)

---

## 🎯 Teste Final

1. Backend rodando: ✅
2. Acesse: http://localhost:8080/api/test/status → Deve retornar JSON
3. Frontend rodando: ✅
4. Acesse: http://localhost:3000
5. Tente fazer login

**Se tudo estiver OK, o login deve funcionar! 🎉**

