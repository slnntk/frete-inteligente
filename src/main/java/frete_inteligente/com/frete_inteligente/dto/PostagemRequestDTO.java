package frete_inteligente.com.frete_inteligente.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PostagemRequestDTO {
    @NotNull(message = "ID do autor é obrigatório")
    private Long autorId;
    
    @NotBlank(message = "Título é obrigatório")
    private String titulo;
    
    private String regiao;
    
    private String descricao;
    
    @NotNull(message = "Preço é obrigatório")
    @Positive(message = "Preço deve ser positivo")
    private BigDecimal preco;
}

