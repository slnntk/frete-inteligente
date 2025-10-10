package frete_inteligente.com.frete_inteligente.domain.vehicle;

import frete_inteligente.com.frete_inteligente.domain.user.Usuario;
import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "veiculo")
public class Veiculo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "proprietario_id")
    private Usuario proprietario;

    @Column(nullable = false, length = 10)
    private String placa;

    @Column(length = 80)
    private String modelo;

    @Column
    private Integer capacidade;
}


