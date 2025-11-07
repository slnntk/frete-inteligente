-- Adicionar campos de localização na tabela usuario
ALTER TABLE usuario 
ADD COLUMN endereco VARCHAR(255),
ADD COLUMN latitude DECIMAL(10,8),
ADD COLUMN longitude DECIMAL(11,8);

-- Atualizar clientes existentes com localização de Fortaleza
-- Coordenadas aproximadas do centro de Fortaleza: -3.7172, -38.5433
UPDATE usuario 
SET endereco = 'Fortaleza, CE, Brasil',
    latitude = -3.7172,
    longitude = -38.5433
WHERE tipo = 'CLIENTE' AND endereco IS NULL;

