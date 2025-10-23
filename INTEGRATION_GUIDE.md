# Guia de Integração - Frete Inteligente

Este guia explica como integrar o **transport-app** (frontend mobile) com o **backend** do sistema Frete Inteligente.

## 📋 Visão Geral da Integração

O sistema Frete Inteligente é composto por:

1. **Backend API** - Node.js/Express com PostgreSQL
2. **Transport App** - React Native/Expo mobile app
3. **Comunicação em Tempo Real** - Socket.IO para rastreamento

## 🏗️ Arquitetura da Integração

```
┌─────────────────┐         HTTP/REST API        ┌──────────────────┐
│                 │ ◄─────────────────────────► │                  │
│  Transport App  │                              │   Backend API    │
│  (React Native) │         WebSocket            │  (Node.js)       │
│                 │ ◄─────────────────────────► │                  │
└─────────────────┘      (Socket.IO)             └──────────────────┘
                                                           │
                                                           ▼
                                                  ┌──────────────────┐
                                                  │   PostgreSQL     │
                                                  │    Database      │
                                                  └──────────────────┘
```

## 🚀 Setup Completo

### Método 1: Desenvolvimento Local

#### Passo 1: Configure o Backend

```bash
# 1. Entre no diretório do backend
cd backend

# 2. Instale dependências
npm install

# 3. Configure variáveis de ambiente
cp .env.example .env

# 4. Edite o .env com suas configurações
# Importante: Configure DB_HOST, DB_NAME, DB_USER, DB_PASSWORD
```

Exemplo de `.env`:
```env
PORT=3000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_NAME=frete_inteligente
DB_USER=postgres
DB_PASSWORD=postgres

JWT_SECRET=minha_chave_secreta_super_segura
JWT_EXPIRES_IN=24h

CORS_ORIGIN=*
```

```bash
# 5. Crie o banco de dados
createdb frete_inteligente

# 6. Inicie o servidor
npm run dev
```

Verificação: Acesse http://localhost:3000 - deve retornar informações da API.

#### Passo 2: Configure o Transport App

```bash
# 1. Entre no diretório do app (em outro terminal)
cd transport-app

# 2. Instale dependências
npm install

# 3. Configure a URL do backend
```

Edite `transport-app/src/services/api.js`:

```javascript
// Para desenvolvimento com dispositivo físico na mesma rede
const API_BASE_URL = 'http://192.168.1.100:3000/api';

// Substitua 192.168.1.100 pelo IP da sua máquina
// Para descobrir seu IP:
// Windows: ipconfig
// macOS/Linux: ifconfig ou ip addr
```

Edite também `transport-app/src/screens/TripTrackingScreen.js`:

```javascript
// Linha ~41, atualize a URL do Socket.IO
const socketConnection = io('http://192.168.1.100:3000');
```

```bash
# 4. Inicie o app
npm start

# 5. Escaneie o QR code com o app Expo Go
```

### Método 2: Usando Docker (Recomendado)

```bash
# 1. No diretório raiz do projeto
docker-compose up -d

# O backend estará disponível em http://localhost:3000
# PostgreSQL em localhost:5432
```

Para o app mobile, siga o Passo 2 do Método 1, mas use:
```javascript
const API_BASE_URL = 'http://SEU_IP_LOCAL:3000/api';
```

## 🔌 Pontos de Integração

### 1. Autenticação (JWT)

**Flow:**
1. App envia credenciais para `/api/auth/login`
2. Backend valida e retorna token JWT
3. App armazena token no AsyncStorage
4. App inclui token em todas as requisições: `Authorization: Bearer <token>`

**Exemplo de Integração:**

```javascript
// App: src/context/AuthContext.js
const login = async (email, password) => {
  const response = await authAPI.login({ email, password });
  const { token } = response.data;
  await AsyncStorage.setItem('userToken', token);
};

// Interceptor adiciona token automaticamente
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('userToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### 2. Listagem de Viagens

**Endpoint:** `GET /api/trips`

**Flow:**
1. App faz requisição autenticada
2. Backend retorna lista de viagens com informações do motorista e vagas
3. App renderiza cards com as viagens

**Exemplo:**

```javascript
// App
const response = await tripsAPI.getTrips({ status: 'scheduled' });
setTrips(response.data.trips);
```

### 3. Check-in

**Endpoint:** `POST /api/checkins`

**Flow:**
1. Passageiro clica em "Fazer Check-in"
2. App envia tripId para o backend
3. Backend valida vagas disponíveis
4. Backend cria check-in e retorna confirmação
5. Backend emite evento Socket.IO para notificar motorista

**Exemplo:**

```javascript
// App
await checkInsAPI.createCheckIn({ tripId, pickupLocation });

// Backend emite evento
io.to(`trip-${tripId}`).emit('newCheckIn', {
  checkInId,
  passengerName,
  tripId
});
```

### 4. Rastreamento em Tempo Real

**Tecnologia:** Socket.IO (WebSocket)

**Flow:**
1. Passageiro entra na tela de rastreamento
2. App conecta ao Socket.IO e entra na sala da viagem
3. Motorista atualiza localização via `POST /api/trips/:id/location`
4. Backend emite evento `locationUpdate` para todos na sala
5. App atualiza marcador no mapa em tempo real

**Exemplo:**

```javascript
// App: TripTrackingScreen.js
const socket = io('http://IP_BACKEND:3000');

socket.emit('joinTrip', tripId);

socket.on('locationUpdate', (data) => {
  if (data.tripId === tripId) {
    setCurrentLocation({
      latitude: data.latitude,
      longitude: data.longitude
    });
  }
});

// Backend: tripController.js
await trip.update({ currentLocation: { latitude, longitude } });
req.app.io.to(`trip-${id}`).emit('locationUpdate', {
  tripId: id,
  latitude,
  longitude
});
```

## 🔒 Segurança

### Backend

1. **Senhas**: Hash com bcrypt (salt rounds: 10)
2. **JWT**: Tokens com expiração de 24h
3. **CORS**: Configurável via env
4. **Validação**: express-validator em todos os endpoints

### App

1. **Armazenamento**: Tokens em AsyncStorage (seguro no React Native)
2. **HTTPS**: Use HTTPS em produção
3. **Validação**: Validação de formulários antes de enviar

## 📊 Fluxo Completo de Uso

### Fluxo do Passageiro

```
1. Abrir App
   ↓
2. Fazer Login/Registro → POST /api/auth/login
   ↓
3. Ver Lista de Viagens → GET /api/trips
   ↓
4. Fazer Check-in → POST /api/checkins
   ↓
5. Ver Meus Check-ins → GET /api/checkins/my
   ↓
6. Rastrear Viagem → WebSocket + GET /api/trips/:id
   ↓
7. (Opcional) Cancelar Check-in → PUT /api/checkins/:id/cancel
```

### Fluxo do Motorista

```
1. Abrir App
   ↓
2. Fazer Login → POST /api/auth/login
   ↓
3. Criar Viagem → POST /api/trips
   ↓
4. Ver Check-ins da Viagem → GET /api/checkins/trip/:tripId
   ↓
5. Iniciar Viagem e Compartilhar Localização
   ↓
6. Atualizar Localização → POST /api/trips/:id/location
   (Loop contínuo durante a viagem)
```

## 🧪 Testando a Integração

### 1. Teste de Autenticação

```bash
# Registrar usuário
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@example.com",
    "cpf": "12345678901",
    "phone": "85999999999",
    "password": "senha123",
    "userType": "passenger"
  }'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@example.com",
    "password": "senha123"
  }'
```

### 2. Teste de Viagens

```bash
# Criar viagem (como motorista)
curl -X POST http://localhost:3000/api/trips \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -d '{
    "title": "Fortaleza → Eusébio",
    "description": "Rota universitária",
    "origin": "Fortaleza",
    "destination": "Eusébio",
    "departureTime": "2025-10-24T06:00:00Z",
    "price": 15.00,
    "capacity": 10
  }'

# Listar viagens
curl http://localhost:3000/api/trips \
  -H "Authorization: Bearer SEU_TOKEN"
```

### 3. Teste de Check-in

```bash
# Fazer check-in
curl -X POST http://localhost:3000/api/checkins \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -d '{
    "tripId": "UUID_DA_VIAGEM",
    "pickupLocation": "Av. Washington Soares, 500"
  }'

# Ver meus check-ins
curl http://localhost:3000/api/checkins/my \
  -H "Authorization: Bearer SEU_TOKEN"
```

## 🐛 Troubleshooting

### Problema: App não conecta ao backend

**Solução:**
1. Verifique se o backend está rodando: `curl http://localhost:3000`
2. Confirme que está usando o IP correto no app
3. Verifique se o firewall não está bloqueando a porta 3000
4. Certifique-se de que o dispositivo está na mesma rede Wi-Fi

### Problema: Socket.IO não conecta

**Solução:**
1. Verifique se a URL do Socket.IO está correta
2. Confirme que o backend suporta WebSocket (Socket.IO ativo)
3. Verifique logs do backend para erros de conexão

### Problema: Token JWT inválido

**Solução:**
1. Verifique se o token não expirou (válido por 24h)
2. Confirme que o JWT_SECRET é o mesmo no backend
3. Faça logout e login novamente

### Problema: Erro CORS

**Solução:**
1. No backend, configure CORS_ORIGIN no .env para incluir a origem do app
2. Para desenvolvimento, use `CORS_ORIGIN=*`
3. Para produção, especifique as origens permitidas

## 📝 Checklist de Integração

- [ ] Backend instalado e rodando
- [ ] PostgreSQL configurado e acessível
- [ ] Banco de dados criado
- [ ] Variáveis de ambiente configuradas
- [ ] Transport app instalado
- [ ] URL do backend configurada no app
- [ ] Socket.IO URL configurada no app
- [ ] Dispositivo na mesma rede (ou emulador configurado)
- [ ] Teste de registro de usuário OK
- [ ] Teste de login OK
- [ ] Teste de listagem de viagens OK
- [ ] Teste de check-in OK
- [ ] Teste de rastreamento em tempo real OK

## 🚀 Próximos Passos

Após a integração básica funcionar:

1. **Implementar notificações push** (Firebase Cloud Messaging)
2. **Adicionar gateway de pagamento** (Pix)
3. **Melhorar otimização de rotas** (Google Maps Directions API)
4. **Implementar sistema de avaliações**
5. **Adicionar chat em tempo real**
6. **Deploy em produção** (Backend em cloud, App nas lojas)

## 📚 Recursos Adicionais

- [Backend API Documentation](./backend/README.md)
- [Transport App Documentation](./transport-app/README.md)
- [Express.js Documentation](https://expressjs.com/)
- [React Native Documentation](https://reactnative.dev/)
- [Socket.IO Documentation](https://socket.io/docs/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

## 💬 Suporte

Para dúvidas ou problemas:
- Abra uma issue no GitHub
- Consulte a documentação dos componentes
- Verifique os logs do backend e do app

---

**Sucesso na integração!** 🎉
