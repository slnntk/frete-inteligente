import { apiClient } from "@/lib/api-client"

export interface PagamentoResponse {
  id: number
  viagemId: number
  usuarioId: number
  valor: number
  status: "PENDENTE" | "PAGO" | "FALHOU"
  metodo: string
  referencia?: string
  criadoEm: string
}

export interface PagamentoRequest {
  viagemId: number
  usuarioId: number
  valor: number
  metodo?: string
  referencia?: string
}

export const pagamentoService = {
  async criar(dto: PagamentoRequest): Promise<PagamentoResponse> {
    const response = await apiClient.post("/pagamentos", dto)
    return response.data
  },

  async confirmarPagamento(pagamentoId: number): Promise<PagamentoResponse> {
    const response = await apiClient.post(`/pagamentos/${pagamentoId}/confirmar`)
    return response.data
  },

  async buscarPorViagemEUsuario(viagemId: number, usuarioId: number): Promise<PagamentoResponse | null> {
    try {
      const response = await apiClient.get(`/pagamentos/viagem/${viagemId}/usuario/${usuarioId}`)
      return response.data
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null
      }
      throw error
    }
  },

  async buscarPorViagem(viagemId: number): Promise<PagamentoResponse[]> {
    const response = await apiClient.get(`/pagamentos/viagem/${viagemId}`)
    return response.data
  }
}

