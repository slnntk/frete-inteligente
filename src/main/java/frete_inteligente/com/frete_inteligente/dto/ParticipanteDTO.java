package frete_inteligente.com.frete_inteligente.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ParticipanteDTO {
    private Long id;
    private String nome;
    private String email;
    private String telefone;
    private boolean checkedIn;
    private boolean coletado;
    private String endereco;
    private Double latitude;
    private Double longitude;
}

