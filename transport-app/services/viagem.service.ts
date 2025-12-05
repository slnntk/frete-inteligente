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
    const payload: any = {
      postagemId: data.postagemId,
      horarioPartida: data.horarioPartida,
      ...(data.destino && { destino: data.destino }),
      ...(data.cepPartida && { cepPartida: data.cepPartida }),
      ...(data.enderecoPartida && { enderecoPartida: data.enderecoPartida }),
      ...(data.latitudePartida && { latitudePartida: data.latitudePartida }),
      ...(data.longitudePartida && { longitudePartida: data.longitudePartida }),
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
    // Se apenas o status está sendo atualizado, usar o endpoint específico
    if (data.status && Object.keys(data).length === 1) {
      return apiClient.put<Viagem>(`/viagens/${id}/status`, data.status);
    }
    
    // Buscar viagem atual primeiro para preservar campos não fornecidos
    const viagemAtual = await apiClient.get<Viagem>(`/viagens/${id}`)
    
    // Construir payload no formato esperado pelo backend (ViagemRequestDTO)
    const payload: any = {
      postagemId: viagemAtual.postagem.id, // Usar postagemId ao invés de objeto aninhado
      horarioPartida: data.horarioPartida || viagemAtual.horarioPartida,
      destino: data.destino !== undefined ? data.destino : viagemAtual.destino,
      cepPartida: data.cepPartida || viagemAtual.cepPartida,
      enderecoPartida: data.enderecoPartida || viagemAtual.enderecoPartida,
      latitudePartida: data.latitudePartida !== undefined ? data.latitudePartida : viagemAtual.latitudePartida,
      longitudePartida: data.longitudePartida !== undefined ? data.longitudePartida : viagemAtual.longitudePartida,
      capacidade: data.capacidade !== undefined ? data.capacidade : viagemAtual.capacidade,
      status: data.status || viagemAtual.status,
    };

    if (data.veiculoId) {
      payload.veiculoId = data.veiculoId;
    } else if (viagemAtual.veiculo) {
      payload.veiculoId = viagemAtual.veiculo.id;
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
  listarParticipantes: async (viagemId: number): Promise<Array<{ id: number; nome: string; email: string; telefone: string; checkedIn: boolean; coletado: boolean; endereco?: string; latitude?: number; longitude?: number }>> => {
    return apiClient.get(`/viagens/${viagemId}/participantes`);
  },
};

