package frete_inteligente.com.frete_inteligente.dto;

import frete_inteligente.com.frete_inteligente.domain.payment.PagamentoStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PagamentoResponseDTO {
    private Long id;
    private Long viagemId;
    private Long usuarioId;
    private BigDecimal valor;
    private PagamentoStatus status;
    private String metodo;
    private String referencia;
    private OffsetDateTime criadoEm;
}

