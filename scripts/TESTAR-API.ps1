# Script de Testes da API - Frete Inteligente
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "TESTES DA API - Frete Inteligente" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$baseUrl = "http://localhost:8080/api"

# Função para fazer requisição
function Test-Endpoint {
    param(
        [string]$Method,
        [string]$Url,
        [string]$Body = $null,
        [string]$Description
    )
    
    Write-Host "Testando: $Description" -ForegroundColor Yellow
    Write-Host "  Metodo: $Method" -ForegroundColor Gray
    Write-Host "  URL: $Url" -ForegroundColor Gray
    
    try {
        $headers = @{
            "Content-Type" = "application/json"
            "Accept" = "application/json"
        }
        
        if ($Body) {
            Write-Host "  Body: $Body" -ForegroundColor Gray
            $response = Invoke-RestMethod -Uri $Url -Method $Method -Body $Body -Headers $headers -ErrorAction Stop
        } else {
            $response = Invoke-RestMethod -Uri $Url -Method $Method -Headers $headers -ErrorAction Stop
        }
        
        Write-Host "  Status: SUCESSO" -ForegroundColor Green
        Write-Host "  Resposta:" -ForegroundColor Green
        $response | ConvertTo-Json -Depth 5
        Write-Host ""
        return $response
    }
    catch {
        Write-Host "  Status: ERRO" -ForegroundColor Red
        Write-Host "  Erro: $($_.Exception.Message)" -ForegroundColor Red
        Write-Host ""
        return $null
    }
}

# Teste 1: Status do Sistema
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "TESTE 1: Status do Sistema" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Test-Endpoint -Method "GET" -Url "$baseUrl/test/status" -Description "Status do sistema"

# Teste 2: Criar Dados de Exemplo
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "TESTE 2: Criar Dados de Exemplo" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Test-Endpoint -Method "POST" -Url "$baseUrl/test/dados-exemplo" -Description "Criar dados de exemplo"

# Teste 3: Listar Usuarios
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "TESTE 3: Listar Usuarios" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Test-Endpoint -Method "GET" -Url "$baseUrl/usuarios" -Description "Listar todos os usuarios"

# Teste 4: Criar Novo Usuario
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "TESTE 4: Criar Novo Usuario" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
$novoUsuario = @{
    tipo = "CLIENTE"
    nome = "Maria Santos"
    email = "maria@teste.com"
    cpf = "11122233344"
    telefone = "(85) 77777-7777"
    senhaHash = "senha789"
} | ConvertTo-Json

$usuario = Test-Endpoint -Method "POST" -Url "$baseUrl/usuarios" -Body $novoUsuario -Description "Criar novo usuario"

# Teste 5: Login
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "TESTE 5: Login" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
$loginData = @{
    email = "maria@teste.com"
    password = "senha789"
} | ConvertTo-Json

Test-Endpoint -Method "POST" -Url "$baseUrl/auth/login" -Body $loginData -Description "Fazer login"

# Teste 6: Listar Postagens
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "TESTE 6: Listar Postagens" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Test-Endpoint -Method "GET" -Url "$baseUrl/postagens" -Description "Listar todas as postagens"

# Teste 7: Criar Nova Postagem (se temos usuario)
if ($usuario -and $usuario.id) {
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "TESTE 7: Criar Nova Postagem" -ForegroundColor Cyan
    Write-Host "========================================" -ForegroundColor Cyan
    $novaPostagem = @{
        autor = @{ id = $usuario.id }
        titulo = "Transporte Teste"
        regiao = "Fortaleza"
        descricao = "Postagem de teste criada via API"
        preco = 25.00
    } | ConvertTo-Json

    Test-Endpoint -Method "POST" -Url "$baseUrl/postagens" -Body $novaPostagem -Description "Criar nova postagem"
}

# Teste 8: Listar Viagens
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "TESTE 8: Listar Viagens" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Test-Endpoint -Method "GET" -Url "$baseUrl/viagens" -Description "Listar todas as viagens"

# Teste 9: Listar Check-ins
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "TESTE 9: Listar Check-ins" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Test-Endpoint -Method "GET" -Url "$baseUrl/checkins" -Description "Listar todos os check-ins"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "TESTES CONCLUIDOS!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

