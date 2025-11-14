package frete_inteligente.com.frete_inteligente.controller;

import frete_inteligente.com.frete_inteligente.domain.trip.Inscricao;
import frete_inteligente.com.frete_inteligente.dto.InscricaoRequestDTO;
import frete_inteligente.com.frete_inteligente.exception.EntityNotFoundException;
import frete_inteligente.com.frete_inteligente.service.InscricaoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inscricoes")
@RequiredArgsConstructor
public class InscricaoController {

    private final InscricaoService inscricaoService;

    @GetMapping
    public List<Inscricao> listar() {
        return inscricaoService.listarTodas();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Inscricao> buscarPorId(@PathVariable Long id) {
        return inscricaoService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new EntityNotFoundException("Inscrição não encontrada"));
    }

    @PostMapping
    public ResponseEntity<Inscricao> criar(@Valid @RequestBody InscricaoRequestDTO dto) {
        Inscricao inscricao = inscricaoService.criar(dto);
        return ResponseEntity.ok(inscricao);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        if (inscricaoService.deletar(id)) {
            return ResponseEntity.noContent().build();
        }
        throw new EntityNotFoundException("Inscrição não encontrada");
    }

    @GetMapping("/cliente/{clienteId}")
    public List<Inscricao> listarPorCliente(@PathVariable Long clienteId) {
        return inscricaoService.buscarPorCliente(clienteId);
    }

    @GetMapping("/viagem/{viagemId}")
    public List<Inscricao> listarPorViagem(@PathVariable Long viagemId) {
        return inscricaoService.buscarPorViagem(viagemId);
    }
}


