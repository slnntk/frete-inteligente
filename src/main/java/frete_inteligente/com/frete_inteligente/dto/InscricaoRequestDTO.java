package frete_inteligente.com.frete_inteligente.dto;

import frete_inteligente.com.frete_inteligente.domain.trip.InscricaoStatus;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InscricaoRequestDTO {
    @NotNull(message = "ID da viagem é obrigatório")
    private Long viagemId;
    
    @NotNull(message = "ID do cliente é obrigatório")
    private Long clienteId;
    
    private InscricaoStatus status;
}

