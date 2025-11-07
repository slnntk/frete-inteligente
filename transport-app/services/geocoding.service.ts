// Serviço de geocodificação usando OpenStreetMap Nominatim
// Documentação: https://nominatim.org/release-docs/develop/api/Search/

export interface GeocodingResult {
  lat: string;
  lon: string;
  display_name: string;
}

export const geocodingService = {
  // Busca coordenadas (latitude, longitude) a partir de um endereço
  buscarCoordenadas: async (endereco: string): Promise<{ latitude: number; longitude: number } | null> => {
    try {
      const encodedAddress = encodeURIComponent(endereco);
      const url = `https://nominatim.openstreetmap.org/search?q=${encodedAddress}&format=json&limit=1`;
      
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'TransportApp/1.0' // Nominatim requer User-Agent
        }
      });
      
      if (!response.ok) {
        throw new Error('Erro ao buscar coordenadas');
      }
      
      const data: GeocodingResult[] = await response.json();
      
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

