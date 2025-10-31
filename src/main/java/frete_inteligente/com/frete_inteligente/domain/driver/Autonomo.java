package frete_inteligente.com.frete_inteligente.domain.driver;

import frete_inteligente.com.frete_inteligente.domain.user.Usuario;
import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "autonomo")
public class Autonomo {

    @Id
    private Long id; // mesmo ID do usuário

    @OneToOne
    @MapsId
    @JoinColumn(name = "id")
    private Usuario usuario;

    @Column(length = 20)
    private String cnh;

    @Column(name = "categoria_cnh", length = 3)
    private String categoriaCnh;

    @Column
    private Boolean ear;
}


