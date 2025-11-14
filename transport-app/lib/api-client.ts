// Cliente HTTP para comunicação com o backend

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorMessage = 'Erro desconhecido';
    
    try {
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || JSON.stringify(errorData);
      } else {
        errorMessage = await response.text() || `Erro ${response.status}: ${response.statusText}`;
      }
    } catch (e) {
      errorMessage = `Erro ${response.status}: ${response.statusText || 'Requisição falhou'}`;
    }
    
    console.error(`[API Error] ${response.status} - ${errorMessage}`);
    throw new ApiError(response.status, errorMessage);
  }

  // Para status 204 (No Content), retornar null
  if (response.status === 204) {
    return null as T;
  }

  try {
    return await response.json();
  } catch (e) {
    console.error('[API Error] Falha ao parsear JSON:', e);
    throw new ApiError(response.status, 'Resposta inválida do servidor');
  }
}

async function fetchWithErrorHandling<T>(
  url: string,
  options: RequestInit
): Promise<T> {
  try {
    console.log(`[API Request] ${options.method || 'GET'} ${url}`);
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers,
      },
    });
    
    return await handleResponse<T>(response);
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    
    // Erro de rede ou conexão
    if (error instanceof TypeError && error.message.includes('fetch')) {
      console.error('[API Error] Erro de conexão:', error);
      throw new ApiError(
        0,
        'Não foi possível conectar ao servidor. Verifique se o backend está rodando em http://localhost:8080'
      );
    }
    
    console.error('[API Error] Erro desconhecido:', error);
    throw new ApiError(0, error instanceof Error ? error.message : 'Erro desconhecido');
  }
}

export const apiClient = {
  get: async <T>(endpoint: string): Promise<T> => {
    return fetchWithErrorHandling<T>(`${API_URL}${endpoint}`, {
      method: 'GET',
    });
  },

  post: async <T>(endpoint: string, data?: unknown): Promise<T> => {
    return fetchWithErrorHandling<T>(`${API_URL}${endpoint}`, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  },

  put: async <T>(endpoint: string, data: unknown): Promise<T> => {
    return fetchWithErrorHandling<T>(`${API_URL}${endpoint}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async <T>(endpoint: string): Promise<T> => {
    return fetchWithErrorHandling<T>(`${API_URL}${endpoint}`, {
      method: 'DELETE',
    });
  },
};

