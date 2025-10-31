package frete_inteligente.com.frete_inteligente.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClienteDTO {
    private Long id;
    
    // Dados do usuário/cliente
    private String nome;
    private String email;
    private String cpf;
    private String telefone;
    private String senha;
    
    // Campos específicos do cliente (estudante)
    private String matricula;
    private String instituicao;
    private String curso;
}

