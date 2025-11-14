@echo off
chcp 65001 > nul
cls

echo ========================================
echo   FRETE INTELIGENTE - Backend (Simples)
echo ========================================
echo.

REM Verificar Java
java -version >nul 2>&1
if errorlevel 1 (
    echo [ERRO] Java nao encontrado!
    echo.
    echo Instale Java 17+ ou Java 21:
    echo https://adoptium.net/temurin/releases/
    echo.
    pause
    exit /b 1
)

echo [OK] Java encontrado
java -version
echo.

REM Verificar Maven
where mvn >nul 2>&1
if errorlevel 1 (
    echo [ERRO] Maven nao encontrado!
    echo.
    echo SOLUCOES:
    echo.
    echo 1. Instale Maven:
    echo    - Baixe: https://maven.apache.org/download.cgi
    echo    - Extraia e adicione ao PATH
    echo    - Ou: choco install maven
    echo.
    echo 2. Use IntelliJ IDEA:
    echo    - Abra FreteInteligenteApplication.java
    echo    - Clique em Run
    echo.
    echo 3. Use Docker:
    echo    - Execute: .\scripts\docker-start.bat
    echo.
    pause
    exit /b 1
)

echo [OK] Maven encontrado
mvn --version
echo.

echo ========================================
echo Compilando e executando...
echo ========================================
echo.

mvn clean spring-boot:run

pause

