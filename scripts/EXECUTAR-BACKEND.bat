@echo off
chcp 65001 > nul
cls

echo ========================================
echo   FRETE INTELIGENTE - Backend
echo ========================================
echo.

REM Verificar se Maven está instalado
where mvn >nul 2>&1
if %errorlevel% equ 0 (
    echo [INFO] Maven encontrado no sistema
    set MVN_CMD=mvn
    goto :executar
)

REM Tentar usar Maven Wrapper
if exist mvnw.cmd (
    echo [INFO] Tentando usar Maven Wrapper...
    call mvnw.cmd --version >nul 2>&1
    if %errorlevel% equ 0 (
        set MVN_CMD=mvnw.cmd
        goto :executar
    )
)

echo.
echo [ERRO] Maven nao encontrado!
echo.
echo SOLUCOES:
echo.
echo Opcao 1: Instalar Maven
echo   1. Baixe: https://maven.apache.org/download.cgi
echo   2. Extraia e adicione ao PATH
echo   3. Ou instale via Chocolatey: choco install maven
echo.
echo Opcao 2: Usar IntelliJ IDEA (RECOMENDADO)
echo   1. Abra o projeto no IntelliJ IDEA
echo   2. Clique com botao direito em FreteInteligenteApplication.java
echo   3. Selecione "Run 'FreteInteligenteApplication'"
echo.
echo Opcao 3: Usar Docker
echo   Execute: .\scripts\docker-start.bat
echo.
pause
exit /b 1

:executar
echo [1/3] Compilando projeto...
echo.

call %MVN_CMD% clean package -DskipTests

if errorlevel 1 (
    echo.
    echo [ERRO] Falha na compilacao!
    echo.
    echo Verifique:
    echo   1. Java esta instalado: java -version
    echo   2. Conexao com internet (para baixar dependencias)
    echo   3. Nao ha erros de sintaxe no codigo
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
echo API Status: http://localhost:8080/api/test/status
echo.
echo ========================================
echo.

call %MVN_CMD% spring-boot:run

pause

