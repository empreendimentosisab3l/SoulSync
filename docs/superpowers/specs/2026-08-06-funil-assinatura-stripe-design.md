# Design: Funil de assinatura Stripe (trial pago) no quiz-v3

**Data:** 2026-08-06
**Status:** Aprovado (aguardando revisão do spec)

## Objetivo

Substituir o checkout Payt de compra única do funil `quiz-v3` por uma assinatura recorrente
via Stripe, usando um **trial pago** para reduzir a fricção de entrada:

- Cliente paga **R$ 4,90 hoje** (taxa de acesso, cobrança imediata)
- **3 dias depois**, a Stripe cobra **R$ 39,90** automaticamente e inicia a recorrência mensal
- Sem nova ação do cliente entre o trial e a cobrança cheia

Stripe **vira o padrão** do quiz-v3. Os funis legados (`/oferta`, `/oferta-v2`, `/quiz-v3/result/5`)
e o webhook Payt permanecem intocados como fallback.

## Decisões de produto (definidas no brainstorming)

| Tema | Decisão |
|------|---------|
| Divisão de tráfego | Stripe vira o padrão do quiz-v3; Payt fica só nos funis antigos |
| Apresentação da oferta | R$ 4,90 como herói absoluto; mensalidade em destaque menor + na tela da Stripe |
| Conta Stripe | Já ativada com CNPJ (recebe BRL em modo live) |
| Trial | 3 dias |
| Taxa de acesso | R$ 4,90 (cobrança imediata) |
| Assinatura | R$ 39,90/mês |

## Abordagem técnica

**Stripe Checkout hospedado** em `mode=subscription` (não Payment Element / não Payment Link).

Razões:
- A Stripe resolve SetupIntent, uso off-session, SCA/3DS, retries e cartão salvo automaticamente
- Zero formulário de cartão próprio → zero superfície de PCI
- ~90% menos código que a "Abordagem B" do guia técnico original

Uma única Checkout Session carrega dois itens:
1. Preço avulso R$ 4,90 (`add_invoice_items` — cobrado na primeira fatura, imediatamente)
2. Preço recorrente R$ 39,90/mês com `subscription_data.trial_period_days = 3`

Como a primeira fatura tem o item avulso de R$ 4,90 (valor > 0), a Stripe cobra o cartão na hora
mesmo com a assinatura em `trialing`. Ao fim do trial (dia 3), a Stripe gera a fatura cheia de
R$ 39,90 e cobra o cartão salvo off-session.

## Arquitetura

### Componentes novos

| Arquivo | Responsabilidade |
|---------|------------------|
| `lib/stripeConfig.ts` | Price IDs, valores e constantes centralizadas (trial days, moeda) |
| `lib/stripe.ts` | Cliente Stripe singleton (server-side) |
| `app/api/stripe/checkout/route.ts` | POST → cria Checkout Session, retorna URL de redirect |
| `app/api/stripe/webhook/route.ts` | POST → processa eventos Stripe, espelha pipeline Payt |
| `app/api/stripe/portal/route.ts` | POST → cria sessão do Customer Portal (cancelar/gerenciar) |
| `app/quiz-v3/sucesso/page.tsx` | Página de retorno pós-pagamento ("verifique seu email") |

### Componentes alterados

| Arquivo | Alteração |
|---------|-----------|
| `app/quiz-v3/checkout/page.tsx` | Bloco de preço vira herói R$ 4,90; 7 CTAs chamam `/api/stripe/checkout` em vez de redirecionar pra Payt |

### Componentes intocados

- Funis `/oferta`, `/oferta-v2`, `/quiz-v3/result/5` e `app/api/webhook/payt/route.ts`
- Login JWT + Prisma (`app/api/auth/me`, `contexts/AuthContext.tsx`)
- Área de membros (`app/membros/page.tsx`) — cliente Stripe entra pelo mesmo fluxo de acesso

## Fluxo de dados

```
quiz-v3 (23 perguntas) → email → result → scratch → checkout (herói R$ 4,90)
  │
  ├─ clique no CTA
  │    → POST /api/stripe/checkout { name, email, src }
  │    → cria/recupera Customer (email)
  │    → cria Checkout Session (mode=subscription, item R$4,90 + item R$39,90/mês trial 3d)
  │    → metadata: { src, name }
  │    → retorna session.url
  │    → redirect para checkout.stripe.com
  │
  ├─ cliente paga R$ 4,90 na Stripe
  │    → redirect para /quiz-v3/sucesso
  │
  └─ webhook checkout.session.completed
       → upsert Prisma (status: active)
       → Google Sheets (reaproveitar saveToGoogleSheets)
       → sendAccessEmail via Resend (magic link /membros?token=)

Dia 3:
  Stripe cobra R$ 39,90 automaticamente (off-session)
  → invoice.paid: confirma recorrência (log/no-op)
  → invoice.payment_failed: Stripe faz retry ~1 semana (não revogamos ainda)
  → customer.subscription.deleted: cancelou OU retries esgotaram → status: inactive
```

## Eventos de webhook

| Evento Stripe | Ação |
|---------------|------|
| `checkout.session.completed` | Concede acesso: upsert Prisma `active` → Sheets → email de acesso |
| `invoice.paid` | Confirma pagamento (inicial ou recorrente); log |
| `invoice.payment_failed` | Não revoga imediatamente (Stripe faz dunning/retries) |
| `customer.subscription.deleted` | Revoga acesso: Prisma `status: inactive` |

Assinatura do webhook verificada com `STRIPE_WEBHOOK_SECRET` via `stripe.webhooks.constructEvent`.
Diferente do webhook Payt atual, **nenhuma chave é hardcoded** no código.

## Variáveis de ambiente novas

```
STRIPE_SECRET_KEY=sk_...            # server-side
STRIPE_WEBHOOK_SECRET=whsec_...     # verificação de assinatura do webhook
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_...   # (reservado; Checkout hospedado não exige no client)
STRIPE_PRICE_ACCESS_FEE=price_...   # R$ 4,90 avulso
STRIPE_PRICE_SUBSCRIPTION=price_... # R$ 39,90/mês
```

## Tratamento de erros

- `/api/stripe/checkout`: se faltar email/name → 400; se a API Stripe falhar → 500 com mensagem
  genérica ao client e log do erro real no servidor
- `/api/stripe/webhook`: assinatura inválida → 400 (Stripe reenvia); erro no processamento → 500
  para a Stripe reentregar; idempotência via `event.id` (a Stripe pode reenviar o mesmo evento)
- Página de sucesso não depende do webhook: mostra "verifique seu email" independentemente

## Pendências que o plano de implementação precisa cobrir

1. **Domínio verificado no Resend** — o remetente atual (`onboarding@resend.dev`) só entrega para o
   email da própria conta Resend. É **bloqueador** para clientes reais receberem o email de acesso.
   Precisa verificar o domínio no Resend antes do go-live.
2. **Customer Portal / cancelamento fácil** — link "gerenciar assinatura" no email e/ou na área de
   membros. Reduz chargeback e é exigência da Stripe para assinaturas.

## Riscos conhecidos (pré-existentes, não introduzidos por este trabalho)

- Chave privada do Google Service Account e Payt access key hardcoded em
  `app/api/webhook/payt/route.ts` — não tocaremos, mas vale registrar.
- Backdoor `test-free-trial-` em `contexts/AuthContext.tsx:124`.
- `lib/analytics.ts` é stub no-op: não há baseline de conversão Payt para comparar com Stripe.

## Acessos necessários do usuário (via extensão)

- Chaves da API Stripe (test primeiro, depois live)
- Dashboard Stripe para configurar o endpoint de webhook
- Resend para verificar o domínio de envio

## Fora de escopo

- Migração dos funis legados para Stripe
- Reescrita do sistema de analytics (stub permanece)
- Correção dos riscos de segurança pré-existentes do webhook Payt
