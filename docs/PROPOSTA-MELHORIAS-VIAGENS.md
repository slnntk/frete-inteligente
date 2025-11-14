# 🚀 Proposta de Melhorias: Sistema de Viagens com Mapa e Roteamento

## 📋 Resumo Executivo

Esta proposta visa melhorar significativamente a experiência do usuário no sistema de viagens, implementando:
- ✅ Interface intuitiva para criação de viagens com geocodificação por CEP
- ✅ Sistema de mapa interativo com visualização de passageiros
- ✅ Roteamento otimizado automático
- ✅ Fluxo melhorado de inscrição e check-in

---

## 🎯 Melhorias Propostas

### 1. **Criação de Viagem Melhorada**

#### Backend
- Adicionar campos: `cep`, `enderecoCompleto`, `pontoPartidaLat`, `pontoPartidaLng`
- Endpoint para geocodificação de CEP → coordenadas
- Validação de CEP brasileiro

#### Frontend
- Formulário com busca por CEP (integração ViaCEP)
- Mapa mostrando ponto de partida
- Preview da rota antes de criar

### 2. **Sistema de Mapa**

#### Alternativas ao Google Maps

**Opção 1: Mapbox (Recomendado)**
- ✅ Grátis até 50.000 requisições/mês
- ✅ Muito customizável
- ✅ API de roteamento incluída
- ✅ Boa documentação
- ❌ Requer chave de API

**Opção 2: Leaflet + OpenStreetMap**
- ✅ Totalmente gratuito
- ✅ Open source
- ✅ Sem necessidade de chave
- ✅ Leve e rápido
- ❌ Roteamento requer plugin adicional (OSRM)

**Opção 3: Google Maps**
- ✅ Mais conhecido
- ✅ Excelente qualidade
- ❌ Mais caro após free tier
- ❌ Requer chave de API e billing

**Recomendação: Mapbox** (melhor custo-benefício)

### 3. **Fluxo de Inscrição Melhorado**

#### Cliente/Estudante
1. Visualiza viagens disponíveis no feed
2. Clica em "Ver Detalhes"
3. Vê mapa com rota e pontos de embarque
4. Informa seu CEP/endereço de embarque
5. Sistema calcula se está na rota
6. Confirma inscrição
7. Recebe confirmação com horário e local

### 4. **Sistema de Check-in Inteligente**

#### Melhorias
- Check-in com geolocalização (GPS)
- Validação de proximidade ao ponto de embarque
- Notificação automática quando próximo
- QR Code para check-in rápido (opcional)

### 5. **Visualização no Mapa para Motorista**

#### Funcionalidades
- Ver todos os passageiros marcados no mapa
- Rota otimizada gerada automaticamente
- Ordem de embarque sugerida
- Navegação turn-by-turn
- Atualização em tempo real da posição do veículo

---

## 🗺️ Arquitetura do Sistema de Mapa

### Backend - Novos Endpoints

```
POST /api/geocoding/cep
  - Recebe: { "cep": "60000-000" }
  - Retorna: { "endereco": "...", "latitude": -3.7172, "longitude": -38.5433 }

POST /api/viagens/{id}/calcular-rota
  - Calcula rota otimizada para todos os passageiros
  - Retorna: { "waypoints": [...], "distancia": 15.5, "tempo": 25 }

GET /api/viagens/{id}/rota
  - Retorna rota atual da viagem
```

### Frontend - Componentes

```
components/
  ├── map/
  │   ├── TripMap.tsx          # Mapa principal da viagem
  │   ├── PassengerMarker.tsx  # Marcador de passageiro
  │   ├── RouteDisplay.tsx     # Exibição da rota
  │   └── DriverNavigation.tsx  # Navegação para motorista
  ├── forms/
  │   ├── CreateTripForm.tsx   # Formulário melhorado
  │   └── EnrollTripForm.tsx   # Formulário de inscrição
  └── checkin/
      └── CheckInButton.tsx    # Botão de check-in com GPS
```

---

## 📦 Dependências Necessárias

### Backend
```xml
<!-- Geocodificação -->
<dependency>
    <groupId>com.google.maps</groupId>
    <artifactId>google-maps-services</artifactId>
    <version>2.2.0</version>
</dependency>
```

### Frontend
```json
{
  "dependencies": {
    "react-map-gl": "^7.1.7",        // Mapbox React
    "mapbox-gl": "^3.0.0",            // Mapbox GL JS
    "@mapbox/mapbox-gl-directions": "^4.1.3",  // Roteamento
    "react-geocode": "^0.2.1",        // Geocodificação
    "react-qr-code": "^2.0.12"        // QR Code (opcional)
  }
}
```

---

## 🔄 Fluxo Completo Proposto

### 1. Motorista/Empresa Cria Viagem
```
1. Acessa "Criar Viagem"
2. Seleciona postagem
3. Informa CEP de partida
4. Sistema busca endereço e mostra no mapa
5. Define horário e capacidade
6. Visualiza rota estimada
7. Confirma criação
```

### 2. Cliente se Inscreve
```
1. Vê viagem no feed
2. Clica em "Ver Detalhes"
3. Vê mapa com rota
4. Informa seu CEP
5. Sistema verifica se está na rota
6. Mostra ponto de embarque sugerido
7. Confirma inscrição
```

### 3. Check-in
```
1. Cliente recebe notificação quando próximo
2. Abre app e vê botão "Fazer Check-in"
3. Sistema valida GPS (opcional)
4. Confirma check-in
5. Motorista vê atualização no mapa
```

### 4. Motorista Inicia Viagem
```
1. Vê todos os passageiros no mapa
2. Sistema gera rota otimizada
3. Clica "Iniciar Viagem"
4. Segue rota turn-by-turn
5. Marca passageiros conforme embarcam
```

---

## 🎨 Mockups de Interface

### Tela de Criação de Viagem
- Campo CEP com busca automática
- Mapa mostrando ponto de partida
- Formulário de horário e capacidade
- Preview da rota

### Tela de Detalhes da Viagem (Cliente)
- Mapa com rota completa
- Lista de pontos de embarque
- Botão "Inscrever-se" com CEP
- Informações de horário e preço

### Tela de Gestão (Motorista)
- Mapa com todos os passageiros
- Rota otimizada desenhada
- Lista de passageiros com status
- Botão "Iniciar Navegação"
- Controles de check-in

---

## 🚀 Implementação

### Fase 1: Backend - Geocodificação
- [ ] Endpoint de geocodificação por CEP
- [ ] Integração com ViaCEP
- [ ] Atualizar modelo Viagem com campos de localização

### Fase 2: Frontend - Mapa Básico
- [ ] Instalar Mapbox
- [ ] Componente de mapa básico
- [ ] Exibir ponto de partida

### Fase 3: Roteamento
- [ ] Integrar API de roteamento
- [ ] Calcular rota otimizada
- [ ] Exibir rota no mapa

### Fase 4: Inscrição Melhorada
- [ ] Formulário com CEP
- [ ] Validação de rota
- [ ] Preview antes de confirmar

### Fase 5: Check-in com GPS
- [ ] Geolocalização do navegador
- [ ] Validação de proximidade
- [ ] Atualização em tempo real

---

## 📊 Benefícios Esperados

1. **Melhor UX**: Interface mais intuitiva e visual
2. **Precisão**: Localização exata via CEP
3. **Eficiência**: Roteamento automático otimizado
4. **Transparência**: Cliente vê exatamente onde embarcar
5. **Automação**: Menos trabalho manual para motorista

---

## 🔐 Considerações de Segurança

- Validar CEP no backend
- Rate limiting na API de geocodificação
- Não expor chaves de API no frontend
- Validar coordenadas recebidas
- Sanitizar endereços

---

## 💰 Custos Estimados

### Mapbox
- Free tier: 50k requisições/mês
- Após: $0.50 por 1k requisições

### Google Maps
- Free tier: $200 créditos/mês
- Após: $5-7 por 1k requisições

### Leaflet + OSRM
- Totalmente gratuito
- Self-hosted ou público

---

## ✅ Próximos Passos

1. Aprovar proposta
2. Escolher provedor de mapa (recomendado: Mapbox)
3. Criar chave de API
4. Implementar Fase 1 (Backend)
5. Implementar Fase 2 (Frontend básico)
6. Testes e ajustes
7. Deploy gradual

