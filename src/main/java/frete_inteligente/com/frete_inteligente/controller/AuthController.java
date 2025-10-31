package frete_inteligente.com.frete_inteligente.controller;

import frete_inteligente.com.frete_inteligente.domain.user.Usuario;
import frete_inteligente.com.frete_inteligente.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UsuarioRepository usuarioRepository;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        // Buscar usuário por email
        Usuario usuario = usuarioRepository.findAll().stream()
                .filter(u -> u.getEmail().equals(loginRequest.getEmail()))
                .findFirst()
                .orElse(null);

        if (usuario == null) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Credenciais inválidas");
            return ResponseEntity.status(401).body(error);
        }

        // Em produção, devemos verificar a senha hasheada
        // Por enquanto, vamos retornar o usuário encontrado
        Map<String, Object> response = new HashMap<>();
        response.put("usuario", usuario);
        response.put("token", "simulated-jwt-token");

        return ResponseEntity.ok(response);
    }

    // Inner class para request
    public static class LoginRequest {
        private String email;
        private String password;

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }
    }
}

