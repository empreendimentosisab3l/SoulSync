# Design: Conta segura na página /obrigado (Stripe)

**Data:** 2026-08-07
**Status:** Aprovado pelo Lucas (escopo "corrigir tudo")

## Objetivo

O lead que pagou no Stripe chega na `/obrigado`, vê **o próprio email já preenchido e
travado** (vindo da sessão do Stripe), cria apenas a senha e entra em `/membros`. E
**ninguém sem pagamento confirmado** consegue criar uma conta ativa.

Resolve dois problemas do estado atual:
1. **Email em branco:** o `success_url` do Stripe não passa email; o quiz-v3 não captura
   email; o lead chega numa tela com campo vazio e precisa redigitar.
2. **Furo de segurança:** `/api/auth/register` cria conta `status:'active'` para qualquer
   email+senha, sem verificar pagamento — acesso grátis a todo o conteúdo.

## Contexto (verificado no código)

- `lib/stripe/checkout.ts` → `success_url: ${origin}/obrigado` (sem session_id, sem email).
- `app/obrigado/page.tsx` → já tem formulário email+senha → `POST /api/auth/register` →
  `refreshAuth()` → `router.push('/membros')`. Campo de email editável, começa vazio
  (tenta `?email=` na URL e `sessionStorage.userEmail`, ambos ausentes no fluxo Stripe).
- `pages/api/auth/register.ts` (Pages Router) → upsert user `status:'active'`, gera JWT,
  seta cookie `session_token`. **Único chamador é `/obrigado`** (grep confirmado).
- `app/api/auth/me/route.ts` → concede acesso a `status` em `['active','pending_password']`.
- Usuários que voltam usam `app/login/page.tsx` (senha), não passam por register.
- Funil Payt antigo NÃO passa por `/obrigado` nem por `register` (isolado).

## Decisões

| Tema | Decisão |
|------|---------|
| Fonte da verdade | Email e status "pagou" vêm **sempre do Stripe server-side** (`checkout.sessions.retrieve`). Cliente não forja. |
| Sinal de "pagou" | `session.status === 'complete'` (checkout concluído, cartão coletado, trial/fee ok). |
| Email | `session.customer_details.email` (fallback `session.customer_email`). Campo travado no front. |
| register | Passa a **exigir `sessionId`**, re-verifica no Stripe, usa o email DA SESSÃO (ignora email do body). Sem sessão `complete` → 402, conta não criada. |
| Compat | register só é chamado pela `/obrigado`; exigir `sessionId` não quebra outros fluxos. |
| Falha transiente Stripe | verify-session e register distinguem "não pago" (bloqueia) de "erro de API" (permite retry, não bloqueia pagador real). |

## Componentes

### 1. `lib/stripe/checkout.ts` (modificar)
`success_url: ${input.origin}/obrigado?session_id={CHECKOUT_SESSION_ID}`
O literal `{CHECKOUT_SESSION_ID}` é substituído pelo Stripe pelo id real (`cs_live_...`).
`cancel_url` inalterado.

### 2. `app/api/stripe/verify-session/route.ts` (criar — App Router, GET)
- Entrada: query `session_id`.
- Sem `session_id` → 400 `{ error }`.
- `stripe.checkout.sessions.retrieve(session_id)`:
  - `status === 'complete'` → 200 `{ paid: true, email }` (email da sessão; string vazia se
    ausente).
  - status diferente → 402 `{ paid: false }`.
  - Erro de "não encontrado" (StripeInvalidRequestError) → 404 `{ paid: false }`.
  - Outro erro (rede/API) → 503 `{ error: 'stripe_unavailable' }` (front pode retry).
- Nunca retorna dados sensíveis além do email.
- Usa o mesmo client Stripe já configurado no projeto (`lib/stripe`).

### 3. `pages/api/auth/register.ts` (modificar)
- Schema passa a exigir `sessionId: string` + `password: string(min 6)`. `email` do body
  é **ignorado** (não confiável).
- Re-verifica a sessão via `stripe.checkout.sessions.retrieve(sessionId)`:
  - `status !== 'complete'` → 402 `{ error: 'payment_not_confirmed' }`, não cria conta.
  - erro de API → 503, não cria conta.
- Extrai `email` da sessão. Sem email na sessão → 422 `{ error: 'email_missing' }`.
- Faz o upsert atual (`status:'active'`, hash bcrypt) usando o email verificado, gera JWT,
  seta cookie `session_token` (inalterado).

### 4. `app/obrigado/page.tsx` (modificar)
- No mount: lê `session_id` da URL → `GET /api/stripe/verify-session`.
  - `paid` → preenche `email` (state) e **trava o input** (readOnly + estilo desabilitado).
  - 402/404 → estado "não localizamos seu pagamento" com contato de suporte; esconde o form.
  - 503 → mensagem "verificando pagamento…" com botão "tentar de novo".
  - Sem `session_id` na URL → mesmo estado de "não localizamos" (acesso direto sem compra).
- `handleCreateAccount`: envia `{ sessionId, password }` (sem email) ao register. Mantém
  validação de senha (min 6, confirmação) e o resto do fluxo (`refreshAuth` → `/membros`).

## Testes

- `app/api/stripe/verify-session/route.test.ts` (vitest, mock do client Stripe):
  sessão `complete` → 200 + email; sessão incompleta → 402; not found → 404; sem
  `session_id` → 400; erro de rede → 503.
- `pages/api/auth/register.test.ts` (vitest, mock Stripe + prisma):
  sessão paga → cria/ativa conta com email da sessão e ignora email do body; sessão
  não paga → 402 e prisma NÃO chamado; sem `sessionId` → 400.
- Teste E2E manual (final, modo teste, cartão 4242): checkout → /obrigado com email
  travado → cria senha → /membros com acesso liberado. Zero dinheiro real.

## Limitação conhecida (fora de escopo)

Se o lead **fechar** a `/obrigado` antes de criar a senha, hoje não há como reenviar o
link (Resend sem domínio verificado). Follow-up quando o email de boas-vindas funcionar
(provisão de conta via webhook `checkout.session.completed` + reset de senha por email).

## Fora de escopo

- Funil Payt antigo, emails de boas-vindas, provisão de conta via webhook, magic link.
