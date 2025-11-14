package frete_inteligente.com.frete_inteligente.service;

import frete_inteligente.com.frete_inteligente.domain.driver.Autonomo;
import frete_inteligente.com.frete_inteligente.domain.user.Usuario;
import frete_inteligente.com.frete_inteligente.domain.user.UsuarioTipo;
import frete_inteligente.com.frete_inteligente.dto.AutonomoDTO;
import frete_inteligente.com.frete_inteligente.repository.AutonomoRepository;
import frete_inteligente.com.frete_inteligente.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AutonomoService {

    private final AutonomoRepository autonomoRepository;
    private final UsuarioRepository usuarioRepository;

    @Transactional
    public AutonomoDTO criar(AutonomoDTO dto) {
        // Criar usuário
        Usuario usuario = Usuario.builder()
                .tipo(UsuarioTipo.AUTONOMO)
                .nome(dto.getNome())
                .email(dto.getEmail())
                .cpf(dto.getCpf())
                .telefone(dto.getTelefone())
                .senhaHash(dto.getSenha()) // Em produção, usar BCrypt
                .build();
        
        usuario = usuarioRepository.save(usuario);

        // Criar autônomo
        Autonomo autonomo = Autonomo.builder()
                .usuario(usuario)
                .cnh(dto.getCnh())
                .categoriaCnh(dto.getCategoriaCnh())
                .ear(dto.getEar())
                .build();

        autonomo = autonomoRepository.save(autonomo);

        return toDTO(autonomo);
    }

    public List<AutonomoDTO> listarTodos() {
        return autonomoRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public Optional<AutonomoDTO> buscarPorId(Long id) {
        return autonomoRepository.findById(id).map(this::toDTO);
    }

    @Transactional
    public Optional<AutonomoDTO> atualizar(Long id, AutonomoDTO dto) {
        return autonomoRepository.findById(id).map(autonomo -> {
            // Atualizar usuário
            Usuario usuario = autonomo.getUsuario();
            usuario.setNome(dto.getNome());
            usuario.setEmail(dto.getEmail());
            usuario.setCpf(dto.getCpf());
            usuario.setTelefone(dto.getTelefone());
            if (dto.getSenha() != null && !dto.getSenha().isEmpty()) {
                usuario.setSenhaHash(dto.getSenha());
            }
            usuarioRepository.save(usuario);

            // Atualizar autônomo
            autonomo.setCnh(dto.getCnh());
            autonomo.setCategoriaCnh(dto.getCategoriaCnh());
            autonomo.setEar(dto.getEar());
            autonomo = autonomoRepository.save(autonomo);

            return toDTO(autonomo);
        });
    }

    @Transactional
    public boolean deletar(Long id) {
        if (autonomoRepository.existsById(id)) {
            autonomoRepository.deleteById(id);
            usuarioRepository.deleteById(id);
            return true;
        }
        return false;
    }

    private AutonomoDTO toDTO(Autonomo autonomo) {
        Usuario usuario = autonomo.getUsuario();
        return AutonomoDTO.builder()
                .id(autonomo.getId())
                .nome(usuario.getNome())
                .email(usuario.getEmail())
                .cpf(usuario.getCpf())
                .telefone(usuario.getTelefone())
                .cnh(autonomo.getCnh())
                .categoriaCnh(autonomo.getCategoriaCnh())
                .ear(autonomo.getEar())
                .build();
    }
}

