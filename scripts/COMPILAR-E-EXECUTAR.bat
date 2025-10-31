@echo off
chcp 65001 > nul
cls

echo ========================================
echo   FRETE INTELIGENTE - Compilacao Manual
echo ========================================
echo.

REM Verificar se o Maven está instalado
where mvn >nul 2>&1
if %errorlevel% equ 0 (
    echo [INFO] Maven encontrado! Usando Maven do sistema...
    echo.
    echo [1/2] Compilando projeto...
    call mvn clean package -DskipTests
    if errorlevel 1 (
        echo [ERRO] Falha na compilacao
        pause
        exit /b 1
    )
    echo.
    echo [2/2] Iniciando servidor...
    echo.
    call mvn spring-boot:run
) else (
    echo [INFO] Maven nao encontrado no sistema.
    echo [INFO] Tentando executar com Maven Wrapper...
    echo.
    
    REM Tentar com Maven Wrapper sem usar PowerShell
    set MVNW_VERBOSE=false
    
    echo [1/2] Compilando projeto...
    call mvnw.cmd clean package -DskipTests
    
    if errorlevel 1 (
        echo.
        echo ========================================
        echo [ERRO] Nao foi possivel compilar!
        echo ========================================
        echo.
        echo SOLUCAO:
        echo 1. Instale o Maven: https://maven.apache.org/download.cgi
        echo 2. Ou use uma IDE como IntelliJ IDEA ou Eclipse
        echo 3. Ou execute: java -version (para verificar Java)
        echo.
        pause
        exit /b 1
    )
    
    echo.
    echo [2/2] Iniciando servidor...
    echo.
    call mvnw.cmd spring-boot:run
)

pause

