package frete_inteligente.com.frete_inteligente.controller;

import frete_inteligente.com.frete_inteligente.dto.AutonomoDTO;
import frete_inteligente.com.frete_inteligente.service.AutonomoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/autonomos")
@RequiredArgsConstructor
public class AutonomoController {

    private final AutonomoService autonomoService;

    @GetMapping
    public ResponseEntity<List<AutonomoDTO>> listarTodos() {
        return ResponseEntity.ok(autonomoService.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AutonomoDTO> buscarPorId(@PathVariable Long id) {
        return autonomoService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<AutonomoDTO> criar(@RequestBody AutonomoDTO dto) {
        AutonomoDTO criado = autonomoService.criar(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(criado);
    }

    @PutMapping("/{id}")
    public ResponseEntity<AutonomoDTO> atualizar(@PathVariable Long id, @RequestBody AutonomoDTO dto) {
        return autonomoService.atualizar(id, dto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        boolean deletado = autonomoService.deletar(id);
        return deletado ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }
}

