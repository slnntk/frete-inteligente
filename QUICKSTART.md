# 🚀 Guia de Início Rápido - Frete Inteligente

Este guia vai te ajudar a colocar o sistema Frete Inteligente rodando em **5 minutos**.

## ⚡ Método Rápido (Docker - Recomendado)

### Pré-requisitos
- Docker e Docker Compose instalados
- Node.js 18+ (apenas para o app mobile)
- Expo CLI: `npm install -g expo-cli`

### Passos

1. **Clone e inicie o backend com Docker:**
```bash
git clone https://github.com/slnntk/frete-inteligente.git
cd frete-inteligente
docker-compose up -d
```

Aguarde alguns segundos. O backend estará em `http://localhost:3000` e o PostgreSQL em `localhost:5432`.

2. **Verifique se está funcionando:**
```bash
curl http://localhost:3000
# Deve retornar: {"message":"Frete Inteligente API",...}
```

3. **Configure e inicie o app mobile:**
```bash
cd transport-app
npm install

# Configure o IP do seu computador em src/services/api.js
# Substitua 'localhost' pelo seu IP local (ex: 192.168.1.100)
```

Descubra seu IP:
- **Windows:** `ipconfig` (procure por IPv4)
- **macOS/Linux:** `ifconfig` ou `ip addr` (procure por inet)

Edite `src/services/api.js`:
```javascript
const API_BASE_URL = 'http://SEU_IP_AQUI:3000/api';
```

4. **Inicie o app:**
```bash
npm start
```

5. **Abra no celular:**
   - Instale o app **Expo Go** (iOS/Android)
   - Escaneie o QR code que apareceu no terminal
   - Pronto! 🎉

## 🔧 Método Manual (Sem Docker)

### Pré-requisitos
- Node.js 18+
- PostgreSQL 14+
- Expo CLI: `npm install -g expo-cli`

### Passos

1. **Configure o PostgreSQL:**
```bash
# Crie o banco de dados
createdb frete_inteligente

# Ou via psql
psql -U postgres -c "CREATE DATABASE frete_inteligente;"
```

2. **Configure e inicie o backend:**
```bash
cd backend
npm install
cp .env.example .env

# Edite o .env com suas credenciais do PostgreSQL
# DB_HOST=localhost
# DB_NAME=frete_inteligente
# DB_USER=postgres
# DB_PASSWORD=sua_senha

npm run dev
```

3. **Em outro terminal, configure o app:**
```bash
cd transport-app
npm install

# Configure o IP em src/services/api.js
# const API_BASE_URL = 'http://SEU_IP:3000/api';

npm start
```

4. **Abra no celular com Expo Go**

## 🧪 Teste a Integração

### 1. Teste o backend (opcional)
```bash
cd backend
./test-api.sh
```

### 2. No app mobile:

1. **Registre-se** como passageiro
2. **Faça login**
3. Você verá a lista de viagens (vazia inicialmente)

### 3. Crie uma viagem de teste:

Use o curl ou Postman:

```bash
# Primeiro, faça login para obter o token
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Motorista Teste",
    "email": "driver@example.com",
    "cpf": "11111111111",
    "phone": "85988888888",
    "password": "senha123",
    "userType": "driver"
  }'

# Copie o token retornado

# Crie uma viagem
curl -X POST http://localhost:3000/api/trips \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{
    "title": "Fortaleza → Universidade",
    "description": "Rota universitária matinal",
    "origin": "Fortaleza Centro",
    "destination": "Unifor",
    "departureTime": "2025-10-24T06:00:00.000Z",
    "price": 12.50,
    "capacity": 10
  }'
```

Agora recarregue o app e você verá a viagem na lista! 🎉

## 📱 Principais Funcionalidades para Testar

### Como Passageiro:
1. ✅ Registrar/Login
2. ✅ Ver lista de viagens disponíveis
3. ✅ Fazer check-in em uma viagem
4. ✅ Ver meus check-ins
5. ✅ Rastrear viagem em tempo real (quando o motorista iniciar)
6. ✅ Cancelar check-in

### Como Motorista:
1. ✅ Registrar/Login como motorista
2. ✅ Criar nova viagem
3. ✅ Ver lista de passageiros confirmados
4. ✅ Compartilhar localização em tempo real
5. ✅ Editar/remover viagem

## 🐛 Problemas Comuns

### "Não consigo conectar ao backend"
- ✅ Verifique se o backend está rodando: `curl http://localhost:3000`
- ✅ Use o IP local (não localhost) no app: `ipconfig` ou `ifconfig`
- ✅ Certifique-se de que celular e computador estão na mesma rede Wi-Fi
- ✅ Desative firewall temporariamente para testar

### "Erro ao conectar ao banco de dados"
- ✅ PostgreSQL está rodando? `sudo systemctl status postgresql`
- ✅ Credenciais corretas no `.env`?
- ✅ Banco de dados criado? `psql -l | grep frete_inteligente`

### "App não abre no celular"
- ✅ Expo Go instalado?
- ✅ Celular na mesma rede Wi-Fi?
- ✅ Tente reiniciar o expo: `npm start -- --clear`

### "Socket.IO não conecta"
- ✅ Verifique a URL do Socket.IO em `TripTrackingScreen.js`
- ✅ Use o mesmo IP do backend
- ✅ Porta 3000 está aberta

## 📚 Próximos Passos

Depois que tudo estiver funcionando:

1. 📖 Leia o [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md) para entender a arquitetura
2. 📖 Consulte [backend/README.md](./backend/README.md) para detalhes da API
3. 📖 Consulte [transport-app/README.md](./transport-app/README.md) para detalhes do app
4. 🔧 Personalize as cores, textos e funcionalidades
5. 🚀 Implante em produção

## 💡 Dicas

- Use **Postman** ou **Insomnia** para testar a API manualmente
- Instale **React Native Debugger** para debugar o app
- Use `console.log` no backend e `console.log` no app para debug
- Logs do backend aparecem no terminal onde você rodou `npm run dev`
- Logs do app aparecem no terminal do Expo e no console do navegador

## 🎯 Resumo dos Endpoints

- **Health:** `GET /`
- **Register:** `POST /api/auth/register`
- **Login:** `POST /api/auth/login`
- **Profile:** `GET /api/auth/profile`
- **Trips:** `GET /api/trips`, `POST /api/trips`, `PUT /api/trips/:id`
- **Check-ins:** `POST /api/checkins`, `GET /api/checkins/my`
- **Location:** `POST /api/trips/:id/location`

## 🆘 Ajuda

Problemas? 
1. Verifique os logs: backend terminal + expo terminal
2. Consulte o [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md)
3. Abra uma issue no GitHub

---

**Boa sorte!** 🚀 Se tudo funcionou, você tem um sistema completo de gestão de transporte rodando!
