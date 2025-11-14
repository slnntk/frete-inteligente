import { apiClient } from '@/lib/api-client';
import type { Checkin } from '@/types';

export const checkinService = {
  // Listar todos os check-ins
  listar: async (): Promise<Checkin[]> => {
    return apiClient.get<Checkin[]>('/checkins');
  },

  // Buscar check-in por ID
  buscarPorId: async (id: number): Promise<Checkin> => {
    return apiClient.get<Checkin>(`/checkins/${id}`);
  },

  // Criar novo check-in
  criar: async (
    viagemId: number, 
    clienteId: number, 
    latitude?: number, 
    longitude?: number
  ): Promise<Checkin> => {
    const payload: any = {
      viagemId: viagemId,
      clienteId: clienteId,
    };
    
    if (latitude !== undefined && longitude !== undefined && latitude !== null && longitude !== null) {
      payload.latitude = latitude;
      payload.longitude = longitude;
    }
    
    return apiClient.post<Checkin>('/checkins', payload);
  },

  // Deletar check-in
  deletar: async (id: number): Promise<void> => {
    return apiClient.delete<void>(`/checkins/${id}`);
  },

  // Buscar check-ins por viagem
  buscarPorViagem: async (viagemId: number): Promise<Checkin[]> => {
    return apiClient.get<Checkin[]>(`/checkins/viagem/${viagemId}`);
  },

  // Buscar check-ins por cliente
  buscarPorCliente: async (clienteId: number): Promise<Checkin[]> => {
    return apiClient.get<Checkin[]>(`/checkins/cliente/${clienteId}`);
  },
};

