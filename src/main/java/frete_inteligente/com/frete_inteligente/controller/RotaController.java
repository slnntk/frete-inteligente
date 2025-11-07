package frete_inteligente.com.frete_inteligente.controller;

import frete_inteligente.com.frete_inteligente.service.RotaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/viagens/{viagemId}/rota")
@RequiredArgsConstructor
public class RotaController {

    private final RotaService rotaService;

    /**
     * Calcula rota otimizada para uma viagem
     * Ordena os pontos de embarque pela menor distância total
     */
    @GetMapping
    public ResponseEntity<Map<String, Object>> calcularRota(@PathVariable Long viagemId) {
        Map<String, Object> resultado = rotaService.calcularRota(viagemId);
        return ResponseEntity.ok(resultado);
    }
}

