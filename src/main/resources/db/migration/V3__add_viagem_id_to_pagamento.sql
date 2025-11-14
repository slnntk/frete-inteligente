-- Adicionar campo viagem_id na tabela pagamento
ALTER TABLE pagamento ADD COLUMN viagem_id BIGINT;
ALTER TABLE pagamento ADD CONSTRAINT fk_pagamento_viagem FOREIGN KEY (viagem_id) REFERENCES viagem(id);

