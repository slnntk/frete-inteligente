@echo off
chcp 65001 > nul
cls

echo ========================================
echo   FRETE INTELIGENTE - Docker
echo ========================================
echo.

REM Verificar Docker
echo [1/3] Verificando Docker...
docker --version >nul 2>&1
if errorlevel 1 (
    echo [ERRO] Docker nao esta instalado!
    echo.
    echo Instale o Docker Desktop:
    echo https://www.docker.com/products/docker-desktop/
    echo.
    pause
    exit /b 1
)

docker --version
echo [OK] Docker instalado!
echo.

REM Menu de opcoes
echo ========================================
echo   ESCOLHA UMA OPCAO:
echo ========================================
echo.
echo 1. Desenvolvimento (Backend H2 + Frontend)
echo 2. Completo (MySQL + Backend + Frontend)
echo 3. Parar todos os containers
echo 4. Ver logs
echo 5. Limpar tudo e reiniciar
echo.
set /p opcao="Digite o numero da opcao: "

if "%opcao%"=="1" goto dev
if "%opcao%"=="2" goto full
if "%opcao%"=="3" goto stop
if "%opcao%"=="4" goto logs
if "%opcao%"=="5" goto clean
goto invalid

:dev
echo.
echo ========================================
echo [2/3] Construindo imagens...
echo ========================================
docker-compose -f docker/docker-compose.dev.yml build
if errorlevel 1 (
    echo [ERRO] Falha ao construir imagens!
    pause
    exit /b 1
)

echo.
echo ========================================
echo [3/3] Iniciando containers...
echo ========================================
docker-compose -f docker/docker-compose.dev.yml up -d
if errorlevel 1 (
    echo [ERRO] Falha ao iniciar containers!
    pause
    exit /b 1
)

echo.
echo ========================================
echo   SUCESSO!
echo ========================================
echo.
echo Backend: http://localhost:8080
echo Frontend: http://localhost:3000
echo H2 Console: http://localhost:8080/h2-console
echo.
echo Comandos uteis:
echo - Ver logs: docker-compose -f docker/docker-compose.dev.yml logs -f
echo - Parar: docker-compose -f docker/docker-compose.dev.yml down
echo.
goto end

:full
echo.
echo ========================================
echo [2/3] Construindo imagens...
echo ========================================
docker-compose -f docker/docker-compose.full.yml build
if errorlevel 1 (
    echo [ERRO] Falha ao construir imagens!
    pause
    exit /b 1
)

echo.
echo ========================================
echo [3/3] Iniciando containers...
echo ========================================
docker-compose -f docker/docker-compose.full.yml up -d
if errorlevel 1 (
    echo [ERRO] Falha ao iniciar containers!
    pause
    exit /b 1
)

echo.
echo ========================================
echo   SUCESSO!
echo ========================================
echo.
echo Backend: http://localhost:8080
echo Frontend: http://localhost:3000
echo MySQL: localhost:3307
echo.
echo Aguarde ~30 segundos para tudo inicializar!
echo.
echo Comandos uteis:
echo - Ver logs: docker-compose -f docker/docker-compose.full.yml logs -f
echo - Parar: docker-compose -f docker-compose.full.yml down
echo.
goto end

:stop
echo.
echo Parando containers...
docker-compose -f docker/docker-compose.dev.yml down 2>nul
docker-compose -f docker-compose.full.yml down 2>nul
echo [OK] Containers parados!
goto end

:logs
echo.
echo Escolha qual versao ver logs:
echo 1. Desenvolvimento
echo 2. Completo
set /p log_opcao="Digite: "

if "%log_opcao%"=="1" (
    docker-compose -f docker/docker-compose.dev.yml logs -f
) else (
    docker-compose -f docker/docker-compose.full.yml logs -f
)
goto end

:clean
echo.
echo [ATENCAO] Isso vai remover TODOS os containers e imagens!
set /p confirm="Tem certeza? (s/n): "
if /i not "%confirm%"=="s" goto end

echo Parando containers...
docker-compose -f docker/docker-compose.dev.yml down -v 2>nul
docker-compose -f docker-compose.full.yml down -v 2>nul

echo Removendo imagens...
docker rmi frete-inteligente-backend 2>nul
docker rmi frete-inteligente-frontend 2>nul

echo [OK] Limpeza concluida!
goto end

:invalid
echo.
echo [ERRO] Opcao invalida!
goto end

:end
echo.
pause

