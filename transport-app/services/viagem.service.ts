import { apiClient } from '@/lib/api-client';
import type { Viagem, ViagemStatus, CreateViagemRequest } from '@/types';

export const viagemService = {
  // Listar todas as viagens
  listar: async (): Promise<Viagem[]> => {
    return apiClient.get<Viagem[]>('/viagens');
  },

  // Buscar viagem por ID
  buscarPorId: async (id: number): Promise<Viagem> => {
    return apiClient.get<Viagem>(`/viagens/${id}`);
  },

  // Criar nova viagem
  criar: async (data: CreateViagemRequest): Promise<Viagem> => {
    const payload: Partial<Viagem> = {
      postagem: { id: data.postagemId },
      horarioPartida: data.horarioPartida,
      ...(data.destino && { destino: data.destino }),
      capacidade: data.capacidade,
      status: data.status,
    };
    
    if (data.veiculoId) {
      payload.veiculo = { id: data.veiculoId };
    }

    // suporte opcional para múltiplos destinos
    // @ts-ignore - propriedade extra opcional
    if ((data as any).destinos) {
      // @ts-ignore
      payload.destinos = (data as any).destinos as string[];
    }

    return apiClient.post<Viagem>('/viagens', payload);
  },

  // Atualizar viagem
  atualizar: async (id: number, data: Partial<CreateViagemRequest>): Promise<Viagem> => {
    const payload: Partial<Viagem> = {
      ...(data.horarioPartida && { horarioPartida: data.horarioPartida }),
      ...(data.destino && { destino: data.destino }),
      ...(data.capacidade !== undefined && { capacidade: data.capacidade }),
      ...(data.status && { status: data.status }),
      ...(data.postagemId && { postagem: { id: data.postagemId } }),
    };

    if (data.veiculoId) {
      payload.veiculo = { id: data.veiculoId };
    }

    return apiClient.put<Viagem>(`/viagens/${id}`, payload);
  },

  // Deletar viagem
  deletar: async (id: number): Promise<void> => {
    return apiClient.delete<void>(`/viagens/${id}`);
  },

  // Buscar viagens por status
  buscarPorStatus: async (status: ViagemStatus): Promise<Viagem[]> => {
    return apiClient.get<Viagem[]>(`/viagens/status/${status}`);
  },

  // Buscar viagens por postagem
  buscarPorPostagem: async (postagemId: number): Promise<Viagem[]> => {
    return apiClient.get<Viagem[]>(`/viagens/postagem/${postagemId}`);
  },

  // Participantes (apenas para gestão)
  listarParticipantes: async (viagemId: number): Promise<Array<{ id: number; nome: string; email: string; telefone: string; checkedIn: boolean; endereco?: string; latitude?: number; longitude?: number }>> => {
    return apiClient.get(`/viagens/${viagemId}/participantes`);
  },
};

