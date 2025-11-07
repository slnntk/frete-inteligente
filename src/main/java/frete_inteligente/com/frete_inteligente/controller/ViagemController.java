package frete_inteligente.com.frete_inteligente.controller;

import frete_inteligente.com.frete_inteligente.domain.trip.Viagem;
import frete_inteligente.com.frete_inteligente.domain.trip.ViagemStatus;
import frete_inteligente.com.frete_inteligente.dto.LocalizacaoMotoristaDTO;
import frete_inteligente.com.frete_inteligente.dto.ParticipanteDTO;
import frete_inteligente.com.frete_inteligente.dto.ViagemRequestDTO;
import frete_inteligente.com.frete_inteligente.exception.EntityNotFoundException;
import frete_inteligente.com.frete_inteligente.service.ViagemService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/viagens")
@RequiredArgsConstructor
public class ViagemController {

    private final ViagemService viagemService;

    @GetMapping
    public List<Viagem> listarViagens() {
        return viagemService.listarTodas();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Viagem> buscarViagem(@PathVariable Long id) {
        return viagemService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new EntityNotFoundException("Viagem não encontrada"));
    }

    @PostMapping
    public ResponseEntity<Viagem> criarViagem(@Valid @RequestBody ViagemRequestDTO dto) {
        Viagem viagem = viagemService.criar(dto);
        return ResponseEntity.ok(viagem);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Viagem> atualizarViagem(
            @PathVariable Long id,
            @RequestBody ViagemRequestDTO dto) {
        return viagemService.atualizar(id, dto)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new EntityNotFoundException("Viagem não encontrada"));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Viagem> atualizarStatus(
            @PathVariable Long id,
            @RequestBody ViagemStatus status) {
        return viagemService.atualizarStatus(id, status)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new EntityNotFoundException("Viagem não encontrada"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarViagem(@PathVariable Long id) {
        if (viagemService.deletar(id)) {
            return ResponseEntity.noContent().build();
        }
        throw new EntityNotFoundException("Viagem não encontrada");
    }

    @GetMapping("/status/{status}")
    public List<Viagem> buscarPorStatus(@PathVariable ViagemStatus status) {
        return viagemService.buscarPorStatus(status);
    }

    @GetMapping("/postagem/{postagemId}")
    public List<Viagem> buscarPorPostagem(@PathVariable Long postagemId) {
        return viagemService.buscarPorPostagem(postagemId);
    }

    // Lista participantes (inscritos) de uma viagem com status de check-in e coleta
    @GetMapping("/{viagemId}/participantes")
    public List<ParticipanteDTO> listarParticipantes(@PathVariable Long viagemId) {
        return viagemService.listarParticipantes(viagemId);
    }
    
    // Atualizar localização do motorista
    @PutMapping("/{viagemId}/motorista/localizacao")
    public ResponseEntity<Viagem> atualizarLocalizacaoMotorista(
            @PathVariable Long viagemId,
            @Valid @RequestBody LocalizacaoMotoristaDTO localizacao) {
        return viagemService.atualizarLocalizacaoMotorista(viagemId, localizacao)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new EntityNotFoundException("Viagem não encontrada"));
    }
}
