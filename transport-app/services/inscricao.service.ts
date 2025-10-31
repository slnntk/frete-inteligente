import { apiClient } from '@/lib/api-client';

export interface InscricaoDTO {
  id?: number;
  viagem: { id: number };
  cliente: { id: number };
  status?: string;
}

export const inscricaoService = {
  criar: async (viagemId: number, clienteId: number): Promise<InscricaoDTO> => {
    const payload: InscricaoDTO = {
      viagem: { id: viagemId },
      cliente: { id: clienteId },
    };
    return apiClient.post<InscricaoDTO>('/inscricoes', payload);
  },

  listarPorCliente: async (clienteId: number): Promise<InscricaoDTO[]> => {
    return apiClient.get<InscricaoDTO[]>(`/inscricoes/cliente/${clienteId}`);
  },

  listarPorViagem: async (viagemId: number): Promise<InscricaoDTO[]> => {
    return apiClient.get<InscricaoDTO[]>(`/inscricoes/viagem/${viagemId}`);
  },
};


