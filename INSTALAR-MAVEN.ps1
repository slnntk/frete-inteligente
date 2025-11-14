# Script de Instalacao do Maven para Windows
# Autor: Assistente AI
# Data: 2024

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  INSTALACAO DO APACHE MAVEN" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar se ja esta instalado
Write-Host "[1/6] Verificando se Maven ja esta instalado..." -ForegroundColor Yellow
$mavenInstalled = Get-Command mvn -ErrorAction SilentlyContinue
if ($mavenInstalled) {
    Write-Host "Maven ja esta instalado!" -ForegroundColor Green
    mvn --version
    exit 0
}

# Verificar Java
Write-Host "[2/6] Verificando Java..." -ForegroundColor Yellow
$javaInstalled = Get-Command java -ErrorAction SilentlyContinue
if (-not $javaInstalled) {
    Write-Host "ERRO: Java nao encontrado!" -ForegroundColor Red
    Write-Host "Por favor, instale o Java primeiro:" -ForegroundColor Yellow
    Write-Host "https://adoptium.net/temurin/releases/" -ForegroundColor Cyan
    exit 1
}

java -version
Write-Host "Java encontrado!" -ForegroundColor Green
Write-Host ""

# Definir caminhos
$mavenVersion = "3.9.6"
$installPath = "C:\Program Files\Apache\maven"
$downloadPath = "$env:TEMP\maven.zip"
$extractPath = "$env:TEMP\maven-extract"

# Tentar diferentes URLs
$urls = @(
    "https://dlcdn.apache.org/maven/maven-3/$mavenVersion/binaries/apache-maven-$mavenVersion-bin.zip",
    "https://archive.apache.org/dist/maven/maven-3/$mavenVersion/binaries/apache-maven-$mavenVersion-bin.zip",
    "https://downloads.apache.org/maven/maven-3/$mavenVersion/binaries/apache-maven-$mavenVersion-bin.zip"
)

# Baixar Maven
Write-Host "[3/6] Baixando Maven $mavenVersion..." -ForegroundColor Yellow
$downloaded = $false

foreach ($url in $urls) {
    try {
        Write-Host "Tentando: $url" -ForegroundColor Gray
        Invoke-WebRequest -Uri $url -OutFile $downloadPath -UseBasicParsing -ErrorAction Stop
        Write-Host "Download concluido!" -ForegroundColor Green
        $downloaded = $true
        break
    } catch {
        Write-Host "Falhou. Tentando proxima URL..." -ForegroundColor Gray
        continue
    }
}

if (-not $downloaded) {
    Write-Host "ERRO: Nao foi possivel baixar o Maven automaticamente." -ForegroundColor Red
    Write-Host ""
    Write-Host "SOLUCAO MANUAL:" -ForegroundColor Yellow
    Write-Host "1. Acesse: https://maven.apache.org/download.cgi" -ForegroundColor Cyan
    Write-Host "2. Baixe: apache-maven-$mavenVersion-bin.zip" -ForegroundColor Cyan
    Write-Host "3. Extraia para: $installPath" -ForegroundColor Cyan
    Write-Host "4. Adicione ao PATH: $installPath\bin" -ForegroundColor Cyan
    exit 1
}

# Criar diretorio de instalacao
Write-Host "[4/6] Criando diretorio de instalacao..." -ForegroundColor Yellow
if (-not (Test-Path $installPath)) {
    New-Item -ItemType Directory -Path $installPath -Force | Out-Null
}

# Extrair arquivo
Write-Host "[5/6] Extraindo Maven..." -ForegroundColor Yellow
if (Test-Path $extractPath) {
    Remove-Item $extractPath -Recurse -Force
}
New-Item -ItemType Directory -Path $extractPath -Force | Out-Null

Expand-Archive -Path $downloadPath -DestinationPath $extractPath -Force

# Mover para local final
$extractedFolder = Get-ChildItem $extractPath -Directory | Select-Object -First 1
if ($extractedFolder) {
    Copy-Item -Path "$($extractedFolder.FullName)\*" -Destination $installPath -Recurse -Force
    Write-Host "Maven extraido para: $installPath" -ForegroundColor Green
} else {
    Write-Host "ERRO: Nao foi possivel encontrar a pasta extraida" -ForegroundColor Red
    exit 1
}

# Limpar arquivos temporarios
Remove-Item $downloadPath -Force -ErrorAction SilentlyContinue
Remove-Item $extractPath -Recurse -Force -ErrorAction SilentlyContinue

# Configurar variaveis de ambiente
Write-Host "[6/6] Configurando variaveis de ambiente..." -ForegroundColor Yellow

# MAVEN_HOME
$mavenHomeExists = [Environment]::GetEnvironmentVariable("MAVEN_HOME", "Machine")
if (-not $mavenHomeExists) {
    [Environment]::SetEnvironmentVariable("MAVEN_HOME", $installPath, "Machine")
    Write-Host "MAVEN_HOME configurado: $installPath" -ForegroundColor Green
} else {
    Write-Host "MAVEN_HOME ja existe: $mavenHomeExists" -ForegroundColor Yellow
}

# Adicionar ao PATH
$currentPath = [Environment]::GetEnvironmentVariable("Path", "Machine")
$mavenBin = "$installPath\bin"

if ($currentPath -notlike "*$mavenBin*") {
    $newPath = $currentPath + ";$mavenBin"
    [Environment]::SetEnvironmentVariable("Path", $newPath, "Machine")
    Write-Host "PATH atualizado com: $mavenBin" -ForegroundColor Green
} else {
    Write-Host "PATH ja contem Maven" -ForegroundColor Yellow
}

# Atualizar PATH na sessao atual
$env:Path += ";$mavenBin"
$env:MAVEN_HOME = $installPath

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  INSTALACAO CONCLUIDA!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "IMPORTANTE:" -ForegroundColor Yellow
Write-Host "Reinicie o terminal para usar o comando 'mvn'" -ForegroundColor Yellow
Write-Host ""
Write-Host "Ou use o caminho completo:" -ForegroundColor Cyan
Write-Host "$mavenBin\mvn.cmd --version" -ForegroundColor White
Write-Host ""

# Testar instalacao
Write-Host "Testando instalacao..." -ForegroundColor Yellow
& "$mavenBin\mvn.cmd" --version

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "Maven instalado e funcionando!" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "AVISO: Maven instalado, mas precisa reiniciar o terminal." -ForegroundColor Yellow
}

