package frete_inteligente.com.frete_inteligente.controller;

import frete_inteligente.com.frete_inteligente.domain.trip.Checkin;
import frete_inteligente.com.frete_inteligente.repository.CheckinRepository;
import frete_inteligente.com.frete_inteligente.repository.ViagemRepository;
import frete_inteligente.com.frete_inteligente.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/checkins")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CheckinController {

    private final CheckinRepository checkinRepository;
    private final ViagemRepository viagemRepository;
    private final UsuarioRepository usuarioRepository;

    @GetMapping
    public List<Checkin> listarCheckins() {
        return checkinRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Checkin> buscarCheckin(@PathVariable Long id) {
        Optional<Checkin> checkin = checkinRepository.findById(id);
        return checkin.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Checkin> criarCheckin(@RequestBody Checkin checkin) {
        // Verificar se a viagem existe
        if (!viagemRepository.existsById(checkin.getViagem().getId())) {
            return ResponseEntity.badRequest().build();
        }
        
        // Verificar se o cliente existe
        if (!usuarioRepository.existsById(checkin.getCliente().getId())) {
            return ResponseEntity.badRequest().build();
        }
        
        // Definir timestamp se não fornecido
        if (checkin.getRealizadoEm() == null) {
            checkin.setRealizadoEm(OffsetDateTime.now());
        }
        
        return ResponseEntity.ok(checkinRepository.save(checkin));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarCheckin(@PathVariable Long id) {
        if (!checkinRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        checkinRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/viagem/{viagemId}")
    public List<Checkin> buscarPorViagem(@PathVariable Long viagemId) {
        return checkinRepository.findAll().stream()
                .filter(c -> c.getViagem().getId().equals(viagemId))
                .toList();
    }

    @GetMapping("/cliente/{clienteId}")
    public List<Checkin> buscarPorCliente(@PathVariable Long clienteId) {
        return checkinRepository.findAll().stream()
                .filter(c -> c.getCliente().getId().equals(clienteId))
                .toList();
    }
}
