// Utilitário para testar conexão com a API

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export async function testApiConnection(): Promise<{ success: boolean; message: string }> {
  try {
    console.log(`[Test API] Testando conexão com: ${API_URL}`);
    
    const response = await fetch(`${API_URL}/test/status`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      return { success: true, message: 'Conexão estabelecida com sucesso!' };
    } else {
      return { 
        success: false, 
        message: `Backend respondeu com status ${response.status}` 
      };
    }
  } catch (error) {
    console.error('[Test API] Erro:', error);
    
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return { 
        success: false, 
        message: 'Não foi possível conectar ao backend. Verifique se está rodando em http://localhost:8080' 
      };
    }
    
    return { 
      success: false, 
      message: `Erro: ${error instanceof Error ? error.message : 'Erro desconhecido'}` 
    };
  }
}

export function getApiUrl(): string {
  return API_URL;
}

