package frete_inteligente.com.frete_inteligente.repository;

import frete_inteligente.com.frete_inteligente.domain.trip.Checkin;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CheckinRepository extends JpaRepository<Checkin, Long> {
    List<Checkin> findByViagemId(Long viagemId);
    List<Checkin> findByClienteId(Long clienteId);
    Optional<Checkin> findByViagemIdAndClienteId(Long viagemId, Long clienteId);
}
