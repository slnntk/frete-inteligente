package frete_inteligente.com.frete_inteligente.domain.trip;

import frete_inteligente.com.frete_inteligente.domain.user.Usuario;
import jakarta.persistence.*;
import lombok.*;
import java.time.OffsetDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "coleta")
public class Coleta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "viagem_id")
    private Viagem viagem;

    @ManyToOne(optional = false)
    @JoinColumn(name = "cliente_id")
    private Usuario cliente;

    @Column(name = "coletado_em")
    private OffsetDateTime coletadoEm;

    // Localização onde foi coletado
    @Column(precision = 10)
    private Double latitude;

    @Column(precision = 11)
    private Double longitude;
}

