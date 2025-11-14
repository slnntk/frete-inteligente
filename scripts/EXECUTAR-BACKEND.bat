@echo off
chcp 65001 > nul
cls

echo ========================================
echo   FRETE INTELIGENTE - Backend
echo ========================================
echo.

REM Sempre verificar e configurar JAVA_HOME para um JDK valido
set JDK_FOUND=0

REM Verificar se JAVA_HOME atual aponta para um JDK valido
if defined JAVA_HOME (
    if exist "%JAVA_HOME%\bin\javac.exe" (
        set JDK_FOUND=1
        echo [INFO] JAVA_HOME valido encontrado: %JAVA_HOME%
    ) else (
        echo [AVISO] JAVA_HOME aponta para JRE ou JDK invalido: %JAVA_HOME%
    )
)

REM Se nao encontrou JDK valido, procurar em locais comuns
if %JDK_FOUND%==0 (
    echo [INFO] Procurando JDK instalado...
    if exist "C:\Program Files\OpenLogic\jdk-22.0.2.9-hotspot" (
        set "JAVA_HOME=C:\Program Files\OpenLogic\jdk-22.0.2.9-hotspot"
        set JDK_FOUND=1
        echo [OK] JDK encontrado: %JAVA_HOME%
    ) else if exist "C:\Program Files\Java\jdk-22" (
        set "JAVA_HOME=C:\Program Files\Java\jdk-22"
        set JDK_FOUND=1
        echo [OK] JDK encontrado: %JAVA_HOME%
    ) else if exist "C:\Program Files\Java\jdk-21" (
        set "JAVA_HOME=C:\Program Files\Java\jdk-21"
        set JDK_FOUND=1
        echo [OK] JDK encontrado: %JAVA_HOME%
    ) else if exist "C:\Program Files\Java\jdk-17" (
        set "JAVA_HOME=C:\Program Files\Java\jdk-17"
        set JDK_FOUND=1
        echo [OK] JDK encontrado: %JAVA_HOME%
    )
)

REM Se ainda nao encontrou, tentar usar javac do PATH
if %JDK_FOUND%==0 (
    where javac >nul 2>&1
    if %errorlevel% equ 0 (
        for /f "delims=" %%i in ('where javac') do (
            set "JAVAC_PATH=%%i"
            goto :found_javac
        )
        :found_javac
        for %%i in ("%JAVAC_PATH%") do set "JAVA_HOME=%%~dpi.."
        if exist "%JAVA_HOME%\bin\javac.exe" (
            set JDK_FOUND=1
            echo [OK] JDK encontrado via javac no PATH: %JAVA_HOME%
        )
    )
)

REM Adicionar JDK ao PATH
if %JDK_FOUND%==1 (
    set "PATH=%JAVA_HOME%\bin;%PATH%"
) else (
    echo.
    echo [ERRO] JDK nao encontrado!
    echo.
    echo Por favor, instale um JDK (nao JRE):
    echo https://adoptium.net/temurin/releases/
    echo.
    pause
    exit /b 1
)

REM Configurar Maven instalado na pasta do usuario
set "MAVEN_HOME=%USERPROFILE%\maven"
set "MAVEN_BIN=%MAVEN_HOME%\bin"
if exist "%MAVEN_BIN%\mvn.cmd" (
    set "PATH=%PATH%;%MAVEN_BIN%"
    set MVN_CMD=mvn
    echo [INFO] Maven encontrado em: %MAVEN_HOME%
    goto :executar
)

REM Verificar se Maven está instalado no sistema
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

