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
    return apiClient.post("/pagamentos", dto)
  },

  async confirmarPagamento(pagamentoId: number): Promise<PagamentoResponse> {
    console.log(`[PagamentoService] Confirmando pagamento ${pagamentoId}`)
    const response = await apiClient.post<PagamentoResponse>(`/pagamentos/${pagamentoId}/confirmar`)
    console.log(`[PagamentoService] Resposta confirmação:`, response)
    return response
  },

  async buscarPorViagemEUsuario(viagemId: number, usuarioId: number): Promise<PagamentoResponse | null> {
    try {
      return await apiClient.get<PagamentoResponse>(`/pagamentos/viagem/${viagemId}/usuario/${usuarioId}`)
    } catch (error: any) {
      if (error.status === 404) {
        return null
      }
      throw error
    }
  },

  async buscarPorViagem(viagemId: number): Promise<PagamentoResponse[]> {
    return apiClient.get<PagamentoResponse[]>(`/pagamentos/viagem/${viagemId}`)
  }
}

