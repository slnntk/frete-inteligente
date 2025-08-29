# Especificações Técnicas MVP - Frete Inteligente

## Configuração do Ambiente de Desenvolvimento

### Pré-requisitos

#### Backend (Java/Spring Boot)
- **Java**: OpenJDK 17+ (recomendado: Eclipse Temurin)
- **Maven**: 3.8+ para gerenciamento de dependências
- **IDE**: IntelliJ IDEA Community ou Eclipse STS
- **Database**: PostgreSQL 14+ + pgAdmin (opcional)
- **Cache**: Redis 6+ + Redis Insight (opcional)

#### Frontend Web (React.js)
- **Node.js**: 18+ LTS (recomendado: via NVM)
- **npm**: 8+ ou Yarn 1.22+
- **Browser**: Chrome 90+ para desenvolvimento

#### Mobile (React Native)
- **React Native CLI**: 0.72+
- **Android Studio**: Para emulador Android + SDK
- **Xcode**: Para iOS (apenas em macOS)
- **Simulators**: iOS Simulator + Android Emulator

### Setup do Backend - Spring Boot

#### 1. Estrutura do Projeto Maven

```xml
<!-- pom.xml -->
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0">
    <modelVersion>4.0.0</modelVersion>
    
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.1.5</version>
        <relativePath/>
    </parent>
    
    <groupId>com.freteinteligentecompany</groupId>
    <artifactId>frete-inteligente-mvp</artifactId>
    <version>0.1.0</version>
    <name>frete-inteligente-mvp</name>
    <description>MVP do Frete Inteligente</description>
    
    <properties>
        <java.version>17</java.version>
    </properties>
    
    <dependencies>
        <!-- Core Spring Boot -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        
        <!-- Security -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-security</artifactId>
        </dependency>
        
        <!-- Database -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>
        <dependency>
            <groupId>org.postgresql</groupId>
            <artifactId>postgresql</artifactId>
            <scope>runtime</scope>
        </dependency>
        
        <!-- Cache -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-redis</artifactId>
        </dependency>
        
        <!-- Validation -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-validation</artifactId>
        </dependency>
        
        <!-- JWT -->
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-api</artifactId>
            <version>0.11.5</version>
        </dependency>
        
        <!-- Testing -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>
</project>
```

#### 2. Estrutura de Pacotes

```
src/main/java/com/freteinteligentecompany/
├── FreteInteligenteApplication.java
├── config/
│   ├── SecurityConfig.java
│   ├── DatabaseConfig.java
│   └── RedisConfig.java
├── controller/
│   ├── AuthController.java
│   ├── VehicleController.java
│   ├── RouteController.java
│   └── DeliveryController.java
├── service/
│   ├── AuthService.java
│   ├── VehicleService.java
│   ├── RouteService.java
│   └── DeliveryService.java
├── repository/
│   ├── UserRepository.java
│   ├── VehicleRepository.java
│   ├── RouteRepository.java
│   └── DeliveryRepository.java
├── model/
│   ├── User.java
│   ├── Vehicle.java
│   ├── Route.java
│   └── Delivery.java
├── dto/
│   ├── AuthRequest.java
│   ├── VehicleDto.java
│   └── RouteDto.java
└── security/
    ├── JwtAuthFilter.java
    ├── JwtService.java
    └── UserDetailsServiceImpl.java
```

#### 3. Configuração de Banco de Dados

```yaml
# application.yml
spring:
  application:
    name: frete-inteligente-mvp
    
  datasource:
    url: jdbc:postgresql://localhost:5432/frete_mvp
    username: frete_user
    password: frete_password
    driver-class-name: org.postgresql.Driver
    
  jpa:
    hibernate:
      ddl-auto: validate
    show-sql: false
    database: postgresql
    database-platform: org.hibernate.dialect.PostgreSQLDialect
    
  redis:
    host: localhost
    port: 6379
    password: 
    timeout: 60000
    
  security:
    jwt:
      secret-key: ${JWT_SECRET_KEY:mySecretKey}
      expiration: 86400000 # 24 hours
      
server:
  port: 8080
  servlet:
    context-path: /api

logging:
  level:
    com.freteinteligentecompany: DEBUG
    org.springframework.security: DEBUG
```

### Modelo de Dados MVP

#### Entidades JPA

```java
// User.java
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false)
    @Email
    private String email;
    
    @Column(nullable = false)
    private String passwordHash;
    
    @Enumerated(EnumType.STRING)
    private Role role;
    
    @CreationTimestamp
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    private LocalDateTime updatedAt;
    
    // Getters, setters, constructors
}

// Vehicle.java
@Entity
@Table(name = "vehicles")
public class Vehicle {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false)
    private String plate;
    
    @Column(nullable = false)
    private String model;
    
    @Column(name = "capacity_kg")
    private Double capacityKg;
    
    @Enumerated(EnumType.STRING)
    private VehicleStatus status;
    
    @Column(name = "gps_latitude")
    private Double gpsLatitude;
    
    @Column(name = "gps_longitude")  
    private Double gpsLongitude;
    
    @UpdateTimestamp
    private LocalDateTime lastUpdate;
    
    // Getters, setters, constructors
}

// Route.java
@Entity
@Table(name = "routes")
public class Route {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name;
    
    @Column(nullable = false)
    private String origin;
    
    @Column(nullable = false)
    private String destination;
    
    @Enumerated(EnumType.STRING)
    private RouteStatus status;
    
    @ManyToOne
    @JoinColumn(name = "created_by")
    private User createdBy;
    
    @ManyToOne
    @JoinColumn(name = "vehicle_id")
    private Vehicle vehicle;
    
    @OneToMany(mappedBy = "route", cascade = CascadeType.ALL)
    private List<RoutePoint> points;
    
    @CreationTimestamp
    private LocalDateTime createdAt;
    
    // Getters, setters, constructors
}
```

#### Scripts SQL de Inicialização

```sql
-- V1__Create_tables.sql (Flyway migration)
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE vehicles (
    id BIGSERIAL PRIMARY KEY,
    plate VARCHAR(20) UNIQUE NOT NULL,
    model VARCHAR(100) NOT NULL,
    capacity_kg DECIMAL(10,2),
    status VARCHAR(50) NOT NULL DEFAULT 'AVAILABLE',
    gps_latitude DECIMAL(10,7),
    gps_longitude DECIMAL(11,7),
    last_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE routes (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    origin VARCHAR(500) NOT NULL,
    destination VARCHAR(500) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'PLANNED',
    created_by BIGINT REFERENCES users(id),
    vehicle_id BIGINT REFERENCES vehicles(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE route_points (
    id BIGSERIAL PRIMARY KEY,
    route_id BIGINT REFERENCES routes(id) ON DELETE CASCADE,
    sequence_order INTEGER NOT NULL,
    address VARCHAR(500) NOT NULL,
    latitude DECIMAL(10,7) NOT NULL,
    longitude DECIMAL(11,7) NOT NULL,
    estimated_arrival TIMESTAMP
);

-- Índices para performance
CREATE INDEX idx_vehicles_status ON vehicles(status);
CREATE INDEX idx_routes_status ON routes(status);
CREATE INDEX idx_route_points_route_id ON route_points(route_id);
CREATE INDEX idx_vehicles_gps ON vehicles(gps_latitude, gps_longitude);
```

### APIs REST - Endpoints Detalhados

#### 1. Autenticação

```java
@RestController
@RequestMapping("/auth")
@Validated
public class AuthController {
    
    @Autowired
    private AuthService authService;
    
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @Valid @RequestBody AuthRequest request) {
        
        AuthResponse response = authService.authenticate(request);
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refresh(
            @RequestHeader("Authorization") String refreshToken) {
        
        AuthResponse response = authService.refreshToken(refreshToken);
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/logout")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> logout(HttpServletRequest request) {
        authService.logout(request);
        return ResponseEntity.noContent().build();
    }
}
```

#### 2. Gestão de Veículos

```java
@RestController
@RequestMapping("/vehicles")
@PreAuthorize("hasRole('ADMIN') or hasRole('DISPATCHER')")
public class VehicleController {
    
    @Autowired
    private VehicleService vehicleService;
    
    @GetMapping
    public ResponseEntity<Page<VehicleDto>> getAllVehicles(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) VehicleStatus status) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<VehicleDto> vehicles = vehicleService.findAll(pageable, status);
        return ResponseEntity.ok(vehicles);
    }
    
    @PostMapping
    public ResponseEntity<VehicleDto> createVehicle(
            @Valid @RequestBody CreateVehicleRequest request) {
        
        VehicleDto vehicle = vehicleService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(vehicle);
    }
    
    @PutMapping("/{id}/location")
    @PreAuthorize("hasRole('DRIVER') or hasRole('ADMIN')")
    public ResponseEntity<Void> updateLocation(
            @PathVariable Long id,
            @Valid @RequestBody LocationUpdateRequest request) {
        
        vehicleService.updateLocation(id, request);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/{id}/tracking")
    public ResponseEntity<List<LocationPoint>> getTrackingHistory(
            @PathVariable Long id,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime to) {
        
        List<LocationPoint> tracking = vehicleService.getTrackingHistory(id, from, to);
        return ResponseEntity.ok(tracking);
    }
}
```

### Setup do Frontend - React.js

#### 1. Estrutura do Projeto

```bash
npx create-react-app frete-dashboard --template typescript
cd frete-dashboard
npm install @mui/material @emotion/react @emotion/styled
npm install @reduxjs/toolkit react-redux
npm install @tanstack/react-query
npm install react-router-dom
npm install axios
npm install leaflet react-leaflet
npm install @types/leaflet
```

#### 2. Estrutura de Pastas

```
src/
├── components/
│   ├── common/
│   │   ├── Layout.tsx
│   │   ├── Header.tsx
│   │   └── Sidebar.tsx
│   ├── vehicles/
│   │   ├── VehicleList.tsx
│   │   ├── VehicleCard.tsx
│   │   └── VehicleForm.tsx
│   └── maps/
│       ├── MapView.tsx
│       └── VehicleMarker.tsx
├── pages/
│   ├── Dashboard.tsx
│   ├── Login.tsx
│   ├── Vehicles.tsx
│   └── Routes.tsx
├── store/
│   ├── store.ts
│   ├── authSlice.ts
│   ├── vehicleSlice.ts
│   └── routeSlice.ts
├── services/
│   ├── api.ts
│   ├── authService.ts
│   └── vehicleService.ts
├── hooks/
│   ├── useAuth.ts
│   └── useVehicles.ts
├── types/
│   ├── auth.ts
│   ├── vehicle.ts
│   └── route.ts
└── utils/
    ├── constants.ts
    └── helpers.ts
```

#### 3. Configuração do Redux Store

```typescript
// store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import authSlice from './authSlice';
import vehicleSlice from './vehicleSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    vehicles: vehicleSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

```typescript
// store/authSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from '../services/authService';

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

export const loginAsync = createAsyncThunk(
  'auth/login',
  async (credentials: LoginRequest) => {
    const response = await authService.login(credentials);
    return response;
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('token');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem('token', action.payload.token);
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Login failed';
      });
  },
});

export default authSlice.reducer;
```

### Setup do Mobile - React Native

#### 1. Inicialização do Projeto

```bash
npx react-native@latest init FreteInteligenteApp --version 0.72.0
cd FreteInteligenteApp

# Dependencies
npm install @react-navigation/native @react-navigation/stack
npm install react-native-screens react-native-safe-area-context
npm install @reduxjs/toolkit react-redux
npm install axios
npm install react-native-maps
npm install @react-native-async-storage/async-storage
npm install react-native-geolocation-service

# iOS setup (se necessário)
cd ios && pod install && cd ..
```

#### 2. Estrutura de Pastas Mobile

```
src/
├── components/
│   ├── common/
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   └── Loading.tsx
│   ├── vehicle/
│   │   └── VehicleStatus.tsx
│   └── map/
│       └── DriverMap.tsx
├── screens/
│   ├── LoginScreen.tsx
│   ├── DashboardScreen.tsx
│   ├── RouteScreen.tsx
│   └── ProfileScreen.tsx
├── navigation/
│   ├── AppNavigator.tsx
│   ├── AuthNavigator.tsx
│   └── TabNavigator.tsx
├── store/
│   ├── store.ts
│   └── slices/
├── services/
│   ├── api.ts
│   ├── authService.ts
│   ├── locationService.ts
│   └── routeService.ts
├── hooks/
│   ├── useLocation.ts
│   └── useAuth.ts
└── types/
    ├── navigation.ts
    └── api.ts
```

#### 3. Configuração de Navegação

```typescript
// navigation/AppNavigator.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

import AuthNavigator from './AuthNavigator';
import TabNavigator from './TabNavigator';

const Stack = createStackNavigator();

const AppNavigator = () => {
  const { token } = useSelector((state: RootState) => state.auth);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {token ? (
          <Stack.Screen name="Main" component={TabNavigator} />
        ) : (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
```

### Configuração de Deploy

#### Docker Compose para Desenvolvimento

```yaml
version: '3.8'
services:
  # Backend
  app:
    build: .
    ports:
      - "8080:8080"
    environment:
      - SPRING_PROFILES_ACTIVE=docker
      - DATABASE_URL=jdbc:postgresql://db:5432/frete_mvp
      - REDIS_URL=redis://redis:6379
    depends_on:
      - db
      - redis
    volumes:
      - ./logs:/app/logs

  # Database
  db:
    image: postgres:14
    environment:
      - POSTGRES_DB=frete_mvp
      - POSTGRES_USER=frete_user
      - POSTGRES_PASSWORD=frete_password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql

  # Cache
  redis:
    image: redis:6-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  # Frontend
  web:
    build:
      context: ./web
      dockerfile: Dockerfile
    ports:
      - "3000:80"
    depends_on:
      - app

  # Reverse Proxy
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - app
      - web

volumes:
  postgres_data:
  redis_data:
```

## Próximos Passos

1. **Setup do Ambiente**: Configurar todos os pré-requisitos
2. **Backend**: Implementar Spring Boot APIs
3. **Frontend**: Desenvolver React.js dashboard  
4. **Mobile**: Criar React Native app
5. **Integração**: Conectar todos os componentes
6. **Testes**: Implementar testes automatizados
7. **Deploy**: Configurar ambiente de produção

---

**Referências:**
- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [React Documentation](https://reactjs.org/docs)
- [React Native Documentation](https://reactnative.dev/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)