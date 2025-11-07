#!/bin/bash

# Script para criar dados de teste específicos:
# - 1 motorista com 3 viagens
# - 2 passageiros nas 3 viagens do motorista
# - 1 empresa com 1 viagem

API_URL="http://localhost:8080/api"

echo "🚀 Criando dados de teste..."
echo ""

# Variáveis para armazenar IDs
MOTORISTA_ID=""
CLIENTE1_ID=""
CLIENTE2_ID=""
EMPRESA_ID=""
declare -a POSTAGEM_MOTORISTA_IDS
declare -a VIAGEM_MOTORISTA_IDS
POSTAGEM_EMPRESA_ID=""
VIAGEM_EMPRESA_ID=""

# ============================================
# 1. CRIAR 2 CLIENTES (PASSAGEIROS)
# ============================================
echo "📚 Criando 2 Clientes/Passageiros..."

CLIENTE1_JSON='{"nome":"João Silva","email":"joao.silva@estudante.com","cpf":"12345678901","telefone":"(85) 98765-4321","senha":"senha123","matricula":"2024001234","instituicao":"Universidade Federal do Ceará","curso":"Ciência da Computação","endereco":"Rua das Flores, 123, Fortaleza, CE","latitude":-3.7172,"longitude":-38.5433}'

RESPONSE=$(curl -s -X POST "$API_URL/clientes" \
  -H "Content-Type: application/json" \
  -d "$CLIENTE1_JSON")

CLIENTE1_ID=$(echo "$RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin)['id'])" 2>/dev/null)
if [ ! -z "$CLIENTE1_ID" ]; then
  NOME=$(echo "$RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin)['nome'])" 2>/dev/null)
  echo "  ✅ Cliente 1 criado: $NOME (ID: $CLIENTE1_ID)"
fi

CLIENTE2_JSON='{"nome":"Maria Santos","email":"maria.santos@estudante.com","cpf":"11122233344","telefone":"(85) 99999-8888","senha":"senha123","matricula":"2024005678","instituicao":"Universidade Estadual do Ceará","curso":"Engenharia de Software","endereco":"Av. Beira Mar, 456, Fortaleza, CE","latitude":-3.7183,"longitude":-38.5424}'

RESPONSE=$(curl -s -X POST "$API_URL/clientes" \
  -H "Content-Type: application/json" \
  -d "$CLIENTE2_JSON")

CLIENTE2_ID=$(echo "$RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin)['id'])" 2>/dev/null)
if [ ! -z "$CLIENTE2_ID" ]; then
  NOME=$(echo "$RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin)['nome'])" 2>/dev/null)
  echo "  ✅ Cliente 2 criado: $NOME (ID: $CLIENTE2_ID)"
fi
echo ""

# ============================================
# 2. CRIAR 1 AUTÔNOMO (MOTORISTA)
# ============================================
echo "🚗 Criando 1 Motorista..."

MOTORISTA_JSON='{"nome":"Carlos Mendes","email":"carlos.mendes@motorista.com","cpf":"98765432100","telefone":"(85) 98888-7777","senha":"senha123","cnh":"12345678901","categoriaCnh":"B","ear":true}'

RESPONSE=$(curl -s -X POST "$API_URL/autonomos" \
  -H "Content-Type: application/json" \
  -d "$MOTORISTA_JSON")

MOTORISTA_ID=$(echo "$RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin)['id'])" 2>/dev/null)
if [ ! -z "$MOTORISTA_ID" ]; then
  NOME=$(echo "$RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin)['nome'])" 2>/dev/null)
  echo "  ✅ Motorista criado: $NOME (ID: $MOTORISTA_ID)"
fi
echo ""

# ============================================
# 3. CRIAR 1 EMPRESA
# ============================================
echo "🏢 Criando 1 Empresa..."

EMPRESA_JSON='{"nome":"Transportes Rápidos LTDA","email":"contato@transportesrapidos.com","telefone":"(85) 3333-4444","senha":"senha123","cnpj":"12.345.678/0001-90","razaoSocial":"Transportes Rápidos LTDA"}'

RESPONSE=$(curl -s -X POST "$API_URL/empresas" \
  -H "Content-Type: application/json" \
  -d "$EMPRESA_JSON")

EMPRESA_ID=$(echo "$RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin)['id'])" 2>/dev/null)
if [ ! -z "$EMPRESA_ID" ]; then
  NOME=$(echo "$RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin)['nome'])" 2>/dev/null)
  echo "  ✅ Empresa criada: $NOME (ID: $EMPRESA_ID)"
fi
echo ""

# ============================================
# 4. CRIAR 3 POSTAGENS PARA O MOTORISTA
# ============================================
echo "📝 Criando 3 postagens para o Motorista..."

POSTAGENS_MOTORISTA=(
  '{"titulo":"Rota 1: Transporte UFC - Centro de Fortaleza","regiao":"Centro, Benfica, Fortaleza","descricao":"Transporte diário confiável para a Universidade Federal do Ceará (UFC). Saída pontual às 6h da manhã. Van com ar-condicionado, Wi-Fi e assentos confortáveis. Aceita passageiros de toda a região central. Retorno disponível às 18h.","preco":15.00}'
  '{"titulo":"Rota 2: Transporte UECE - Aldeota e Praia de Iracema","regiao":"Aldeota, Praia de Iracema, Meireles, Fortaleza","descricao":"Rota exclusiva para a Universidade Estadual do Ceará (UECE). Passa pelos principais pontos da Aldeota e região. Horários flexíveis: manhã (7h30) e tarde (13h30). Veículo moderno e seguro. Aceito pagamento em dinheiro, PIX ou cartão.","preco":12.50}'
  '{"titulo":"Rota 3: Transporte IFCE - Maracanaú e Região Metropolitana","regiao":"Maracanaú, Pacatuba, Caucaia, Fortaleza","descricao":"Viagem para o Instituto Federal do Ceará (IFCE) - Campus Maracanaú. Atende toda a região metropolitana. Saída às 5h30 da manhã com retorno às 18h. Van espaçosa com capacidade para 20 passageiros. Preço especial para estudantes com carteirinha.","preco":20.00}'
)

for i in "${!POSTAGENS_MOTORISTA[@]}"; do
  POSTAGEM_JSON="${POSTAGENS_MOTORISTA[$i]}"
  POSTAGEM_COMPLETA=$(echo "$POSTAGEM_JSON" | python3 -c "
import sys, json
data = json.load(sys.stdin)
data['autor'] = {'id': int(sys.argv[1])}
print(json.dumps(data))
" "$MOTORISTA_ID" 2>/dev/null)
  
  RESPONSE=$(curl -s -X POST "$API_URL/postagens" \
    -H "Content-Type: application/json" \
    -d "$POSTAGEM_COMPLETA")
  
  POSTAGEM_ID=$(echo "$RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin)['id'])" 2>/dev/null)
  if [ ! -z "$POSTAGEM_ID" ]; then
    POSTAGEM_MOTORISTA_IDS+=($POSTAGEM_ID)
    TITULO=$(echo "$RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin)['titulo'])" 2>/dev/null)
    echo "  ✅ Postagem $((i+1)) criada: $TITULO (ID: $POSTAGEM_ID)"
  fi
done
echo ""

# ============================================
# 5. CRIAR 1 POSTAGEM PARA A EMPRESA
# ============================================
echo "📝 Criando 1 postagem para a Empresa..."

POSTAGEM_EMPRESA_JSON='{"titulo":"Frota Completa - Transporte Universitário","regiao":"Fortaleza e Região Metropolitana","descricao":"Empresa com frota completa de vans e ônibus. Rotas para todas as universidades. Horários flexíveis e preços competitivos.","preco":18.00}'

POSTAGEM_COMPLETA=$(echo "$POSTAGEM_EMPRESA_JSON" | python3 -c "
import sys, json
data = json.load(sys.stdin)
data['autor'] = {'id': int(sys.argv[1])}
print(json.dumps(data))
" "$EMPRESA_ID" 2>/dev/null)

RESPONSE=$(curl -s -X POST "$API_URL/postagens" \
  -H "Content-Type: application/json" \
  -d "$POSTAGEM_COMPLETA")

POSTAGEM_EMPRESA_ID=$(echo "$RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin)['id'])" 2>/dev/null)
if [ ! -z "$POSTAGEM_EMPRESA_ID" ]; then
  TITULO=$(echo "$RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin)['titulo'])" 2>/dev/null)
  echo "  ✅ Postagem criada: $TITULO (ID: $POSTAGEM_EMPRESA_ID)"
fi
echo ""

# ============================================
# 6. CRIAR 3 VIAGENS PARA O MOTORISTA
# ============================================
echo "🚌 Criando 3 viagens para o Motorista..."

HORARIOS=("06:00" "07:30" "05:30")
DESTINOS=("Universidade Federal do Ceará - Campus do Pici" "Universidade Estadual do Ceará - Campus Itaperi" "Instituto Federal do Ceará - Campus Maracanaú")
CEPS=("60455-760" "60714-903" "61939-140")
ENDERECOS=("Av. Humberto Monte, s/n, Pici, Fortaleza - CE" "Av. Dr. Silas Munguba, 1700, Itaperi, Fortaleza - CE" "Av. Parque Central, 3105, Distrito Industrial, Maracanaú - CE")
# Coordenadas de partida para cada rota (Fortaleza, CE)
LATITUDES_PARTIDA=(-3.7172 -3.7183 -3.7190)
LONGITUDES_PARTIDA=(-38.5433 -38.5424 -38.5415)

for i in "${!POSTAGEM_MOTORISTA_IDS[@]}"; do
  POSTAGEM_ID="${POSTAGEM_MOTORISTA_IDS[$i]}"
  HORARIO="${HORARIOS[$i]}"
  DESTINO="${DESTINOS[$i]}"
  CEP="${CEPS[$i]}"
  ENDERECO="${ENDERECOS[$i]}"
  
  # Criar viagem
  LAT_PARTIDA="${LATITUDES_PARTIDA[$i]}"
  LNG_PARTIDA="${LONGITUDES_PARTIDA[$i]}"
  
  VIAGEM_JSON=$(python3 -c "
import json
import sys
viagem = {
    'postagem': {'id': int(sys.argv[1])},
    'horarioPartida': sys.argv[2],
    'destino': sys.argv[3],
    'cepPartida': sys.argv[4],
    'enderecoPartida': sys.argv[5],
    'latitudePartida': float(sys.argv[6]),
    'longitudePartida': float(sys.argv[7]),
    'capacidade': 20,
    'status': 'ABERTA'
}
print(json.dumps(viagem))
" "$POSTAGEM_ID" "$HORARIO" "$DESTINO" "$CEP" "$ENDERECO" "$LAT_PARTIDA" "$LNG_PARTIDA" 2>/dev/null)
  
  RESPONSE=$(curl -s -X POST "$API_URL/viagens" \
    -H "Content-Type: application/json" \
    -d "$VIAGEM_JSON")
  
  VIAGEM_ID=$(echo "$RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin)['id'])" 2>/dev/null)
  if [ ! -z "$VIAGEM_ID" ]; then
    VIAGEM_MOTORISTA_IDS+=($VIAGEM_ID)
    echo "  ✅ Viagem $((i+1)) criada: $DESTINO às $HORARIO (ID: $VIAGEM_ID)"
  fi
done
echo ""

# ============================================
# 7. CRIAR 1 VIAGEM PARA A EMPRESA
# ============================================
echo "🚌 Criando 1 viagem para a Empresa..."

VIAGEM_EMPRESA_JSON='{"postagem":{"id":'$POSTAGEM_EMPRESA_ID'},"horarioPartida":"08:00","destino":"Universidade de Fortaleza","cepPartida":"60160-230","enderecoPartida":"Av. Washington Soares, 1321, Edson Queiroz, Fortaleza - CE","latitudePartida":-3.7200,"longitudePartida":-38.5400,"capacidade":40,"status":"ABERTA"}'

RESPONSE=$(curl -s -X POST "$API_URL/viagens" \
  -H "Content-Type: application/json" \
  -d "$VIAGEM_EMPRESA_JSON")

VIAGEM_EMPRESA_ID=$(echo "$RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin)['id'])" 2>/dev/null)
if [ ! -z "$VIAGEM_EMPRESA_ID" ]; then
  DESTINO=$(echo "$RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin)['destino'])" 2>/dev/null)
  echo "  ✅ Viagem criada: $DESTINO (ID: $VIAGEM_EMPRESA_ID)"
fi
echo ""

# ============================================
# 8. INSCREVER 2 PASSAGEIROS NAS 3 VIAGENS DO MOTORISTA
# ============================================
echo "🎫 Inscrevendo 2 passageiros nas 3 viagens do Motorista..."

for VIAGEM_ID in "${VIAGEM_MOTORISTA_IDS[@]}"; do
  # Inscrever Cliente 1
  INSCRICAO1_JSON='{"viagem":{"id":'$VIAGEM_ID'},"cliente":{"id":'$CLIENTE1_ID'}}'
  RESPONSE=$(curl -s -X POST "$API_URL/inscricoes" \
    -H "Content-Type: application/json" \
    -d "$INSCRICAO1_JSON")
  
  INSCRICAO1_ID=$(echo "$RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin)['id'])" 2>/dev/null)
  if [ ! -z "$INSCRICAO1_ID" ]; then
    echo "  ✅ Cliente 1 inscrito na viagem ID: $VIAGEM_ID"
  fi
  
  # Inscrever Cliente 2
  INSCRICAO2_JSON='{"viagem":{"id":'$VIAGEM_ID'},"cliente":{"id":'$CLIENTE2_ID'}}'
  RESPONSE=$(curl -s -X POST "$API_URL/inscricoes" \
    -H "Content-Type: application/json" \
    -d "$INSCRICAO2_JSON")
  
  INSCRICAO2_ID=$(echo "$RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin)['id'])" 2>/dev/null)
  if [ ! -z "$INSCRICAO2_ID" ]; then
    echo "  ✅ Cliente 2 inscrito na viagem ID: $VIAGEM_ID"
  fi
done
echo ""

# ============================================
# RESUMO FINAL
# ============================================
echo "🎉 Dados de teste criados com sucesso!"
echo ""
echo "📊 RESUMO:"
echo "  👤 Clientes criados: 2"
echo "    - João Silva (ID: $CLIENTE1_ID)"
echo "    - Maria Santos (ID: $CLIENTE2_ID)"
echo ""
echo "  🚗 Motorista criado: 1"
echo "    - Carlos Mendes (ID: $MOTORISTA_ID)"
echo ""
echo "  🏢 Empresa criada: 1"
echo "    - Transportes Rápidos LTDA (ID: $EMPRESA_ID)"
echo ""
echo "  📝 Postagens:"
echo "    - Motorista (Carlos): 3 postagens com 3 rotas distintas"
echo "      • Rota 1: UFC - Centro de Fortaleza (R$ 15,00)"
echo "      • Rota 2: UECE - Aldeota e Praia de Iracema (R$ 12,50)"
echo "      • Rota 3: IFCE - Maracanaú e Região Metropolitana (R$ 20,00)"
echo "    - Empresa: 1 postagem"
echo ""
echo "  🚌 Viagens:"
echo "    - Motorista (Carlos): 3 viagens (IDs: ${VIAGEM_MOTORISTA_IDS[@]})"
echo "      • Viagem 1: UFC às 06:00"
echo "      • Viagem 2: UECE às 07:30"
echo "      • Viagem 3: IFCE às 05:30"
echo "    - Empresa: 1 viagem (ID: $VIAGEM_EMPRESA_ID)"
echo ""
echo "  🎫 Inscrições:"
echo "    - 2 passageiros inscritos em cada uma das 3 viagens do motorista"
echo "    - Total: 6 inscrições"
echo ""
echo "🔑 CREDENCIAIS DE ACESSO:"
echo ""
echo "👤 CLIENTES (Passageiros):"
echo "  - joao.silva@estudante.com / senha123"
echo "  - maria.santos@estudante.com / senha123"
echo ""
echo "🚗 MOTORISTA:"
echo "  - carlos.mendes@motorista.com / senha123"
echo ""
echo "🏢 EMPRESA:"
echo "  - contato@transportesrapidos.com / senha123"
echo ""
