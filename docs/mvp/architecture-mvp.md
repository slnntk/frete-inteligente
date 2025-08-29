# Arquitetura MVP - Frete Inteligente

## Visão Geral da Arquitetura

O MVP do Frete Inteligente utiliza uma arquitetura simplificada mas robusta, focada em **Java/Spring Boot** para o backend e **React Native** para aplicações móveis.

## Stack Tecnológica Detalhada

### Backend - Java/Spring Boot

```
┌─────────────────────────────────────────────────────────┐
│                 SPRING BOOT APPLICATION                 │
├─────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐  │
│  │   Spring    │  │   Spring    │  │   Spring Data   │  │
│  │     Web     │  │  Security   │  │      JPA        │  │
│  │   (REST)    │  │   (JWT)     │  │  (PostgreSQL)   │  │
│  └─────────────┘  └─────────────┘  └─────────────────┘  │
│                                                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐  │
│  │   Spring    │  │   Spring    │  │     Redis       │  │
│  │    Boot     │  │  Validation │  │    (Cache)      │  │
│  │  Actuator   │  │             │  │                 │  │
│  └─────────────┘  └─────────────┘  └─────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

**Componentes Backend:**
- **Spring Web**: APIs RESTful para todas as operações
- **Spring Security**: Autenticação JWT e autorização
- **Spring Data JPA**: ORM para PostgreSQL
- **Spring Boot Actuator**: Health checks e métricas
- **Redis**: Cache de sessões e dados temporários

### Frontend Web - React.js

```
┌─────────────────────────────────────────────────────────┐
│                   REACT.JS DASHBOARD                    │
├─────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐  │
│  │   React     │  │  Material   │  │     Axios       │  │
│  │ Components  │  │     UI      │  │  (HTTP Client)  │  │
│  └─────────────┘  └─────────────┘  └─────────────────┘  │
│                                                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐  │
│  │   Redux     │  │   React     │  │   Leaflet/      │  │
│  │   Toolkit   │  │   Router    │  │   MapBox        │  │
│  └─────────────┘  └─────────────┘  └─────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### Mobile - React Native

```
┌─────────────────────────────────────────────────────────┐
│                 REACT NATIVE MOBILE APP                 │
├─────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐  │
│  │    React    │  │    React    │  │     Axios       │  │
│  │   Native    │  │ Navigation  │  │  (HTTP Client)  │  │
│  │   0.72+     │  │     v6      │  │                 │  │
│  └─────────────┘  └─────────────┘  └─────────────────┘  │
│                                                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐  │
│  │   Redux     │  │   React     │  │   @react-       │  │
│  │   Toolkit   │  │   Native    │  │   native/maps   │  │
│  │             │  │    Maps     │  │                 │  │
│  └─────────────┘  └─────────────┘  └─────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

## Arquitetura de Dados

### Modelo de Dados Simplificado

```sql
-- Usuários e Autenticação
Users (id, email, password_hash, role, created_at)
Sessions (id, user_id, token, expires_at)

-- Gestão da Frota
Vehicles (id, plate, model, capacity, status, gps_lat, gps_lng)
Drivers (id, user_id, license_number, vehicle_id)

-- Rotas e Entregas
Routes (id, name, origin, destination, status, created_by)
Route_Points (id, route_id, sequence, address, lat, lng)
Deliveries (id, route_id, vehicle_id, driver_id, status, started_at)

-- Rastreamento
GPS_Tracking (id, vehicle_id, lat, lng, timestamp, speed)
```

### Banco de Dados - PostgreSQL

**Configuração Recomendada:**
- PostgreSQL 14+
- Conexões: Pool de 20 conexões
- Índices em colunas críticas (GPS, timestamps)
- Backup automático diário

### Cache - Redis

**Uso no MVP:**
- Sessões de usuário (JWT tokens)
- Cache de rotas calculadas
- Dados de GPS em tempo real
- Configurações do sistema

## APIs REST - Endpoints Principais

### Autenticação
```
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me
```

### Veículos
```
GET    /api/vehicles
POST   /api/vehicles
PUT    /api/vehicles/{id}
DELETE /api/vehicles/{id}
GET    /api/vehicles/{id}/location
```

### Rotas
```
GET    /api/routes
POST   /api/routes
PUT    /api/routes/{id}
DELETE /api/routes/{id}
GET    /api/routes/{id}/tracking
```

### Entregas
```
GET    /api/deliveries
POST   /api/deliveries
PUT    /api/deliveries/{id}/status
GET    /api/deliveries/{id}/timeline
```

## Fluxo de Dados

### 1. Criação de Rota
```
Dashboard Web → Spring Boot API → PostgreSQL
     ↓
GPS Tracking ← Mobile App ← Route Assignment
```

### 2. Rastreamento em Tempo Real
```
Mobile App → GPS Data → Spring Boot → Redis Cache
     ↓
Dashboard Web ← WebSocket/Polling ← Spring Boot
```

## Segurança

### Autenticação JWT
- Tokens com expiração de 24h
- Refresh tokens para renovação
- Logout invalida tokens no Redis

### Autorização
- **ADMIN**: Acesso total ao dashboard
- **DISPATCHER**: Gestão de rotas e veículos  
- **DRIVER**: Apenas suas rotas atribuídas

### Comunicação
- HTTPS obrigatório em produção
- Validação de inputs com Bean Validation
- Rate limiting básico

## Deploy e Infraestrutura

### Containerização - Docker

```dockerfile
# Dockerfile para Spring Boot
FROM openjdk:17-jre-slim
COPY target/frete-inteligente.jar app.jar
ENTRYPOINT ["java", "-jar", "/app.jar"]
```

### Orquestração - Docker Compose

```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "8080:8080"
    environment:
      - DATABASE_URL=postgresql://db:5432/frete
      - REDIS_URL=redis://redis:6379
  
  db:
    image: postgres:14
    environment:
      - POSTGRES_DB=frete
      - POSTGRES_USER=frete
      - POSTGRES_PASSWORD=password
  
  redis:
    image: redis:6-alpine
  
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
```

## Monitoramento Básico

### Health Checks
- Spring Boot Actuator (`/actuator/health`)
- Database connectivity check
- Redis connectivity check

### Métricas Básicas
- Requests por minuto
- Tempo de resposta médio
- Uso de CPU/Memória
- Conexões de banco ativas

## Performance - MVP

### Objetivos
- **Latência**: < 3 segundos para operações críticas
- **Throughput**: 100 requests/segundo
- **Concurrent Users**: 50 usuários simultâneos
- **Database**: < 100ms para queries simples

### Otimizações
- Cache Redis para dados frequentes
- Índices de banco otimizados
- Connection pooling
- Compressão de respostas HTTP

## Escalabilidade Futura

O MVP é projetado para evoluir para o projeto completo:

1. **Microservices**: Separação em serviços menores
2. **Load Balancer**: NGINX → múltiplas instâncias
3. **Database Sharding**: Particionamento por região
4. **Event Streaming**: Apache Kafka para eventos
5. **Container Orchestration**: Kubernetes

---

**Próximo:** [Especificações Técnicas MVP](./technical-specs-mvp.md)