@echo off
chcp 65001 > nul

REM Script helper para garantir que Maven funcione
REM Atualiza PATH na sessao atual e executa Maven

set "MAVEN_HOME=%USERPROFILE%\maven"
set "MAVEN_BIN=%MAVEN_HOME%\bin"
set "PATH=%PATH%;%MAVEN_BIN%"

REM Se recebeu argumentos, executa o Maven com eles
if "%~1"=="" (
    echo Maven configurado!
    echo.
    echo PATH atualizado para esta sessao.
    echo.
    echo Use: mvn --version
    echo Ou: %MAVEN_BIN%\mvn.cmd --version
    echo.
    %MAVEN_BIN%\mvn.cmd --version
) else (
    %MAVEN_BIN%\mvn.cmd %*
)

