@echo off
echo ====================================
echo   SoulSync - Hypnozio MVP
echo ====================================
echo.
echo Limpando processos antigos...
taskkill /F /IM node.exe /T 2>nul
echo.
echo Removendo lock files...
if exist ".next\dev\lock" del /F ".next\dev\lock"
echo.
echo Aguardando 2 segundos...
timeout /t 2 /nobreak >nul
echo.
echo Iniciando servidor de desenvolvimento...
echo O projeto vai abrir em: http://localhost:3000
echo.
echo Pressione Ctrl+C para parar o servidor
echo ====================================
echo.
npm run dev
