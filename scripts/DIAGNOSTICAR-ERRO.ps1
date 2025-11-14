# Script de Diagnostico - Frete Inteligente
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "DIAGNOSTICO DE PROBLEMAS" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$baseUrl = "http://localhost:8080"

# Teste 1: Verificar se o servidor esta rodando
Write-Host "[1/4] Verificando se o servidor esta rodando..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri $baseUrl -Method GET -ErrorAction Stop -TimeoutSec 5
    Write-Host "  OK: Servidor respondendo na porta 8080" -ForegroundColor Green
} catch {
    Write-Host "  ERRO: Servidor nao esta rodando!" -ForegroundColor Red
    Write-Host "  Execute: SETUP-COMPLETO.bat ou use IntelliJ IDEA" -ForegroundColor Yellow
    exit 1
}

# Teste 2: Testar endpoint GET
Write-Host ""
Write-Host "[2/4] Testando endpoint GET /api/usuarios..." -ForegroundColor Yellow
try {
    $usuarios = Invoke-RestMethod -Uri "$baseUrl/api/usuarios" -Method GET -ErrorAction Stop
    Write-Host "  OK: Endpoint GET funcionando! Usuarios encontrados: $($usuarios.Count)" -ForegroundColor Green
    if ($usuarios.Count -gt 0) {
        Write-Host "  Usuarios existentes:" -ForegroundColor Cyan
        $usuarios | ForEach-Object {
            Write-Host "    - ID: $($_.id) | Nome: $($_.nome) | Email: $($_.email)" -ForegroundColor Gray
        }
    }
} catch {
    Write-Host "  ERRO no endpoint GET!" -ForegroundColor Red
    Write-Host "  $($_.Exception.Message)" -ForegroundColor Red
}

# Teste 3: Testar endpoint de status
Write-Host ""
Write-Host "[3/4] Testando endpoint de status..." -ForegroundColor Yellow
try {
    $status = Invoke-RestMethod -Uri "$baseUrl/api/test/status" -Method GET -ErrorAction Stop
    Write-Host "  OK: Status do sistema" -ForegroundColor Green
    Write-Host "    - Usuarios: $($status.usuarios)" -ForegroundColor Gray
    Write-Host "    - Postagens: $($status.postagens)" -ForegroundColor Gray
    Write-Host "    - Viagens: $($status.viagens)" -ForegroundColor Gray
    Write-Host "    - Checkins: $($status.checkins)" -ForegroundColor Gray
} catch {
    Write-Host "  ERRO no endpoint de status!" -ForegroundColor Red
    Write-Host "  $($_.Exception.Message)" -ForegroundColor Red
}

# Teste 4: Tentar criar usuario
Write-Host ""
Write-Host "[4/4] Tentando criar usuario..." -ForegroundColor Yellow
try {
    $novoUsuario = @{
        tipo = "CLIENTE"
        nome = "Usuario Teste Diagnostico"
        email = "diagnostico@teste.com"
        cpf = "12345678901"
        telefone = "(85) 99999-9999"
        senhaHash = "senha123"
    } | ConvertTo-Json

    $resultado = Invoke-RestMethod -Uri "$baseUrl/api/usuarios" -Method POST -Body $novoUsuario -ContentType "application/json" -ErrorAction Stop
    Write-Host "  OK: Usuario criado com sucesso!" -ForegroundColor Green
    Write-Host "    - ID: $($resultado.id)" -ForegroundColor Gray
    Write-Host "    - Nome: $($resultado.nome)" -ForegroundColor Gray
    Write-Host "    - Email: $($resultado.email)" -ForegroundColor Gray
} catch {
    Write-Host "  ERRO ao criar usuario!" -ForegroundColor Red
    Write-Host ""
    Write-Host "  Detalhes do erro:" -ForegroundColor Yellow
    
    if ($_.Exception.Response) {
        try {
            $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
            $responseBody = $reader.ReadToEnd()
            Write-Host "  $responseBody" -ForegroundColor Red
        } catch {
            Write-Host "  $($_.Exception.Message)" -ForegroundColor Red
        }
    } else {
        Write-Host "  $($_.Exception.Message)" -ForegroundColor Red
    }
    
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "POSSIVEIS CAUSAS:" -ForegroundColor Yellow
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "1. Banco de dados nao foi inicializado corretamente" -ForegroundColor Gray
    Write-Host "2. Tabelas nao foram criadas" -ForegroundColor Gray
    Write-Host "3. Email duplicado" -ForegroundColor Gray
    Write-Host "4. Problemas com Hibernate/JPA" -ForegroundColor Gray
    Write-Host ""
    Write-Host "SOLUCOES:" -ForegroundColor Yellow
    Write-Host "1. Reinicie o backend" -ForegroundColor Gray
    Write-Host "2. Verifique os logs do backend" -ForegroundColor Gray
    Write-Host "3. Acesse H2 Console: $baseUrl/h2-console" -ForegroundColor Gray
    Write-Host "4. Tente criar dados de exemplo primeiro" -ForegroundColor Gray
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "DIAGNOSTICO CONCLUIDO" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
