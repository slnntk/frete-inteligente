package frete_inteligente.com.frete_inteligente.repository;

import frete_inteligente.com.frete_inteligente.domain.payment.Pagamento;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PagamentoRepository extends JpaRepository<Pagamento, Long> {
    Optional<Pagamento> findByViagemIdAndUsuarioId(Long viagemId, Long usuarioId);
}
