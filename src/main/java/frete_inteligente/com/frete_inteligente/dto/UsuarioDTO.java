package frete_inteligente.com.frete_inteligente.dto;

import frete_inteligente.com.frete_inteligente.domain.user.UsuarioTipo;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UsuarioDTO {
    private Long id;
    private UsuarioTipo tipo;
    private String nome;
    private String email;
    private String cpf;
    private String telefone;
    private String senha; // Não retornar no GET
}

