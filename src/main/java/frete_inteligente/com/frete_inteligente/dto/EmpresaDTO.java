package frete_inteligente.com.frete_inteligente.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmpresaDTO {
    private Long id;
    
    // Dados do usuário
    private String nome;
    private String email;
    private String telefone;
    private String senha;
    
    // Dados específicos da empresa
    private String cnpj;
    private String razaoSocial;
}

