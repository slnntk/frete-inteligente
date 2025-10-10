# Frete Inteligente - Documentação técnica do Projeto

## 📋 Visão Geral

O **Frete Inteligente** é uma aplicação Spring Boot que facilita a conexão entre empresas de transporte, motoristas autônomos e clientes para serviços de frete universitário. O sistema permite que empresas publiquem ofertas de transporte, clientes se inscrevam em viagens e motoristas façam check-in durante as viagens.

## 🏗️ Arquitetura do Sistema

### Tecnologias Utilizadas
- **Backend**: Spring Boot 3.x
- **Banco de Dados**: H2 (desenvolvimento) / PostgreSQL (produção)
- **ORM**: JPA/Hibernate
- **Build Tool**: Maven
- **Linguagem**: Java 17+

### Estrutura do Projeto
```
src/main/java/frete_inteligente/com/frete_inteligente/
├── controller/          # Controladores REST
│   ├── UsuarioController.java
│   ├── PostagemController.java
│   ├── ViagemController.java
│   ├── CheckinController.java
│   └── TestController.java
├── domain/             # Entidades de domínio
│   ├── user/           # Usuários
│   ├── post/           # Postagens
│   ├── trip/           # Viagens e Check-ins
│   ├── company/        # Empresas
│   ├── driver/         # Motoristas autônomos
│   ├── payment/        # Pagamentos
│   └── vehicle/        # Veículos
├── repository/         # Repositórios JPA
└── FreteInteligenteApplication.java
```

## 👥 Entidades Principais

### Usuario
Representa todos os tipos de usuários do sistema:
- **Tipos**: EMPRESA, AUTONOMO, CLIENTE
- **Campos**: id, tipo, nome, email, cpf, telefone, senhaHash

### Postagem
Representa ofertas de transporte publicadas por empresas:
- **Campos**: id, autor, titulo, regiao, descricao, preco
- **Relacionamento**: Muitas postagens para um autor (Usuario)

### Viagem
Representa uma viagem específica baseada em uma postagem:
- **Campos**: id, postagem, horarioPartida, destino, capacidade, status
- **Status**: ABERTA, FECHADA, EM_ANDAMENTO, CONCLUIDA

### Checkin
Representa o registro de presença de um cliente em uma viagem:
- **Campos**: id, viagem, cliente, realizadoEm
- **Relacionamentos**: Uma viagem pode ter muitos check-ins

## 🚀 Como Executar o Projeto

### Pré-requisitos
- Java 17 ou superior
- Maven 3.6+
- IDE (IntelliJ IDEA, Eclipse, VS Code)

### Configuração

1. **Clone o repositório** (se aplicável)
2. **Configure o banco de dados** no `application.properties`:
```properties
spring.application.name=frete-inteligente
spring.flyway.enabled=false
spring.jpa.hibernate.ddl-auto=update
```

3. **Execute a aplicação**:
```bash
# Via Maven
mvn spring-boot:run

# Ou compile e execute
mvn clean package
java -jar target/frete-inteligente-0.0.1-SNAPSHOT.jar
```

4. **Acesse a aplicação**:
- API: `http://localhost:8080`
- H2 Console: `http://localhost:8080/h2-console` (se configurado)

## 📡 API Endpoints

### Base URL
```
http://localhost:8080
```

### Headers Padrão
```
Content-Type: application/json
Accept: application/json
```

## 👤 Usuários (`/api/usuarios`)

### Listar Usuários
```http
GET /api/usuarios
```

### Buscar Usuário por ID
```http
GET /api/usuarios/{id}
```

### Criar Usuário
```http
POST /api/usuarios
Content-Type: application/json

{
  "tipo": "EMPRESA",
  "nome": "Transporte Universitário LTDA",
  "email": "contato@transporte.com",
  "cpf": "12345678901",
  "telefone": "(85) 99999-9999",
  "senhaHash": "senha123"
}
```

### Atualizar Usuário
```http
PUT /api/usuarios/{id}
Content-Type: application/json

{
  "tipo": "EMPRESA",
  "nome": "Nome Atualizado",
  "email": "novo@email.com",
  "cpf": "12345678901",
  "telefone": "(85) 99999-9999",
  "senhaHash": "senha123"
}
```

### Deletar Usuário
```http
DELETE /api/usuarios/{id}
```

### Buscar por Tipo
```http
GET /api/usuarios/tipo/{tipo}
```
**Tipos válidos**: `EMPRESA`, `AUTONOMO`, `CLIENTE`

## 📝 Postagens (`/api/postagens`)

### Listar Postagens
```http
GET /api/postagens
```

### Buscar Postagem por ID
```http
GET /api/postagens/{id}
```

### Criar Postagem
```http
POST /api/postagens
Content-Type: application/json

{
  "autor": {
    "id": 1
  },
  "titulo": "Frete para Universitários - Unifor",
  "regiao": "Maranguape e Maracanaú",
  "descricao": "Levamos alunos universitários para Unifor, Estácio, FB, UNI7 e Unichristus",
  "preco": 15.00
}
```

### Atualizar Postagem
```http
PUT /api/postagens/{id}
Content-Type: application/json

{
  "autor": {
    "id": 1
  },
  "titulo": "Título Atualizado",
  "regiao": "Nova Região",
  "descricao": "Nova descrição",
  "preco": 20.00
}
```

### Deletar Postagem
```http
DELETE /api/postagens/{id}
```

### Buscar por Autor
```http
GET /api/postagens/autor/{autorId}
```

## 🚌 Viagens (`/api/viagens`)

### Listar Viagens
```http
GET /api/viagens
```

### Buscar Viagem por ID
```http
GET /api/viagens/{id}
```

### Criar Viagem
```http
POST /api/viagens
Content-Type: application/json

{
  "postagem": {
    "id": 1
  },
  "horarioPartida": "05:30:00",
  "destino": "Unifor",
  "capacidade": 20,
  "status": "ABERTA"
}
```

### Atualizar Viagem
```http
PUT /api/viagens/{id}
Content-Type: application/json

{
  "postagem": {
    "id": 1
  },
  "horarioPartida": "06:00:00",
  "destino": "Unifor",
  "capacidade": 25,
  "status": "EM_ANDAMENTO"
}
```

### Deletar Viagem
```http
DELETE /api/viagens/{id}
```

### Buscar por Status
```http
GET /api/viagens/status/{status}
```
**Status válidos**: `ABERTA`, `FECHADA`, `EM_ANDAMENTO`, `CONCLUIDA`

### Buscar por Postagem
```http
GET /api/viagens/postagem/{postagemId}
```

## ✅ Check-ins (`/api/checkins`)

### Listar Check-ins
```http
GET /api/checkins
```

### Buscar Check-in por ID
```http
GET /api/checkins/{id}
```

### Criar Check-in
```http
POST /api/checkins
Content-Type: application/json

{
  "viagem": {
    "id": 1
  },
  "cliente": {
    "id": 2
  }
}
```

### Deletar Check-in
```http
DELETE /api/checkins/{id}
```

### Buscar por Viagem
```http
GET /api/checkins/viagem/{viagemId}
```

### Buscar por Cliente
```http
GET /api/checkins/cliente/{clienteId}
```

## 🧪 Endpoints de Teste (`/api/test`)

### Criar Dados de Exemplo
```http
POST /api/test/dados-exemplo
```
Este endpoint cria automaticamente:
- 1 usuário empresa
- 1 usuário cliente
- 1 postagem
- 1 viagem
- 1 check-in

### Status do Sistema
```http
GET /api/test/status
```
Retorna contadores de todas as entidades no banco.

## 🔧 Testando com Postman

### 1. Configuração Inicial
1. Abra o Postman
2. Crie uma nova Collection: "Frete Inteligente"
3. Configure a variável de ambiente `base_url` = `http://localhost:8080`

### 2. Sequência Recomendada de Testes

#### Passo 1: Verificar se a aplicação está rodando
```http
GET {{base_url}}/api/test/status
```

#### Passo 2: Criar dados de exemplo
```http
POST {{base_url}}/api/test/dados-exemplo
```

#### Passo 3: Testar CRUD de Usuários
1. **Listar usuários**: `GET {{base_url}}/api/usuarios`
2. **Buscar usuário**: `GET {{base_url}}/api/usuarios/1`
3. **Criar usuário**: `POST {{base_url}}/api/usuarios`
4. **Atualizar usuário**: `PUT {{base_url}}/api/usuarios/1`
5. **Deletar usuário**: `DELETE {{base_url}}/api/usuarios/1`

#### Passo 4: Testar CRUD de Postagens
1. **Listar postagens**: `GET {{base_url}}/api/postagens`
2. **Criar postagem**: `POST {{base_url}}/api/postagens`
3. **Buscar por autor**: `GET {{base_url}}/api/postagens/autor/1`

#### Passo 5: Testar CRUD de Viagens
1. **Listar viagens**: `GET {{base_url}}/api/viagens`
2. **Criar viagem**: `POST {{base_url}}/api/viagens`
3. **Buscar por status**: `GET {{base_url}}/api/viagens/status/ABERTA`

#### Passo 6: Testar CRUD de Check-ins
1. **Listar check-ins**: `GET {{base_url}}/api/checkins`
2. **Criar check-in**: `POST {{base_url}}/api/checkins`
3. **Buscar por viagem**: `GET {{base_url}}/api/checkins/viagem/1`

### 3. Headers Importantes
- **Content-Type**: `application/json` (para requisições com body)
- **Accept**: `application/json`

### 4. Códigos de Resposta Esperados
- **200 OK**: Sucesso
- **201 Created**: Criação bem-sucedida
- **204 No Content**: Deleção bem-sucedida
- **400 Bad Request**: Dados inválidos
- **404 Not Found**: Recurso não encontrado

## 📊 Estrutura de Dados

### UsuarioTipo (Enum)
```java
public enum UsuarioTipo {
    EMPRESA,    // Empresa de transporte
    AUTONOMO,   // Motorista autônomo
    CLIENTE     // Cliente/Passageiro
}
```

### ViagemStatus (Enum)
```java
public enum ViagemStatus {
    ABERTA,         // Aceitando inscrições
    FECHADA,        // Não aceita mais inscrições
    EM_ANDAMENTO,   // Viagem em progresso
    CONCLUIDA       // Viagem finalizada
}
```

## 🔍 Validações e Regras de Negócio

### Validações Implementadas
1. **Postagem**: Verifica se o autor existe antes de criar
2. **Viagem**: Verifica se a postagem e veículo existem
3. **Check-in**: Verifica se a viagem e cliente existem
4. **Usuário**: Email único no sistema

### Relacionamentos
- **Postagem** → **Usuario** (Many-to-One)
- **Viagem** → **Postagem** (Many-to-One)
- **Check-in** → **Viagem** (Many-to-One)
- **Check-in** → **Usuario** (Many-to-One)

## 🚨 Tratamento de Erros

### Respostas de Erro Padrão
```json
{
  "timestamp": "2024-01-01T12:00:00Z",
  "status": 400,
  "error": "Bad Request",
  "message": "Descrição do erro",
  "path": "/api/endpoint"
}
```

### Códigos de Status HTTP
- **200**: Sucesso
- **201**: Criado
- **204**: Sem conteúdo (deleção)
- **400**: Requisição inválida
- **404**: Não encontrado
- **500**: Erro interno do servidor

## 🔧 Configurações Avançadas

### application.properties
```properties
# Nome da aplicação
spring.application.name=frete-inteligente

# Configuração do Flyway (migrações)
spring.flyway.enabled=false

# Configuração do Hibernate
spring.jpa.hibernate.ddl-auto=update

# Configuração do servidor
server.port=8080

# Configuração do CORS (já implementado nos controllers)
# @CrossOrigin(origins = "*")
```

### Logs
Para habilitar logs detalhados, adicione ao `application.properties`:
```properties
logging.level.frete_inteligente.com.frete_inteligente=DEBUG
logging.level.org.springframework.web=DEBUG
```

## 📈 Próximos Passos

### Funcionalidades Planejadas
1. **Autenticação e Autorização**
   - JWT tokens
   - Controle de acesso por roles

2. **Pagamentos**
   - Integração com gateways de pagamento
   - Controle de status de pagamento

3. **Notificações**
   - Email/SMS para confirmações
   - Push notifications

4. **Relatórios**
   - Dashboard administrativo
   - Relatórios de viagens e receita

5. **API Externa**
   - Integração com mapas
   - Cálculo de rotas e distâncias

### Melhorias Técnicas
1. **Testes**
   - Testes unitários
   - Testes de integração
   - Testes de carga

2. **Documentação**
   - Swagger/OpenAPI
   - Documentação de API interativa

3. **Monitoramento**
   - Health checks
   - Métricas de performance
   - Logs estruturados

## 🤝 Contribuição

### Como Contribuir
1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

### Padrões de Código
- Use Java 17+ features
- Siga as convenções do Spring Boot
- Documente métodos públicos
- Escreva testes para novas funcionalidades

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique esta documentação
2. Consulte os logs da aplicação
3. Teste com o endpoint `/api/test/status`
4. Use o endpoint `/api/test/dados-exemplo` para dados de teste

---

**Versão**: 1.0.0  
**Última atualização**: Janeiro 2024  
**Autor**: Equipe Frete Inteligente
