import { apiClient } from '@/lib/api-client';

export interface AutonomoDTO {
  id?: number;
  nome: string;
  email: string;
  cpf: string;
  telefone: string;
  senha?: string;
  cnh: string;
  categoriaCnh: string;
  ear?: boolean;
}

export const autonomoService = {
  listarTodos: async (): Promise<AutonomoDTO[]> => {
    return apiClient.get<AutonomoDTO[]>('/autonomos');
  },

  buscarPorId: async (id: number): Promise<AutonomoDTO> => {
    return apiClient.get<AutonomoDTO>(`/autonomos/${id}`);
  },

  criar: async (autonomo: AutonomoDTO): Promise<AutonomoDTO> => {
    return apiClient.post<AutonomoDTO>('/autonomos', autonomo);
  },

  atualizar: async (id: number, autonomo: AutonomoDTO): Promise<AutonomoDTO> => {
    return apiClient.put<AutonomoDTO>(`/autonomos/${id}`, autonomo);
  },

  deletar: async (id: number): Promise<void> => {
    await apiClient.delete<void>(`/autonomos/${id}`);
  },
};

