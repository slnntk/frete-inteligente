# Frete Inteligente - Backend API

Backend API do sistema Frete Inteligente, construído com Node.js, Express e PostgreSQL.

## 🚀 Tecnologias

- **Node.js** v18+
- **Express.js** - Framework web
- **PostgreSQL** - Banco de dados relacional
- **Sequelize** - ORM para PostgreSQL
- **JWT** - Autenticação
- **Socket.IO** - Comunicação em tempo real
- **bcryptjs** - Hash de senhas

## 📋 Pré-requisitos

- Node.js 18+ instalado
- PostgreSQL 14+ instalado e rodando
- npm ou yarn

## ⚙️ Instalação

1. Entre no diretório do backend:
```bash
cd backend
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

4. Edite o arquivo `.env` com suas configurações:
```env
PORT=3000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_NAME=frete_inteligente
DB_USER=postgres
DB_PASSWORD=sua_senha

JWT_SECRET=sua_chave_secreta_jwt
JWT_EXPIRES_IN=24h

CORS_ORIGIN=http://localhost:19006,exp://192.168.1.100:19000
```

5. Crie o banco de dados PostgreSQL:
```bash
createdb frete_inteligente
# ou via psql:
psql -U postgres -c "CREATE DATABASE frete_inteligente;"
```

## 🏃 Executando

### Modo Desenvolvimento
```bash
npm run dev
```

### Modo Produção
```bash
npm start
```

O servidor estará disponível em `http://localhost:3000`

## 📡 Endpoints da API

### Autenticação

**POST** `/api/auth/register`
- Registra um novo usuário (passageiro, motorista ou empresa)
- Body: `{ name, email, cpf, phone, password, userType }`

**POST** `/api/auth/login`
- Realiza login
- Body: `{ email, password }`

**GET** `/api/auth/profile`
- Obtém perfil do usuário autenticado
- Requer: Token JWT no header `Authorization: Bearer <token>`

### Viagens

**GET** `/api/trips`
- Lista todas as viagens disponíveis
- Query params: `status`, `date`, `origin`, `destination`
- Requer: Autenticação

**GET** `/api/trips/:id`
- Obtém detalhes de uma viagem específica
- Requer: Autenticação

**POST** `/api/trips`
- Cria nova viagem (apenas motoristas/empresas)
- Body: `{ title, description, origin, destination, departureTime, price, capacity }`
- Requer: Autenticação como motorista ou empresa

**PUT** `/api/trips/:id`
- Atualiza uma viagem existente
- Requer: Autenticação como proprietário da viagem

**DELETE** `/api/trips/:id`
- Remove uma viagem
- Requer: Autenticação como proprietário da viagem

**POST** `/api/trips/:id/location`
- Atualiza localização em tempo real da viagem
- Body: `{ latitude, longitude }`
- Requer: Autenticação como motorista da viagem

### Check-ins

**POST** `/api/checkins`
- Realiza check-in em uma viagem
- Body: `{ tripId, pickupLocation }`
- Requer: Autenticação

**GET** `/api/checkins/my`
- Lista todos os check-ins do usuário autenticado
- Requer: Autenticação

**PUT** `/api/checkins/:id/cancel`
- Cancela um check-in
- Requer: Autenticação como proprietário do check-in

**PUT** `/api/checkins/:id/payment`
- Atualiza status de pagamento
- Body: `{ paymentStatus: 'pending' | 'paid' | 'refunded' }`
- Requer: Autenticação

**GET** `/api/checkins/trip/:tripId`
- Lista todos os check-ins de uma viagem (apenas motoristas/empresas)
- Requer: Autenticação como motorista da viagem

## 🔌 WebSocket (Socket.IO)

O backend suporta comunicação em tempo real via Socket.IO:

### Eventos

**Cliente -> Servidor:**
- `joinTrip(tripId)` - Entrar em uma sala de viagem
- `leaveTrip(tripId)` - Sair de uma sala de viagem

**Servidor -> Cliente:**
- `locationUpdate` - Atualização de localização do veículo
- `newCheckIn` - Novo check-in realizado
- `checkInCancelled` - Check-in cancelado

## 🗄️ Estrutura do Banco de Dados

### Tabela Users
- id (UUID, PK)
- name, email, cpf, phone, password
- userType (passenger, driver, company)
- address, dateOfBirth
- cnhCategory, cnhNumber, vehicleCapacity
- isVerified

### Tabela Trips
- id (UUID, PK)
- driverId (FK -> Users)
- title, description
- origin, destination
- departureTime, arrivalTime
- price, capacity, status
- currentLocation (JSONB)
- route (JSONB)

### Tabela CheckIns
- id (UUID, PK)
- tripId (FK -> Trips)
- passengerId (FK -> Users)
- status (confirmed, cancelled)
- checkInTime, pickupLocation, pickupOrder
- paymentStatus (pending, paid, refunded)

## 🔒 Segurança

- Senhas são criptografadas com bcrypt
- Autenticação JWT com tokens de curta duração
- Validação de entrada com express-validator
- CORS configurável
- Rate limiting recomendado para produção

## 🧪 Testes

```bash
npm test
```

## 📝 Lint

```bash
npm run lint
```

## 🚀 Deploy

Para produção:

1. Configure as variáveis de ambiente de produção
2. Use um gerenciador de processos como PM2:
```bash
npm install -g pm2
pm2 start src/server.js --name frete-backend
```

3. Configure um proxy reverso (nginx) para SSL/TLS
4. Configure backup automático do banco de dados

## 📄 Licença

MIT
