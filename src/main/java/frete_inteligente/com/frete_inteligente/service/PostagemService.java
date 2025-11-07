package frete_inteligente.com.frete_inteligente.service;

import frete_inteligente.com.frete_inteligente.domain.post.Postagem;
import frete_inteligente.com.frete_inteligente.domain.trip.Viagem;
import frete_inteligente.com.frete_inteligente.domain.trip.ViagemStatus;
import frete_inteligente.com.frete_inteligente.dto.PostagemRequestDTO;
import frete_inteligente.com.frete_inteligente.repository.PostagemRepository;
import frete_inteligente.com.frete_inteligente.repository.UsuarioRepository;
import frete_inteligente.com.frete_inteligente.repository.ViagemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PostagemService {

    private final PostagemRepository postagemRepository;
    private final UsuarioRepository usuarioRepository;
    private final ViagemRepository viagemRepository;

    public List<Postagem> listarTodas() {
        return postagemRepository.findAll();
    }

    public Optional<Postagem> buscarPorId(Long id) {
        return postagemRepository.findById(id);
    }

    @Transactional
    public Postagem criar(PostagemRequestDTO dto) {
        // Validar se o autor existe
        var autor = usuarioRepository.findById(dto.getAutorId())
                .orElseThrow(() -> new IllegalArgumentException("Autor não encontrado"));

        // Criar postagem
        Postagem postagem = Postagem.builder()
                .autor(autor)
                .titulo(dto.getTitulo())
                .regiao(dto.getRegiao())
                .descricao(dto.getDescricao())
                .preco(dto.getPreco())
                .build();

        Postagem salva = postagemRepository.save(postagem);

        // Criar viagem padrão automaticamente vinculada à postagem (regra de negócio)
        Viagem viagem = Viagem.builder()
                .postagem(salva)
                .horarioPartida(LocalTime.of(5, 30))
                .destino(salva.getRegiao() != null ? salva.getRegiao() : "A definir")
                .capacidade(20)
                .status(ViagemStatus.ABERTA)
                .build();
        viagemRepository.save(viagem);

        return salva;
    }

    @Transactional
    public Optional<Postagem> atualizar(Long id, PostagemRequestDTO dto) {
        return postagemRepository.findById(id).map(postagem -> {
            // Validar se o autor existe (se mudou)
            if (!postagem.getAutor().getId().equals(dto.getAutorId())) {
                var autor = usuarioRepository.findById(dto.getAutorId())
                        .orElseThrow(() -> new IllegalArgumentException("Autor não encontrado"));
                postagem.setAutor(autor);
            }

            postagem.setTitulo(dto.getTitulo());
            postagem.setRegiao(dto.getRegiao());
            postagem.setDescricao(dto.getDescricao());
            postagem.setPreco(dto.getPreco());

            return postagemRepository.save(postagem);
        });
    }

    @Transactional
    public boolean deletar(Long id) {
        if (postagemRepository.existsById(id)) {
            postagemRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public List<Postagem> buscarPorAutor(Long autorId) {
        return postagemRepository.findByAutorId(autorId);
    }
}

