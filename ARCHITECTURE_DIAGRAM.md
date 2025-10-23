# Diagramas de Arquitetura - Frete Inteligente

## 📐 Visão Geral da Arquitetura

```
┌─────────────────────────────────────────────────────────────────────┐
│                         FRONTEND LAYER                               │
│                                                                       │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                    Transport App (React Native)               │  │
│  │                                                                │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌──────────────────┐     │  │
│  │  │   Login/    │  │   Trips     │  │   Check-ins      │     │  │
│  │  │  Register   │  │   List      │  │   Management     │     │  │
│  │  └─────────────┘  └─────────────┘  └──────────────────┘     │  │
│  │                                                                │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌──────────────────┐     │  │
│  │  │   Real-time │  │  Payment    │  │   Profile        │     │  │
│  │  │  Tracking   │  │  Status     │  │   Management     │     │  │
│  │  └─────────────┘  └─────────────┘  └──────────────────┘     │  │
│  │                                                                │  │
│  └────────────────┬──────────────────┬──────────────────────────┘  │
│                   │                  │                              │
└───────────────────┼──────────────────┼──────────────────────────────┘
                    │                  │
              HTTP/REST            WebSocket
             (Axios/JWT)          (Socket.IO)
                    │                  │
┌───────────────────┼──────────────────┼──────────────────────────────┐
│                   │                  │                               │
│                   ▼                  ▼                               │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │                     BACKEND LAYER                           │    │
│  │                   Node.js + Express.js                      │    │
│  │                                                              │    │
│  │  ┌──────────────┐  ┌──────────────┐  ┌─────────────────┐  │    │
│  │  │   Auth       │  │    Trips     │  │   Check-ins     │  │    │
│  │  │ Controller   │  │  Controller  │  │   Controller    │  │    │
│  │  └──────┬───────┘  └──────┬───────┘  └────────┬────────┘  │    │
│  │         │                 │                    │            │    │
│  │  ┌──────▼─────────────────▼────────────────────▼────────┐  │    │
│  │  │              Middleware Layer                         │  │    │
│  │  │  • JWT Authentication                                 │  │    │
│  │  │  • Request Validation (express-validator)            │  │    │
│  │  │  • CORS Handler                                      │  │    │
│  │  │  • Error Handler                                     │  │    │
│  │  └──────────────────────────────────────────────────────┘  │    │
│  │                                                              │    │
│  │  ┌──────────────────────────────────────────────────────┐  │    │
│  │  │              Sequelize ORM Layer                      │  │    │
│  │  │  • User Model                                         │  │    │
│  │  │  • Trip Model                                         │  │    │
│  │  │  • CheckIn Model                                      │  │    │
│  │  └────────────────────┬─────────────────────────────────┘  │    │
│  │                       │                                     │    │
│  └───────────────────────┼─────────────────────────────────────┘    │
│                          │                                           │
└──────────────────────────┼───────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      DATABASE LAYER                                  │
│                                                                       │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                     PostgreSQL 14+                            │  │
│  │                                                                │  │
│  │  ┌───────────┐  ┌───────────┐  ┌────────────┐               │  │
│  │  │   Users   │  │   Trips   │  │  CheckIns  │               │  │
│  │  │   Table   │  │   Table   │  │   Table    │               │  │
│  │  └───────────┘  └───────────┘  └────────────┘               │  │
│  │                                                                │  │
│  │  Relationships:                                                │  │
│  │  • User (driver) → Trips (1:N)                                │  │
│  │  • User (passenger) → CheckIns (1:N)                          │  │
│  │  • Trip → CheckIns (1:N)                                      │  │
│  │                                                                │  │
│  └────────────────────────────────────────────────────────────────┘  │
│                                                                       │
└───────────────────────────────────────────────────────────────────────┘
```

## 🔄 Fluxo de Dados - Autenticação

```
┌──────────┐                ┌──────────┐                ┌──────────┐
│   App    │                │  Backend │                │    DB    │
└────┬─────┘                └────┬─────┘                └────┬─────┘
     │                           │                           │
     │  POST /auth/register      │                           │
     │  { email, password, ... } │                           │
     ├──────────────────────────►│                           │
     │                           │                           │
     │                           │  Validate input           │
     │                           │  Hash password (bcrypt)   │
     │                           │                           │
     │                           │  INSERT INTO users        │
     │                           ├──────────────────────────►│
     │                           │                           │
     │                           │  User created             │
     │                           │◄──────────────────────────┤
     │                           │                           │
     │                           │  Generate JWT token       │
     │                           │  (sign with secret)       │
     │                           │                           │
     │  { user, token }          │                           │
     │◄──────────────────────────┤                           │
     │                           │                           │
     │  Store token in           │                           │
     │  AsyncStorage             │                           │
     │                           │                           │
     └───────────────────────────┴───────────────────────────┘

Subsequent requests include: Authorization: Bearer <token>
```

## 🚌 Fluxo de Dados - Check-in em Viagem

```
┌──────────┐         ┌──────────┐         ┌──────────┐         ┌──────────┐
│Passageiro│         │  Backend │         │    DB    │         │ Motorista│
│   App    │         │   API    │         │          │         │   App    │
└────┬─────┘         └────┬─────┘         └────┬─────┘         └────┬─────┘
     │                    │                    │                    │
     │ 1. View trips      │                    │                    │
     ├───────────────────►│                    │                    │
     │                    │ SELECT * FROM trips│                    │
     │                    ├───────────────────►│                    │
     │                    │◄───────────────────┤                    │
     │ 2. Trips list      │                    │                    │
     │◄───────────────────┤                    │                    │
     │                    │                    │                    │
     │ 3. Check-in        │                    │                    │
     │ POST /checkins     │                    │                    │
     ├───────────────────►│                    │                    │
     │                    │ 4. Verify capacity │                    │
     │                    ├───────────────────►│                    │
     │                    │◄───────────────────┤                    │
     │                    │                    │                    │
     │                    │ 5. INSERT checkin  │                    │
     │                    ├───────────────────►│                    │
     │                    │◄───────────────────┤                    │
     │                    │                    │                    │
     │ 6. Success         │ 7. Socket.IO emit  │                    │
     │◄───────────────────┤    'newCheckIn'    │                    │
     │                    ├───────────────────────────────────────►│
     │                    │                    │    8. Notification │
     │                    │                    │                    │
     └────────────────────┴────────────────────┴────────────────────┘
```

## 📍 Fluxo de Dados - Rastreamento em Tempo Real

```
┌──────────┐         ┌──────────┐         ┌──────────┐         ┌──────────┐
│Passageiro│         │Socket.IO │         │  Backend │         │ Motorista│
│   App    │         │  Server  │         │    API   │         │   App    │
└────┬─────┘         └────┬─────┘         └────┬─────┘         └────┬─────┘
     │                    │                    │                    │
     │ 1. Open tracking   │                    │                    │
     │    screen          │                    │                    │
     │                    │                    │                    │
     │ 2. Connect         │                    │                    │
     │    Socket.IO       │                    │                    │
     ├───────────────────►│                    │                    │
     │                    │                    │                    │
     │ 3. emit('joinTrip')│                    │                    │
     ├───────────────────►│                    │                    │
     │                    │ Join room          │                    │
     │    Joined room     │ 'trip-{tripId}'    │                    │
     │◄───────────────────┤                    │                    │
     │                    │                    │                    │
     │                    │                    │ 4. POST location   │
     │                    │                    │ /trips/:id/location│
     │                    │                    │◄───────────────────┤
     │                    │                    │                    │
     │                    │                    │ 5. Update DB       │
     │                    │                    │    Save location   │
     │                    │                    │                    │
     │                    │ 6. emit            │                    │
     │                    │  'locationUpdate'  │                    │
     │                    │◄───────────────────┤                    │
     │                    │  to room           │                    │
     │                    │                    │                    │
     │ 7. Receive update  │                    │                    │
     │    Update marker   │                    │                    │
     │◄───────────────────┤                    │                    │
     │    on map          │                    │                    │
     │                    │                    │                    │
     └────────────────────┴────────────────────┴────────────────────┘

Loop: Motorista envia localização a cada X segundos
```

## 🗄️ Modelo de Dados - Relacionamentos

```
┌─────────────────────────────────────────────────────────────────┐
│                          Users Table                             │
├─────────────────────────────────────────────────────────────────┤
│ id (UUID, PK)                                                   │
│ name, email, cpf, phone, password                               │
│ userType (passenger | driver | company)                         │
│ address, dateOfBirth                                            │
│ cnhCategory, cnhNumber, vehicleCapacity (drivers only)          │
│ isVerified                                                      │
│ createdAt, updatedAt                                            │
└─────────────────────────┬───────────────────────────────────────┘
                          │
                          │ 1:N (as driver)
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                          Trips Table                             │
├─────────────────────────────────────────────────────────────────┤
│ id (UUID, PK)                                                   │
│ driverId (UUID, FK → Users.id)                                  │
│ title, description                                              │
│ origin, destination                                             │
│ departureTime, arrivalTime                                      │
│ price, capacity                                                 │
│ status (scheduled | in_progress | completed | cancelled)        │
│ currentLocation (JSONB: { lat, lng, timestamp })                │
│ route (JSONB: [{ lat, lng }])                                   │
│ createdAt, updatedAt                                            │
└─────────────────────────┬───────────────────────────────────────┘
                          │
                          │ 1:N
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                        CheckIns Table                            │
├─────────────────────────────────────────────────────────────────┤
│ id (UUID, PK)                                                   │
│ tripId (UUID, FK → Trips.id)                                    │
│ passengerId (UUID, FK → Users.id)                               │
│ status (confirmed | cancelled)                                  │
│ checkInTime                                                     │
│ pickupLocation                                                  │
│ pickupOrder                                                     │
│ paymentStatus (pending | paid | refunded)                       │
│ createdAt, updatedAt                                            │
│                                                                  │
│ UNIQUE INDEX: (tripId, passengerId)                             │
└─────────────────────────────────────────────────────────────────┘
                          ▲
                          │ 1:N (as passenger)
                          │
                          │
┌─────────────────────────┴───────────────────────────────────────┐
│                          Users Table                             │
│                    (referenciado novamente)                      │
└─────────────────────────────────────────────────────────────────┘
```

## 🔐 Segurança - Fluxo de Autenticação

```
┌────────────────────────────────────────────────────────────────────┐
│                      Security Layers                                │
└────────────────────────────────────────────────────────────────────┘

1. Password Storage:
   Plain Password → bcrypt.hash(password, 10) → Hashed Password (stored)

2. JWT Token Generation:
   User Login → jwt.sign({ id: userId }, SECRET, { expiresIn: '24h' })
   
3. Token Validation:
   Request → Extract Token → jwt.verify(token, SECRET) → User Object

4. Request Authorization:
   ┌─────────────┐
   │   Request   │
   └──────┬──────┘
          │
          ▼
   ┌────────────────┐
   │ Auth Middleware│
   └──────┬─────────┘
          │
          ├─ Valid Token? ──────► Continue to controller
          │
          └─ Invalid? ──────────► 401 Unauthorized

5. Role-Based Access:
   ┌────────────────────┐
   │ checkUserType()    │
   │ Middleware         │
   └──────┬─────────────┘
          │
          ├─ Correct role? ─────► Continue
          │
          └─ Wrong role? ───────► 403 Forbidden
```

## 📊 Performance & Escalabilidade

```
Current Architecture:
┌──────────────┐
│  Single Node │     ← MVP: Monolith backend
└──────────────┘

Future Architecture:
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  Backend 1   │     │  Backend 2   │     │  Backend 3   │
└──────┬───────┘     └──────┬───────┘     └──────┬───────┘
       │                    │                    │
       └────────────────────┼────────────────────┘
                            │
                    ┌───────▼────────┐
                    │ Load Balancer  │
                    │ (NGINX/ALB)    │
                    └────────────────┘
                            │
                    ┌───────▼────────┐
                    │ Database Pool  │
                    │ (PostgreSQL    │
                    │  with replicas)│
                    └────────────────┘
```

---

Este documento fornece uma visão visual completa da arquitetura do sistema Frete Inteligente, facilitando o entendimento da integração entre os componentes.
