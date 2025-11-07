package frete_inteligente.com.frete_inteligente.controller;

import frete_inteligente.com.frete_inteligente.domain.post.Postagem;
import frete_inteligente.com.frete_inteligente.dto.PostagemRequestDTO;
import frete_inteligente.com.frete_inteligente.exception.EntityNotFoundException;
import frete_inteligente.com.frete_inteligente.service.PostagemService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/postagens")
@RequiredArgsConstructor
public class PostagemController {

    private final PostagemService postagemService;

    @GetMapping
    public List<Postagem> listarPostagens() {
        return postagemService.listarTodas();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Postagem> buscarPostagem(@PathVariable Long id) {
        return postagemService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new EntityNotFoundException("Postagem não encontrada"));
    }

    @PostMapping
    public ResponseEntity<Postagem> criarPostagem(@Valid @RequestBody PostagemRequestDTO dto) {
        Postagem postagem = postagemService.criar(dto);
        return ResponseEntity.ok(postagem);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Postagem> atualizarPostagem(
            @PathVariable Long id,
            @Valid @RequestBody PostagemRequestDTO dto) {
        return postagemService.atualizar(id, dto)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new EntityNotFoundException("Postagem não encontrada"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarPostagem(@PathVariable Long id) {
        if (postagemService.deletar(id)) {
            return ResponseEntity.noContent().build();
        }
        throw new EntityNotFoundException("Postagem não encontrada");
    }

    @GetMapping("/autor/{autorId}")
    public List<Postagem> buscarPorAutor(@PathVariable Long autorId) {
        return postagemService.buscarPorAutor(autorId);
    }
}
