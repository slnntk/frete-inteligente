package frete_inteligente.com.frete_inteligente.service;

import frete_inteligente.com.frete_inteligente.domain.payment.Pagamento;
import frete_inteligente.com.frete_inteligente.exception.EntityNotFoundException;
import frete_inteligente.com.frete_inteligente.domain.payment.PagamentoStatus;
import frete_inteligente.com.frete_inteligente.domain.trip.Viagem;
import frete_inteligente.com.frete_inteligente.domain.user.Usuario;
import frete_inteligente.com.frete_inteligente.dto.PagamentoRequestDTO;
import frete_inteligente.com.frete_inteligente.dto.PagamentoResponseDTO;
import frete_inteligente.com.frete_inteligente.repository.PagamentoRepository;
import frete_inteligente.com.frete_inteligente.repository.UsuarioRepository;
import frete_inteligente.com.frete_inteligente.repository.ViagemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PagamentoService {

    private final PagamentoRepository pagamentoRepository;
    private final UsuarioRepository usuarioRepository;
    private final ViagemRepository viagemRepository;

    @Transactional
    public PagamentoResponseDTO criar(PagamentoRequestDTO dto) {
        if (dto.getUsuarioId() == null) {
            throw new IllegalArgumentException("ID do usuário é obrigatório");
        }
        if (dto.getViagemId() == null) {
            throw new IllegalArgumentException("ID da viagem é obrigatório");
        }

        Usuario usuario = usuarioRepository.findById(dto.getUsuarioId())
                .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado"));

        Viagem viagem = viagemRepository.findById(dto.getViagemId())
                .orElseThrow(() -> new IllegalArgumentException("Viagem não encontrada"));

        // Verificar se já existe pagamento para esta viagem e usuário
        Optional<Pagamento> pagamentoExistente = pagamentoRepository.findByViagemIdAndUsuarioId(
                dto.getViagemId(), dto.getUsuarioId());

        if (pagamentoExistente.isPresent()) {
            return toDTO(pagamentoExistente.get());
        }

        Pagamento pagamento = Pagamento.builder()
                .usuario(usuario)
                .viagem(viagem)
                .valor(dto.getValor())
                .status(PagamentoStatus.PENDENTE)
                .metodo(dto.getMetodo() != null ? dto.getMetodo() : "PIX")
                .referencia(dto.getReferencia())
                .criadoEm(java.time.OffsetDateTime.now())
                .build();

        pagamento = pagamentoRepository.save(pagamento);
        return toDTO(pagamento);
    }

    @Transactional
    public PagamentoResponseDTO confirmarPagamento(Long pagamentoId) {
        Pagamento pagamento = pagamentoRepository.findById(pagamentoId)
                .orElseThrow(() -> new EntityNotFoundException("Pagamento não encontrado"));

        pagamento.setStatus(PagamentoStatus.PAGO);
        pagamento = pagamentoRepository.save(pagamento);

        return toDTO(pagamento);
    }

    public Optional<PagamentoResponseDTO> buscarPorViagemEUsuario(Long viagemId, Long usuarioId) {
        return pagamentoRepository.findByViagemIdAndUsuarioId(viagemId, usuarioId)
                .map(this::toDTO);
    }

    public List<PagamentoResponseDTO> buscarPorViagem(Long viagemId) {
        return pagamentoRepository.findAll().stream()
                .filter(p -> p.getViagem().getId().equals(viagemId))
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    private PagamentoResponseDTO toDTO(Pagamento pagamento) {
        if (pagamento == null) {
            throw new IllegalArgumentException("Pagamento não pode ser nulo");
        }
        return PagamentoResponseDTO.builder()
                .id(pagamento.getId())
                .viagemId(pagamento.getViagem() != null ? pagamento.getViagem().getId() : null)
                .usuarioId(pagamento.getUsuario() != null ? pagamento.getUsuario().getId() : null)
                .valor(pagamento.getValor())
                .status(pagamento.getStatus())
                .metodo(pagamento.getMetodo())
                .referencia(pagamento.getReferencia())
                .criadoEm(pagamento.getCriadoEm())
                .build();
    }
}
