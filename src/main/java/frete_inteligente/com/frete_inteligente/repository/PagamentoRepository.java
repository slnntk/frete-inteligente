package frete_inteligente.com.frete_inteligente.repository;

import frete_inteligente.com.frete_inteligente.domain.payment.Pagamento;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PagamentoRepository extends JpaRepository<Pagamento, Long> {}
