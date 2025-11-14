package frete_inteligente.com.frete_inteligente.dto;

import frete_inteligente.com.frete_inteligente.domain.trip.ViagemStatus;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ViagemRequestDTO {
    @NotNull(message = "ID da postagem é obrigatório")
    private Long postagemId;
    
    private Long veiculoId;
    
    @NotNull(message = "Horário de partida é obrigatório")
    private LocalTime horarioPartida;
    
    private String destino;
    
    private String cepPartida;
    private String enderecoPartida;
    private Double latitudePartida;
    private Double longitudePartida;
    
    @NotNull(message = "Capacidade é obrigatória")
    @Positive(message = "Capacidade deve ser positiva")
    private Integer capacidade;
    
    private ViagemStatus status;
}

