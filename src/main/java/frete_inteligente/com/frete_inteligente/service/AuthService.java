package frete_inteligente.com.frete_inteligente.service;

import frete_inteligente.com.frete_inteligente.domain.user.Usuario;
import frete_inteligente.com.frete_inteligente.dto.LoginRequestDTO;
import frete_inteligente.com.frete_inteligente.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UsuarioRepository usuarioRepository;

    /**
     * Autentica um usuário
     * TODO: Implementar verificação de senha com BCrypt em produção
     */
    public Map<String, Object> login(LoginRequestDTO loginRequest) {
        // Buscar usuário por email
        Usuario usuario = usuarioRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Credenciais inválidas"));

        // TODO: Em produção, verificar senha hasheada com BCrypt
        // Por enquanto, apenas verifica se o usuário existe
        // if (!passwordEncoder.matches(loginRequest.getPassword(), usuario.getSenhaHash())) {
        //     throw new IllegalArgumentException("Credenciais inválidas");
        // }

        Map<String, Object> response = new HashMap<>();
        response.put("usuario", usuario);
        response.put("token", "simulated-jwt-token"); // TODO: Implementar JWT real

        return response;
    }

    public Optional<Usuario> buscarUsuarioPorEmail(String email) {
        return usuarioRepository.findByEmail(email);
    }
}

