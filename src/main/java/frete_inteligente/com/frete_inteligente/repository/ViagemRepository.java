package frete_inteligente.com.frete_inteligente.repository;

import frete_inteligente.com.frete_inteligente.domain.trip.Viagem;
import frete_inteligente.com.frete_inteligente.domain.trip.ViagemStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ViagemRepository extends JpaRepository<Viagem, Long> {
    List<Viagem> findByPostagemId(Long postagemId);
    List<Viagem> findByStatus(ViagemStatus status);
}
