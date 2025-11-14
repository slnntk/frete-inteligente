package frete_inteligente.com.frete_inteligente.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CheckinRequestDTO {
    @NotNull(message = "ID da viagem é obrigatório")
    private Long viagemId;
    
    @NotNull(message = "ID do cliente é obrigatório")
    private Long clienteId;
    
    private Double latitude;
    private Double longitude;
}

