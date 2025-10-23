# 📡 API Reference - Frete Inteligente

Referência completa de todos os endpoints da API do Frete Inteligente.

**Base URL:** `http://localhost:3000/api`

## 📋 Índice

- [Autenticação](#autenticação)
- [Viagens](#viagens)
- [Check-ins](#check-ins)
- [WebSocket Events](#websocket-events)

---

## 🔐 Autenticação

### Registrar Usuário

Cria uma nova conta de usuário.

**Endpoint:** `POST /auth/register`

**Body:**
```json
{
  "name": "João Silva",
  "email": "joao@example.com",
  "cpf": "12345678901",
  "phone": "85999999999",
  "password": "senha123",
  "userType": "passenger",
  "address": "Rua Example, 123",
  "dateOfBirth": "1990-01-15"
}
```

**Campos:**
- `name` (string, required) - Nome completo
- `email` (string, required) - Email válido
- `cpf` (string, required) - CPF com 11 dígitos (apenas números)
- `phone` (string, required) - Telefone
- `password` (string, required) - Senha (mínimo 6 caracteres)
- `userType` (string, optional) - Tipo: `passenger`, `driver`, `company` (padrão: `passenger`)
- `address` (string, optional) - Endereço
- `dateOfBirth` (string, optional) - Data de nascimento (formato: YYYY-MM-DD)

**Response (201):**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "uuid",
    "name": "João Silva",
    "email": "joao@example.com",
    "cpf": "12345678901",
    "userType": "passenger"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Errors:**
- `400` - Validação falhou ou usuário já existe
- `500` - Erro interno do servidor

---

### Login

Autentica um usuário existente.

**Endpoint:** `POST /auth/login`

**Body:**
```json
{
  "email": "joao@example.com",
  "password": "senha123"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "user": {
    "id": "uuid",
    "name": "João Silva",
    "email": "joao@example.com",
    "cpf": "12345678901",
    "userType": "passenger"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Errors:**
- `401` - Credenciais inválidas
- `500` - Erro interno do servidor

---

### Obter Perfil

Retorna os dados do usuário autenticado.

**Endpoint:** `GET /auth/profile`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "user": {
    "id": "uuid",
    "name": "João Silva",
    "email": "joao@example.com",
    "cpf": "12345678901",
    "phone": "85999999999",
    "userType": "passenger",
    "address": "Rua Example, 123",
    "dateOfBirth": "1990-01-15",
    "createdAt": "2025-10-23T10:00:00Z",
    "updatedAt": "2025-10-23T10:00:00Z"
  }
}
```

**Errors:**
- `401` - Token inválido ou ausente
- `500` - Erro interno do servidor

---

## 🚌 Viagens

### Listar Viagens

Retorna lista de viagens disponíveis.

**Endpoint:** `GET /trips`

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `status` (string, optional) - Filtrar por status: `scheduled`, `in_progress`, `completed`, `cancelled`
- `date` (string, optional) - Filtrar por data (formato: YYYY-MM-DD)
- `origin` (string, optional) - Filtrar por origem (busca parcial)
- `destination` (string, optional) - Filtrar por destino (busca parcial)

**Example:**
```
GET /trips?status=scheduled&origin=Fortaleza
```

**Response (200):**
```json
{
  "trips": [
    {
      "id": "uuid",
      "driverId": "uuid",
      "title": "Fortaleza → Eusébio",
      "description": "Rota universitária matinal",
      "origin": "Fortaleza Centro",
      "destination": "Eusébio - Unifor",
      "departureTime": "2025-10-24T06:00:00Z",
      "arrivalTime": null,
      "price": "12.50",
      "capacity": 10,
      "status": "scheduled",
      "currentLocation": null,
      "driver": {
        "id": "uuid",
        "name": "Motorista Silva",
        "phone": "85988888888"
      },
      "checkIns": [
        { "id": "uuid", "status": "confirmed" }
      ],
      "availableSeats": 8,
      "confirmedPassengers": 2,
      "createdAt": "2025-10-23T10:00:00Z",
      "updatedAt": "2025-10-23T10:00:00Z"
    }
  ]
}
```

**Errors:**
- `401` - Não autenticado
- `500` - Erro interno do servidor

---

### Obter Viagem por ID

Retorna detalhes de uma viagem específica.

**Endpoint:** `GET /trips/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "trip": {
    "id": "uuid",
    "driverId": "uuid",
    "title": "Fortaleza → Eusébio",
    "description": "Rota universitária matinal",
    "origin": "Fortaleza Centro",
    "destination": "Eusébio - Unifor",
    "departureTime": "2025-10-24T06:00:00Z",
    "price": "12.50",
    "capacity": 10,
    "status": "scheduled",
    "currentLocation": {
      "latitude": -3.7327,
      "longitude": -38.5267,
      "timestamp": "2025-10-24T06:30:00Z"
    },
    "driver": {
      "id": "uuid",
      "name": "Motorista Silva",
      "phone": "85988888888"
    },
    "checkIns": [
      {
        "id": "uuid",
        "status": "confirmed",
        "passenger": {
          "id": "uuid",
          "name": "João Silva",
          "phone": "85999999999"
        }
      }
    ],
    "availableSeats": 8,
    "confirmedPassengers": 2
  }
}
```

**Errors:**
- `401` - Não autenticado
- `404` - Viagem não encontrada
- `500` - Erro interno do servidor

---

### Criar Viagem

Cria uma nova viagem (apenas motoristas e empresas).

**Endpoint:** `POST /trips`

**Headers:**
```
Authorization: Bearer <token>
```

**Body:**
```json
{
  "title": "Fortaleza → Eusébio",
  "description": "Rota universitária matinal",
  "origin": "Fortaleza Centro",
  "destination": "Eusébio - Unifor",
  "departureTime": "2025-10-24T06:00:00Z",
  "price": 12.50,
  "capacity": 10
}
```

**Campos:**
- `title` (string, required) - Título da viagem
- `description` (string, optional) - Descrição
- `origin` (string, required) - Local de origem
- `destination` (string, required) - Local de destino
- `departureTime` (string, required) - Horário de partida (ISO 8601)
- `price` (number, required) - Preço da viagem
- `capacity` (number, optional) - Capacidade de passageiros (padrão: 10)

**Response (201):**
```json
{
  "message": "Trip created successfully",
  "trip": {
    "id": "uuid",
    "driverId": "uuid",
    "title": "Fortaleza → Eusébio",
    "origin": "Fortaleza Centro",
    "destination": "Eusébio - Unifor",
    "departureTime": "2025-10-24T06:00:00Z",
    "price": "12.50",
    "capacity": 10,
    "status": "scheduled"
  }
}
```

**Errors:**
- `401` - Não autenticado
- `403` - Usuário não é motorista ou empresa
- `400` - Validação falhou
- `500` - Erro interno do servidor

---

### Atualizar Viagem

Atualiza uma viagem existente (apenas proprietário).

**Endpoint:** `PUT /trips/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Body:** (todos os campos são opcionais)
```json
{
  "title": "Novo Título",
  "description": "Nova Descrição",
  "price": 15.00,
  "status": "in_progress"
}
```

**Response (200):**
```json
{
  "message": "Trip updated successfully",
  "trip": { /* dados atualizados */ }
}
```

**Errors:**
- `401` - Não autenticado
- `403` - Não autorizado (não é o proprietário)
- `404` - Viagem não encontrada
- `500` - Erro interno do servidor

---

### Deletar Viagem

Remove uma viagem (apenas proprietário).

**Endpoint:** `DELETE /trips/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "message": "Trip deleted successfully"
}
```

**Errors:**
- `401` - Não autenticado
- `403` - Não autorizado
- `404` - Viagem não encontrada
- `500` - Erro interno do servidor

---

### Atualizar Localização

Atualiza a localização em tempo real do veículo (apenas motorista da viagem).

**Endpoint:** `POST /trips/:id/location`

**Headers:**
```
Authorization: Bearer <token>
```

**Body:**
```json
{
  "latitude": -3.7327,
  "longitude": -38.5267
}
```

**Campos:**
- `latitude` (number, required) - Latitude (-90 a 90)
- `longitude` (number, required) - Longitude (-180 a 180)

**Response (200):**
```json
{
  "message": "Location updated successfully",
  "location": {
    "latitude": -3.7327,
    "longitude": -38.5267,
    "timestamp": "2025-10-24T06:30:00Z"
  }
}
```

**Side Effect:** Emite evento `locationUpdate` via Socket.IO para todos conectados à viagem.

**Errors:**
- `401` - Não autenticado
- `403` - Não autorizado (não é o motorista)
- `404` - Viagem não encontrada
- `400` - Coordenadas inválidas
- `500` - Erro interno do servidor

---

## ✅ Check-ins

### Criar Check-in

Realiza check-in em uma viagem.

**Endpoint:** `POST /checkins`

**Headers:**
```
Authorization: Bearer <token>
```

**Body:**
```json
{
  "tripId": "uuid",
  "pickupLocation": "Av. Washington Soares, 500"
}
```

**Campos:**
- `tripId` (string, required) - UUID da viagem
- `pickupLocation` (string, optional) - Local de embarque

**Response (201):**
```json
{
  "message": "Check-in successful",
  "checkIn": {
    "id": "uuid",
    "tripId": "uuid",
    "passengerId": "uuid",
    "status": "confirmed",
    "checkInTime": "2025-10-23T10:00:00Z",
    "pickupLocation": "Av. Washington Soares, 500",
    "paymentStatus": "pending"
  }
}
```

**Side Effect:** Emite evento `newCheckIn` via Socket.IO.

**Errors:**
- `401` - Não autenticado
- `404` - Viagem não encontrada
- `400` - Viagem lotada ou check-in duplicado
- `500` - Erro interno do servidor

---

### Listar Meus Check-ins

Retorna todos os check-ins do usuário autenticado.

**Endpoint:** `GET /checkins/my`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "checkIns": [
    {
      "id": "uuid",
      "tripId": "uuid",
      "passengerId": "uuid",
      "status": "confirmed",
      "checkInTime": "2025-10-23T10:00:00Z",
      "pickupLocation": "Av. Washington Soares, 500",
      "paymentStatus": "pending",
      "trip": {
        "id": "uuid",
        "title": "Fortaleza → Eusébio",
        "origin": "Fortaleza Centro",
        "destination": "Eusébio - Unifor",
        "departureTime": "2025-10-24T06:00:00Z",
        "price": "12.50",
        "driver": {
          "id": "uuid",
          "name": "Motorista Silva",
          "phone": "85988888888"
        }
      }
    }
  ]
}
```

**Errors:**
- `401` - Não autenticado
- `500` - Erro interno do servidor

---

### Cancelar Check-in

Cancela um check-in existente.

**Endpoint:** `PUT /checkins/:id/cancel`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "message": "Check-in cancelled successfully",
  "checkIn": {
    "id": "uuid",
    "status": "cancelled",
    /* outros campos */
  }
}
```

**Side Effect:** Emite evento `checkInCancelled` via Socket.IO.

**Errors:**
- `401` - Não autenticado
- `403` - Não autorizado (não é o proprietário)
- `404` - Check-in não encontrado
- `500` - Erro interno do servidor

---

### Atualizar Status de Pagamento

Atualiza o status de pagamento de um check-in.

**Endpoint:** `PUT /checkins/:id/payment`

**Headers:**
```
Authorization: Bearer <token>
```

**Body:**
```json
{
  "paymentStatus": "paid"
}
```

**Campos:**
- `paymentStatus` (string, required) - Status: `pending`, `paid`, `refunded`

**Response (200):**
```json
{
  "message": "Payment status updated successfully",
  "checkIn": {
    "id": "uuid",
    "paymentStatus": "paid",
    /* outros campos */
  }
}
```

**Errors:**
- `401` - Não autenticado
- `403` - Não autorizado
- `404` - Check-in não encontrado
- `400` - Status inválido
- `500` - Erro interno do servidor

---

### Listar Check-ins de uma Viagem

Lista todos os check-ins de uma viagem específica (apenas motorista/empresa).

**Endpoint:** `GET /checkins/trip/:tripId`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "checkIns": [
    {
      "id": "uuid",
      "tripId": "uuid",
      "passengerId": "uuid",
      "status": "confirmed",
      "checkInTime": "2025-10-23T10:00:00Z",
      "pickupLocation": "Av. Washington Soares, 500",
      "pickupOrder": 1,
      "paymentStatus": "paid",
      "passenger": {
        "id": "uuid",
        "name": "João Silva",
        "phone": "85999999999",
        "email": "joao@example.com"
      }
    }
  ]
}
```

**Errors:**
- `401` - Não autenticado
- `403` - Não autorizado (não é o motorista)
- `404` - Viagem não encontrada
- `500` - Erro interno do servidor

---

## 🔌 WebSocket Events

O sistema usa Socket.IO para comunicação em tempo real.

**URL de Conexão:** `http://localhost:3000`

### Client → Server

#### `joinTrip`
Entra em uma sala de viagem para receber atualizações.

```javascript
socket.emit('joinTrip', tripId);
```

#### `leaveTrip`
Sai de uma sala de viagem.

```javascript
socket.emit('leaveTrip', tripId);
```

### Server → Client

#### `locationUpdate`
Emitido quando a localização do veículo é atualizada.

```javascript
socket.on('locationUpdate', (data) => {
  console.log(data);
  // {
  //   tripId: "uuid",
  //   latitude: -3.7327,
  //   longitude: -38.5267,
  //   timestamp: "2025-10-24T06:30:00Z"
  // }
});
```

#### `newCheckIn`
Emitido quando um novo check-in é realizado.

```javascript
socket.on('newCheckIn', (data) => {
  console.log(data);
  // {
  //   checkInId: "uuid",
  //   passengerName: "João Silva",
  //   tripId: "uuid"
  // }
});
```

#### `checkInCancelled`
Emitido quando um check-in é cancelado.

```javascript
socket.on('checkInCancelled', (data) => {
  console.log(data);
  // {
  //   checkInId: "uuid",
  //   tripId: "uuid"
  // }
});
```

---

## 🔒 Autenticação JWT

Todos os endpoints (exceto `/auth/register` e `/auth/login`) requerem autenticação JWT.

**Header Format:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Token Expiration:** 24 horas (configurável via `JWT_EXPIRES_IN`)

**Token Payload:**
```json
{
  "id": "user_uuid",
  "iat": 1698000000,
  "exp": 1698086400
}
```

---

## 📝 Status Codes

- `200` - OK
- `201` - Created
- `400` - Bad Request (validação falhou)
- `401` - Unauthorized (não autenticado)
- `403` - Forbidden (sem permissão)
- `404` - Not Found
- `500` - Internal Server Error

---

## 🧪 Testando com cURL

### Exemplo completo:

```bash
# 1. Registrar
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@test.com","cpf":"12345678901","phone":"85999999999","password":"test123","userType":"passenger"}'

# 2. Login (salve o token)
TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123"}' \
  | grep -o '"token":"[^"]*' | cut -d'"' -f4)

# 3. Listar viagens
curl http://localhost:3000/api/trips \
  -H "Authorization: Bearer $TOKEN"

# 4. Fazer check-in
curl -X POST http://localhost:3000/api/checkins \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"tripId":"trip_uuid_here"}'
```

---

Para mais detalhes, consulte:
- [Backend README](./backend/README.md)
- [Integration Guide](./INTEGRATION_GUIDE.md)
- [Architecture Diagram](./ARCHITECTURE_DIAGRAM.md)
