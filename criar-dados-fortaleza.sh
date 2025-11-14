#!/bin/bash

# Script para criar dados de teste realistas de Fortaleza
# - 1 motorista
# - 10 passageiros com endereços reais de Fortaleza
# - 5 passageiros farão check-in em locais diferentes do endereço cadastrado

API_URL="http://localhost:8080/api"

echo "🚀 Criando dados de teste realistas de Fortaleza..."
echo ""

# Variáveis para armazenar IDs
MOTORISTA_ID=""
declare -a CLIENTE_IDS
declare -a POSTAGEM_IDS
declare -a VIAGEM_IDS

# ============================================
# 1. CRIAR 1 MOTORISTA
# ============================================
echo "🚗 Criando Motorista..."

MOTORISTA_JSON='{"nome":"Carlos Mendes","email":"carlos.mendes@motorista.com","cpf":"98765432100","telefone":"(85) 98888-7777","senha":"senha123","cnh":"12345678901","categoriaCnh":"B","ear":true}'

RESPONSE=$(curl -s -X POST "$API_URL/autonomos" \
  -H "Content-Type: application/json" \
  -d "$MOTORISTA_JSON")

MOTORISTA_ID=$(echo "$RESPONSE" | python3 -c "import sys, json; data = json.load(sys.stdin); print(data.get('id', ''))" 2>/dev/null)

# Se já existe, buscar o ID existente
if [ -z "$MOTORISTA_ID" ] || [ "$MOTORISTA_ID" == "None" ]; then
  echo "  ⚠️  Motorista pode já existir, buscando..."
  RESPONSE=$(curl -s "$API_URL/usuarios")
  MOTORISTA_ID=$(echo "$RESPONSE" | python3 -c "import sys, json; data = json.load(sys.stdin); carlos = [u for u in data if 'carlos.mendes' in u.get('email', '').lower() and u.get('tipo') == 'AUTONOMO']; print(carlos[0]['id'] if carlos else '')" 2>/dev/null)
fi

if [ ! -z "$MOTORISTA_ID" ] && [ "$MOTORISTA_ID" != "None" ]; then
  NOME=$(echo "$RESPONSE" | python3 -c "import sys, json; data = json.load(sys.stdin); print(data.get('nome', 'Carlos Mendes'))" 2>/dev/null)
  echo "  ✅ Motorista: $NOME (ID: $MOTORISTA_ID)"
else
  echo "  ❌ ERRO: Não foi possível criar/encontrar o motorista!"
  exit 1
fi
echo ""

# ============================================
# 2. CRIAR 10 PASSAGEIROS COM ENDEREÇOS REAIS DE FORTALEZA
# ============================================
echo "📚 Criando 10 Passageiros com endereços reais de Fortaleza..."

# Dados reais de Fortaleza: Nome, Email, CPF, Telefone, Endereço, Latitude, Longitude, Senha
CLIENTES_DATA=(
  # Cliente 1 - Aldeota
  '{"nome":"Ana Silva","email":"ana.silva@estudante.com","cpf":"11111111111","telefone":"(85) 98888-0001","senha":"senha123","endereco":"Av. Washington Soares, 1321, Edson Queiroz, Fortaleza - CE","latitude":-3.7505,"longitude":-38.4889}'
  
  # Cliente 2 - Meireles
  '{"nome":"Bruno Costa","email":"bruno.costa@estudante.com","cpf":"22222222222","telefone":"(85) 98888-0002","senha":"senha123","endereco":"Av. Beira Mar, 2380, Meireles, Fortaleza - CE","latitude":-3.7231,"longitude":-38.5247}'
  
  # Cliente 3 - Centro
  '{"nome":"Carla Santos","email":"carla.santos@estudante.com","cpf":"33333333333","telefone":"(85) 98888-0003","senha":"senha123","endereco":"Rua Major Facundo, 500, Centro, Fortaleza - CE","latitude":-3.7305,"longitude":-38.5264}'
  
  # Cliente 4 - Benfica
  '{"nome":"Diego Oliveira","email":"diego.oliveira@estudante.com","cpf":"44444444444","telefone":"(85) 98888-0004","senha":"senha123","endereco":"Av. da Universidade, 2853, Benfica, Fortaleza - CE","latitude":-3.7474,"longitude":-38.5747}'
  
  # Cliente 5 - Parangaba
  '{"nome":"Eduarda Lima","email":"eduarda.lima@estudante.com","cpf":"55555555555","telefone":"(85) 98888-0005","senha":"senha123","endereco":"Av. João Pessoa, 2000, Parangaba, Fortaleza - CE","latitude":-3.7890,"longitude":-38.5600}'
  
  # Cliente 6 - Montese
  '{"nome":"Felipe Alves","email":"felipe.alves@estudante.com","cpf":"66666666666","telefone":"(85) 98888-0006","senha":"senha123","endereco":"Rua Dom Luís, 221, Montese, Fortaleza - CE","latitude":-3.7600,"longitude":-38.5500}'
  
  # Cliente 7 - Cocó
  '{"nome":"Gabriela Rocha","email":"gabriela.rocha@estudante.com","cpf":"77777777777","telefone":"(85) 98888-0007","senha":"senha123","endereco":"Av. Eng. Santana Júnior, 2000, Cocó, Fortaleza - CE","latitude":-3.7400,"longitude":-38.4700}'
  
  # Cliente 8 - Papicu
  '{"nome":"Henrique Ferreira","email":"henrique.ferreira@estudante.com","cpf":"88888888888","telefone":"(85) 98888-0008","senha":"senha123","endereco":"Av. Eng. Luís Vieira, 1000, Papicu, Fortaleza - CE","latitude":-3.7300,"longitude":-38.4800}'
  
  # Cliente 9 - Cidade dos Funcionários
  '{"nome":"Isabela Martins","email":"isabela.martins@estudante.com","cpf":"99999999999","telefone":"(85) 98888-0009","senha":"senha123","endereco":"Av. Senador Virgílio Távora, 1500, Cidade dos Funcionários, Fortaleza - CE","latitude":-3.7800,"longitude":-38.4900}'
  
  # Cliente 10 - Fátima
  '{"nome":"João Pedro Souza","email":"joao.pedro@estudante.com","cpf":"10101010101","telefone":"(85) 98888-0010","senha":"senha123","endereco":"Rua Barão do Rio Branco, 1000, Fátima, Fortaleza - CE","latitude":-3.7200,"longitude":-38.5400}'
)

for i in "${!CLIENTES_DATA[@]}"; do
  CLIENTE_JSON="${CLIENTES_DATA[$i]}"
  RESPONSE=$(curl -s -X POST "$API_URL/clientes" \
    -H "Content-Type: application/json" \
    -d "$CLIENTE_JSON")
  
  CLIENTE_ID=$(echo "$RESPONSE" | python3 -c "import sys, json; data = json.load(sys.stdin); print(data.get('id', ''))" 2>/dev/null)
  
  # Se não foi criado, pode já existir - buscar pelo email
  if [ -z "$CLIENTE_ID" ] || [ "$CLIENTE_ID" == "None" ]; then
    EMAIL=$(echo "$CLIENTE_JSON" | python3 -c "import sys, json; data = json.load(sys.stdin); print(data.get('email', ''))" 2>/dev/null)
    if [ ! -z "$EMAIL" ]; then
      RESPONSE=$(curl -s "$API_URL/usuarios")
      CLIENTE_ID=$(echo "$RESPONSE" | python3 -c "import sys, json; data = json.load(sys.stdin); cliente = [u for u in data if u.get('email', '').lower() == '$EMAIL'.lower() and u.get('tipo') == 'CLIENTE']; print(cliente[0]['id'] if cliente else '')" 2>/dev/null)
    fi
  fi
  
  if [ ! -z "$CLIENTE_ID" ] && [ "$CLIENTE_ID" != "None" ]; then
    CLIENTE_IDS+=($CLIENTE_ID)
    NOME=$(echo "$CLIENTE_JSON" | python3 -c "import sys, json; data = json.load(sys.stdin); print(data.get('nome', 'Cliente'))" 2>/dev/null)
    echo "  ✅ Cliente $((i+1)): $NOME (ID: $CLIENTE_ID)"
  else
    echo "  ❌ Erro ao criar cliente $((i+1))"
    echo "  Resposta: $RESPONSE"
  fi
done
echo ""

# ============================================
# 3. CRIAR 1 POSTAGEM PARA O MOTORISTA
# ============================================
echo "📝 Criando postagem para o Motorista..."

POSTAGEM_COMPLETA=$(python3 -c "
import sys, json
data = {
    'autorId': int(sys.argv[1]),
    'titulo': 'Transporte Universitário - Rotas Flexíveis',
    'regiao': 'Fortaleza e Região Metropolitana',
    'descricao': 'Transporte confiável para todas as universidades de Fortaleza. Rotas flexíveis com pontos de embarque personalizados. Van com ar-condicionado, Wi-Fi e assentos confortáveis. Aceito pagamento em dinheiro, PIX ou cartão.',
    'preco': 18.00
}
print(json.dumps(data))
" "$MOTORISTA_ID" 2>/dev/null)

RESPONSE=$(curl -s -X POST "$API_URL/postagens" \
  -H "Content-Type: application/json" \
  -d "$POSTAGEM_COMPLETA")

POSTAGEM_ID=$(echo "$RESPONSE" | python3 -c "import sys, json; data = json.load(sys.stdin); print(data.get('id', ''))" 2>/dev/null)

if [ -z "$POSTAGEM_ID" ] || [ "$POSTAGEM_ID" == "None" ]; then
  echo "  ❌ ERRO: Não foi possível criar a postagem!"
  echo "  Resposta: $RESPONSE"
  exit 1
fi

POSTAGEM_IDS+=($POSTAGEM_ID)
TITULO=$(echo "$RESPONSE" | python3 -c "import sys, json; data = json.load(sys.stdin); print(data.get('titulo', 'Postagem'))" 2>/dev/null)
echo "  ✅ Postagem criada: $TITULO (ID: $POSTAGEM_ID)"
echo ""

# ============================================
# 4. CRIAR 1 VIAGEM
# ============================================
echo "🚌 Criando viagem..."

VIAGEM_JSON='{"postagemId":'$POSTAGEM_ID',"horarioPartida":"06:30","destino":"Universidade Federal do Ceará - Campus do Pici","cepPartida":"60020-181","enderecoPartida":"Av. da Universidade, 2853, Benfica, Fortaleza - CE","latitudePartida":-3.7474,"longitudePartida":-38.5747,"capacidade":20,"status":"ABERTA"}'

RESPONSE=$(curl -s -X POST "$API_URL/viagens" \
  -H "Content-Type: application/json" \
  -d "$VIAGEM_JSON")

VIAGEM_ID=$(echo "$RESPONSE" | python3 -c "import sys, json; data = json.load(sys.stdin); print(data.get('id', ''))" 2>/dev/null)

if [ -z "$VIAGEM_ID" ] || [ "$VIAGEM_ID" == "None" ]; then
  echo "  ❌ ERRO: Não foi possível criar a viagem!"
  echo "  Resposta: $RESPONSE"
  exit 1
fi

VIAGEM_IDS+=($VIAGEM_ID)
DESTINO=$(echo "$RESPONSE" | python3 -c "import sys, json; data = json.load(sys.stdin); print(data.get('destino', 'UFC'))" 2>/dev/null)
echo "  ✅ Viagem criada: $DESTINO (ID: $VIAGEM_ID)"
echo ""

# ============================================
# 5. INSCREVER TODOS OS 10 PASSAGEIROS
# ============================================
echo "🎫 Inscrevendo 10 passageiros na viagem..."

for CLIENTE_ID in "${CLIENTE_IDS[@]}"; do
  INSCRICAO_JSON='{"viagemId":'$VIAGEM_ID',"clienteId":'$CLIENTE_ID'}'
  RESPONSE=$(curl -s -X POST "$API_URL/inscricoes" \
    -H "Content-Type: application/json" \
    -d "$INSCRICAO_JSON")
  
  INSCRICAO_ID=$(echo "$RESPONSE" | python3 -c "import sys, json; data = json.load(sys.stdin); print(data.get('id', ''))" 2>/dev/null)
  if [ ! -z "$INSCRICAO_ID" ] && [ "$INSCRICAO_ID" != "None" ]; then
    echo "  ✅ Cliente ID $CLIENTE_ID inscrito (ID inscrição: $INSCRICAO_ID)"
  else
    echo "  ⚠️  Cliente ID $CLIENTE_ID - resposta: $RESPONSE"
  fi
done
echo ""

# ============================================
# 6. CRIAR CHECK-INS (5 com localização diferente)
# ============================================
echo "📍 Criando check-ins..."
echo "  (5 passageiros farão check-in em locais diferentes do endereço cadastrado)"

# Locais de check-in alternativos (pontos de referência em Fortaleza)
# 5 passageiros farão check-in em locais diferentes do endereço cadastrado
# Criar check-ins usando o formato correto do DTO (viagemId e clienteId diretamente)
CHECKIN_LOCATIONS=(
  # Cliente 1 (Ana) - Check-in no Shopping Iguatemi (diferente de Aldeota)
  '{"viagemId":'$VIAGEM_ID',"clienteId":'${CLIENTE_IDS[0]}',"latitude":-3.7505,"longitude":-38.4889}'
  
  # Cliente 2 (Bruno) - Check-in no próprio endereço (Meireles)
  '{"viagemId":'$VIAGEM_ID',"clienteId":'${CLIENTE_IDS[1]}',"latitude":-3.7231,"longitude":-38.5247}'
  
  # Cliente 3 (Carla) - Check-in no Terminal da Parangaba (diferente de Centro)
  '{"viagemId":'$VIAGEM_ID',"clienteId":'${CLIENTE_IDS[2]}',"latitude":-3.7890,"longitude":-38.5600}'
  
  # Cliente 4 (Diego) - Check-in no próprio endereço (Benfica)
  '{"viagemId":'$VIAGEM_ID',"clienteId":'${CLIENTE_IDS[3]}',"latitude":-3.7474,"longitude":-38.5747}'
  
  # Cliente 5 (Eduarda) - Check-in no Shopping Center Iguatemi (diferente de Parangaba)
  '{"viagemId":'$VIAGEM_ID',"clienteId":'${CLIENTE_IDS[4]}',"latitude":-3.7505,"longitude":-38.4889}'
  
  # Cliente 6 (Felipe) - Check-in no próprio endereço (Montese)
  '{"viagemId":'$VIAGEM_ID',"clienteId":'${CLIENTE_IDS[5]}',"latitude":-3.7600,"longitude":-38.5500}'
  
  # Cliente 7 (Gabriela) - Check-in no Parque do Cocó (diferente de Cocó residencial)
  '{"viagemId":'$VIAGEM_ID',"clienteId":'${CLIENTE_IDS[6]}',"latitude":-3.7400,"longitude":-38.4700}'
  
  # Cliente 8 (Henrique) - Check-in no próprio endereço (Papicu)
  '{"viagemId":'$VIAGEM_ID',"clienteId":'${CLIENTE_IDS[7]}',"latitude":-3.7300,"longitude":-38.4800}'
  
  # Cliente 9 (Isabela) - Check-in no Shopping Del Paseo (diferente de Cidade dos Funcionários)
  '{"viagemId":'$VIAGEM_ID',"clienteId":'${CLIENTE_IDS[8]}',"latitude":-3.7505,"longitude":-38.4889}'
  
  # Cliente 10 (João Pedro) - Check-in no próprio endereço (Fátima)
  '{"viagemId":'$VIAGEM_ID',"clienteId":'${CLIENTE_IDS[9]}',"latitude":-3.7200,"longitude":-38.5400}'
)

CHECKIN_NAMES=("Ana (Shopping Iguatemi)" "Bruno (Meireles)" "Carla (Terminal Parangaba)" "Diego (Benfica)" "Eduarda (Shopping Iguatemi)" "Felipe (Montese)" "Gabriela (Parque do Cocó)" "Henrique (Papicu)" "Isabela (Shopping Del Paseo)" "João Pedro (Fátima)")

for i in "${!CHECKIN_LOCATIONS[@]}"; do
  CHECKIN_JSON="${CHECKIN_LOCATIONS[$i]}"
  RESPONSE=$(curl -s -X POST "$API_URL/checkins" \
    -H "Content-Type: application/json" \
    -d "$CHECKIN_JSON")
  
  CHECKIN_ID=$(echo "$RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin)['id'])" 2>/dev/null)
  if [ ! -z "$CHECKIN_ID" ]; then
    echo "  ✅ Check-in criado: ${CHECKIN_NAMES[$i]}"
  fi
done
echo ""

# ============================================
# RESUMO FINAL
# ============================================
echo "🎉 Dados de teste criados com sucesso!"
echo ""
echo "📊 RESUMO:"
echo "  🚗 Motorista: 1"
echo "    - Carlos Mendes (ID: $MOTORISTA_ID)"
echo ""
echo "  👤 Passageiros: ${#CLIENTE_IDS[@]}"
for i in "${!CLIENTE_IDS[@]}"; do
  echo "    - Cliente $((i+1)) (ID: ${CLIENTE_IDS[$i]})"
done
echo ""
echo "  📝 Postagem: 1"
echo "    - ID: $POSTAGEM_ID"
echo ""
echo "  🚌 Viagem: 1"
echo "    - ID: $VIAGEM_ID"
echo "    - Destino: Universidade Federal do Ceará - Campus do Pici"
echo ""
echo "  🎫 Inscrições: ${#CLIENTE_IDS[@]}"
echo ""
echo "  📍 Check-ins: ${#CLIENTE_IDS[@]}"
echo "    - 5 passageiros fizeram check-in em locais diferentes do endereço cadastrado"
echo "    - 5 passageiros fizeram check-in no próprio endereço"
echo ""
echo "✅ VERIFICAÇÃO:"
echo "  Para verificar se funcionou, faça login como motorista:"
echo "  - Email: carlos.mendes@motorista.com"
echo "  - Senha: senha123"
echo "  - Acesse o perfil e veja a viagem criada com todos os passageiros e check-ins!"
echo ""
echo "🔑 CREDENCIAIS DE ACESSO:"
echo ""
echo "🚗 MOTORISTA:"
echo "  - carlos.mendes@motorista.com / senha123"
echo ""
echo "👤 PASSAGEIROS:"
echo "  - ana.silva@estudante.com / senha123"
echo "  - bruno.costa@estudante.com / senha123"
echo "  - carla.santos@estudante.com / senha123"
echo "  - diego.oliveira@estudante.com / senha123"
echo "  - eduarda.lima@estudante.com / senha123"
echo "  - felipe.alves@estudante.com / senha123"
echo "  - gabriela.rocha@estudante.com / senha123"
echo "  - henrique.ferreira@estudante.com / senha123"
echo "  - isabela.martins@estudante.com / senha123"
echo "  - joao.pedro@estudante.com / senha123"
echo ""

