@echo off
chcp 65001 > nul
cls

echo ========================================
echo   ATUALIZAR DOCKER COM ALTERACOES
echo ========================================
echo.

REM Verificar Docker
docker --version >nul 2>&1
if errorlevel 1 (
    echo [ERRO] Docker nao esta instalado!
    pause
    exit /b 1
)

echo [INFO] Docker encontrado!
echo.

REM Menu
echo ========================================
echo   ESCOLHA UMA OPCAO:
echo ========================================
echo.
echo 1. Reconstruir apenas Frontend (mais rapido)
echo 2. Reconstruir tudo (Backend + Frontend)
echo 3. Parar, limpar e reconstruir tudo
echo.
set /p opcao="Digite o numero da opcao: "

if "%opcao%"=="1" goto frontend
if "%opcao%"=="2" goto rebuild
if "%opcao%"=="3" goto clean_rebuild
goto invalid

:frontend
echo.
echo ========================================
echo   RECONSTRUINDO APENAS FRONTEND
echo ========================================
echo.

echo Parando container frontend...
docker-compose -f docker/docker-compose.dev.yml stop frontend 2>nul

echo.
echo Reconstruindo imagem frontend...
docker-compose -f docker/docker-compose.dev.yml build --no-cache frontend

if errorlevel 1 (
    echo [ERRO] Falha ao reconstruir frontend!
    pause
    exit /b 1
)

echo.
echo Iniciando container frontend...
docker-compose -f docker/docker-compose.dev.yml up -d frontend

echo.
echo ========================================
echo   SUCESSO!
echo ========================================
echo.
echo Frontend atualizado e rodando!
echo Acesse: http://localhost:3000
echo.
goto end

:rebuild
echo.
echo ========================================
echo   RECONSTRUINDO TUDO
echo ========================================
echo.

echo Parando containers...
docker-compose -f docker/docker-compose.dev.yml stop

echo.
echo Reconstruindo imagens (pode demorar alguns minutos)...
docker-compose -f docker/docker-compose.dev.yml build --no-cache

if errorlevel 1 (
    echo [ERRO] Falha ao reconstruir imagens!
    pause
    exit /b 1
)

echo.
echo Iniciando containers...
docker-compose -f docker/docker-compose.dev.yml up -d

echo.
echo ========================================
echo   SUCESSO!
echo ========================================
echo.
echo Todos os containers foram atualizados!
echo Backend: http://localhost:8080
echo Frontend: http://localhost:3000
echo.
goto end

:clean_rebuild
echo.
echo ========================================
echo   LIMPAR E RECONSTRUIR TUDO
echo ========================================
echo.
echo [ATENCAO] Isso vai remover containers e reconstruir do zero!
set /p confirm="Continuar? (s/n): "
if /i not "%confirm%"=="s" goto end

echo.
echo Parando e removendo containers...
docker-compose -f docker/docker-compose.dev.yml down -v

echo.
echo Removendo imagens antigas...
docker rmi frete-inteligente-backend 2>nul
docker rmi frete-inteligente-frontend 2>nul

echo.
echo Reconstruindo imagens (pode demorar varios minutos)...
docker-compose -f docker/docker-compose.dev.yml build --no-cache

if errorlevel 1 (
    echo [ERRO] Falha ao reconstruir imagens!
    pause
    exit /b 1
)

echo.
echo Iniciando containers...
docker-compose -f docker/docker-compose.dev.yml up -d

echo.
echo ========================================
echo   SUCESSO!
echo ========================================
echo.
echo Tudo foi reconstruido do zero!
echo Backend: http://localhost:8080
echo Frontend: http://localhost:3000
echo.
goto end

:invalid
echo.
echo [ERRO] Opcao invalida!
goto end

:end
echo.
pause

