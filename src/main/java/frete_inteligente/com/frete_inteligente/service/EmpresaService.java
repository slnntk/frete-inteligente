package frete_inteligente.com.frete_inteligente.service;

import frete_inteligente.com.frete_inteligente.domain.company.Empresa;
import frete_inteligente.com.frete_inteligente.domain.user.Usuario;
import frete_inteligente.com.frete_inteligente.domain.user.UsuarioTipo;
import frete_inteligente.com.frete_inteligente.dto.EmpresaDTO;
import frete_inteligente.com.frete_inteligente.repository.EmpresaRepository;
import frete_inteligente.com.frete_inteligente.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EmpresaService {

    private final EmpresaRepository empresaRepository;
    private final UsuarioRepository usuarioRepository;

    @Transactional
    public EmpresaDTO criar(EmpresaDTO dto) {
        // Criar usuário
        Usuario usuario = Usuario.builder()
                .tipo(UsuarioTipo.EMPRESA)
                .nome(dto.getNome())
                .email(dto.getEmail())
                .telefone(dto.getTelefone())
                .senhaHash(dto.getSenha()) // Em produção, usar BCrypt
                .build();
        
        usuario = usuarioRepository.save(usuario);

        // Criar empresa
        Empresa empresa = Empresa.builder()
                .usuario(usuario)
                .cnpj(dto.getCnpj())
                .razaoSocial(dto.getRazaoSocial())
                .build();

        empresa = empresaRepository.save(empresa);

        return toDTO(empresa);
    }

    public List<EmpresaDTO> listarTodos() {
        return empresaRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public Optional<EmpresaDTO> buscarPorId(Long id) {
        return empresaRepository.findById(id).map(this::toDTO);
    }

    @Transactional
    public Optional<EmpresaDTO> atualizar(Long id, EmpresaDTO dto) {
        return empresaRepository.findById(id).map(empresa -> {
            // Atualizar usuário
            Usuario usuario = empresa.getUsuario();
            usuario.setNome(dto.getNome());
            usuario.setEmail(dto.getEmail());
            usuario.setTelefone(dto.getTelefone());
            if (dto.getSenha() != null && !dto.getSenha().isEmpty()) {
                usuario.setSenhaHash(dto.getSenha());
            }
            usuarioRepository.save(usuario);

            // Atualizar empresa
            empresa.setCnpj(dto.getCnpj());
            empresa.setRazaoSocial(dto.getRazaoSocial());
            empresa = empresaRepository.save(empresa);

            return toDTO(empresa);
        });
    }

    @Transactional
    public boolean deletar(Long id) {
        if (empresaRepository.existsById(id)) {
            empresaRepository.deleteById(id);
            usuarioRepository.deleteById(id);
            return true;
        }
        return false;
    }

    private EmpresaDTO toDTO(Empresa empresa) {
        Usuario usuario = empresa.getUsuario();
        return EmpresaDTO.builder()
                .id(empresa.getId())
                .nome(usuario.getNome())
                .email(usuario.getEmail())
                .telefone(usuario.getTelefone())
                .cnpj(empresa.getCnpj())
                .razaoSocial(empresa.getRazaoSocial())
                .build();
    }
}

