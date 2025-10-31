import { apiClient } from '@/lib/api-client';

export interface ClienteDTO {
  id?: number;
  nome: string;
  email: string;
  cpf: string;
  telefone: string;
  senha?: string;
  matricula?: string;
  instituicao?: string;
  curso?: string;
}

export const clienteService = {
  listarTodos: async (): Promise<ClienteDTO[]> => {
    return apiClient.get<ClienteDTO[]>('/clientes');
  },

  buscarPorId: async (id: number): Promise<ClienteDTO> => {
    return apiClient.get<ClienteDTO>(`/clientes/${id}`);
  },

  criar: async (cliente: ClienteDTO): Promise<ClienteDTO> => {
    return apiClient.post<ClienteDTO>('/clientes', cliente);
  },

  atualizar: async (id: number, cliente: ClienteDTO): Promise<ClienteDTO> => {
    return apiClient.put<ClienteDTO>(`/clientes/${id}`, cliente);
  },

  deletar: async (id: number): Promise<void> => {
    await apiClient.delete<void>(`/clientes/${id}`);
  },
};

