@echo off
chcp 65001 > nul

echo ========================================
echo   TESTE DE CONFIGURACAO JAVA_HOME
echo ========================================
echo.

echo JAVA_HOME atual: %JAVA_HOME%
echo.

REM Configurar JAVA_HOME se nao estiver configurado ou se apontar para JRE
if "%JAVA_HOME%"=="" (
    echo [INFO] JAVA_HOME nao configurado, procurando JDK...
    if exist "C:\Program Files\OpenLogic\jdk-22.0.2.9-hotspot" (
        set "JAVA_HOME=C:\Program Files\OpenLogic\jdk-22.0.2.9-hotspot"
        echo [OK] JAVA_HOME configurado: %JAVA_HOME%
    )
) else (
    echo [INFO] JAVA_HOME ja configurado: %JAVA_HOME%
    if not exist "%JAVA_HOME%\bin\javac.exe" (
        echo [AVISO] JAVA_HOME nao aponta para um JDK (javac nao encontrado)
        if exist "C:\Program Files\OpenLogic\jdk-22.0.2.9-hotspot" (
            set "JAVA_HOME=C:\Program Files\OpenLogic\jdk-22.0.2.9-hotspot"
            echo [OK] JAVA_HOME reconfigurado: %JAVA_HOME%
        )
    ) else (
        echo [OK] JAVA_HOME aponta para um JDK valido
    )
)

echo.
echo JAVA_HOME final: %JAVA_HOME%
echo.

REM Adicionar ao PATH
if defined JAVA_HOME (
    set "PATH=%JAVA_HOME%\bin;%PATH%"
)

echo Testando Java:
java -version
echo.

echo Testando javac:
javac -version
echo.

echo Testando Maven:
set "MAVEN_BIN=%USERPROFILE%\maven\bin"
if exist "%MAVEN_BIN%\mvn.cmd" (
    set "PATH=%PATH%;%MAVEN_BIN%"
    mvn -version
) else (
    echo Maven nao encontrado em: %MAVEN_BIN%
)

pause

