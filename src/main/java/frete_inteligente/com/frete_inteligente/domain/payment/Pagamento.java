package frete_inteligente.com.frete_inteligente.domain.payment;

import frete_inteligente.com.frete_inteligente.domain.user.Usuario;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.OffsetDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "pagamento")
public class Pagamento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;

    @Column(precision = 10, scale = 2, nullable = false)
    private BigDecimal valor;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private PagamentoStatus status;

    @Column(length = 20)
    private String metodo; // PIX, CARTAO, etc.

    @Column(length = 120)
    private String referencia;

    private OffsetDateTime criadoEm;
}


