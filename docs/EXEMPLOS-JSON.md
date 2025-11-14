# 📋 Exemplos de JSON para Testar a API

## 🔗 Base URL
```
http://localhost:8080/api
```

---

## 👤 USUÁRIOS

### 1. Criar Usuário Cliente
**Endpoint:** `POST /api/usuarios`

```json
{
  "tipo": "CLIENTE",
  "nome": "João da Silva",
  "email": "joao@email.com",
  "cpf": "12345678901",
  "telefone": "(85) 98765-4321",
  "senhaHash": "senha123"
}
```

### 2. Criar Usuário Motorista Autônomo
**Endpoint:** `POST /api/usuarios`

```json
{
  "tipo": "AUTONOMO",
  "nome": "Carlos Motorista",
  "email": "carlos@transporte.com",
  "cpf": "98765432100",
  "telefone": "(85) 99999-8888",
  "senhaHash": "senha456"
}
```

### 3. Criar Usuário Empresa
**Endpoint:** `POST /api/usuarios`

```json
{
  "tipo": "EMPRESA",
  "nome": "Transporte Universitário LTDA",
  "email": "contato@transporteuni.com",
  "cpf": "11122233344",
  "telefone": "(85) 3333-4444",
  "senhaHash": "empresa123"
}
```

### 4. Atualizar Usuário
**Endpoint:** `PUT /api/usuarios/{id}`

```json
{
  "nome": "João da Silva Junior",
  "telefone": "(85) 91234-5678"
}
```

---

## 🔐 AUTENTICAÇÃO

### 5. Login
**Endpoint:** `POST /api/auth/login`

```json
{
  "email": "joao@email.com",
  "password": "senha123"
}
```

**Resposta esperada:**
```json
{
  "usuario": {
    "id": 1,
    "tipo": "CLIENTE",
    "nome": "João da Silva",
    "email": "joao@email.com",
    "cpf": "12345678901",
    "telefone": "(85) 98765-4321"
  },
  "token": "simulated-jwt-token"
}
```

---

## 📝 POSTAGENS

### 6. Criar Postagem Simples
**Endpoint:** `POST /api/postagens`

```json
{
  "autor": {
    "id": 1
  },
  "titulo": "Transporte para Unifor - Manhã",
  "regiao": "Maranguape e Maracanaú",
  "descricao": "Transporte diário saindo de Maranguape às 5h30 com destino à Unifor. Vagas limitadas!",
  "preco": 15.00
}
```

### 7. Criar Postagem Detalhada
**Endpoint:** `POST /api/postagens`

```json
{
  "autor": {
    "id": 2
  },
  "titulo": "Frete Universitário - Região Metropolitana",
  "regiao": "Fortaleza, Caucaia, Maracanaú",
  "descricao": "Levamos estudantes para Unifor, Estácio, FB, UNI7 e Unichristus. Horários flexíveis, veículo climatizado, wi-fi disponível. Pagamento mensal ou por viagem.",
  "preco": 20.00
}
```

### 8. Atualizar Postagem
**Endpoint:** `PUT /api/postagens/{id}`

```json
{
  "titulo": "Transporte para Unifor - Manhã [VAGAS DISPONÍVEIS]",
  "preco": 12.50
}
```

---

## 🚗 VIAGENS

### 9. Criar Viagem
**Endpoint:** `POST /api/viagens`

```json
{
  "postagem": {
    "id": 1
  },
  "horarioPartida": "05:30:00",
  "destino": "Unifor - Campus Washington Soares",
  "capacidade": 15,
  "status": "ABERTA"
}
```

### 10. Criar Viagem com Horário da Tarde
**Endpoint:** `POST /api/viagens`

```json
{
  "postagem": {
    "id": 1
  },
  "horarioPartida": "13:00:00",
  "destino": "UNI7 - Campus Fortaleza",
  "capacidade": 20,
  "status": "ABERTA"
}
```

### 11. Atualizar Status da Viagem
**Endpoint:** `PUT /api/viagens/{id}`

```json
{
  "status": "EM_ANDAMENTO"
}
```

**Status possíveis:** `ABERTA`, `EM_ANDAMENTO`, `CONCLUIDA`, `CANCELADA`

---

## ✅ CHECK-INS

### 12. Criar Check-in
**Endpoint:** `POST /api/checkins`

```json
{
  "viagem": {
    "id": 1
  },
  "cliente": {
    "id": 3
  }
}
```

**Nota:** O campo `realizadoEm` é preenchido automaticamente com a data/hora atual.

---

## 🧪 DADOS DE TESTE

### 13. Criar Dados de Exemplo Completos
**Endpoint:** `POST /api/test/dados-exemplo`

**Não precisa enviar JSON!** Apenas faça POST vazio:

```bash
POST http://localhost:8080/api/test/dados-exemplo
```

Isso criará automaticamente:
- 1 Empresa de transporte
- 1 Cliente
- 1 Postagem
- 1 Viagem
- 1 Check-in

---

## 🔍 CONSULTAS

### 14. Listar Todos os Usuários
```
GET http://localhost:8080/api/usuarios
```

### 15. Buscar Usuário por ID
```
GET http://localhost:8080/api/usuarios/1
```

### 16. Buscar Usuários por Tipo
```
GET http://localhost:8080/api/usuarios/tipo/CLIENTE
GET http://localhost:8080/api/usuarios/tipo/AUTONOMO
GET http://localhost:8080/api/usuarios/tipo/EMPRESA
```

### 17. Listar Todas as Postagens
```
GET http://localhost:8080/api/postagens
```

### 18. Buscar Postagens por Autor
```
GET http://localhost:8080/api/postagens/autor/1
```

### 19. Listar Todas as Viagens
```
GET http://localhost:8080/api/viagens
```

### 20. Buscar Viagens por Status
```
GET http://localhost:8080/api/viagens/status/ABERTA
```

### 21. Buscar Viagens por Postagem
```
GET http://localhost:8080/api/viagens/postagem/1
```

### 22. Listar Todos os Check-ins
```
GET http://localhost:8080/api/checkins
```

### 23. Buscar Check-ins por Viagem
```
GET http://localhost:8080/api/checkins/viagem/1
```

### 24. Buscar Check-ins por Cliente
```
GET http://localhost:8080/api/checkins/cliente/3
```

### 25. Status do Sistema
```
GET http://localhost:8080/api/test/status
```

---

## 🛠️ Como Testar com PowerShell

### Método 1: Usando Invoke-RestMethod

```powershell
# Criar usuário
$usuario = @{
    tipo = "CLIENTE"
    nome = "Maria Santos"
    email = "maria@teste.com"
    cpf = "11122233344"
    telefone = "(85) 77777-7777"
    senhaHash = "senha789"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:8080/api/usuarios" -Method POST -Body $usuario -ContentType "application/json"

# Login
$login = @{
    email = "maria@teste.com"
    password = "senha789"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method POST -Body $login -ContentType "application/json"
$response

# Listar usuários
Invoke-RestMethod -Uri "http://localhost:8080/api/usuarios" -Method GET
```

### Método 2: Usando curl (Windows 10+)

```powershell
# Criar usuário
curl -X POST http://localhost:8080/api/usuarios -H "Content-Type: application/json" -d "{\"tipo\":\"CLIENTE\",\"nome\":\"Pedro Alves\",\"email\":\"pedro@teste.com\",\"cpf\":\"55566677788\",\"telefone\":\"(85) 91111-2222\",\"senhaHash\":\"senha999\"}"

# Login
curl -X POST http://localhost:8080/api/auth/login -H "Content-Type: application/json" -d "{\"email\":\"pedro@teste.com\",\"password\":\"senha999\"}"

# Listar usuários
curl http://localhost:8080/api/usuarios
```

---

## 📱 Como Testar com Postman ou Insomnia

### Postman:
1. Instale: https://www.postman.com/downloads/
2. Crie uma nova Request
3. Selecione o método (GET, POST, PUT, DELETE)
4. Cole a URL
5. Em "Body" → "raw" → "JSON"
6. Cole o JSON do exemplo
7. Clique em "Send"

### Insomnia:
1. Instale: https://insomnia.rest/download
2. New Request
3. Escolha o método
4. Cole a URL
5. Body → JSON
6. Cole o JSON
7. Send

---

## 🎯 Fluxo Completo de Teste

### Passo 1: Criar Dados de Exemplo
```powershell
Invoke-RestMethod -Uri "http://localhost:8080/api/test/dados-exemplo" -Method POST
```

### Passo 2: Listar Tudo
```powershell
# Ver usuários criados
Invoke-RestMethod -Uri "http://localhost:8080/api/usuarios"

# Ver postagens
Invoke-RestMethod -Uri "http://localhost:8080/api/postagens"

# Ver viagens
Invoke-RestMethod -Uri "http://localhost:8080/api/viagens"

# Ver check-ins
Invoke-RestMethod -Uri "http://localhost:8080/api/checkins"
```

### Passo 3: Criar Seu Próprio Usuário
```powershell
$meuUsuario = @{
    tipo = "CLIENTE"
    nome = "Seu Nome Aqui"
    email = "seu@email.com"
    cpf = "00011122233"
    telefone = "(85) 90000-0000"
    senhaHash = "minhasenha"
} | ConvertTo-Json

$criado = Invoke-RestMethod -Uri "http://localhost:8080/api/usuarios" -Method POST -Body $meuUsuario -ContentType "application/json"
$criado
```

### Passo 4: Fazer Login
```powershell
$login = @{
    email = "seu@email.com"
    password = "minhasenha"
} | ConvertTo-Json

$auth = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method POST -Body $login -ContentType "application/json"
$auth
```

---

## 💾 Salvar como Arquivo .ps1

Crie um arquivo `meus-testes.ps1`:

```powershell
# Meus Testes da API
$baseUrl = "http://localhost:8080/api"

# 1. Criar dados de exemplo
Write-Host "Criando dados de exemplo..." -ForegroundColor Yellow
Invoke-RestMethod -Uri "$baseUrl/test/dados-exemplo" -Method POST | ConvertTo-Json

# 2. Listar usuários
Write-Host "`nListando usuarios..." -ForegroundColor Yellow
Invoke-RestMethod -Uri "$baseUrl/usuarios" | ConvertTo-Json

# 3. Criar meu usuário
Write-Host "`nCriando meu usuario..." -ForegroundColor Yellow
$usuario = @{
    tipo = "CLIENTE"
    nome = "Teste Usuario"
    email = "teste@email.com"
    cpf = "99988877766"
    telefone = "(85) 99999-9999"
    senhaHash = "teste123"
} | ConvertTo-Json

Invoke-RestMethod -Uri "$baseUrl/usuarios" -Method POST -Body $usuario -ContentType "application/json" | ConvertTo-Json
```

Execute com:
```powershell
.\meus-testes.ps1
```

---

**Pronto! Agora você tem todos os exemplos de JSON para testar a API completa! 🎉**

