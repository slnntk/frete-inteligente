# 🗺️ Guia de Implementação: Sistema de Mapa e Roteamento

## ✅ O que já foi implementado (Backend)

1. **GeocodingController** - Busca de endereço por CEP (ViaCEP)
2. **RotaController** - Cálculo de rota otimizada
3. **Campos adicionados em Viagem**:
   - `cepPartida`
   - `enderecoPartida`
   - `latitudePartida`
   - `longitudePartida`

## 📦 Próximos Passos - Frontend

### 1. Instalar Dependências

```bash
cd transport-app
npm install react-map-gl mapbox-gl @mapbox/mapbox-gl-directions
```

### 2. Configurar Variáveis de Ambiente

Criar/atualizar `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
NEXT_PUBLIC_MAPBOX_TOKEN=seu_token_aqui
```

**Como obter token do Mapbox:**
1. Acesse https://account.mapbox.com/
2. Crie uma conta gratuita
3. Vá em "Access tokens"
4. Copie o token padrão

### 3. Criar Serviços

#### `services/geocoding.service.ts`
```typescript
import { apiClient } from '@/lib/api-client';

export const geocodingService = {
  buscarPorCep: async (cep: string) => {
    return apiClient.get(`/geocoding/cep/${cep}`);
  },
  
  geocodificarEndereco: async (endereco: string) => {
    return apiClient.post('/geocoding/geocode', { endereco });
  }
};
```

#### `services/rota.service.ts`
```typescript
import { apiClient } from '@/lib/api-client';

export const rotaService = {
  calcularRota: async (viagemId: number) => {
    return apiClient.get(`/viagens/${viagemId}/rota`);
  }
};
```

### 4. Criar Componentes de Mapa

#### `components/map/TripMap.tsx`
- Mapa principal com Mapbox
- Exibe ponto de partida
- Exibe passageiros como marcadores
- Desenha rota otimizada

#### `components/map/PassengerMarker.tsx`
- Marcador customizado para passageiros
- Mostra nome e status de check-in
- Cores diferentes para check-in feito/pendente

#### `components/forms/CreateTripForm.tsx`
- Formulário melhorado com campo CEP
- Busca automática de endereço
- Preview do mapa antes de criar

### 5. Atualizar Páginas

#### `app/viagens/[id]/page.tsx`
- Integrar componente TripMap
- Mostrar rota otimizada
- Atualização em tempo real

## 🎯 Fluxo Completo

### Motorista cria viagem:
1. Preenche CEP → sistema busca endereço
2. Mapa mostra localização
3. Define horário e capacidade
4. Visualiza rota estimada
5. Confirma criação

### Cliente se inscreve:
1. Vê viagem no feed
2. Clica "Ver Detalhes"
3. Vê mapa com rota
4. Informa seu CEP
5. Sistema verifica se está na rota
6. Confirma inscrição

### Check-in:
1. Cliente recebe notificação
2. Abre app → botão "Fazer Check-in"
3. Sistema valida GPS (opcional)
4. Confirma check-in
5. Motorista vê atualização no mapa

### Motorista inicia viagem:
1. Vê todos passageiros no mapa
2. Sistema gera rota otimizada
3. Clica "Iniciar Viagem"
4. Segue rota turn-by-turn
5. Marca passageiros conforme embarcam

## 🔧 Alternativas ao Mapbox

### Opção 1: Leaflet + OpenStreetMap (Gratuito)
```bash
npm install leaflet react-leaflet
npm install --save-dev @types/leaflet
```

### Opção 2: Google Maps
```bash
npm install @react-google-maps/api
```

## 📝 Checklist de Implementação

- [ ] Instalar dependências do mapa
- [ ] Configurar token do Mapbox
- [ ] Criar serviço de geocodificação
- [ ] Criar serviço de rota
- [ ] Criar componente TripMap
- [ ] Criar componente PassengerMarker
- [ ] Atualizar formulário de criação de viagem
- [ ] Atualizar página de gestão de viagem
- [ ] Implementar check-in com GPS
- [ ] Testar fluxo completo
- [ ] Adicionar tratamento de erros
- [ ] Otimizar performance do mapa

## 🚀 Exemplo de Uso do Mapbox

```tsx
'use client'
import { useState } from 'react'
import Map, { Marker, Source, Layer } from 'react-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

export function TripMap({ waypoints, route }) {
  const [viewState, setViewState] = useState({
    longitude: -38.5433,
    latitude: -3.7172,
    zoom: 12
  })

  return (
    <Map
      {...viewState}
      onMove={evt => setViewState(evt.viewState)}
      mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
      style={{ width: '100%', height: 400 }}
      mapStyle="mapbox://styles/mapbox/streets-v12"
    >
      {waypoints.map((point, i) => (
        <Marker
          key={i}
          longitude={point.longitude}
          latitude={point.latitude}
        >
          <div className="bg-blue-500 text-white px-2 py-1 rounded">
            {point.nome}
          </div>
        </Marker>
      ))}
      
      {route && (
        <Source id="route" type="geojson" data={route}>
          <Layer
            id="route"
            type="line"
            paint={{
              'line-color': '#3b82f6',
              'line-width': 4
            }}
          />
        </Source>
      )}
    </Map>
  )
}
```

## 💡 Dicas

1. **Performance**: Use `useMemo` para cálculos de rota
2. **Cache**: Cache resultados de geocodificação
3. **Erros**: Trate erros de API graciosamente
4. **Mobile**: Teste em dispositivos móveis
5. **Offline**: Considere cache de mapas para offline

## 📚 Recursos

- [Mapbox GL JS Docs](https://docs.mapbox.com/mapbox-gl-js/)
- [React Map GL](https://visgl.github.io/react-map-gl/)
- [ViaCEP API](https://viacep.com.br/)
- [Leaflet Docs](https://leafletjs.com/)

