import { apiClient } from '@/lib/api-client';

export interface CepResult {
  cep: string;
  endereco: string;
  logradouro: string;
  bairro: string;
  cidade: string;
  estado: string;
  ibge?: string;
  latitude?: number;
  longitude?: number;
}

export interface GeocodingRequest {
  endereco: string;
}

export interface GeocodingResponse {
  endereco: string;
  latitude: number | null;
  longitude: number | null;
  mensagem?: string;
}

export const geocodingService = {
  // Busca endereço por CEP usando ViaCEP (via backend)
  buscarPorCep: async (cep: string): Promise<CepResult> => {
    return apiClient.get<CepResult>(`/geocoding/cep/${cep}`);
  },

  // Geocodifica um endereço completo (requer API externa configurada)
  geocodificarEndereco: async (endereco: string): Promise<GeocodingResponse> => {
    return apiClient.post<GeocodingResponse>('/geocoding/geocode', { endereco });
  },

  // Busca coordenadas usando OpenStreetMap Nominatim (fallback)
  buscarCoordenadas: async (endereco: string): Promise<{ latitude: number; longitude: number } | null> => {
    try {
      const encodedAddress = encodeURIComponent(endereco);
      const url = `https://nominatim.openstreetmap.org/search?q=${encodedAddress}&format=json&limit=1`;
      
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'TransportApp/1.0'
        }
      });
      
      if (!response.ok) {
        throw new Error('Erro ao buscar coordenadas');
      }
      
      const data = await response.json();
      
      if (data && data.length > 0) {
        return {
          latitude: parseFloat(data[0].lat),
          longitude: parseFloat(data[0].lon)
        };
      }
      
      return null;
    } catch (error) {
      console.error('Erro na geocodificação:', error);
      return null;
    }
  },
};

