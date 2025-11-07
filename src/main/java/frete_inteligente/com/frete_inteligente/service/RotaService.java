package frete_inteligente.com.frete_inteligente.service;

import frete_inteligente.com.frete_inteligente.domain.trip.Checkin;
import frete_inteligente.com.frete_inteligente.domain.trip.Inscricao;
import frete_inteligente.com.frete_inteligente.domain.trip.Viagem;
import frete_inteligente.com.frete_inteligente.domain.user.Usuario;
import frete_inteligente.com.frete_inteligente.repository.CheckinRepository;
import frete_inteligente.com.frete_inteligente.repository.InscricaoRepository;
import frete_inteligente.com.frete_inteligente.repository.ViagemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
@RequiredArgsConstructor
public class RotaService {

    private final ViagemRepository viagemRepository;
    private final InscricaoRepository inscricaoRepository;
    private final CheckinRepository checkinRepository;
    private final RestTemplate restTemplate;
    
    @Value("${mapbox.access-token:}")
    private String mapboxAccessToken;

    /**
     * Calcula rota otimizada para uma viagem
     * Ordena os pontos de embarque pela menor distância total
     */
    public Map<String, Object> calcularRota(Long viagemId) {
        Viagem viagem = viagemRepository.findById(viagemId)
                .orElseThrow(() -> new IllegalArgumentException("Viagem não encontrada"));

        // Ponto de partida
        if (viagem.getLatitudePartida() == null || viagem.getLongitudePartida() == null) {
            throw new IllegalArgumentException("Viagem não possui ponto de partida definido");
        }

        // Buscar check-ins dos passageiros (prioriza local de check-in sobre endereço cadastrado)
        List<Map<String, Object>> passageiros = buscarPassageirosComLocalizacao(viagemId);

        // Ordenar por distância do ponto de partida (algoritmo simples: nearest neighbor)
        List<Map<String, Object>> rotaOtimizada = calcularRotaOtimizada(
            viagem.getLatitudePartida(),
            viagem.getLongitudePartida(),
            passageiros
        );

        // Calcular rota real usando Mapbox Directions API (se disponível)
        Map<String, Object> rotaReal = null;
        if (mapboxAccessToken != null && !mapboxAccessToken.isEmpty() && !rotaOtimizada.isEmpty()) {
            rotaReal = calcularRotaRealMapbox(
                viagem.getLatitudePartida(),
                viagem.getLongitudePartida(),
                rotaOtimizada
            );
        }

        Map<String, Object> resultado = new HashMap<>();
        resultado.put("pontoPartida", Map.of(
            "latitude", viagem.getLatitudePartida(),
            "longitude", viagem.getLongitudePartida(),
            "endereco", viagem.getEnderecoPartida()
        ));
        resultado.put("waypoints", rotaOtimizada);
        resultado.put("totalPontos", rotaOtimizada.size());
        resultado.put("distanciaEstimada", calcularDistanciaTotal(rotaOtimizada));
        
        // Adicionar rota real se calculada
        if (rotaReal != null) {
            resultado.put("rotaReal", rotaReal);
        }
        
        return resultado;
    }

    /**
     * Busca passageiros inscritos com suas localizações (prioriza check-in)
     */
    private List<Map<String, Object>> buscarPassageirosComLocalizacao(Long viagemId) {
        List<Inscricao> inscricoes = inscricaoRepository.findByViagemId(viagemId);

        return inscricoes.stream()
            .map(inscricao -> {
                Usuario cliente = inscricao.getCliente();
                Map<String, Object> p = new HashMap<>();
                p.put("id", cliente.getId());
                p.put("nome", cliente.getNome());
                
                // Verificar se há check-in com localização
                // Se houver check-in, usar coordenadas do check-in (local escolhido)
                // Caso contrário, usar endereço cadastrado
                Optional<Checkin> checkinOpt = checkinRepository.findByViagemIdAndClienteId(viagemId, cliente.getId());
                
                if (checkinOpt.isPresent() && checkinOpt.get().getLatitude() != null 
                        && checkinOpt.get().getLongitude() != null) {
                    // Usar local de check-in (local escolhido pelo passageiro)
                    p.put("latitude", checkinOpt.get().getLatitude());
                    p.put("longitude", checkinOpt.get().getLongitude());
                    p.put("endereco", "Local de embarque escolhido");
                    p.put("checkedIn", true);
                } else {
                    // Usar endereço cadastrado
                    p.put("latitude", cliente.getLatitude());
                    p.put("longitude", cliente.getLongitude());
                    p.put("endereco", cliente.getEndereco());
                    p.put("checkedIn", false);
                }
                
                return p;
            })
            .filter(p -> p.get("latitude") != null && p.get("longitude") != null)
            .collect(java.util.stream.Collectors.toList());
    }

    /**
     * Algoritmo Nearest Neighbor para otimização de rota
     */
    private List<Map<String, Object>> calcularRotaOtimizada(
            Double latInicio, Double lngInicio, List<Map<String, Object>> passageiros) {
        
        if (passageiros.isEmpty()) {
            return new ArrayList<>();
        }

        List<Map<String, Object>> rota = new ArrayList<>();
        List<Map<String, Object>> naoVisitados = new ArrayList<>(passageiros);
        
        Double latAtual = latInicio;
        Double lngAtual = lngInicio;

        while (!naoVisitados.isEmpty()) {
            // Encontrar o passageiro mais próximo
            Map<String, Object> maisProximo = null;
            double menorDistancia = Double.MAX_VALUE;
            int indiceMaisProximo = -1;

            for (int i = 0; i < naoVisitados.size(); i++) {
                Map<String, Object> p = naoVisitados.get(i);
                Double lat = (Double) p.get("latitude");
                Double lng = (Double) p.get("longitude");
                
                double distancia = calcularDistanciaHaversine(latAtual, lngAtual, lat, lng);
                
                if (distancia < menorDistancia) {
                    menorDistancia = distancia;
                    maisProximo = p;
                    indiceMaisProximo = i;
                }
            }

            if (maisProximo != null) {
                rota.add(maisProximo);
                latAtual = (Double) maisProximo.get("latitude");
                lngAtual = (Double) maisProximo.get("longitude");
                naoVisitados.remove(indiceMaisProximo);
            }
        }

        return rota;
    }

    /**
     * Calcula distância entre dois pontos usando fórmula de Haversine
     */
    private double calcularDistanciaHaversine(Double lat1, Double lng1, Double lat2, Double lng2) {
        final int R = 6371; // Raio da Terra em km
        
        double latDistance = Math.toRadians(lat2 - lat1);
        double lngDistance = Math.toRadians(lng2 - lng1);
        
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lngDistance / 2) * Math.sin(lngDistance / 2);
        
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        
        return R * c;
    }

    /**
     * Calcula distância total da rota
     */
    private double calcularDistanciaTotal(List<Map<String, Object>> rota) {
        if (rota.size() < 2) {
            return 0.0;
        }

        double distanciaTotal = 0.0;
        for (int i = 0; i < rota.size() - 1; i++) {
            Map<String, Object> p1 = rota.get(i);
            Map<String, Object> p2 = rota.get(i + 1);
            
            Double lat1 = (Double) p1.get("latitude");
            Double lng1 = (Double) p1.get("longitude");
            Double lat2 = (Double) p2.get("latitude");
            Double lng2 = (Double) p2.get("longitude");
            
            distanciaTotal += calcularDistanciaHaversine(lat1, lng1, lat2, lng2);
        }
        
        return Math.round(distanciaTotal * 10.0) / 10.0;
    }

    /**
     * Calcula rota real usando Mapbox Directions API
     * Retorna coordenadas da rota seguindo as ruas (não linha reta)
     */
    @SuppressWarnings("unchecked")
    private Map<String, Object> calcularRotaRealMapbox(
            Double latPartida, Double lngPartida, List<Map<String, Object>> waypoints) {
        
        if (waypoints.isEmpty()) {
            return null;
        }

        try {
            // Construir URL da API Mapbox Directions
            // Formato: https://api.mapbox.com/directions/v5/mapbox/driving/{coordinates}?access_token={token}
            StringBuilder coordinates = new StringBuilder();
            coordinates.append(lngPartida).append(",").append(latPartida); // Ponto de partida
            
            // Adicionar waypoints
            for (Map<String, Object> wp : waypoints) {
                coordinates.append(";");
                coordinates.append(wp.get("longitude")).append(",").append(wp.get("latitude"));
            }
            
            String url = String.format(
                "https://api.mapbox.com/directions/v5/mapbox/driving/%s?access_token=%s&geometries=geojson&overview=full",
                coordinates.toString(),
                mapboxAccessToken
            );
            
            // Fazer requisição à API Mapbox
            Map<String, Object> response = restTemplate.getForObject(url, Map.class);
            
            if (response != null && response.containsKey("routes")) {
                List<Map<String, Object>> routes = (List<Map<String, Object>>) response.get("routes");
                
                if (routes != null && !routes.isEmpty()) {
                    Map<String, Object> route = routes.get(0);
                    Map<String, Object> geometry = (Map<String, Object>) route.get("geometry");
                
                    Map<String, Object> rotaReal = new HashMap<>();
                    rotaReal.put("coordinates", geometry.get("coordinates")); // Array de [lng, lat]
                    rotaReal.put("distance", route.get("distance")); // Distância em metros
                    rotaReal.put("duration", route.get("duration")); // Duração em segundos
                    
                    return rotaReal;
                }
            }
        } catch (Exception e) {
            // Se falhar, retorna null (usa rota em linha reta)
            System.err.println("Erro ao calcular rota real: " + e.getMessage());
        }
        
        return null;
    }
}

