package frete_inteligente.com.frete_inteligente.service;

import frete_inteligente.com.frete_inteligente.domain.user.Usuario;
import frete_inteligente.com.frete_inteligente.domain.user.UsuarioTipo;
import frete_inteligente.com.frete_inteligente.dto.ClienteDTO;
import frete_inteligente.com.frete_inteligente.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ClienteService {

    private final UsuarioRepository usuarioRepository;

    @Transactional
    public ClienteDTO criar(ClienteDTO dto) {
        Usuario usuario = Usuario.builder()
                .tipo(UsuarioTipo.CLIENTE)
                .nome(dto.getNome())
                .email(dto.getEmail())
                .cpf(dto.getCpf())
                .telefone(dto.getTelefone())
                .senhaHash(dto.getSenha()) // Em produção, usar BCrypt
                .build();
        
        usuario = usuarioRepository.save(usuario);

        return toDTO(usuario);
    }

    public List<ClienteDTO> listarTodos() {
        return usuarioRepository.findAll().stream()
                .filter(u -> u.getTipo() == UsuarioTipo.CLIENTE)
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public Optional<ClienteDTO> buscarPorId(Long id) {
        return usuarioRepository.findById(id)
                .filter(u -> u.getTipo() == UsuarioTipo.CLIENTE)
                .map(this::toDTO);
    }

    @Transactional
    public Optional<ClienteDTO> atualizar(Long id, ClienteDTO dto) {
        return usuarioRepository.findById(id)
                .filter(u -> u.getTipo() == UsuarioTipo.CLIENTE)
                .map(usuario -> {
                    usuario.setNome(dto.getNome());
                    usuario.setEmail(dto.getEmail());
                    usuario.setCpf(dto.getCpf());
                    usuario.setTelefone(dto.getTelefone());
                    if (dto.getSenha() != null && !dto.getSenha().isEmpty()) {
                        usuario.setSenhaHash(dto.getSenha());
                    }
                    usuario = usuarioRepository.save(usuario);
                    return toDTO(usuario);
                });
    }

    @Transactional
    public boolean deletar(Long id) {
        Optional<Usuario> usuario = usuarioRepository.findById(id)
                .filter(u -> u.getTipo() == UsuarioTipo.CLIENTE);
        
        if (usuario.isPresent()) {
            usuarioRepository.deleteById(id);
            return true;
        }
        return false;
    }

    private ClienteDTO toDTO(Usuario usuario) {
        return ClienteDTO.builder()
                .id(usuario.getId())
                .nome(usuario.getNome())
                .email(usuario.getEmail())
                .cpf(usuario.getCpf())
                .telefone(usuario.getTelefone())
                .build();
    }
}

