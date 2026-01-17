# 🔗 Integração Payt - Guia Completo

Este guia explica como configurar a integração entre o SoulSync e a plataforma de pagamentos Payt.

## 📋 Visão Geral

A integração funciona através de **webhooks (postbacks)** que a Payt envia automaticamente quando eventos importantes acontecem (vendas, cancelamentos, etc.).

### Fluxo Completo

```
Cliente paga na Payt
    ↓
Payt confirma pagamento
    ↓
Payt envia webhook para seu servidor
    ↓
Servidor gera token de acesso
    ↓
Email automático enviado ao cliente
    ↓
Cliente acessa área de membros com magic link
```

## 🔧 Configuração na Payt

### 1. Acessar Configurações de Postback

1. Faça login no painel da Payt
2. Vá em **Postbacks** (conforme imagem que você enviou)
3. Clique em **"Criar Postback"**

### 2. Configurar o Postback

Preencha os campos:

#### Nome
```
SOULSYNC
```

#### Status
- ✅ **Ativo** (toggle ligado)

#### Notificar Erros
- 🔴 **Notificar** (toggle ligado) - Recomendado para debug

#### URL
```
https://seudominio.vercel.app/api/webhook/payt
```

> ⚠️ **IMPORTANTE**: Substitua `seudominio.vercel.app` pela URL real do seu projeto

Para desenvolvimento local (testes), use uma ferramenta como:
- **Ngrok**: `https://xxxx.ngrok.io/api/webhook/payt`
- **Localtunnel**: `https://xxxx.loca.lt/api/webhook/payt`

#### Tipo
```
PayT V1
```

#### Chave Única
```
f630b87e16e6a6364027dcb2b465b9d4
```

> 🔐 Esta chave já está configurada no código do webhook

### 3. Selecionar Eventos

Marque os seguintes eventos para receber notificações:

#### ✅ Eventos que LIBERAM acesso:
- [x] **Assinatura Cancelada** - Cliente cancelou (remove acesso)
- [x] **Assinatura Reativada** - Cliente reativou (libera acesso)
- [x] **Venda** - Nova venda confirmada (libera acesso)
- [x] **Recorrência** - Pagamento recorrente (libera acesso)

#### ⚠️ Eventos importantes:
- [x] **Pedido Confirmado** - Pedido foi confirmado (libera acesso)
- [x] **Pedido Frustrado** - Pagamento falhou (remove acesso)
- [x] **Assinatura em Atraso** - Pagamento atrasado (apenas aviso)

#### ℹ️ Eventos opcionais (para logs):
- [ ] **Aguardando Confirmação** - Pedido em processamento
- [ ] **Assinatura Renovada** - Renovação de assinatura
- [ ] **Assinatura Ativada** - Assinatura foi ativada

### 4. Eventos Pague após receber

Deixe **DESMARCADOS** (não são necessários para o fluxo atual).

## 🧪 Testando a Integração

### Teste 1: Verificar endpoint

Abra no navegador:
```
https://seudominio.vercel.app/api/webhook/payt
```

Você deve ver:
```json
{
  "status": "Webhook Payt ativo",
  "provider": "Payt",
  "timestamp": "2025-01-17T...",
  "endpoint": "/api/webhook/payt"
}
```

### Teste 2: Simular venda (desenvolvimento local)

```bash
curl -X POST http://localhost:3000/api/webhook/payt \
  -H "Content-Type: application/json" \
  -d '{
    "event": "Venda",
    "customer_email": "teste@example.com",
    "customer_name": "Cliente Teste",
    "product_name": "SoulSync Premium",
    "transaction_id": "12345",
    "access_key": "f630b87e16e6a6364027dcb2b465b9d4"
  }'
```

### Teste 3: Verificar logs

Após uma venda real ou teste, verifique os logs do Vercel:

1. Acesse seu projeto no Vercel
2. Vá em **Logs** ou **Functions**
3. Procure por:
   - `📩 Webhook Payt recebido`
   - `✅ Token gerado`
   - `📨 Email de acesso enviado`

## 📧 Estrutura do Email Enviado

Quando uma venda é confirmada, o cliente recebe automaticamente um email com:

- ✉️ Assunto: **"🎉 Bem-vinda(o) ao SoulSync - Seu Acesso Está Liberado!"**
- 🔗 Magic link: `https://seudominio.com/membros?token=xxxxx`
- 📝 Instruções de acesso
- 🎧 Lista das 8 sessões incluídas

## 🔍 Como Funciona Internamente

### 1. Payt envia webhook

```json
{
  "event": "Venda",
  "customer_email": "cliente@example.com",
  "customer_name": "Maria Silva",
  "product_name": "SoulSync - Hipnose para Emagrecimento",
  "transaction_id": "TRX-12345",
  "customer_id": "CUST-67890",
  "subscription_id": "SUB-11111",
  "access_key": "f630b87e16e6a6364027dcb2b465b9d4"
}
```

### 2. Servidor processa e cria token

```javascript
const token = crypto.randomBytes(32).toString('hex');
// Gera algo como: "a1b2c3d4e5f6..."
```

### 3. Salva em `data/access-tokens.json`

```json
{
  "token": "a1b2c3d4e5f6...",
  "email": "cliente@example.com",
  "name": "Maria Silva",
  "planType": "SoulSync - Hipnose para Emagrecimento",
  "orderId": "TRX-12345",
  "customerId": "CUST-67890",
  "subscriptionId": "SUB-11111",
  "createdAt": "2025-01-17T14:30:00.000Z",
  "expiresAt": null,
  "isActive": true
}
```

### 4. Envia email via Resend

Email contém o link:
```
https://seudominio.com/membros?token=a1b2c3d4e5f6...
```

### 5. Cliente acessa área de membros

Quando o cliente clica no link:
1. Sistema valida o token via `/api/validate-token`
2. Se válido e `isActive: true` → Acesso liberado
3. Se inválido ou `isActive: false` → Acesso negado

## 🚨 Eventos que Removem Acesso

Os seguintes eventos da Payt **desativam o acesso**:

| Evento | O que acontece |
|--------|----------------|
| `Assinatura Cancelada` | Cliente cancelou → `isActive: false` |
| `Pedido Frustrado` | Pagamento falhou → `isActive: false` |
| `Assinatura Renovada` | Renovação → Recria token |

Quando `isActive: false`, o cliente perde acesso à área de membros.

## 🔐 Segurança

### Validação de Chave

O webhook valida a chave enviada pela Payt:

```typescript
function validatePaytKey(requestKey: string): boolean {
  return requestKey === 'f630b87e16e6a6364027dcb2b465b9d4';
}
```

Se a chave estiver errada, retorna `401 Unauthorized`.

### Tokens Únicos

Cada compra gera um token único de 64 caracteres hexadecimais:
- Impossível adivinhar
- Não expira (a menos que `isActive` seja `false`)
- Único por cliente

## 📊 Monitoramento

### Verificar vendas processadas

Consulte o arquivo:
```
data/access-tokens.json
```

Cada entrada representa uma venda processada.

### Logs importantes

No console/Vercel logs, procure por:

**✅ Sucesso:**
```
📩 Webhook Payt recebido: { event: 'Venda', customer: 'cliente@example.com' }
✅ Token gerado: a1b2c3d4...
📧 Email do cliente: cliente@example.com
🔗 Link de acesso: https://...
📨 Email de acesso enviado automaticamente!
```

**❌ Erros:**
```
❌ Chave de acesso inválida
❌ Erro no webhook Payt: ...
⚠️ Erro ao enviar email, mas token foi criado
```

## 🆘 Troubleshooting

### Email não chegou

1. Verifique se `RESEND_API_KEY` está configurado no `.env.local`
2. Confira o dashboard da Resend: https://resend.com/emails
3. Verifique a pasta de spam
4. Confira se o email do cliente está correto

### Webhook não está sendo chamado

1. Verifique se a URL está correta no painel da Payt
2. Confirme que o postback está **Ativo**
3. Teste com ferramenta de tunnel (ngrok) em desenvolvimento
4. Verifique os logs de erro no painel da Payt

### Token inválido ao acessar

1. Verifique se o arquivo `data/access-tokens.json` existe
2. Confirme que o token está no arquivo
3. Verifique se `isActive: true`
4. Teste a rota: `/api/validate-token?token=xxxxx`

## 🚀 Deploy em Produção

### 1. Deploy no Vercel

```bash
git add .
git commit -m "feat: integração Payt completa"
git push
```

### 2. Configurar variáveis de ambiente

No painel do Vercel:
1. Vá em **Settings → Environment Variables**
2. Adicione:
   - `RESEND_API_KEY`: Sua chave da Resend
   - `NEXT_PUBLIC_BASE_URL`: `https://seudominio.vercel.app`

### 3. Atualizar URL no Payt

No painel da Payt, atualize a URL do postback para:
```
https://seudominio.vercel.app/api/webhook/payt
```

### 4. Fazer uma venda de teste

Use o modo de teste da Payt (se disponível) ou faça uma compra real de teste.

### 5. Verificar funcionamento

1. Confira os logs do Vercel
2. Verifique se o email foi enviado
3. Teste o acesso com o link recebido

## ✅ Checklist Final

- [ ] Postback criado na Payt
- [ ] URL do webhook configurada corretamente
- [ ] Chave única adicionada
- [ ] Eventos corretos selecionados
- [ ] Status "Ativo" ligado
- [ ] `RESEND_API_KEY` configurado
- [ ] `NEXT_PUBLIC_BASE_URL` configurado
- [ ] Teste de venda realizado
- [ ] Email recebido com sucesso
- [ ] Acesso à área de membros funcionando

## 📞 Suporte

Em caso de dúvidas:
- Documentação Payt: Consulte o painel de ajuda
- Logs do Vercel: https://vercel.com/your-project/logs
- Resend Dashboard: https://resend.com/emails

---

**Última atualização**: Janeiro 2025
**Versão da integração**: Payt V1
**Chave de acesso**: f630b87e16e6a6364027dcb2b465b9d4
