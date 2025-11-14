package frete_inteligente.com.frete_inteligente.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PagamentoRequestDTO {
    private Long viagemId;
    private Long usuarioId;
    private BigDecimal valor;
    private String metodo;
    private String referencia;
}

