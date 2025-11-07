#!/bin/bash

# Script para criar usuários de teste
# Cliente (Estudante), Autônomo (Motorista) e Empresa

API_URL="http://localhost:8080/api"

echo "🚀 Criando usuários de teste..."
echo ""

# 1. Criar Cliente (Estudante)
echo "📚 Criando Cliente/Estudante..."
CLIENTE_RESPONSE=$(curl -s -X POST "$API_URL/clientes" \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "João Silva",
    "email": "joao.silva@estudante.com",
    "cpf": "12345678901",
    "telefone": "(85) 98765-4321",
    "senha": "senha123",
    "matricula": "2024001234",
    "instituicao": "Universidade Federal do Ceará",
    "curso": "Ciência da Computação",
    "endereco": "Rua das Flores, 123, Fortaleza, CE",
    "latitude": -3.7172,
    "longitude": -38.5433
  }')

echo "✅ Cliente criado:"
echo "$CLIENTE_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$CLIENTE_RESPONSE"
echo ""

# 2. Criar Autônomo (Motorista)
echo "🚗 Criando Autônomo/Motorista..."
AUTONOMO_RESPONSE=$(curl -s -X POST "$API_URL/autonomos" \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Carlos Mendes",
    "email": "carlos.mendes@motorista.com",
    "cpf": "98765432100",
    "telefone": "(85) 98888-7777",
    "senha": "senha123",
    "cnh": "12345678901",
    "categoriaCnh": "B",
    "ear": true
  }')

echo "✅ Autônomo criado:"
echo "$AUTONOMO_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$AUTONOMO_RESPONSE"
echo ""

# 3. Criar Empresa
echo "🏢 Criando Empresa..."
EMPRESA_RESPONSE=$(curl -s -X POST "$API_URL/empresas" \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Transportes Rápidos LTDA",
    "email": "contato@transportesrapidos.com",
    "telefone": "(85) 3333-4444",
    "senha": "senha123",
    "cnpj": "12.345.678/0001-90",
    "razaoSocial": "Transportes Rápidos LTDA"
  }')

echo "✅ Empresa criada:"
echo "$EMPRESA_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$EMPRESA_RESPONSE"
echo ""

# Criar mais alguns usuários para ter mais dados de teste
echo "📚 Criando mais um Cliente..."
CLIENTE2_RESPONSE=$(curl -s -X POST "$API_URL/clientes" \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Maria Santos",
    "email": "maria.santos@estudante.com",
    "cpf": "11122233344",
    "telefone": "(85) 99999-8888",
    "senha": "senha123",
    "matricula": "2024005678",
    "instituicao": "Universidade Estadual do Ceará",
    "curso": "Engenharia de Software",
    "endereco": "Av. Beira Mar, 456, Fortaleza, CE",
    "latitude": -3.7183,
    "longitude": -38.5424
  }')

echo "✅ Cliente 2 criado:"
echo "$CLIENTE2_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$CLIENTE2_RESPONSE"
echo ""

echo "🚗 Criando mais um Autônomo..."
AUTONOMO2_RESPONSE=$(curl -s -X POST "$API_URL/autonomos" \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Pedro Oliveira",
    "email": "pedro.oliveira@motorista.com",
    "cpf": "55566677788",
    "telefone": "(85) 97777-6666",
    "senha": "senha123",
    "cnh": "98765432100",
    "categoriaCnh": "D",
    "ear": false
  }')

echo "✅ Autônomo 2 criado:"
echo "$AUTONOMO2_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$AUTONOMO2_RESPONSE"
echo ""

echo "🎉 Usuários de teste criados com sucesso!"
echo ""
echo "📋 Resumo dos usuários criados:"
echo ""
echo "👤 CLIENTES (Estudantes):"
echo "   - joao.silva@estudante.com / senha123"
echo "   - maria.santos@estudante.com / senha123"
echo ""
echo "🚗 AUTÔNOMOS (Motoristas):"
echo "   - carlos.mendes@motorista.com / senha123"
echo "   - pedro.oliveira@motorista.com / senha123"
echo ""
echo "🏢 EMPRESAS:"
echo "   - contato@transportesrapidos.com / senha123"
echo ""

