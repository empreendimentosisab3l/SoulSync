# 📧 Guia de Configuração - Envio Automático de Emails

## 🎯 O Que Foi Implementado

Agora quando um cliente compra, **automaticamente**:
1. ✅ Webhook recebe notificação da LastLink
2. ✅ Token único é gerado
3. ✅ **Email é enviado automaticamente** com link de acesso
4. ✅ Cliente clica no link e acessa a área de membros

---

## 🚀 Passo 1: Criar Conta no Resend (GRÁTIS)

### 1.1 Acessar Resend

1. Vá em: https://resend.com
2. Clique em **"Start Building"** ou **"Sign Up"**
3. Crie sua conta (pode usar Google/GitHub)

### 1.2 Plano Gratuito

✅ **3.000 emails por mês GRÁTIS**
✅ Sem cartão de crédito necessário
✅ Para sempre gratuito

---

## 🔑 Passo 2: Obter API Key

### 2.1 Criar API Key

1. Faça login no Resend
2. Vá em: **API Keys** (menu lateral)
3. Clique em **"Create API Key"**
4. Configure:
   - **Name**: SoulSync Production
   - **Permission**: Full Access (ou Send Emails apenas)
5. Clique em **"Add"**
6. **COPIE A KEY** (você só verá uma vez!)

Exemplo de API Key:
```
re_123456789_AbCdEfGhIjKlMnOpQrStUvWxYz
```

---

## ⚙️ Passo 3: Configurar no Projeto

### 3.1 Adicionar ao .env.local

Crie ou edite o arquivo `.env.local` na raiz do projeto:

```bash
# .env.local

# Resend API Key
RESEND_API_KEY=re_SUA_KEY_AQUI

# URL do seu site (em produção será seu domínio real)
NEXT_PUBLIC_BASE_URL=http://localhost:3002
```

### 3.2 Exemplo Completo:

```bash
# .env.local (EXEMPLO - NÃO COPIAR)

RESEND_API_KEY=re_123456789_AbCdEfGhIjKlMnOpQrStUvWxYz
NEXT_PUBLIC_BASE_URL=http://localhost:3002
```

⚠️ **IMPORTANTE**: Nunca commit o arquivo `.env.local` no Git!

---

## 📬 Passo 4: Configurar Domínio de Envio (OPCIONAL para testes)

### 4.1 Para Testes (Usar domínio do Resend)

Por padrão, o email será enviado de:
```
SoulSync <onboarding@resend.dev>
```

Isso funciona perfeitamente para testes!

### 4.2 Para Produção (Usar seu domínio)

1. No Resend, vá em **Domains**
2. Clique em **"Add Domain"**
3. Digite seu domínio (ex: `soulsync.com.br`)
4. Adicione os registros DNS fornecidos pelo Resend:
   - **SPF** (TXT)
   - **DKIM** (TXT)
   - **DMARC** (TXT)
5. Aguarde verificação (pode levar algumas horas)

Depois, edite o arquivo `lib/email/sendAccessEmail.ts`:

```typescript
from: 'SoulSync <noreply@soulsync.com.br>', // Seu domínio
```

---

## 🧪 Passo 5: Testar Envio de Email

### 5.1 Reiniciar Servidor

Após configurar `.env.local`, reinicie o servidor:

```bash
# Parar servidor (Ctrl+C)
# Iniciar novamente:
npm run dev
```

### 5.2 Executar Teste do Webhook

Execute o script de teste (troque o email pelo seu):

**Windows:**
```bash
curl -X POST http://localhost:3002/api/webhook/lastlink ^
  -H "Content-Type: application/json" ^
  -d "{\"event_type\": \"Purchase_Order_Confirmed\", \"customer\": {\"email\": \"SEU_EMAIL@gmail.com\", \"name\": \"Seu Nome\"}, \"product\": {\"name\": \"SoulSync - Anual\"}, \"order\": {\"id\": \"TEST-123\"}}"
```

**Mac/Linux:**
```bash
curl -X POST http://localhost:3002/api/webhook/lastlink \
  -H "Content-Type: application/json" \
  -d '{"event_type": "Purchase_Order_Confirmed", "customer": {"email": "SEU_EMAIL@gmail.com", "name": "Seu Nome"}, "product": {"name": "SoulSync - Anual"}, "order": {"id": "TEST-123"}}'
```

### 5.3 Verificar Console

No terminal onde o servidor está rodando, você deve ver:

```
📩 Webhook recebido: {
  event: 'Purchase_Order_Confirmed',
  customer: 'SEU_EMAIL@gmail.com',
  product: 'SoulSync - Anual'
}
✅ Token gerado: abc123...
📧 Email do cliente: SEU_EMAIL@gmail.com
🔗 Link de acesso: http://localhost:3002/membros?token=abc123...
📨 Email de acesso enviado automaticamente!
```

### 5.4 Verificar Email

1. Abra sua caixa de entrada
2. Procure por email de **SoulSync**
3. ⚠️ Verifique a **caixa de SPAM** também!
4. Clique no botão **"ACESSAR ÁREA DE MEMBROS"**
5. Você deve acessar a área de membros diretamente!

---

## 📊 Fluxo Completo (Produção)

```
1. Cliente compra no LastLink
   ↓
2. LastLink processa pagamento
   ↓
3. LastLink envia webhook para seu servidor
   ↓
4. Seu servidor:
   • Gera token único
   • Salva em access-tokens.json
   • Envia email AUTOMATICAMENTE
   ↓
5. Cliente recebe email
   ↓
6. Cliente clica no botão
   ↓
7. Acessa área de membros!
```

---

## 🎨 Personalizar Email (Opcional)

### Editar Template

Abra: `lib/email/sendAccessEmail.ts`

Você pode alterar:
- ✏️ Cores do gradiente
- ✏️ Textos e mensagens
- ✏️ Nome do remetente
- ✏️ Adicionar logo (base64 ou URL)

Exemplo - Adicionar logo:

```typescript
<img src="https://seudominio.com/logo.png" alt="SoulSync" style="width: 120px; margin-bottom: 20px;">
```

---

## 🔒 Segurança

### Proteger .env.local

Certifique-se de que `.gitignore` contém:

```
.env.local
.env*.local
```

### Variáveis de Ambiente em Produção

Ao fazer deploy (Vercel/Netlify):

1. Vá em **Settings** → **Environment Variables**
2. Adicione:
   - `RESEND_API_KEY`: sua chave
   - `NEXT_PUBLIC_BASE_URL`: https://seudominio.com

---

## 📈 Monitorar Emails Enviados

### No Painel do Resend

1. Acesse https://resend.com/emails
2. Veja todos os emails enviados
3. Status de entrega
4. Taxa de abertura
5. Cliques no link

---

## 🆘 Troubleshooting

### Email não chegou

✅ **Verificar API Key**
```bash
echo $RESEND_API_KEY
# Deve mostrar: re_123...
```

✅ **Verificar logs do servidor**
```
Se ver: "Email enviado com sucesso" → Email foi enviado
Se ver: "Erro ao enviar email" → Problema com API Key ou Resend
```

✅ **Verificar caixa de SPAM**

✅ **Verificar limite do Resend**
- 3.000 emails/mês no plano gratuito
- Veja uso em: https://resend.com/overview

### Email vai para SPAM

✅ **Configure domínio próprio** (Passo 4.2)
✅ **Adicione registros SPF/DKIM**
✅ **Evite palavras como**: "grátis", "ganhe dinheiro", etc.

### Erro: "RESEND_API_KEY is not defined"

1. Certifique-se que criou `.env.local`
2. Reinicie o servidor (`npm run dev`)
3. A key começa com `re_`

---

## 💰 Custos

### Plano Gratuito (Resend)
- ✅ 3.000 emails/mês
- ✅ Grátis para sempre
- ✅ Suficiente para ~100 vendas/mês

### Se Precisar Mais
- **Plano Pro**: US$ 20/mês → 50.000 emails
- **Plano Business**: US$ 85/mês → 500.000 emails

---

## ✅ Checklist de Configuração

- [ ] Conta criada no Resend
- [ ] API Key copiada
- [ ] Arquivo `.env.local` criado
- [ ] Variável `RESEND_API_KEY` configurada
- [ ] Variável `NEXT_PUBLIC_BASE_URL` configurada
- [ ] Servidor reiniciado
- [ ] Teste de webhook executado
- [ ] Email recebido com sucesso
- [ ] Link do email funcionando
- [ ] (Opcional) Domínio configurado para produção

---

## 🎉 Pronto!

Agora seu sistema está **100% automatizado**:
- ✅ Cliente compra
- ✅ Recebe email automaticamente
- ✅ Clica e acessa área de membros
- ✅ Zero trabalho manual!

---

**Dúvidas?** Verifique os logs do servidor ou teste novamente! 🚀
