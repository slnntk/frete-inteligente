package frete_inteligente.com.frete_inteligente.service;

import frete_inteligente.com.frete_inteligente.domain.trip.Checkin;
import frete_inteligente.com.frete_inteligente.domain.trip.Coleta;
import frete_inteligente.com.frete_inteligente.domain.trip.Inscricao;
import frete_inteligente.com.frete_inteligente.domain.trip.Viagem;
import frete_inteligente.com.frete_inteligente.domain.trip.ViagemStatus;
import frete_inteligente.com.frete_inteligente.dto.LocalizacaoMotoristaDTO;
import frete_inteligente.com.frete_inteligente.dto.ParticipanteDTO;
import frete_inteligente.com.frete_inteligente.dto.ViagemRequestDTO;
import frete_inteligente.com.frete_inteligente.repository.CheckinRepository;
import frete_inteligente.com.frete_inteligente.repository.ColetaRepository;
import frete_inteligente.com.frete_inteligente.repository.InscricaoRepository;
import frete_inteligente.com.frete_inteligente.repository.PostagemRepository;
import frete_inteligente.com.frete_inteligente.repository.VeiculoRepository;
import frete_inteligente.com.frete_inteligente.repository.ViagemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ViagemService {

    private final ViagemRepository viagemRepository;
    private final PostagemRepository postagemRepository;
    private final VeiculoRepository veiculoRepository;
    private final InscricaoRepository inscricaoRepository;
    private final CheckinRepository checkinRepository;
    private final ColetaRepository coletaRepository;

    public List<Viagem> listarTodas() {
        return viagemRepository.findAll();
    }

    public Optional<Viagem> buscarPorId(Long id) {
        return viagemRepository.findById(id);
    }

    @Transactional
    public Viagem criar(ViagemRequestDTO dto) {
        // Validar se a postagem existe
        var postagem = postagemRepository.findById(dto.getPostagemId())
                .orElseThrow(() -> new IllegalArgumentException("Postagem não encontrada"));

        // Validar se o veículo existe (se fornecido)
        if (dto.getVeiculoId() != null) {
            veiculoRepository.findById(dto.getVeiculoId())
                    .orElseThrow(() -> new IllegalArgumentException("Veículo não encontrado"));
        }

        Viagem viagem = Viagem.builder()
                .postagem(postagem)
                .horarioPartida(dto.getHorarioPartida())
                .destino(dto.getDestino())
                .cepPartida(dto.getCepPartida())
                .enderecoPartida(dto.getEnderecoPartida())
                .latitudePartida(dto.getLatitudePartida())
                .longitudePartida(dto.getLongitudePartida())
                .capacidade(dto.getCapacidade())
                .status(dto.getStatus() != null ? dto.getStatus() : ViagemStatus.ABERTA)
                .build();

        if (dto.getVeiculoId() != null) {
            viagem.setVeiculo(veiculoRepository.findById(dto.getVeiculoId()).orElse(null));
        }

        return viagemRepository.save(viagem);
    }

    @Transactional
    public Optional<Viagem> atualizar(Long id, ViagemRequestDTO dto) {
        return viagemRepository.findById(id).map(viagem -> {
            // Validar postagem se mudou
            if (!viagem.getPostagem().getId().equals(dto.getPostagemId())) {
                var postagem = postagemRepository.findById(dto.getPostagemId())
                        .orElseThrow(() -> new IllegalArgumentException("Postagem não encontrada"));
                viagem.setPostagem(postagem);
            }

            // Atualizar apenas os campos fornecidos
            if (dto.getHorarioPartida() != null) {
                viagem.setHorarioPartida(dto.getHorarioPartida());
            }
            if (dto.getDestino() != null) {
                viagem.setDestino(dto.getDestino());
            }
            if (dto.getCepPartida() != null) {
                viagem.setCepPartida(dto.getCepPartida());
            }
            if (dto.getEnderecoPartida() != null) {
                viagem.setEnderecoPartida(dto.getEnderecoPartida());
            }
            if (dto.getLatitudePartida() != null) {
                viagem.setLatitudePartida(dto.getLatitudePartida());
            }
            if (dto.getLongitudePartida() != null) {
                viagem.setLongitudePartida(dto.getLongitudePartida());
            }
            if (dto.getCapacidade() != null) {
                viagem.setCapacidade(dto.getCapacidade());
            }
            if (dto.getStatus() != null) {
                viagem.setStatus(dto.getStatus());
            }
            if (dto.getVeiculoId() != null) {
                veiculoRepository.findById(dto.getVeiculoId())
                        .ifPresent(viagem::setVeiculo);
            }

            return viagemRepository.save(viagem);
        });
    }

    @Transactional
    public Optional<Viagem> atualizarStatus(Long id, ViagemStatus status) {
        return viagemRepository.findById(id).map(viagem -> {
            viagem.setStatus(status);
            return viagemRepository.save(viagem);
        });
    }

    @Transactional
    public Optional<Viagem> atualizarLocalizacaoMotorista(Long id, LocalizacaoMotoristaDTO localizacao) {
        return viagemRepository.findById(id).map(viagem -> {
            viagem.setLatitudeMotorista(localizacao.getLatitude());
            viagem.setLongitudeMotorista(localizacao.getLongitude());
            return viagemRepository.save(viagem);
        });
    }

    @Transactional
    public boolean deletar(Long id) {
        if (viagemRepository.existsById(id)) {
            viagemRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public List<Viagem> buscarPorStatus(ViagemStatus status) {
        return viagemRepository.findByStatus(status);
    }

    public List<Viagem> buscarPorPostagem(Long postagemId) {
        return viagemRepository.findByPostagemId(postagemId);
    }

    /**
     * Lista participantes (inscritos) de uma viagem com status de check-in e coleta
     */
    public List<ParticipanteDTO> listarParticipantes(Long viagemId) {
        List<Inscricao> inscricoes = inscricaoRepository.findByViagemId(viagemId);

        return inscricoes.stream()
                .map(inscricao -> {
                    var cliente = inscricao.getCliente();
                    
                    // Buscar check-in do cliente nesta viagem
                    Optional<Checkin> checkinOpt = checkinRepository.findByViagemIdAndClienteId(viagemId, cliente.getId());
                    
                    // Buscar coleta do cliente nesta viagem
                    Optional<Coleta> coletaOpt = coletaRepository.findByViagemIdAndClienteId(viagemId, cliente.getId());
                    
                    boolean checkedIn = checkinOpt.isPresent();
                    boolean coletado = coletaOpt.isPresent();
                    
                    // Priorizar coordenadas do check-in sobre endereço cadastrado
                    Double lat = null;
                    Double lng = null;
                    
                    if (checkinOpt.isPresent() && checkinOpt.get().getLatitude() != null 
                            && checkinOpt.get().getLongitude() != null) {
                        // Usar coordenadas do check-in (local escolhido pelo passageiro)
                        lat = checkinOpt.get().getLatitude();
                        lng = checkinOpt.get().getLongitude();
                    } else if (cliente.getLatitude() != null && cliente.getLongitude() != null) {
                        // Usar coordenadas do endereço cadastrado
                        lat = cliente.getLatitude();
                        lng = cliente.getLongitude();
                    }
                    
                    return ParticipanteDTO.builder()
                            .id(cliente.getId())
                            .nome(cliente.getNome())
                            .email(cliente.getEmail())
                            .telefone(cliente.getTelefone())
                            .checkedIn(checkedIn)
                            .coletado(coletado)
                            .endereco(cliente.getEndereco())
                            .latitude(lat)
                            .longitude(lng)
                            .build();
                })
                .collect(Collectors.toList());
    }
}

