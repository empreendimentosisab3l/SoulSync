# 🔗 Guia de Integração LastLink + SoulSync

## 📋 Visão Geral do Fluxo

```
Cliente faz compra → LastLink processa pagamento → Webhook notifica seu servidor → Sistema libera acesso → Cliente acessa /membros
```

---

## 🎯 Passo a Passo Completo

### 1️⃣ **Configurar Produto na LastLink**

1. Acesse sua conta LastLink
2. Vá em **Produtos** e selecione seu produto (ou crie um novo)
3. Configure:
   - Nome: "SoulSync - Programa de Hipnoterapia"
   - Preços dos planos:
     - **Trimestral**: R$ 64,74 (3x R$ 21,58)
     - **Semestral**: R$ 102,84 (6x R$ 17,14)
     - **Anual**: R$ 191,52 (12x R$ 15,96)

---

### 2️⃣ **Configurar Webhook na LastLink**

#### No painel da LastLink:

1. Vá em **Produtos** → selecione seu produto
2. Clique em **Integrações**
3. Encontre **Lastlink - Webhook** e clique em **Ativar**
4. Clique em **Novo webhook**
5. Preencha:
   - **Nome**: "SoulSync Access Control"
   - **URL**: `https://seudominio.com/api/webhook/lastlink`

#### Eventos importantes para selecionar:

✅ **Purchase_Order_Confirmed** - Pagamento confirmado (PRINCIPAL)
✅ **Product_access_started** - Acesso liberado
✅ **Product_access_ended** - Acesso removido
✅ **Subscription_Canceled** - Assinatura cancelada
✅ **Subscription_Expired** - Pagamento de renovação falhou
✅ **Payment_Refund** - Reembolso processado

---

### 3️⃣ **Criar Endpoint de Webhook no Seu Servidor**

Você precisa criar uma API que receberá as notificações da LastLink:

```typescript
// app/api/webhook/lastlink/route.ts

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Receber dados do webhook
    const data = await request.json();

    console.log('Webhook recebido:', data);

    // Verificar tipo de evento
    const eventType = data.event_type;

    switch (eventType) {
      case 'Purchase_Order_Confirmed':
        // Pagamento confirmado - liberar acesso
        await liberarAcesso(data);
        break;

      case 'Product_access_ended':
      case 'Subscription_Canceled':
      case 'Subscription_Expired':
        // Remover acesso
        await removerAcesso(data);
        break;

      case 'Payment_Refund':
        // Processar reembolso
        await processarReembolso(data);
        break;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro no webhook:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

async function liberarAcesso(data: any) {
  // Extrair informações do comprador
  const email = data.customer?.email;
  const name = data.customer?.name;
  const productId = data.product?.id;

  // OPÇÃO 1: Salvar no banco de dados
  // await db.users.create({
  //   email,
  //   name,
  //   hasAccess: true,
  //   planType: data.product?.name,
  //   expiresAt: data.subscription?.next_charge_date
  // });

  // OPÇÃO 2: Enviar email com credenciais
  // await sendWelcomeEmail(email, name);

  console.log(`✅ Acesso liberado para: ${email}`);
}

async function removerAcesso(data: any) {
  const email = data.customer?.email;

  // Atualizar no banco
  // await db.users.update({
  //   where: { email },
  //   data: { hasAccess: false }
  // });

  console.log(`❌ Acesso removido para: ${email}`);
}

async function processarReembolso(data: any) {
  const email = data.customer?.email;

  // Remover acesso e processar reembolso
  await removerAcesso(data);

  console.log(`💰 Reembolso processado para: ${email}`);
}
```

---

### 4️⃣ **Exemplo de Payload do Webhook**

Quando um cliente comprar, você receberá um JSON assim:

```json
{
  "event_type": "Purchase_Order_Confirmed",
  "order": {
    "id": "ORD-123456",
    "status": "paid",
    "amount": 191.52,
    "created_at": "2025-11-03T15:30:00Z"
  },
  "customer": {
    "id": "CUST-789",
    "name": "Maria Silva",
    "email": "maria@exemplo.com",
    "phone": "+5511999999999"
  },
  "product": {
    "id": "PROD-456",
    "name": "SoulSync - Anual",
    "type": "subscription"
  },
  "subscription": {
    "id": "SUB-321",
    "status": "active",
    "next_charge_date": "2026-11-03"
  },
  "payment": {
    "method": "credit_card",
    "installments": 12
  }
}
```

---

### 5️⃣ **Opções de Implementação**

#### **OPÇÃO A: Sistema de Autenticação (Recomendado)**

Criar login/senha para área de membros:

1. Criar tabela de usuários no banco
2. Quando webhook confirmar pagamento, criar conta
3. Enviar email com credenciais
4. Cliente faz login em `/membros`

**Vantagens:**
✅ Mais seguro
✅ Controle total de acesso
✅ Histórico de uso
✅ Pode rastrear progresso

**Desvantagens:**
❌ Mais complexo
❌ Precisa banco de dados

---

#### **OPÇÃO B: Link Mágico (Mais Simples)**

Gerar link único com token para cada cliente:

1. Webhook recebe compra
2. Gera token único: `https://soulsync.com/membros?token=ABC123XYZ`
3. Envia email com link
4. Cliente clica e acessa direto

**Vantagens:**
✅ Implementação rápida
✅ Experiência sem fricção
✅ Não precisa login/senha

**Desvantagens:**
❌ Menos seguro
❌ Link pode ser compartilhado

---

#### **OPÇÃO C: Usar Área de Membros da LastLink (Mais Fácil)**

A LastLink tem área de membros nativa:

1. Configure os áudios na área da LastLink
2. Cliente compra e acessa automaticamente
3. LastLink gerencia tudo

**Vantagens:**
✅ Zero código necessário
✅ Totalmente automático
✅ LastLink gerencia cobranças

**Desvantagens:**
❌ Menos customização
❌ Design limitado
❌ Depende 100% da LastLink

---

### 6️⃣ **Testar a Integração**

#### Usar webhook.site para debug:

1. Acesse https://webhook.site
2. Copie a URL gerada
3. Cole na LastLink como URL do webhook
4. Clique em "Testar" na LastLink
5. Veja o payload completo em webhook.site

#### Fazer compra de teste:

1. Na LastLink, crie um produto de teste (R$ 1,00)
2. Use cartão de teste LastLink
3. Verifique se webhook foi enviado
4. Confirme que acesso foi liberado

---

### 7️⃣ **Banco de Dados Sugerido**

Se optar por sistema próprio, estrutura sugerida:

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  has_access BOOLEAN DEFAULT false,
  plan_type VARCHAR(50),
  lastlink_customer_id VARCHAR(100),
  lastlink_subscription_id VARCHAR(100),
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE access_logs (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  session_id VARCHAR(100),
  accessed_at TIMESTAMP DEFAULT NOW(),
  ip_address VARCHAR(50)
);

CREATE TABLE sessions_progress (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  session_number INT,
  completed BOOLEAN DEFAULT false,
  last_position INT DEFAULT 0,
  completed_at TIMESTAMP
);
```

---

### 8️⃣ **Fluxo de Experiência do Cliente**

```
1. Cliente acessa soulsync.com
   ↓
2. Faz o quiz (21 perguntas)
   ↓
3. Vê resultados personalizados
   ↓
4. Escolhe plano e clica "Pague Agora"
   ↓
5. Redireciona para LastLink checkout
   ↓
6. Cliente preenche dados e paga
   ↓
7. LastLink processa pagamento
   ↓
8. Webhook notifica seu servidor
   ↓
9. Sistema cria conta/token
   ↓
10. Email enviado com acesso
    ↓
11. Cliente acessa /membros
    ↓
12. Ouve as 8 sessões de hipnoterapia
```

---

### 9️⃣ **Segurança**

#### Validar webhook da LastLink:

```typescript
// Verificar se requisição veio da LastLink
function validarWebhook(request: NextRequest) {
  const signature = request.headers.get('X-Lastlink-Signature');
  const secret = process.env.LASTLINK_WEBHOOK_SECRET;

  // Validar assinatura
  // const isValid = crypto.createHmac('sha256', secret)
  //   .update(body)
  //   .digest('hex') === signature;

  return true; // Implementar validação real
}
```

---

### 🔟 **Próximos Passos Recomendados**

1. ✅ **Escolher opção de implementação** (A, B ou C)
2. ✅ **Configurar banco de dados** (se opção A ou B)
3. ✅ **Criar endpoint de webhook**
4. ✅ **Testar com webhook.site**
5. ✅ **Fazer compra de teste**
6. ✅ **Configurar emails automáticos**
7. ✅ **Implementar proteção da rota /membros**
8. ✅ **Deploy em produção**

---

### 📚 Recursos Úteis

- **Documentação LastLink**: https://support.lastlink.com
- **Central de Ajuda**: https://support.lastlink.com/pt-BR/collections/2720464-integracoes
- **Webhook.site** (para testes): https://webhook.site
- **Testar cartões**: Use dados de teste fornecidos pela LastLink

---

### 💡 Dica Final

**Para começar rápido**: Use a **Opção C** (área de membros nativa da LastLink) para validar o negócio. Depois, migre para **Opção A** quando escalar.

---

Precisa de ajuda com alguma parte específica? 🚀
