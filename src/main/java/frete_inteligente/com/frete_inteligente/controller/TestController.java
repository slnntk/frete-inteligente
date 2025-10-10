package frete_inteligente.com.frete_inteligente.controller;

import frete_inteligente.com.frete_inteligente.domain.user.Usuario;
import frete_inteligente.com.frete_inteligente.domain.user.UsuarioTipo;
import frete_inteligente.com.frete_inteligente.domain.post.Postagem;
import frete_inteligente.com.frete_inteligente.domain.trip.Viagem;
import frete_inteligente.com.frete_inteligente.domain.trip.ViagemStatus;
import frete_inteligente.com.frete_inteligente.domain.trip.Checkin;
import frete_inteligente.com.frete_inteligente.repository.UsuarioRepository;
import frete_inteligente.com.frete_inteligente.repository.PostagemRepository;
import frete_inteligente.com.frete_inteligente.repository.ViagemRepository;
import frete_inteligente.com.frete_inteligente.repository.CheckinRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalTime;
import java.time.OffsetDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/test")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class TestController {

    private final UsuarioRepository usuarioRepository;
    private final PostagemRepository postagemRepository;
    private final ViagemRepository viagemRepository;
    private final CheckinRepository checkinRepository;

    @PostMapping("/dados-exemplo")
    public ResponseEntity<Map<String, Object>> criarDadosExemplo() {
        Map<String, Object> resultado = new HashMap<>();
        
        try {
            // Criar usuário empresa
            Usuario empresa = Usuario.builder()
                    .tipo(UsuarioTipo.EMPRESA)
                    .nome("Transporte Universitário LTDA")
                    .email("contato@transporte.com")
                    .cpf("12345678901")
                    .telefone("(85) 99999-9999")
                    .senhaHash("senha123")
                    .build();
            empresa = usuarioRepository.save(empresa);
            resultado.put("empresa", empresa);

            // Criar usuário cliente
            Usuario cliente = Usuario.builder()
                    .tipo(UsuarioTipo.CLIENTE)
                    .nome("João Silva")
                    .email("joao@email.com")
                    .cpf("98765432100")
                    .telefone("(85) 88888-8888")
                    .senhaHash("senha456")
                    .build();
            cliente = usuarioRepository.save(cliente);
            resultado.put("cliente", cliente);

            // Criar postagem
            Postagem postagem = Postagem.builder()
                    .autor(empresa)
                    .titulo("Frete para Universitários - Unifor")
                    .regiao("Maranguape e Maracanaú")
                    .descricao("Levamos alunos universitários para Unifor, Estácio, FB, UNI7 e Unichristus")
                    .preco(new BigDecimal("15.00"))
                    .build();
            postagem = postagemRepository.save(postagem);
            resultado.put("postagem", postagem);

            // Criar viagem
            Viagem viagem = Viagem.builder()
                    .postagem(postagem)
                    .horarioPartida(LocalTime.of(5, 30))
                    .destino("Unifor")
                    .capacidade(20)
                    .status(ViagemStatus.ABERTA)
                    .build();
            viagem = viagemRepository.save(viagem);
            resultado.put("viagem", viagem);

            // Criar checkin
            Checkin checkin = Checkin.builder()
                    .viagem(viagem)
                    .cliente(cliente)
                    .realizadoEm(OffsetDateTime.now())
                    .build();
            checkin = checkinRepository.save(checkin);
            resultado.put("checkin", checkin);

            resultado.put("sucesso", true);
            resultado.put("mensagem", "Dados de exemplo criados com sucesso!");
            
            return ResponseEntity.ok(resultado);
            
        } catch (Exception e) {
            resultado.put("sucesso", false);
            resultado.put("erro", e.getMessage());
            return ResponseEntity.badRequest().body(resultado);
        }
    }

    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> status() {
        Map<String, Object> status = new HashMap<>();
        status.put("usuarios", usuarioRepository.count());
        status.put("postagens", postagemRepository.count());
        status.put("viagens", viagemRepository.count());
        status.put("checkins", checkinRepository.count());
        status.put("status", "OK");
        return ResponseEntity.ok(status);
    }
}
