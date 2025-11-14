import { apiClient } from '@/lib/api-client';
import type { Usuario, UsuarioTipo, CreateUsuarioRequest, LoginRequest, LoginResponse } from '@/types';

export const usuarioService = {
  // Listar todos os usuários
  listar: async (): Promise<Usuario[]> => {
    return apiClient.get<Usuario[]>('/usuarios');
  },

  // Buscar usuário por ID
  buscarPorId: async (id: number): Promise<Usuario> => {
    return apiClient.get<Usuario>(`/usuarios/${id}`);
  },

  // Criar novo usuário (registro)
  criar: async (data: CreateUsuarioRequest): Promise<Usuario> => {
    return apiClient.post<Usuario>('/usuarios', data);
  },

  // Atualizar usuário
  atualizar: async (id: number, data: Partial<Usuario>): Promise<Usuario> => {
    return apiClient.put<Usuario>(`/usuarios/${id}`, data);
  },

  // Deletar usuário
  deletar: async (id: number): Promise<void> => {
    return apiClient.delete<void>(`/usuarios/${id}`);
  },

  // Buscar usuários por tipo
  buscarPorTipo: async (tipo: UsuarioTipo): Promise<Usuario[]> => {
    return apiClient.get<Usuario[]>(`/usuarios/tipo/${tipo}`);
  },

  // Login - autenticar usuário
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    return apiClient.post<LoginResponse>('/auth/login', data);
  },
};

