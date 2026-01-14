@echo off
echo ========================================
echo DEPLOY LIMPO - Vercel
echo ========================================
echo.

echo [1/4] Limpando cache local...
if exist .next rmdir /s /q .next
if exist node_modules\.cache rmdir /s /q node_modules\.cache
echo Cache local limpo!
echo.

echo [2/4] Verificando alteracoes no Git...
git status
echo.

echo [3/4] Adicionando e commitando alteracoes...
git add .
git commit -m "Deploy: Atualizacao - %date% %time%"
echo.

echo [4/4] Enviando para GitHub (forcando rebuild no Vercel)...
git push origin main --force-with-lease
echo.

echo ========================================
echo Deploy iniciado!
echo ========================================
echo.
echo IMPORTANTE: No Vercel, se o problema persistir:
echo 1. Va em Settings ^> Data Cache ^> Purge Data Cache
echo 2. Va em Settings ^> CDN Cache ^> Purge CDN Cache
echo 3. Aguarde alguns minutos
echo.
pause
