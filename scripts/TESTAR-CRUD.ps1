# Script de Teste Automatizado - CRUD de Usuários
# Testa todas as operações CRUD para Cliente, Autônomo e Empresa

$ErrorActionPreference = "Continue"
$baseUrl = "http://localhost:8080/api"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  TESTE CRUD COMPLETO DE USUÁRIOS" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar se o backend está rodando
Write-Host "1. Verificando se o backend está rodando..." -ForegroundColor Yellow
try {
    $test = Invoke-RestMethod -Uri "$baseUrl/usuarios" -Method GET -TimeoutSec 5
    Write-Host "✅ Backend está rodando!" -ForegroundColor Green
} catch {
    Write-Host "❌ Backend não está rodando. Inicie o backend primeiro!" -ForegroundColor Red
    Write-Host "Execute: mvnw.cmd spring-boot:run" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  TESTE: CLIENTE (Estudante)" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# 1. Criar Cliente
Write-Host "`n2. Criando Cliente..." -ForegroundColor Yellow
$cliente = @{
    nome = "Maria Santos da Silva"
    email = "maria.santos@email.com"
    cpf = "11122233344"
    telefone = "(85) 99999-9999"
    senha = "senha123"
    matricula = "2024001"
    instituicao = "Universidade Federal do Ceará"
    curso = "Ciência da Computação"
} | ConvertTo-Json

try {
    $clienteCriado = Invoke-RestMethod -Uri "$baseUrl/clientes" -Method POST -Body $cliente -ContentType "application/json"
    Write-Host "✅ Cliente criado com sucesso! ID: $($clienteCriado.id)" -ForegroundColor Green
    $clienteId = $clienteCriado.id
} catch {
    Write-Host "❌ Erro ao criar cliente: $_" -ForegroundColor Red
}

# 2. Listar Clientes
Write-Host "`n3. Listando todos os clientes..." -ForegroundColor Yellow
try {
    $clientes = Invoke-RestMethod -Uri "$baseUrl/clientes" -Method GET
    Write-Host "✅ Total de clientes: $($clientes.Count)" -ForegroundColor Green
    $clientes | Format-Table id, nome, email, cpf -AutoSize
} catch {
    Write-Host "❌ Erro ao listar clientes: $_" -ForegroundColor Red
}

# 3. Buscar Cliente por ID
if ($clienteId) {
    Write-Host "`n4. Buscando cliente por ID ($clienteId)..." -ForegroundColor Yellow
    try {
        $clienteBuscado = Invoke-RestMethod -Uri "$baseUrl/clientes/$clienteId" -Method GET
        Write-Host "✅ Cliente encontrado:" -ForegroundColor Green
        Write-Host "   Nome: $($clienteBuscado.nome)"
        Write-Host "   Email: $($clienteBuscado.email)"
        Write-Host "   CPF: $($clienteBuscado.cpf)"
    } catch {
        Write-Host "❌ Erro ao buscar cliente: $_" -ForegroundColor Red
    }
}

# 4. Atualizar Cliente
if ($clienteId) {
    Write-Host "`n5. Atualizando cliente..." -ForegroundColor Yellow
    $clienteAtualizado = @{
        nome = "Maria Santos da Silva (Atualizada)"
        email = "maria.santos.nova@email.com"
        cpf = "11122233344"
        telefone = "(85) 98888-8888"
        matricula = "2024001"
        instituicao = "UFC"
        curso = "Engenharia de Software"
    } | ConvertTo-Json

    try {
        $resultado = Invoke-RestMethod -Uri "$baseUrl/clientes/$clienteId" -Method PUT -Body $clienteAtualizado -ContentType "application/json"
        Write-Host "✅ Cliente atualizado com sucesso!" -ForegroundColor Green
        Write-Host "   Novo nome: $($resultado.nome)"
        Write-Host "   Novo email: $($resultado.email)"
    } catch {
        Write-Host "❌ Erro ao atualizar cliente: $_" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  TESTE: AUTÔNOMO (Motorista)" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# 5. Criar Autônomo
Write-Host "`n6. Criando Autônomo..." -ForegroundColor Yellow
$autonomo = @{
    nome = "José Carlos Motorista"
    email = "jose.motorista@email.com"
    cpf = "55566677788"
    telefone = "(85) 98888-7777"
    senha = "senha123"
    cnh = "12345678901"
    categoriaCnh = "D"
    ear = $true
} | ConvertTo-Json

try {
    $autonomoCriado = Invoke-RestMethod -Uri "$baseUrl/autonomos" -Method POST -Body $autonomo -ContentType "application/json"
    Write-Host "✅ Autônomo criado com sucesso! ID: $($autonomoCriado.id)" -ForegroundColor Green
    $autonomoId = $autonomoCriado.id
} catch {
    Write-Host "❌ Erro ao criar autônomo: $_" -ForegroundColor Red
}

# 6. Listar Autônomos
Write-Host "`n7. Listando todos os autônomos..." -ForegroundColor Yellow
try {
    $autonomos = Invoke-RestMethod -Uri "$baseUrl/autonomos" -Method GET
    Write-Host "✅ Total de autônomos: $($autonomos.Count)" -ForegroundColor Green
    $autonomos | Format-Table id, nome, email, cnh, categoriaCnh -AutoSize
} catch {
    Write-Host "❌ Erro ao listar autônomos: $_" -ForegroundColor Red
}

# 7. Atualizar Autônomo
if ($autonomoId) {
    Write-Host "`n8. Atualizando autônomo..." -ForegroundColor Yellow
    $autonomoAtualizado = @{
        nome = "José Carlos Motorista (Atualizado)"
        email = "jose.motorista.novo@email.com"
        cpf = "55566677788"
        telefone = "(85) 97777-6666"
        cnh = "12345678901"
        categoriaCnh = "E"
        ear = $true
    } | ConvertTo-Json

    try {
        $resultado = Invoke-RestMethod -Uri "$baseUrl/autonomos/$autonomoId" -Method PUT -Body $autonomoAtualizado -ContentType "application/json"
        Write-Host "✅ Autônomo atualizado com sucesso!" -ForegroundColor Green
        Write-Host "   Nova categoria CNH: $($resultado.categoriaCnh)"
    } catch {
        Write-Host "❌ Erro ao atualizar autônomo: $_" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  TESTE: EMPRESA" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# 8. Criar Empresa
Write-Host "`n9. Criando Empresa..." -ForegroundColor Yellow
$empresa = @{
    nome = "Transportes ABC LTDA"
    email = "contato@transportesabc.com"
    telefone = "(85) 3333-3333"
    senha = "senha123"
    cnpj = "11222333000144"
    razaoSocial = "Transportes ABC LTDA"
} | ConvertTo-Json

try {
    $empresaCriada = Invoke-RestMethod -Uri "$baseUrl/empresas" -Method POST -Body $empresa -ContentType "application/json"
    Write-Host "✅ Empresa criada com sucesso! ID: $($empresaCriada.id)" -ForegroundColor Green
    $empresaId = $empresaCriada.id
} catch {
    Write-Host "❌ Erro ao criar empresa: $_" -ForegroundColor Red
}

# 9. Listar Empresas
Write-Host "`n10. Listando todas as empresas..." -ForegroundColor Yellow
try {
    $empresas = Invoke-RestMethod -Uri "$baseUrl/empresas" -Method GET
    Write-Host "✅ Total de empresas: $($empresas.Count)" -ForegroundColor Green
    $empresas | Format-Table id, nome, email, cnpj -AutoSize
} catch {
    Write-Host "❌ Erro ao listar empresas: $_" -ForegroundColor Red
}

# 10. Atualizar Empresa
if ($empresaId) {
    Write-Host "`n11. Atualizando empresa..." -ForegroundColor Yellow
    $empresaAtualizada = @{
        nome = "Transportes ABC LTDA (Atualizada)"
        email = "novo.contato@transportesabc.com"
        telefone = "(85) 3000-0000"
        cnpj = "11222333000144"
        razaoSocial = "Transportes ABC LTDA - ME"
    } | ConvertTo-Json

    try {
        $resultado = Invoke-RestMethod -Uri "$baseUrl/empresas/$empresaId" -Method PUT -Body $empresaAtualizada -ContentType "application/json"
        Write-Host "✅ Empresa atualizada com sucesso!" -ForegroundColor Green
        Write-Host "   Nova razão social: $($resultado.razaoSocial)"
    } catch {
        Write-Host "❌ Erro ao atualizar empresa: $_" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  TESTE: EXCLUSÃO (DELETE)" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# 11. Deletar Cliente
if ($clienteId) {
    Write-Host "`n12. Deletando cliente (ID: $clienteId)..." -ForegroundColor Yellow
    try {
        Invoke-RestMethod -Uri "$baseUrl/clientes/$clienteId" -Method DELETE
        Write-Host "✅ Cliente deletado com sucesso!" -ForegroundColor Green
    } catch {
        Write-Host "❌ Erro ao deletar cliente: $_" -ForegroundColor Red
    }
}

# 12. Deletar Autônomo
if ($autonomoId) {
    Write-Host "`n13. Deletando autônomo (ID: $autonomoId)..." -ForegroundColor Yellow
    try {
        Invoke-RestMethod -Uri "$baseUrl/autonomos/$autonomoId" -Method DELETE
        Write-Host "✅ Autônomo deletado com sucesso!" -ForegroundColor Green
    } catch {
        Write-Host "❌ Erro ao deletar autônomo: $_" -ForegroundColor Red
    }
}

# 13. Deletar Empresa
if ($empresaId) {
    Write-Host "`n14. Deletando empresa (ID: $empresaId)..." -ForegroundColor Yellow
    try {
        Invoke-RestMethod -Uri "$baseUrl/empresas/$empresaId" -Method DELETE
        Write-Host "✅ Empresa deletada com sucesso!" -ForegroundColor Green
    } catch {
        Write-Host "❌ Erro ao deletar empresa: $_" -ForegroundColor Red
    }
}

# Resumo Final
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  RESUMO DOS TESTES" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Total de operações testadas: 14" -ForegroundColor White
Write-Host ""
Write-Host "✅ CRUD Cliente:" -ForegroundColor Green
Write-Host "   - Create (POST)" -ForegroundColor White
Write-Host "   - Read (GET all)" -ForegroundColor White
Write-Host "   - Read (GET by ID)" -ForegroundColor White
Write-Host "   - Update (PUT)" -ForegroundColor White
Write-Host "   - Delete (DELETE)" -ForegroundColor White
Write-Host ""
Write-Host "✅ CRUD Autônomo:" -ForegroundColor Green
Write-Host "   - Create (POST)" -ForegroundColor White
Write-Host "   - Read (GET all)" -ForegroundColor White
Write-Host "   - Update (PUT)" -ForegroundColor White
Write-Host "   - Delete (DELETE)" -ForegroundColor White
Write-Host ""
Write-Host "✅ CRUD Empresa:" -ForegroundColor Green
Write-Host "   - Create (POST)" -ForegroundColor White
Write-Host "   - Read (GET all)" -ForegroundColor White
Write-Host "   - Update (PUT)" -ForegroundColor White
Write-Host "   - Delete (DELETE)" -ForegroundColor White
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  TESTES CONCLUÍDOS!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Para testar a interface web, acesse:" -ForegroundColor Yellow
Write-Host "http://localhost:3000/usuarios" -ForegroundColor Cyan
Write-Host ""

