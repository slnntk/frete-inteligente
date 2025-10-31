package frete_inteligente.com.frete_inteligente.controller;

import frete_inteligente.com.frete_inteligente.domain.trip.Inscricao;
import frete_inteligente.com.frete_inteligente.repository.InscricaoRepository;
import frete_inteligente.com.frete_inteligente.repository.UsuarioRepository;
import frete_inteligente.com.frete_inteligente.repository.ViagemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/inscricoes")
@RequiredArgsConstructor
public class InscricaoController {

    private final InscricaoRepository inscricaoRepository;
    private final ViagemRepository viagemRepository;
    private final UsuarioRepository usuarioRepository;

    @GetMapping
    public List<Inscricao> listar() {
        return inscricaoRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Inscricao> buscarPorId(@PathVariable Long id) {
        Optional<Inscricao> inscricao = inscricaoRepository.findById(id);
        return inscricao.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Inscricao> criar(@RequestBody Inscricao inscricao) {
        if (inscricao.getViagem() == null || inscricao.getViagem().getId() == null ||
                !viagemRepository.existsById(inscricao.getViagem().getId())) {
            return ResponseEntity.badRequest().build();
        }
        if (inscricao.getCliente() == null || inscricao.getCliente().getId() == null ||
                !usuarioRepository.existsById(inscricao.getCliente().getId())) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(inscricaoRepository.save(inscricao));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        if (!inscricaoRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        inscricaoRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/cliente/{clienteId}")
    public List<Inscricao> listarPorCliente(@PathVariable Long clienteId) {
        return inscricaoRepository.findAll().stream()
                .filter(i -> i.getCliente() != null && i.getCliente().getId().equals(clienteId))
                .collect(Collectors.toList());
    }

    @GetMapping("/viagem/{viagemId}")
    public List<Inscricao> listarPorViagem(@PathVariable Long viagemId) {
        return inscricaoRepository.findAll().stream()
                .filter(i -> i.getViagem() != null && i.getViagem().getId().equals(viagemId))
                .collect(Collectors.toList());
    }
}


