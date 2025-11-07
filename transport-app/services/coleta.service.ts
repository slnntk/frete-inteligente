import { apiClient } from '@/lib/api-client';

export interface Coleta {
  id?: number;
  viagem: { id: number };
  cliente: { id: number };
  coletadoEm?: string;
  latitude?: number;
  longitude?: number;
}

export const coletaService = {
  // Listar todas as coletas
  listar: async (): Promise<Coleta[]> => {
    return apiClient.get<Coleta[]>('/coletas');
  },

  // Buscar coleta por ID
  buscarPorId: async (id: number): Promise<Coleta> => {
    return apiClient.get<Coleta>(`/coletas/${id}`);
  },

  // Criar nova coleta
  criar: async (
    viagemId: number,
    clienteId: number,
    latitude?: number,
    longitude?: number
  ): Promise<Coleta> => {
    const payload: any = {
      viagemId: viagemId,
      clienteId: clienteId
    };
    
    // Adicionar coordenadas apenas se ambas estiverem definidas
    if (latitude !== undefined && longitude !== undefined && latitude !== null && longitude !== null) {
      payload.latitude = latitude;
      payload.longitude = longitude;
    }
    
    console.log('[ColetaService] Criando coleta com payload:', payload);
    
    try {
      const result = await apiClient.post<Coleta>('/coletas', payload);
      console.log('[ColetaService] Coleta criada com sucesso:', result);
      return result;
    } catch (error: any) {
      console.error('[ColetaService] Erro ao criar coleta:', error);
      console.error('[ColetaService] Payload enviado:', JSON.stringify(payload, null, 2));
      throw error;
    }
  },

  // Deletar coleta
  deletar: async (id: number): Promise<void> => {
    return apiClient.delete<void>(`/coletas/${id}`);
  },

  // Buscar coletas por viagem
  buscarPorViagem: async (viagemId: number): Promise<Coleta[]> => {
    return apiClient.get<Coleta[]>(`/coletas/viagem/${viagemId}`);
  },

  // Buscar coletas por cliente
  buscarPorCliente: async (clienteId: number): Promise<Coleta[]> => {
    return apiClient.get<Coleta[]>(`/coletas/cliente/${clienteId}`);
  },
};

