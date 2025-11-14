package frete_inteligente.com.frete_inteligente.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/geocoding")
@RequiredArgsConstructor
public class GeocodingController {

    private final RestTemplate restTemplate;

    /**
     * Busca endereço e coordenadas a partir de um CEP
     * Usa a API ViaCEP (gratuita e sem necessidade de chave)
     */
    @GetMapping("/cep/{cep}")
    public ResponseEntity<Map<String, Object>> buscarPorCep(@PathVariable String cep) {
        try {
            // Remove formatação do CEP
            String cepLimpo = cep.replaceAll("[^0-9]", "");
            
            if (cepLimpo.length() != 8) {
                return ResponseEntity.badRequest().build();
            }

            // Busca na API ViaCEP
            String url = "https://viacep.com.br/ws/" + cepLimpo + "/json/";
            Map<String, Object> response = restTemplate.getForObject(url, Map.class);
            
            if (response == null || response.containsKey("erro")) {
                return ResponseEntity.notFound().build();
            }

            // Monta endereço completo
            String endereco = String.format("%s, %s - %s/%s",
                response.getOrDefault("logradouro", ""),
                response.getOrDefault("bairro", ""),
                response.getOrDefault("localidade", ""),
                response.getOrDefault("uf", "")
            ).trim();

            // Para coordenadas, usaremos uma API de geocodificação
            // Por enquanto, retornamos o endereço e sugerimos usar Google Geocoding ou similar
            Map<String, Object> resultado = new HashMap<>();
            resultado.put("cep", cepLimpo);
            resultado.put("endereco", endereco);
            resultado.put("logradouro", response.get("logradouro"));
            resultado.put("bairro", response.get("bairro"));
            resultado.put("cidade", response.get("localidade"));
            resultado.put("estado", response.get("uf"));
            resultado.put("ibge", response.get("ibge"));
            
            // Nota: Para obter latitude/longitude, será necessário usar
            // Google Maps Geocoding API ou similar no frontend
            // Ou implementar aqui com chave de API
            
            return ResponseEntity.ok(resultado);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Endpoint para buscar coordenadas de um endereço completo
     * Requer integração com Google Maps ou similar
     */
    @PostMapping("/geocode")
    public ResponseEntity<Map<String, Object>> geocodificarEndereco(@RequestBody Map<String, String> request) {
        String endereco = request.get("endereco");
        
        if (endereco == null || endereco.trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        // TODO: Implementar geocodificação com Google Maps API
        // Por enquanto, retorna estrutura vazia
        Map<String, Object> resultado = new HashMap<>();
        resultado.put("endereco", endereco);
        resultado.put("latitude", null);
        resultado.put("longitude", null);
        resultado.put("mensagem", "Geocodificação requer configuração de API");
        
        return ResponseEntity.ok(resultado);
    }
}

