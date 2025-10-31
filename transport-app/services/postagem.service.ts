import { apiClient } from '@/lib/api-client';
import type { Postagem, CreatePostagemRequest } from '@/types';

export const postagemService = {
  // Listar todas as postagens
  listar: async (): Promise<Postagem[]> => {
    return apiClient.get<Postagem[]>('/postagens');
  },

  // Buscar postagem por ID
  buscarPorId: async (id: number): Promise<Postagem> => {
    return apiClient.get<Postagem>(`/postagens/${id}`);
  },

  // Criar nova postagem
  criar: async (data: CreatePostagemRequest): Promise<Postagem> => {
    const payload = {
      autor: { id: data.autorId },
      titulo: data.titulo,
      regiao: data.regiao,
      descricao: data.descricao,
      preco: data.preco,
    };
    return apiClient.post<Postagem>('/postagens', payload);
  },

  // Atualizar postagem
  atualizar: async (id: number, data: Partial<CreatePostagemRequest>): Promise<Postagem> => {
    const payload: Partial<Postagem> = {
      ...(data.titulo && { titulo: data.titulo }),
      ...(data.regiao && { regiao: data.regiao }),
      ...(data.descricao && { descricao: data.descricao }),
      ...(data.preco !== undefined && { preco: data.preco }),
      ...(data.autorId && { autor: { id: data.autorId } }),
    };
    return apiClient.put<Postagem>(`/postagens/${id}`, payload);
  },

  // Deletar postagem
  deletar: async (id: number): Promise<void> => {
    return apiClient.delete<void>(`/postagens/${id}`);
  },

  // Buscar postagens por autor
  buscarPorAutor: async (autorId: number): Promise<Postagem[]> => {
    return apiClient.get<Postagem[]>(`/postagens/autor/${autorId}`);
  },
};

