// Utilitário para verificar se o backend está acessível

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export async function checkBackendStatus(): Promise<{
  online: boolean;
  message: string;
  url: string;
}> {
  const url = `${API_URL}/test/status`;
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 segundos timeout
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    
    if (response.ok) {
      return {
        online: true,
        message: 'Backend está online e funcionando!',
        url: API_URL,
      };
    } else {
      return {
        online: false,
        message: `Backend respondeu com erro ${response.status}`,
        url: API_URL,
      };
    }
  } catch (error: any) {
    if (error.name === 'AbortError') {
      return {
        online: false,
        message: 'Timeout: O backend não respondeu em 5 segundos',
        url: API_URL,
      };
    }
    
    return {
      online: false,
      message: 'Não foi possível conectar ao backend. Verifique se está rodando.',
      url: API_URL,
    };
  }
}

