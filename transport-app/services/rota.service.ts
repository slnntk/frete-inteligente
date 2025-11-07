import { apiClient } from '@/lib/api-client';

export interface Waypoint {
  id: number;
  nome: string;
  endereco?: string;
  latitude: number;
  longitude: number;
}

export interface PontoPartida {
  latitude: number;
  longitude: number;
  endereco?: string;
}

export interface RotaReal {
  coordinates: Array<[number, number]>; // [lng, lat]
  distance: number; // em metros
  duration: number; // em segundos
}

export interface RotaResponse {
  pontoPartida: PontoPartida;
  waypoints: Waypoint[];
  totalPontos: number;
  distanciaEstimada: number;
  rotaReal?: RotaReal; // Rota real seguindo as ruas (quando disponível)
}

export const rotaService = {
  // Calcula rota otimizada para uma viagem
  calcularRota: async (viagemId: number): Promise<RotaResponse> => {
    return apiClient.get<RotaResponse>(`/viagens/${viagemId}/rota`);
  },
};

