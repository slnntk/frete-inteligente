package frete_inteligente.com.frete_inteligente.controller;

import frete_inteligente.com.frete_inteligente.domain.trip.Viagem;
import frete_inteligente.com.frete_inteligente.domain.trip.ViagemStatus;
import frete_inteligente.com.frete_inteligente.repository.ViagemRepository;
import frete_inteligente.com.frete_inteligente.repository.InscricaoRepository;
import frete_inteligente.com.frete_inteligente.repository.CheckinRepository;
import frete_inteligente.com.frete_inteligente.domain.user.Usuario;
import frete_inteligente.com.frete_inteligente.repository.PostagemRepository;
import frete_inteligente.com.frete_inteligente.repository.VeiculoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/viagens")
@RequiredArgsConstructor
public class ViagemController {

    private final ViagemRepository viagemRepository;
    private final PostagemRepository postagemRepository;
    private final VeiculoRepository veiculoRepository;
    private final InscricaoRepository inscricaoRepository;
    private final CheckinRepository checkinRepository;

    @GetMapping
    public List<Viagem> listarViagens() {
        return viagemRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Viagem> buscarViagem(@PathVariable Long id) {
        Optional<Viagem> viagem = viagemRepository.findById(id);
        return viagem.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Viagem> criarViagem(@RequestBody Viagem viagem) {
        // Verificar se a postagem existe
        if (!postagemRepository.existsById(viagem.getPostagem().getId())) {
            return ResponseEntity.badRequest().build();
        }
        
        // Verificar se o veículo existe (se fornecido)
        if (viagem.getVeiculo() != null && !veiculoRepository.existsById(viagem.getVeiculo().getId())) {
            return ResponseEntity.badRequest().build();
        }
        
        return ResponseEntity.ok(viagemRepository.save(viagem));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Viagem> atualizarViagem(@PathVariable Long id, @RequestBody Viagem viagemAtualizada) {
        if (!viagemRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        viagemAtualizada.setId(id);
        return ResponseEntity.ok(viagemRepository.save(viagemAtualizada));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarViagem(@PathVariable Long id) {
        if (!viagemRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        viagemRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/status/{status}")
    public List<Viagem> buscarPorStatus(@PathVariable ViagemStatus status) {
        return viagemRepository.findAll().stream()
                .filter(v -> v.getStatus() == status)
                .toList();
    }

    @GetMapping("/postagem/{postagemId}")
    public List<Viagem> buscarPorPostagem(@PathVariable Long postagemId) {
        return viagemRepository.findAll().stream()
                .filter(v -> v.getPostagem().getId().equals(postagemId))
                .toList();
    }

    // Lista participantes (inscritos) de uma viagem com status de check-in
    @GetMapping("/{viagemId}/participantes")
    public List<ParticipanteDTO> listarParticipantes(@PathVariable Long viagemId) {
        return inscricaoRepository.findAll().stream()
                .filter(i -> i.getViagem().getId().equals(viagemId))
                .map(i -> {
                    Usuario u = i.getCliente();
                    boolean checkin = checkinRepository.findAll().stream()
                            .anyMatch(c -> c.getViagem().getId().equals(viagemId)
                                    && c.getCliente().getId().equals(u.getId()));
                    return new ParticipanteDTO(
                            u.getId(), 
                            u.getNome(), 
                            u.getEmail(), 
                            u.getTelefone(), 
                            checkin,
                            u.getEndereco(),
                            u.getLatitude(),
                            u.getLongitude()
                    );
                })
                .toList();
    }

    public record ParticipanteDTO(
            Long id, 
            String nome, 
            String email, 
            String telefone, 
            boolean checkedIn,
            String endereco,
            Double latitude,
            Double longitude
    ) {}
}
