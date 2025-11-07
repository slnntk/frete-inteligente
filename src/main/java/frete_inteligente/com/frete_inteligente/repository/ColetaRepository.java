package frete_inteligente.com.frete_inteligente.repository;

import frete_inteligente.com.frete_inteligente.domain.trip.Coleta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ColetaRepository extends JpaRepository<Coleta, Long> {
    List<Coleta> findByViagemId(Long viagemId);
    List<Coleta> findByClienteId(Long clienteId);
    Optional<Coleta> findByViagemIdAndClienteId(Long viagemId, Long clienteId);
}

