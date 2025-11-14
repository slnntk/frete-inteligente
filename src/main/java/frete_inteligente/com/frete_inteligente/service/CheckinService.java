package frete_inteligente.com.frete_inteligente.service;

import frete_inteligente.com.frete_inteligente.domain.trip.Checkin;
import frete_inteligente.com.frete_inteligente.domain.trip.Viagem;
import frete_inteligente.com.frete_inteligente.domain.user.Usuario;
import frete_inteligente.com.frete_inteligente.dto.CheckinRequestDTO;
import frete_inteligente.com.frete_inteligente.repository.CheckinRepository;
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
public class CheckinService {

    private final CheckinRepository checkinRepository;
    private final ViagemRepository viagemRepository;
    private final UsuarioRepository usuarioRepository;

    public List<Checkin> listarTodos() {
        return checkinRepository.findAll();
    }

    public Optional<Checkin> buscarPorId(Long id) {
        return checkinRepository.findById(id);
    }

    @Transactional
    public Checkin criar(CheckinRequestDTO dto) {
        // Validar se a viagem existe
        Viagem viagem = viagemRepository.findById(dto.getViagemId())
                .orElseThrow(() -> new IllegalArgumentException("Viagem não encontrada"));

        // Validar se o cliente existe
        Usuario cliente = usuarioRepository.findById(dto.getClienteId())
                .orElseThrow(() -> new IllegalArgumentException("Cliente não encontrado"));

        // Se a viagem não tem ponto de partida definido, usar a localização do primeiro check-in
        if (viagem.getLatitudePartida() == null || viagem.getLongitudePartida() == null) {
            // Usar localização do cliente se disponível
            if (cliente.getLatitude() != null && cliente.getLongitude() != null) {
                viagem.setLatitudePartida(cliente.getLatitude());
                viagem.setLongitudePartida(cliente.getLongitude());
                if (cliente.getEndereco() != null) {
                    viagem.setEnderecoPartida(cliente.getEndereco());
                }
                viagemRepository.save(viagem);
            }
        }

        // Atualizar localização do cliente se o check-in tiver coordenadas
        if (dto.getLatitude() != null && dto.getLongitude() != null) {
            cliente.setLatitude(dto.getLatitude());
            cliente.setLongitude(dto.getLongitude());
            usuarioRepository.save(cliente);

            // Se a viagem ainda não tem ponto de partida, usar as coordenadas do check-in
            if (viagem.getLatitudePartida() == null || viagem.getLongitudePartida() == null) {
                viagem.setLatitudePartida(dto.getLatitude());
                viagem.setLongitudePartida(dto.getLongitude());
                viagemRepository.save(viagem);
            }
        }

        // Criar check-in
        Checkin checkin = Checkin.builder()
                .viagem(viagem)
                .cliente(cliente)
                .latitude(dto.getLatitude())
                .longitude(dto.getLongitude())
                .realizadoEm(OffsetDateTime.now())
                .build();

        return checkinRepository.save(checkin);
    }

    @Transactional
    public boolean deletar(Long id) {
        if (checkinRepository.existsById(id)) {
            checkinRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public List<Checkin> buscarPorViagem(Long viagemId) {
        return checkinRepository.findByViagemId(viagemId);
    }

    public List<Checkin> buscarPorCliente(Long clienteId) {
        return checkinRepository.findByClienteId(clienteId);
    }

    public Optional<Checkin> buscarPorViagemECliente(Long viagemId, Long clienteId) {
        return checkinRepository.findByViagemIdAndClienteId(viagemId, clienteId);
    }
}

