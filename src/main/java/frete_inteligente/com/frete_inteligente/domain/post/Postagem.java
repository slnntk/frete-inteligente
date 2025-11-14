package frete_inteligente.com.frete_inteligente.domain.post;

import frete_inteligente.com.frete_inteligente.domain.user.Usuario;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "postagem")
public class Postagem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "autor_id")
    private Usuario autor;

    @Column(nullable = false, length = 160)
    private String titulo;

    @Column(length = 160)
    private String regiao;

    @Lob
    private String descricao;

    @Column(precision = 10, scale = 2)
    private BigDecimal preco;
}


