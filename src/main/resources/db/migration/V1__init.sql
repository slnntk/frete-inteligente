-- Esquema inicial mínimo para MVP
CREATE TABLE IF NOT EXISTS usuario (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    tipo VARCHAR(20) NOT NULL, -- EMPRESA | AUTONOMO | CLIENTE
    nome VARCHAR(120) NOT NULL,
    email VARCHAR(160) NOT NULL UNIQUE,
    cpf VARCHAR(14),
    telefone VARCHAR(30),
    senha_hash VARCHAR(255) NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS empresa (
    id BIGINT PRIMARY KEY,
    cnpj VARCHAR(18) NOT NULL UNIQUE,
    razao_social VARCHAR(160) NOT NULL,
    FOREIGN KEY (id) REFERENCES usuario(id)
);

CREATE TABLE IF NOT EXISTS autonomo (
    id BIGINT PRIMARY KEY,
    cnh VARCHAR(20),
    categoria_cnh VARCHAR(3),
    ear BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (id) REFERENCES usuario(id)
);

CREATE TABLE IF NOT EXISTS veiculo (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    proprietario_id BIGINT NOT NULL, -- empresa ou autonomo (usuario.id)
    placa VARCHAR(10) NOT NULL,
    modelo VARCHAR(80),
    capacidade INT,
    FOREIGN KEY (proprietario_id) REFERENCES usuario(id)
);

CREATE TABLE IF NOT EXISTS postagem (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    autor_id BIGINT NOT NULL, -- empresa/autonomo
    titulo VARCHAR(160) NOT NULL,
    regiao VARCHAR(160),
    descricao TEXT,
    preco DECIMAL(10,2),
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (autor_id) REFERENCES usuario(id)
);

CREATE TABLE IF NOT EXISTS viagem (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    postagem_id BIGINT NOT NULL,
    veiculo_id BIGINT,
    horario_partida TIME NOT NULL,
    destino VARCHAR(160),
    capacidade INT,
    status VARCHAR(20) DEFAULT 'ABERTA',
    FOREIGN KEY (postagem_id) REFERENCES postagem(id),
    FOREIGN KEY (veiculo_id) REFERENCES veiculo(id)
);

CREATE TABLE IF NOT EXISTS inscricao (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    viagem_id BIGINT NOT NULL,
    cliente_id BIGINT NOT NULL,
    status VARCHAR(20) DEFAULT 'ATIVA', -- ATIVA | CANCELADA
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (viagem_id, cliente_id),
    FOREIGN KEY (viagem_id) REFERENCES viagem(id),
    FOREIGN KEY (cliente_id) REFERENCES usuario(id)
);

CREATE TABLE IF NOT EXISTS checkin (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    viagem_id BIGINT NOT NULL,
    cliente_id BIGINT NOT NULL,
    realizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (viagem_id, cliente_id, realizado_em),
    FOREIGN KEY (viagem_id) REFERENCES viagem(id),
    FOREIGN KEY (cliente_id) REFERENCES usuario(id)
);

CREATE TABLE IF NOT EXISTS pagamento (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    usuario_id BIGINT NOT NULL,
    valor DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'PENDENTE', -- PENDENTE | PAGO | FALHOU
    metodo VARCHAR(20) DEFAULT 'PIX',
    referencia VARCHAR(120),
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuario(id)
);


