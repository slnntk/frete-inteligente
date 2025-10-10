package frete_inteligente.com.frete_inteligente.controller;

import frete_inteligente.com.frete_inteligente.domain.post.Postagem;
import frete_inteligente.com.frete_inteligente.repository.PostagemRepository;
import frete_inteligente.com.frete_inteligente.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/postagens")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PostagemController {

    private final PostagemRepository postagemRepository;
    private final UsuarioRepository usuarioRepository;

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
        return ResponseEntity.ok(postagemRepository.save(postagem));
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
