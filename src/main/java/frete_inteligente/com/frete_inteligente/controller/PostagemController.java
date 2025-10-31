package frete_inteligente.com.frete_inteligente.controller;

import frete_inteligente.com.frete_inteligente.domain.post.Postagem;
import frete_inteligente.com.frete_inteligente.repository.PostagemRepository;
import frete_inteligente.com.frete_inteligente.repository.ViagemRepository;
import frete_inteligente.com.frete_inteligente.domain.trip.Viagem;
import frete_inteligente.com.frete_inteligente.domain.trip.ViagemStatus;
import frete_inteligente.com.frete_inteligente.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/postagens")
@RequiredArgsConstructor
public class PostagemController {

    private final PostagemRepository postagemRepository;
    private final UsuarioRepository usuarioRepository;
    private final ViagemRepository viagemRepository;

    @GetMapping
    public List<Postagem> listarPostagens() {
        return postagemRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Postagem> buscarPostagem(@PathVariable Long id) {
        Optional<Postagem> postagem = postagemRepository.findById(id);
        return postagem.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Postagem> criarPostagem(@RequestBody Postagem postagem) {
        // Verificar se o autor existe
        if (!usuarioRepository.existsById(postagem.getAutor().getId())) {
            return ResponseEntity.badRequest().build();
        }
        Postagem salva = postagemRepository.save(postagem);

        // Criar viagem padrão automaticamente vinculada à postagem
        Viagem viagem = Viagem.builder()
                .postagem(salva)
                .horarioPartida(java.time.LocalTime.of(5, 30))
                .destino(salva.getRegiao() != null ? salva.getRegiao() : "A definir")
                .capacidade(20)
                .status(ViagemStatus.ABERTA)
                .build();
        viagemRepository.save(viagem);

        return ResponseEntity.ok(salva);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Postagem> atualizarPostagem(@PathVariable Long id, @RequestBody Postagem postagemAtualizada) {
        if (!postagemRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        postagemAtualizada.setId(id);
        return ResponseEntity.ok(postagemRepository.save(postagemAtualizada));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarPostagem(@PathVariable Long id) {
        if (!postagemRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        postagemRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/autor/{autorId}")
    public List<Postagem> buscarPorAutor(@PathVariable Long autorId) {
        return postagemRepository.findAll().stream()
                .filter(p -> p.getAutor().getId().equals(autorId))
                .toList();
    }
}
