package frete_inteligente.com.frete_inteligente.domain.trip;

import frete_inteligente.com.frete_inteligente.domain.post.Postagem;
import frete_inteligente.com.frete_inteligente.domain.vehicle.Veiculo;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "viagem")
public class Viagem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "postagem_id")
    private Postagem postagem;

    @ManyToOne
    @JoinColumn(name = "veiculo_id")
    private Veiculo veiculo;

    @Column(name = "horario_partida", nullable = false)
    private LocalTime horarioPartida;

    @Column(length = 160)
    private String destino;

    // Lista de destinos alternativos/opcionais
    @ElementCollection
    @CollectionTable(name = "viagem_destinos", joinColumns = @JoinColumn(name = "viagem_id"))
    @Column(name = "destino")
    private List<String> destinos;

    @Column
    private Integer capacidade;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private ViagemStatus status;
}


