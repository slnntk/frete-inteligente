// API client for backend integration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export interface Usuario {
  id?: number;
  tipo: 'EMPRESA' | 'AUTONOMO' | 'CLIENTE';
  nome: string;
  email: string;
  cpf: string;
  telefone: string;
  senhaHash: string;
}

export interface Postagem {
  id?: number;
  autor: {
    id: number;
  };
  titulo: string;
  regiao: string;
  descricao: string;
  preco: number;
}

export interface Viagem {
  id?: number;
  postagem: {
    id: number;
  };
  horarioPartida: string;
  destino: string;
  capacidade: number;
  status: 'ABERTA' | 'FECHADA' | 'EM_ANDAMENTO' | 'CONCLUIDA';
}

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Handle 204 No Content
      if (response.status === 204) {
        return null as T;
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Usuario endpoints
  async getUsuarios(): Promise<Usuario[]> {
    return this.request<Usuario[]>('/api/usuarios');
  }

  async getUsuario(id: number): Promise<Usuario> {
    return this.request<Usuario>(`/api/usuarios/${id}`);
  }

  async createUsuario(usuario: Usuario): Promise<Usuario> {
    return this.request<Usuario>('/api/usuarios', {
      method: 'POST',
      body: JSON.stringify(usuario),
    });
  }

  async updateUsuario(id: number, usuario: Usuario): Promise<Usuario> {
    return this.request<Usuario>(`/api/usuarios/${id}`, {
      method: 'PUT',
      body: JSON.stringify(usuario),
    });
  }

  async deleteUsuario(id: number): Promise<void> {
    return this.request<void>(`/api/usuarios/${id}`, {
      method: 'DELETE',
    });
  }

  async getUsuariosByTipo(tipo: string): Promise<Usuario[]> {
    return this.request<Usuario[]>(`/api/usuarios/tipo/${tipo}`);
  }

  // Postagem endpoints
  async getPostagens(): Promise<Postagem[]> {
    return this.request<Postagem[]>('/api/postagens');
  }

  async getPostagem(id: number): Promise<Postagem> {
    return this.request<Postagem>(`/api/postagens/${id}`);
  }

  async createPostagem(postagem: Postagem): Promise<Postagem> {
    return this.request<Postagem>('/api/postagens', {
      method: 'POST',
      body: JSON.stringify(postagem),
    });
  }

  async updatePostagem(id: number, postagem: Postagem): Promise<Postagem> {
    return this.request<Postagem>(`/api/postagens/${id}`, {
      method: 'PUT',
      body: JSON.stringify(postagem),
    });
  }

  async deletePostagem(id: number): Promise<void> {
    return this.request<void>(`/api/postagens/${id}`, {
      method: 'DELETE',
    });
  }

  async getPostagensByAutor(autorId: number): Promise<Postagem[]> {
    return this.request<Postagem[]>(`/api/postagens/autor/${autorId}`);
  }

  // Viagem endpoints
  async getViagens(): Promise<Viagem[]> {
    return this.request<Viagem[]>('/api/viagens');
  }

  async getViagem(id: number): Promise<Viagem> {
    return this.request<Viagem>(`/api/viagens/${id}`);
  }

  async createViagem(viagem: Viagem): Promise<Viagem> {
    return this.request<Viagem>('/api/viagens', {
      method: 'POST',
      body: JSON.stringify(viagem),
    });
  }

  // Test endpoints
  async createDadosExemplo(): Promise<any> {
    return this.request<any>('/api/test/dados-exemplo', {
      method: 'POST',
    });
  }

  async getStatus(): Promise<any> {
    return this.request<any>('/api/test/status');
  }
}

// Export a singleton instance
export const api = new ApiClient();
