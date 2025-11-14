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
public class LocalizacaoMotoristaDTO {
    @NotNull(message = "Latitude é obrigatória")
    private Double latitude;
    
    @NotNull(message = "Longitude é obrigatória")
    private Double longitude;
}

