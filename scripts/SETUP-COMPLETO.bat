@echo off
setlocal enabledelayedexpansion
chcp 65001 > nul
cls

echo ========================================
echo   FRETE INTELIGENTE - Setup Completo
echo ========================================
echo.

REM Verificar Java
echo [1/4] Verificando Java...
java -version 2>&1 | findstr /i "version" > nul
if errorlevel 1 (
    echo [ERRO] Java nao encontrado!
    echo.
    echo Por favor, instale Java 17+:
    echo https://adoptium.net/temurin/releases/
    echo.
    pause
    exit /b 1
)
echo [OK] Java instalado!
echo.

REM Verificar se Maven está instalado
echo [2/4] Verificando Maven...
where mvn >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] Maven encontrado!
    set "MVN_CMD=mvn"
    goto :compile
)

echo [INFO] Maven nao encontrado. Instalando Maven Portable...
echo.

REM Baixar Maven Portable
if not exist "tools\maven" (
    echo [3/4] Baixando Apache Maven 3.9.6...
    mkdir tools 2>nul
    
    REM Tentar baixar com curl
    curl -L "https://dlcdn.apache.org/maven/maven-3/3.9.6/binaries/apache-maven-3.9.6-bin.zip" -o "tools\maven.zip"
    
    if not exist "tools\maven.zip" (
        echo [ERRO] Nao foi possivel baixar Maven automaticamente.
        echo.
        echo ========================================
        echo   SOLUCAO MANUAL
        echo ========================================
        echo.
        echo Opcao 1: Instale IntelliJ IDEA (RECOMENDADO)
        echo   https://www.jetbrains.com/idea/download/
        echo.
        echo Opcao 2: Instale Maven manualmente
        echo   https://maven.apache.org/download.cgi
        echo.
        echo Opcao 3: Abra o arquivo:
        echo   COMO-EXECUTAR-SOLUCOES.md
        echo.
        pause
        exit /b 1
    )
    
    echo [OK] Maven baixado!
    echo.
    echo [4/4] Extraindo Maven...
    
    REM Extrair usando tar (disponível no Windows 10+)
    tar -xf "tools\maven.zip" -C "tools"
    
    if errorlevel 1 (
        echo [ERRO] Falha ao extrair Maven.
        echo Use IntelliJ IDEA ou instale Maven manualmente.
        pause
        exit /b 1
    )
    
    rename "tools\apache-maven-3.9.6" maven
    del "tools\maven.zip"
    
    echo [OK] Maven instalado em: tools\maven
)

set "MVN_CMD=%CD%\tools\maven\bin\mvn.cmd"
set "PATH=%CD%\tools\maven\bin;%PATH%"

:compile
echo.
echo ========================================
echo   Compilando Projeto
echo ========================================
echo.

"%MVN_CMD%" clean package -DskipTests

if errorlevel 1 (
    echo.
    echo [ERRO] Falha na compilacao!
    echo.
    echo Verifique:
    echo 1. Java está instalado: java -version
    echo 2. Conexao com internet (para baixar dependencias)
    echo.
    pause
    exit /b 1
)

echo.
echo ========================================
echo   Iniciando Backend
echo ========================================
echo.
echo Servidor: http://localhost:8080
echo Console H2: http://localhost:8080/h2-console
echo.
echo Pressione Ctrl+C para parar o servidor
echo ========================================
echo.

"%MVN_CMD%" spring-boot:run

pause

