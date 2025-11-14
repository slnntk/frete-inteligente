import { apiClient } from '@/lib/api-client';

export interface InscricaoDTO {
  id?: number;
  viagem: { id: number };
  cliente: { id: number };
  status?: string;
}

export const inscricaoService = {
  criar: async (
    viagemId: number, 
    clienteId: number,
    localizacao?: { endereco?: string; latitude?: number; longitude?: number }
  ): Promise<InscricaoDTO> => {
    const payload: any = {
      viagemId: viagemId,
      clienteId: clienteId,
    };
    
    // A localização será atualizada no perfil do cliente se fornecida
    // Por enquanto, apenas criamos a inscrição
    // TODO: Atualizar perfil do cliente com localização se fornecida
    
    return apiClient.post<InscricaoDTO>('/inscricoes', payload);
  },

  listarPorCliente: async (clienteId: number): Promise<InscricaoDTO[]> => {
    return apiClient.get<InscricaoDTO[]>(`/inscricoes/cliente/${clienteId}`);
  },

  listarPorViagem: async (viagemId: number): Promise<InscricaoDTO[]> => {
    return apiClient.get<InscricaoDTO[]>(`/inscricoes/viagem/${viagemId}`);
  },
};


