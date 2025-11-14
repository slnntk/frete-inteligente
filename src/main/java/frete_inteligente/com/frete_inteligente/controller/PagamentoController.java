package frete_inteligente.com.frete_inteligente.controller;

import frete_inteligente.com.frete_inteligente.dto.PagamentoRequestDTO;
import frete_inteligente.com.frete_inteligente.dto.PagamentoResponseDTO;
import frete_inteligente.com.frete_inteligente.service.PagamentoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/pagamentos")
@RequiredArgsConstructor
public class PagamentoController {

    private final PagamentoService pagamentoService;

    @PostMapping
    public ResponseEntity<PagamentoResponseDTO> criar(@Valid @RequestBody PagamentoRequestDTO dto) {
        PagamentoResponseDTO pagamento = pagamentoService.criar(dto);
        return ResponseEntity.ok(pagamento);
    }

    @PostMapping("/{id}/confirmar")
    public ResponseEntity<PagamentoResponseDTO> confirmarPagamento(@PathVariable Long id) {
        PagamentoResponseDTO pagamento = pagamentoService.confirmarPagamento(id);
        return ResponseEntity.ok(pagamento);
    }

    @GetMapping("/viagem/{viagemId}/usuario/{usuarioId}")
    public ResponseEntity<PagamentoResponseDTO> buscarPorViagemEUsuario(
            @PathVariable Long viagemId,
            @PathVariable Long usuarioId) {
        Optional<PagamentoResponseDTO> pagamento = pagamentoService.buscarPorViagemEUsuario(viagemId, usuarioId);
        return pagamento.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/viagem/{viagemId}")
    public ResponseEntity<List<PagamentoResponseDTO>> buscarPorViagem(@PathVariable Long viagemId) {
        List<PagamentoResponseDTO> pagamentos = pagamentoService.buscarPorViagem(viagemId);
        return ResponseEntity.ok(pagamentos);
    }
}

