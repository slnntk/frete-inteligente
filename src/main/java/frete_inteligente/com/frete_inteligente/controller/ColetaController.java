package frete_inteligente.com.frete_inteligente.controller;

import frete_inteligente.com.frete_inteligente.domain.trip.Coleta;
import frete_inteligente.com.frete_inteligente.dto.ColetaRequestDTO;
import frete_inteligente.com.frete_inteligente.exception.EntityNotFoundException;
import frete_inteligente.com.frete_inteligente.service.ColetaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/coletas")
@RequiredArgsConstructor
public class ColetaController {

    private final ColetaService coletaService;

    @GetMapping
    public List<Coleta> listar() {
        return coletaService.listarTodas();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Coleta> buscarPorId(@PathVariable Long id) {
        return coletaService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new EntityNotFoundException("Coleta não encontrada"));
    }

    @PostMapping
    public ResponseEntity<Coleta> criarColeta(@Valid @RequestBody ColetaRequestDTO dto) {
        System.out.println("[ColetaController] POST /api/coletas - DTO recebido: " + dto);
        try {
            Coleta coleta = coletaService.criar(dto);
            System.out.println("[ColetaController] Coleta criada com sucesso - ID: " + coleta.getId());
            return ResponseEntity.ok(coleta);
        } catch (IllegalArgumentException e) {
            System.err.println("[ColetaController] Erro ao criar coleta: " + e.getMessage());
            throw e;
        } catch (Exception e) {
            System.err.println("[ColetaController] Erro inesperado ao criar coleta: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        if (coletaService.deletar(id)) {
            return ResponseEntity.noContent().build();
        }
        throw new EntityNotFoundException("Coleta não encontrada");
    }

    @GetMapping("/viagem/{viagemId}")
    public List<Coleta> listarPorViagem(@PathVariable Long viagemId) {
        return coletaService.buscarPorViagem(viagemId);
    }

    @GetMapping("/cliente/{clienteId}")
    public List<Coleta> listarPorCliente(@PathVariable Long clienteId) {
        return coletaService.buscarPorCliente(clienteId);
    }
}

