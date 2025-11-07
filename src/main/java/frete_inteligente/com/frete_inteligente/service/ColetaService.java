package frete_inteligente.com.frete_inteligente.service;

import frete_inteligente.com.frete_inteligente.domain.trip.Coleta;
import frete_inteligente.com.frete_inteligente.dto.ColetaRequestDTO;
import frete_inteligente.com.frete_inteligente.repository.ColetaRepository;
import frete_inteligente.com.frete_inteligente.repository.UsuarioRepository;
import frete_inteligente.com.frete_inteligente.repository.ViagemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ColetaService {

    private final ColetaRepository coletaRepository;
    private final ViagemRepository viagemRepository;
    private final UsuarioRepository usuarioRepository;

    public List<Coleta> listarTodas() {
        return coletaRepository.findAll();
    }

    public Optional<Coleta> buscarPorId(Long id) {
        return coletaRepository.findById(id);
    }

    @Transactional
    public Coleta criar(ColetaRequestDTO dto) {
        System.out.println("[ColetaService] Criando coleta - DTO recebido: viagemId=" + dto.getViagemId() + 
                          ", clienteId=" + dto.getClienteId() + 
                          ", latitude=" + dto.getLatitude() + 
                          ", longitude=" + dto.getLongitude());
        
        // Validar se a viagem existe
        var viagem = viagemRepository.findById(dto.getViagemId())
                .orElseThrow(() -> {
                    System.err.println("[ColetaService] ERRO: Viagem não encontrada - ID: " + dto.getViagemId());
                    return new IllegalArgumentException("Viagem não encontrada");
                });

        // Validar se o cliente existe
        var cliente = usuarioRepository.findById(dto.getClienteId())
                .orElseThrow(() -> {
                    System.err.println("[ColetaService] ERRO: Cliente não encontrado - ID: " + dto.getClienteId());
                    return new IllegalArgumentException("Cliente não encontrado");
                });

        // Verificar se já existe coleta para este cliente nesta viagem
        var coletaExistente = coletaRepository.findByViagemIdAndClienteId(viagem.getId(), cliente.getId());
        if (coletaExistente.isPresent()) {
            System.err.println("[ColetaService] ERRO: Cliente já foi coletado - viagemId=" + viagem.getId() + 
                              ", clienteId=" + cliente.getId());
            throw new IllegalArgumentException("Cliente já foi coletado nesta viagem.");
        }

        Coleta coleta = Coleta.builder()
                .viagem(viagem)
                .cliente(cliente)
                .latitude(dto.getLatitude())
                .longitude(dto.getLongitude())
                .coletadoEm(OffsetDateTime.now())
                .build();

        Coleta coletaSalva = coletaRepository.save(coleta);
        System.out.println("[ColetaService] Coleta criada com sucesso - ID: " + coletaSalva.getId());
        return coletaSalva;
    }

    @Transactional
    public boolean deletar(Long id) {
        if (coletaRepository.existsById(id)) {
            coletaRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public List<Coleta> buscarPorViagem(Long viagemId) {
        return coletaRepository.findByViagemId(viagemId);
    }

    public List<Coleta> buscarPorCliente(Long clienteId) {
        return coletaRepository.findByClienteId(clienteId);
    }

    public Optional<Coleta> buscarPorViagemECliente(Long viagemId, Long clienteId) {
        return coletaRepository.findByViagemIdAndClienteId(viagemId, clienteId);
    }
}

