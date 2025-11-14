package frete_inteligente.com.frete_inteligente.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AutonomoDTO {
    private Long id;
    
    // Dados do usuário
    private String nome;
    private String email;
    private String cpf;
    private String telefone;
    private String senha;
    
    // Dados específicos do autônomo
    private String cnh;
    private String categoriaCnh;
    private Boolean ear;
}

