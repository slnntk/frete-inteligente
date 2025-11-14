package frete_inteligente.com.frete_inteligente.controller;

import frete_inteligente.com.frete_inteligente.domain.trip.Checkin;
import frete_inteligente.com.frete_inteligente.dto.CheckinRequestDTO;
import frete_inteligente.com.frete_inteligente.exception.EntityNotFoundException;
import frete_inteligente.com.frete_inteligente.service.CheckinService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/checkins")
@RequiredArgsConstructor
public class CheckinController {

    private final CheckinService checkinService;

    @GetMapping
    public List<Checkin> listarCheckins() {
        return checkinService.listarTodos();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Checkin> buscarCheckin(@PathVariable Long id) {
        return checkinService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new EntityNotFoundException("Check-in não encontrado"));
    }

    @PostMapping
    public ResponseEntity<Checkin> criarCheckin(@Valid @RequestBody CheckinRequestDTO dto) {
        Checkin checkin = checkinService.criar(dto);
        return ResponseEntity.ok(checkin);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarCheckin(@PathVariable Long id) {
        if (checkinService.deletar(id)) {
            return ResponseEntity.noContent().build();
        }
        throw new EntityNotFoundException("Check-in não encontrado");
    }

    @GetMapping("/viagem/{viagemId}")
    public List<Checkin> buscarPorViagem(@PathVariable Long viagemId) {
        return checkinService.buscarPorViagem(viagemId);
    }

    @GetMapping("/cliente/{clienteId}")
    public List<Checkin> buscarPorCliente(@PathVariable Long clienteId) {
        return checkinService.buscarPorCliente(clienteId);
    }
}
