package frete_inteligente.com.frete_inteligente.service;

import frete_inteligente.com.frete_inteligente.domain.trip.Inscricao;
import frete_inteligente.com.frete_inteligente.domain.trip.InscricaoStatus;
import frete_inteligente.com.frete_inteligente.dto.InscricaoRequestDTO;
import frete_inteligente.com.frete_inteligente.repository.InscricaoRepository;
import frete_inteligente.com.frete_inteligente.repository.UsuarioRepository;
import frete_inteligente.com.frete_inteligente.repository.ViagemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class InscricaoService {

    private final InscricaoRepository inscricaoRepository;
    private final ViagemRepository viagemRepository;
    private final UsuarioRepository usuarioRepository;

    public List<Inscricao> listarTodas() {
        return inscricaoRepository.findAll();
    }

    public Optional<Inscricao> buscarPorId(Long id) {
        return inscricaoRepository.findById(id);
    }

    @Transactional
    public Inscricao criar(InscricaoRequestDTO dto) {
        // Validar se a viagem existe
        var viagem = viagemRepository.findById(dto.getViagemId())
                .orElseThrow(() -> new IllegalArgumentException("Viagem não encontrada"));

        // Validar se o cliente existe
        var cliente = usuarioRepository.findById(dto.getClienteId())
                .orElseThrow(() -> new IllegalArgumentException("Cliente não encontrado"));

        // Validar capacidade da viagem (opcional - pode ser implementado depois)
        // int inscricoesAtivas = inscricaoRepository.findByViagemId(dto.getViagemId()).size();
        // if (inscricoesAtivas >= viagem.getCapacidade()) {
        //     throw new IllegalArgumentException("Viagem lotada");
        // }

        Inscricao inscricao = Inscricao.builder()
                .viagem(viagem)
                .cliente(cliente)
                .status(dto.getStatus() != null ? dto.getStatus() : InscricaoStatus.ATIVA)
                .build();

        return inscricaoRepository.save(inscricao);
    }

    @Transactional
    public boolean deletar(Long id) {
        if (inscricaoRepository.existsById(id)) {
            inscricaoRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public List<Inscricao> buscarPorCliente(Long clienteId) {
        return inscricaoRepository.findByClienteId(clienteId);
    }

    public List<Inscricao> buscarPorViagem(Long viagemId) {
        return inscricaoRepository.findByViagemId(viagemId);
    }
}

