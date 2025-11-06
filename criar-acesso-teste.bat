@echo off
echo ========================================
echo  CRIAR ACESSO DE TESTE - SoulSync
echo ========================================
echo.

set /p nome="Digite o nome do cliente (ou Enter para 'Cliente Teste'): "
set /p email="Digite o email (ou Enter para 'teste@exemplo.com'): "

if "%nome%"=="" set nome=Cliente Teste
if "%email%"=="" set email=teste@exemplo.com

echo.
echo Criando token para %nome% (%email%)...
echo.

node criar-token-teste.js "%nome%" "%email%"

echo.
pause
