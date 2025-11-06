# 🧪 Guia de Teste - Sistema de Link Mágico

## ✅ Sistema Implementado

Você agora tem um sistema funcional de controle de acesso usando **tokens mágicos**!

---

## 📁 Arquivos Criados

### 1️⃣ **API Endpoints**

✅ `/app/api/webhook/lastlink/route.ts`
- Recebe webhooks da LastLink
- Gera tokens de acesso
- Salva em arquivo JSON

✅ `/app/api/validate-token/route.ts`
- Valida tokens
- Retorna dados do usuário

### 2️⃣ **Helper de Autenticação**

✅ `/lib/auth/validateToken.ts`
- Função para validar tokens
- Gerenciamento de tokens ativos

### 3️⃣ **Página de Membros Protegida**

✅ `/app/membros/page.tsx`
- Valida token na URL
- Salva no localStorage
- Telas de loading e acesso negado

---

## 🧪 Como Testar

### **TESTE 1: Simular Webhook da LastLink**

Vamos simular uma compra usando o webhook.site:

#### Passo 1: Usar Postman ou cURL

```bash
curl -X POST http://localhost:3002/api/webhook/lastlink \
  -H "Content-Type: application/json" \
  -d '{
    "event_type": "Purchase_Order_Confirmed",
    "order": {
      "id": "ORD-123456",
      "status": "paid",
      "amount": 191.52
    },
    "customer": {
      "id": "CUST-789",
      "name": "Maria Silva",
      "email": "maria@exemplo.com"
    },
    "product": {
      "id": "PROD-456",
      "name": "SoulSync - Anual"
    },
    "subscription": {
      "id": "SUB-321",
      "status": "active"
    }
  }'
```

#### Passo 2: Verificar Console

No terminal onde está rodando `npm run dev`, você verá:

```
📩 Webhook recebido: {
  event: 'Purchase_Order_Confirmed',
  customer: 'maria@exemplo.com',
  product: 'SoulSync - Anual'
}
✅ Token gerado: abc123...xyz789
📧 Email do cliente: maria@exemplo.com
🔗 Link de acesso: http://localhost:3002/membros?token=abc123...xyz789
```

#### Passo 3: Copiar o Link

Copie o link completo que apareceu no console.

#### Passo 4: Acessar o Link

Cole o link no navegador. Você deve:
1. Ver tela de "Validando seu acesso..."
2. Ser redirecionado para /membros (sem token na URL)
3. Ver a área de membros completa!

---

### **TESTE 2: Verificar Arquivo de Tokens**

O sistema cria um arquivo `data/access-tokens.json` com todos os tokens:

```bash
# Windows
type data\access-tokens.json

# Mac/Linux
cat data/access-tokens.json
```

Você verá algo assim:

```json
[
  {
    "token": "abc123...xyz789",
    "email": "maria@exemplo.com",
    "name": "Maria Silva",
    "planType": "SoulSync - Anual",
    "orderId": "ORD-123456",
    "customerId": "CUST-789",
    "subscriptionId": "SUB-321",
    "createdAt": "2025-11-03T22:00:00.000Z",
    "expiresAt": null,
    "isActive": true
  }
]
```

---

### **TESTE 3: Tentar Acessar Sem Token**

1. Abra uma aba anônima
2. Acesse: `http://localhost:3002/membros`
3. Deve ver a tela de "Acesso Restrito"
4. Clique em "Voltar para Home"

---

### **TESTE 4: Persistência do Token**

1. Acesse com um link válido: `http://localhost:3002/membros?token=SEU_TOKEN`
2. Navegue pela área de membros
3. Feche o navegador
4. Abra novamente e vá em `http://localhost:3002/membros` (sem token)
5. Deve continuar logado!

---

### **TESTE 5: Botão Sair**

1. Estando logado, clique em "Sair" no canto superior direito
2. Deve voltar para a home
3. Tente acessar `/membros` novamente
4. Deve ver tela de "Acesso Restrito"

---

## 🔍 Testar com webhook.site

### Passo 1: Acessar webhook.site

1. Vá em https://webhook.site
2. Copie a URL única gerada

### Passo 2: Configurar na LastLink

1. Na LastLink, vá em Produtos → Seu Produto → Integrações
2. Cole a URL do webhook.site
3. Selecione eventos: `Purchase_Order_Confirmed`
4. Clique em "Testar"

### Passo 3: Ver Payload

1. Volte para webhook.site
2. Veja o JSON completo que a LastLink envia
3. Use esse formato para seus testes!

---

## 📊 Fluxo Completo

```
1. Cliente compra no LastLink
   ↓
2. LastLink processa pagamento
   ↓
3. LastLink envia webhook para:
   https://seudominio.com/api/webhook/lastlink
   ↓
4. Sistema gera token único
   ↓
5. Sistema salva em access-tokens.json
   ↓
6. Sistema loga link no console:
   http://seudominio.com/membros?token=ABC123
   ↓
7. [MANUAL] Enviar link por email
   ↓
8. Cliente clica no link
   ↓
9. Sistema valida token
   ↓
10. Token salvo no localStorage
    ↓
11. Cliente acessa área de membros!
```

---

## 🚀 Próximos Passos para Produção

### 1. **Configurar Domínio**

Você precisa de um domínio público para a LastLink enviar webhooks.

**Opções:**
- Vercel (gratuito): https://vercel.com
- Netlify (gratuito): https://netlify.com
- Railway (gratuito): https://railway.app

### 2. **Deploy do Projeto**

```bash
# Fazer build
npm run build

# Fazer deploy (exemplo: Vercel)
npx vercel --prod
```

### 3. **Configurar Webhook na LastLink**

Após deploy, configure na LastLink:
- URL: `https://seu-dominio.vercel.app/api/webhook/lastlink`
- Eventos: `Purchase_Order_Confirmed`

### 4. **Enviar Email Automático** (Opcional)

Para enviar o link automaticamente, adicione serviço de email:

**Opções:**
- Resend (gratuito até 3000 emails/mês)
- SendGrid (gratuito até 100 emails/dia)
- Mailgun

Código exemplo no arquivo `INTEGRACAO-LASTLINK.md`

### 5. **Banco de Dados** (Futuro)

Para escalar, migre de JSON para banco:
- Supabase (PostgreSQL gratuito)
- PlanetScale (MySQL gratuito)
- MongoDB Atlas (gratuito)

---

## 📝 Checklist de Produção

- [ ] Deploy feito
- [ ] Domínio configurado
- [ ] Webhook configurado na LastLink
- [ ] Teste real de compra feito
- [ ] Email de boas-vindas funcionando
- [ ] Monitoramento de erros (Sentry?)

---

## ⚠️ Limitações Atuais

1. **Tokens não expiram automaticamente** - Precisa implementar lógica de expiração
2. **Sem envio de email automático** - Link aparece apenas no console
3. **Armazenamento em JSON** - Não escala para muitos usuários
4. **Sem criptografia de tokens** - Considere usar JWT

---

## 💡 Melhorias Futuras

1. ✅ Enviar email automático com link
2. ✅ Migrar para banco de dados
3. ✅ Adicionar expiração de tokens
4. ✅ Implementar renovação automática
5. ✅ Dashboard de admin
6. ✅ Analytics de uso

---

## 🆘 Troubleshooting

### Problema: "Acesso Restrito" mesmo com token válido

**Solução:**
1. Verifique se o arquivo `data/access-tokens.json` existe
2. Confirme que `isActive: true`
3. Limpe o localStorage e tente novamente

### Problema: Webhook não está chegando

**Solução:**
1. Teste localmente primeiro
2. Use webhook.site para debug
3. Verifique logs da LastLink

### Problema: Token não persiste após reload

**Solução:**
1. Verifique o console do navegador
2. Confirme que localStorage está ativo
3. Tente em modo normal (não anônimo)

---

Precisa de ajuda? Revise `INTEGRACAO-LASTLINK.md` para mais detalhes! 🚀
