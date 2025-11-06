@echo off
echo ========================================
echo Testando Webhook da LastLink
echo ========================================
echo.

curl -X POST http://localhost:3003/api/webhook/lastlink ^
  -H "Content-Type: application/json" ^
  -d "{\"event_type\": \"Purchase_Order_Confirmed\", \"order\": {\"id\": \"ORD-TEST-001\", \"status\": \"paid\", \"amount\": 191.52}, \"customer\": {\"id\": \"CUST-TEST\", \"name\": \"Lucas\", \"email\": \"lsbempreendimentos@gmail.com\"}, \"product\": {\"id\": \"PROD-456\", \"name\": \"SoulSync - Anual\"}, \"subscription\": {\"id\": \"SUB-TEST\", \"status\": \"active\"}}"

echo.
echo ========================================
echo Verifique o console do servidor!
echo Copie o link gerado e cole no navegador
echo ========================================
pause
