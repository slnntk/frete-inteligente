# Plano de Refatoração do Backend

## 🎯 Objetivo

Refatorar o backend para seguir princípios SOLID, melhorar a arquitetura em camadas e facilitar manutenção e testes.

## 📋 Fase 1: Criar Services Faltantes (Prioridade ALTA)

### 1.1 PostagemService
**Responsabilidades:**
- CRUD de postagens
- Validação de autor
- Criação automática de viagem padrão (regra de negócio)

### 1.2 ViagemService
**Responsabilidades:**
- CRUD de viagens
- Listagem de participantes com agregação
- Atualização de localização do motorista
- Validações de negócio

### 1.3 CheckinService
**Responsabilidades:**
- CRUD de check-ins
- Definição automática de ponto de partida
- Atualização de localização do cliente
- Validações de viagem e cliente

### 1.4 ColetaService
**Responsabilidades:**
- CRUD de coletas
- Validações de viagem e cliente
- Timestamp automático

### 1.5 InscricaoService
**Responsabilidades:**
- CRUD de inscrições
- Validações de capacidade da viagem
- Validações de cliente e viagem

### 1.6 RotaService
**Responsabilidades:**
- Cálculo de rotas otimizadas
- Integração com Mapbox Directions API
- Algoritmo de otimização (Nearest Neighbor)
- Cálculo de distâncias (Haversine)

### 1.7 AuthService
**Responsabilidades:**
- Autenticação de usuários
- Verificação de senha (BCrypt)
- Geração de tokens JWT
- Validação de credenciais

## 📋 Fase 2: Criar DTOs Consistentes (Prioridade ALTA)

### 2.1 Request DTOs
- `PostagemRequestDTO`
- `ViagemRequestDTO`
- `CheckinRequestDTO`
- `ColetaRequestDTO`
- `InscricaoRequestDTO`
- `RotaRequestDTO`
- `LoginRequestDTO`

### 2.2 Response DTOs
- `PostagemResponseDTO`
- `ViagemResponseDTO`
- `CheckinResponseDTO`
- `ColetaResponseDTO`
- `InscricaoResponseDTO`
- `RotaResponseDTO`
- `ParticipanteResponseDTO`
- `LoginResponseDTO`

### 2.3 Mover DTOs Internos
- Mover `ParticipanteDTO` de `ViagemController` para `dto`
- Mover `LocalizacaoMotoristaDTO` para `dto`

## 📋 Fase 3: Otimizar Repositories (Prioridade MÉDIA)

### 3.1 Criar Query Methods
- `InscricaoRepository.findByViagemId(Long viagemId)`
- `InscricaoRepository.findByClienteId(Long clienteId)`
- `CheckinRepository.findByViagemIdAndClienteId(Long viagemId, Long clienteId)`
- `CheckinRepository.findByViagemId(Long viagemId)`
- `CheckinRepository.findByClienteId(Long clienteId)`
- `ColetaRepository.findByViagemId(Long viagemId)`
- `ColetaRepository.findByClienteId(Long clienteId)`
- `ViagemRepository.findByPostagemId(Long postagemId)`
- `ViagemRepository.findByStatus(ViagemStatus status)`
- `PostagemRepository.findByAutorId(Long autorId)`

## 📋 Fase 4: Tratamento de Exceções (Prioridade ALTA)

### 4.1 Criar Exceções Customizadas
- `EntityNotFoundException`
- `ValidationException`
- `BusinessRuleException`
- `AuthenticationException`

### 4.2 Criar ControllerAdvice
- `GlobalExceptionHandler`
- Tratamento centralizado de exceções
- Respostas padronizadas de erro

## 📋 Fase 5: Validação de Dados (Prioridade MÉDIA)

### 5.1 Adicionar Bean Validation
- Anotações `@Valid` nos controllers
- Validações em DTOs
- Mensagens de erro customizadas

## 📋 Fase 6: Refatorar Controllers (Prioridade ALTA)

### 6.1 PostagemController
- Remover acesso direto a repositórios
- Usar `PostagemService`
- Remover lógica de criação de viagem

### 6.2 ViagemController
- Remover acesso direto a repositórios
- Usar `ViagemService`
- Simplificar métodos

### 6.3 CheckinController
- Remover acesso direto a repositórios
- Usar `CheckinService`
- Remover lógica de negócio

### 6.4 ColetaController
- Remover acesso direto a repositórios
- Usar `ColetaService`

### 6.5 InscricaoController
- Remover acesso direto a repositórios
- Usar `InscricaoService`

### 6.6 RotaController
- Remover acesso direto a repositórios
- Usar `RotaService`
- Mover toda lógica de cálculo

### 6.7 AuthController
- Remover acesso direto a repositórios
- Usar `AuthService`
- Implementar verificação de senha

## 📋 Fase 7: Segurança e Autenticação (Prioridade MÉDIA)

### 7.1 Implementar BCrypt
- Hash de senhas
- Verificação de senhas

### 7.2 Implementar JWT
- Geração de tokens
- Validação de tokens
- Proteção de endpoints

### 7.3 Proteger TestController
- Remover em produção
- Ou adicionar perfil de desenvolvimento
- Ou adicionar autenticação

## 📋 Fase 8: Melhorias Adicionais (Prioridade BAIXA)

### 8.1 Adicionar Logging
- Log de operações importantes
- Log de erros

### 8.2 Documentação API
- Swagger/OpenAPI
- Documentação de endpoints

### 8.3 Testes
- Testes unitários para services
- Testes de integração para controllers

## 🚀 Ordem de Implementação Recomendada

1. **Semana 1:** Fase 1 (Criar Services)
2. **Semana 2:** Fase 2 (Criar DTOs) + Fase 3 (Otimizar Repositories)
3. **Semana 3:** Fase 4 (Exceções) + Fase 5 (Validação)
4. **Semana 4:** Fase 6 (Refatorar Controllers)
5. **Semana 5:** Fase 7 (Segurança) + Fase 8 (Melhorias)

## ⚠️ Considerações Importantes

1. **Refatoração Incremental:** Fazer uma entidade por vez para não quebrar o sistema
2. **Testes:** Criar testes antes de refatorar (quando possível)
3. **Compatibilidade:** Manter compatibilidade com frontend durante refatoração
4. **Rollback:** Ter plano de rollback para cada fase

## 📊 Métricas de Sucesso

- ✅ Todos os controllers usam services
- ✅ Nenhum controller acessa repositórios diretamente
- ✅ Toda lógica de negócio está em services
- ✅ DTOs consistentes em todas as operações
- ✅ Tratamento de exceções centralizado
- ✅ Validação de dados implementada
- ✅ Queries otimizadas
- ✅ Autenticação segura

