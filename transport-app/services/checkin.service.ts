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
  criar: async (viagemId: number, clienteId: number): Promise<Checkin> => {
    const payload = {
      viagem: { id: viagemId },
      cliente: { id: clienteId },
    };
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

