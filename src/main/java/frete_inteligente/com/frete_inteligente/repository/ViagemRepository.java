package frete_inteligente.com.frete_inteligente.repository;

import frete_inteligente.com.frete_inteligente.domain.trip.Viagem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ViagemRepository extends JpaRepository<Viagem, Long> {}
