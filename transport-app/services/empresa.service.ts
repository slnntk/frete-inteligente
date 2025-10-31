import { apiClient } from '@/lib/api-client';

export interface EmpresaDTO {
  id?: number;
  nome: string;
  email: string;
  telefone: string;
  senha?: string;
  cnpj: string;
  razaoSocial: string;
}

export const empresaService = {
  listarTodos: async (): Promise<EmpresaDTO[]> => {
    return apiClient.get<EmpresaDTO[]>('/empresas');
  },

  buscarPorId: async (id: number): Promise<EmpresaDTO> => {
    return apiClient.get<EmpresaDTO>(`/empresas/${id}`);
  },

  criar: async (empresa: EmpresaDTO): Promise<EmpresaDTO> => {
    return apiClient.post<EmpresaDTO>('/empresas', empresa);
  },

  atualizar: async (id: number, empresa: EmpresaDTO): Promise<EmpresaDTO> => {
    return apiClient.put<EmpresaDTO>(`/empresas/${id}`, empresa);
  },

  deletar: async (id: number): Promise<void> => {
    await apiClient.delete<void>(`/empresas/${id}`);
  },
};

