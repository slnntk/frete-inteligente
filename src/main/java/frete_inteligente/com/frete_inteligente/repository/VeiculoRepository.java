package frete_inteligente.com.frete_inteligente.repository;

import frete_inteligente.com.frete_inteligente.domain.vehicle.Veiculo;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VeiculoRepository extends JpaRepository<Veiculo, Long> {}
