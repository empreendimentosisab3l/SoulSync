# ✅ Checklist Pós-Deploy - SoulSync

## 🎯 Testes Obrigatórios Após Deploy

### 1. ✅ Verificar se o Deploy Passou

**Onde:** Painel da Vercel
**Como:**
1. Acesse: https://vercel.com/seu-usuario/hypnozio-mvp
2. Vá na aba "Deployments"
3. O último deploy deve estar com status "Ready" (verde)

**Se estiver vermelho (erro):**
- Clique no deploy
- Vá em "Build Logs"
- Veja qual foi o erro
- Provavelmente falta alguma variável de ambiente

---

### 2. ✅ Testar Endpoint do Webhook

**URL:** `https://seu-dominio.vercel.app/api/webhook/payt`

**Teste via navegador:**
```
Abra: https://seu-dominio.vercel.app/api/webhook/payt
```

**Resultado esperado:**
```json
{
  "status": "Webhook Payt ativo (unificado)",
  "provider": "Payt",
  "features": ["JSON tokens", "Database", "Google Sheets", "Email"],
  "timestamp": "2025-01-17T...",
  "endpoint": "/api/webhook/payt"
}
```

**Se der erro 500:**
- Problema no banco de dados
- Vai nos logs: Vercel → Seu Projeto → Logs

---

### 3. ✅ Verificar Variáveis de Ambiente

**Onde:** Vercel → Settings → Environment Variables

**Obrigatórias:**
- [x] `DATABASE_URL` - Você tem
- [x] `JWT_SECRET` - Você tem
- [x] `GOOGLE_SHEET_ID` - Você tem
- [x] `GOOGLE_SERVICE_ACCOUNT_EMAIL` - Você tem
- [ ] `RESEND_API_KEY` - **Você adicionou?**
- [ ] `NEXT_PUBLIC_BASE_URL` - **Você adicionou?**

**Como verificar se faltou alguma:**
1. Vá em Vercel → Logs
2. Procure por avisos tipo: `⚠️ Google Sheets não configurado`
3. Procure por erros do Resend

---

### 4. ✅ Testar Banco de Dados (Prisma)

**No seu terminal local:**

```bash
# Verificar se as migrations foram aplicadas
npx prisma studio
```

Isso vai abrir um navegador com o Prisma Studio.

**Se não abrir ou der erro:**
```bash
# Aplicar schema no banco
npx prisma db push

# Gerar cliente Prisma
npx prisma generate
```

**Então faça commit e redeploy:**
```bash
git add -A
git commit -m "chore: prisma migrations"
git push
```

---

### 5. ✅ Testar Webhook com Simulação

**Teste com curl ou Postman:**

```bash
curl -X POST https://seu-dominio.vercel.app/api/webhook/payt \
  -H "Content-Type: application/json" \
  -d '{
    "event": "Venda",
    "customer_email": "teste@example.com",
    "customer_name": "Cliente Teste",
    "product_name": "SoulSync Premium",
    "transaction_id": "test-123",
    "access_key": "f630b87e16e6a6364027dcb2b465b9d4"
  }'
```

**Resultado esperado:**
```json
{
  "success": true,
  "message": "Acesso liberado, email enviado e dados salvos",
  "token": "a1b2c3d4e5f6...",
  "emailSent": true
}
```

**Se `emailSent: false`:**
- `RESEND_API_KEY` não foi configurada
- Ou a chave está inválida

**Depois do teste, verifique:**
1. **Logs da Vercel** - Ver se processou tudo
2. **Google Sheets** - Ver se apareceu a linha com o cliente teste
3. **Email** - Verificar se chegou no teste@example.com (se configurou Resend)

---

### 6. ✅ Testar Login

**URL:** `https://seu-dominio.vercel.app/login`

**Teste:**
1. Abra a URL
2. Tente fazer login com qualquer email/senha
3. Deve aparecer "Credenciais inválidas" (normal, não tem usuário ainda)

**Se der erro 500:**
- Problema no banco de dados
- Tabela `User` não existe
- Execute: `npx prisma db push`

**Criar usuário de teste (opcional):**
```bash
# No Prisma Studio ou direto no banco
# Adicione um usuário com:
# email: teste@teste.com
# password: hash bcrypt de uma senha
# status: active
```

---

### 7. ✅ Testar Área de Membros

**URL:** `https://seu-dominio.vercel.app/membros`

**Teste sem token:**
- Deve redirecionar ou mostrar acesso negado

**Teste com token (após simulação do webhook):**
```
https://seu-dominio.vercel.app/membros?token=TOKEN_GERADO_NO_TESTE
```

**Resultado esperado:**
- Mostra as 8 sessões de áudio
- Consegue ouvir os áudios

---

### 8. ✅ Verificar Logs da Vercel

**Onde:** Vercel → Seu Projeto → Logs (ou Functions)

**O que procurar:**

**Logs de SUCESSO:**
```
✅ Token gerado: a1b2c3d4...
✅ Usuário salvo no banco de dados: teste@example.com
✅ Cliente salvo no Google Sheets
📨 Email de acesso enviado automaticamente!
```

**Logs de ERRO:**
```
❌ Chave de acesso inválida
❌ Erro ao salvar no banco de dados
❌ Erro ao salvar no Google Sheets
⚠️ Erro ao enviar email, mas acesso foi liberado
```

---

## 🐛 Problemas Comuns e Soluções

### Problema 1: Build falhou na Vercel

**Sintomas:**
- Deploy mostra "Error" vermelho
- Build logs mostram erro de compilação

**Soluções:**
```bash
# Testar build localmente
npm run build

# Se passar local mas falhar na Vercel:
# - Verificar variáveis de ambiente
# - Verificar NODE_VERSION (se configurada)
```

### Problema 2: Webhook retorna 500

**Sintomas:**
- Teste do webhook dá erro 500
- Logs mostram erro de banco

**Soluções:**
```bash
# Aplicar schema no banco
npx prisma db push

# Verificar se DATABASE_URL está correta
# Testar conexão local com o banco
```

### Problema 3: Email não é enviado

**Sintomas:**
- `emailSent: false` na resposta
- Logs mostram erro do Resend

**Soluções:**
1. Verificar se `RESEND_API_KEY` foi adicionada
2. Verificar se a chave está válida em https://resend.com/api-keys
3. Verificar se ultrapassou limite de emails (3.000/mês no gratuito)

### Problema 4: Google Sheets não salva

**Sintomas:**
- Logs mostram: `⚠️ Google Sheets não configurado`
- Ou erro ao salvar

**Soluções:**
1. Verificar `GOOGLE_SHEET_ID` na Vercel
2. Verificar `GOOGLE_SERVICE_ACCOUNT_EMAIL` na Vercel
3. Verificar se a planilha foi compartilhada com a service account
4. Verificar se a primeira aba tem as colunas corretas: Data, Nome, Email, Status, Plano

---

## ✅ CHECKLIST FINAL

Marque conforme for testando:

### Deploy
- [ ] Deploy passou sem erros (verde na Vercel)
- [ ] Site está acessível no ar

### Endpoints
- [ ] `GET /api/webhook/payt` retorna status do webhook
- [ ] `GET /login` carrega página de login
- [ ] `GET /membros` carrega área de membros

### Webhook
- [ ] Teste de simulação retorna `success: true`
- [ ] Token é gerado
- [ ] Usuário salva no banco de dados
- [ ] Cliente aparece no Google Sheets
- [ ] Email é enviado (`emailSent: true`)

### Funcionalidades
- [ ] Login funciona (mesmo que retorne "inválido")
- [ ] Área de membros valida token
- [ ] Áudios carregam e tocam

### Variáveis de Ambiente
- [ ] Todas as 6 variáveis estão configuradas
- [ ] `NEXT_PUBLIC_BASE_URL` aponta para domínio correto
- [ ] `RESEND_API_KEY` está válida

---

## 📞 Se algo não funcionar

1. **Veja os logs da Vercel primeiro**
   - 90% dos problemas aparecem lá

2. **Teste localmente**
   ```bash
   npm run dev
   # Testar tudo funcionando local
   ```

3. **Verifique as variáveis de ambiente**
   - Copie as mesmas que funcionam local para a Vercel

4. **Redeploye após ajustes**
   ```bash
   git push
   # Vercel faz deploy automaticamente
   ```

---

**Data:** 17/01/2025
**Status:** Aguardando testes
**Build:** ✅ Passou localmente
