@echo off
chcp 65001 > nul
cls

echo ========================================
echo   FRETE INTELIGENTE - Frontend
echo ========================================
echo.

REM Verificar Node.js
echo [1/4] Verificando Node.js...
where node >nul 2>&1
if errorlevel 1 (
    echo [ERRO] Node.js nao encontrado!
    echo.
    echo Instale o Node.js LTS:
    echo https://nodejs.org/
    echo.
    echo Depois REINICIE o terminal e execute novamente.
    pause
    exit /b 1
)

node --version
echo [OK] Node.js instalado!
echo.

REM Verificar npm
echo [2/4] Verificando npm...
where npm >nul 2>&1
if errorlevel 1 (
    echo [ERRO] npm nao encontrado!
    echo.
    echo Reinstale o Node.js ou adicione ao PATH:
    echo C:\Program Files\nodejs\
    pause
    exit /b 1
)

npm --version
echo [OK] npm instalado!
echo.

REM Navegar para a pasta do frontend
cd transport-app

REM Verificar .env.local
echo [3/4] Verificando configuracao...
if not exist .env.local (
    echo Criando arquivo .env.local...
    echo NEXT_PUBLIC_API_URL=http://localhost:8080/api > .env.local
    echo [OK] Arquivo .env.local criado!
)
echo.

REM Verificar se node_modules existe
if not exist node_modules (
    echo [INFO] Instalando dependencias (pode demorar alguns minutos)...
    echo.
    call npm install
    if errorlevel 1 (
        echo.
        echo [ERRO] Falha ao instalar dependencias!
        pause
        exit /b 1
    )
    echo.
    echo [OK] Dependencias instaladas!
)

echo.
echo ========================================
echo [4/4] Iniciando Frontend
echo ========================================
echo.
echo Frontend: http://localhost:3000
echo Backend API: http://localhost:8080
echo.
echo IMPORTANTE: O backend precisa estar rodando!
echo.
echo Pressione Ctrl+C para parar o servidor
echo ========================================
echo.

call npm run dev

pause
