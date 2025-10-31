@echo off
chcp 65001 > nul
cls

echo ========================================
echo   FRETE INTELIGENTE - Backend
echo ========================================
echo.
echo [1/3] Compilando projeto...
echo.

call mvnw.cmd clean package -DskipTests

if errorlevel 1 (
    echo.
    echo [ERRO] Falha na compilacao!
    echo.
    pause
    exit /b 1
)

echo.
echo ========================================
echo [2/3] Compilacao concluida!
echo ========================================
echo.
echo [3/3] Iniciando servidor...
echo.
echo Aguarde! O servidor estara pronto quando aparecer:
echo "Started FreteInteligenteApplication"
echo.
echo Servidor: http://localhost:8080
echo Console H2: http://localhost:8080/h2-console
echo.
echo ========================================
echo.

call mvnw.cmd spring-boot:run

pause

