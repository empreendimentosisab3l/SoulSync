# ✅ FASE 2 - BACKEND (APIs) COMPLETA!

## 🎉 Todas as APIs implementadas com sucesso!

### ✅ APIs Criadas:

---

## 1️⃣ API NextAuth - `/api/auth/[...nextauth]`

**Arquivo:** `app/api/auth/[...nextauth]/route.ts`

**Função:** Autenticação do dashboard com NextAuth

**Métodos:** GET, POST

**Fluxo:**
- Login com username/password
- Verifica credenciais no banco (bcrypt)
- Retorna JWT token
- Gerencia sessões

**Uso:**
```typescript
import { signIn } from 'next-auth/react';

await signIn('credentials', {
  username: 'admin',
  password: 'admin123'
});
```

---

## 2️⃣ API de Tracking - `/api/track`

**Arquivo:** `app/api/track/route.ts`

**Função:** Receber eventos do quiz e salvar no banco

**Método:** POST

**Validação:** Zod schema

**Eventos suportados:**
- `quiz_started` - Quiz iniciado
- `card_viewed` - Card visualizado
- `card_answered` - Resposta dada
- `email_collected` - Email coletado
- `name_collected` - Nome coletado
- `quiz_completed` - Quiz completado
- `offer_viewed` - Oferta visualizada
- `conversion` - Compra realizada
- `quiz_abandoned` - Usuário abandonou
- `page_exit` - Saiu da página

**Request Body:**
```json
{
  "event": "quiz_started",
  "quizId": "quiz_v1",
  "sessionId": "uuid",
  "device": "mobile",
  "browser": "Chrome",
  "os": "Android",
  "screenWidth": 375,
  "screenHeight": 812,
  "utmSource": "facebook",
  "utmMedium": "cpc",
  "utmCampaign": "quiz_test_1",
  "timestamp": 1638360000000
}
```

**Response:**
```json
{
  "success": true,
  "sessionId": "uuid"
}
```

**Ações realizadas:**
- Cria quiz automaticamente se não existir
- Cria/atualiza sessão do usuário
- Salva evento na tabela `quiz_events`
- Atualiza `completedAt` quando quiz é completado
- Cria `Conversion` quando há compra

---

## 3️⃣ API Dashboard Overview - `/api/dashboard/overview`

**Arquivo:** `app/api/dashboard/overview/route.ts`

**Função:** Métricas gerais do dashboard

**Método:** GET

**Autenticação:** NextAuth (obrigatório)

**Query Params:**
- `startDate` (opcional) - YYYY-MM-DD
- `endDate` (opcional) - YYYY-MM-DD

**Response:**
```json
{
  "visitors": 1000,
  "started": 600,
  "startRate": 60,
  "completed": 240,
  "completionRate": 40,
  "converted": 36,
  "conversionRate": 15,
  "finalConversionRate": 3.6,
  "revenue": 10692.00,
  "cac": 0,
  "roi": 0,
  "trend": [
    {
      "date": "2025-01-15",
      "visitors": 45,
      "completed": 18,
      "converted": 3
    }
  ]
}
```

**Métricas calculadas:**
- Total de visitantes
- Taxa de início (% que começou o quiz)
- Taxa de conclusão (% que completou)
- Taxa de conversão (% que comprou)
- Receita total
- CAC (Custo de Aquisição de Cliente)
- ROI (Retorno sobre Investimento)
- Tendência dos últimos 30 dias

---

## 4️⃣ API Quiz Details - `/api/dashboard/quiz/[id]`

**Arquivo:** `app/api/dashboard/quiz/[id]/route.ts`

**Função:** Análise detalhada de um quiz específico

**Método:** GET

**Autenticação:** NextAuth (obrigatório)

**URL:** `/api/dashboard/quiz/{quiz-id}`

**Response:**
```json
{
  "quiz": {
    "id": "uuid",
    "name": "Quiz V1",
    "version": "1.0"
  },
  "funnel": [
    { "stage": "Visitantes", "count": 1000, "percentage": 100 },
    { "stage": "Completaram", "count": 240, "percentage": 40 },
    { "stage": "Converteram", "count": 36, "percentage": 15 }
  ],
  "cardAnalysis": [
    {
      "cardNumber": 1,
      "cardName": "idade",
      "views": 600,
      "avgTimeSpent": 5.2,
      "abandonments": 8,
      "abandonmentRate": 1.3
    }
  ],
  "bottlenecks": [
    {
      "cardNumber": 8,
      "cardName": "peso_desejado",
      "abandonments": 112,
      "abandonmentRate": 24.9
    }
  ],
  "devices": [
    { "type": "mobile", "count": 650 },
    { "type": "desktop", "count": 300 },
    { "type": "tablet", "count": 50 }
  ],
  "sources": [
    {
      "source": "facebook",
      "visitors": 500,
      "conversions": 20,
      "conversionRate": 4
    }
  ],
  "metrics": {
    "totalSessions": 1000,
    "completed": 240,
    "converted": 36,
    "revenue": 10692.00,
    "completionRate": 40,
    "conversionRate": 15
  }
}
```

**Análises incluídas:**
- Funil de conversão
- Análise card por card (tempo médio, abandonos)
- Bottlenecks (cards problemáticos)
- Breakdown por dispositivo
- Breakdown por UTM source
- Performance por origem de tráfego

---

## 5️⃣ API Compare - `/api/dashboard/compare`

**Arquivo:** `app/api/dashboard/compare/route.ts`

**Função:** Comparar múltiplos quizzes (A/B testing)

**Método:** GET

**Autenticação:** NextAuth (obrigatório)

**Query Params:**
- `quizIds` (obrigatório) - IDs separados por vírgula: `uuid1,uuid2,uuid3`
- `startDate` (opcional) - YYYY-MM-DD
- `endDate` (opcional) - YYYY-MM-DD

**Exemplo:** `/api/dashboard/compare?quizIds=abc123,def456`

**Response:**
```json
{
  "quizzes": [
    {
      "id": "uuid1",
      "name": "Quiz V1",
      "version": "1.0",
      "metrics": {
        "visitors": 1000,
        "started": 600,
        "startRate": 60,
        "completed": 240,
        "completionRate": 40,
        "converted": 30,
        "conversionRate": 12,
        "finalConversionRate": 3,
        "revenue": 8970,
        "avgRevenue": 299
      }
    },
    {
      "id": "uuid2",
      "name": "Quiz V2",
      "version": "2.0",
      "metrics": {
        "visitors": 800,
        "started": 550,
        "startRate": 68,
        "completed": 298,
        "completionRate": 54,
        "converted": 54,
        "conversionRate": 18,
        "finalConversionRate": 6.7,
        "revenue": 16146,
        "avgRevenue": 299
      }
    }
  ],
  "winner": {
    "quizId": "uuid2",
    "quizName": "Quiz V2",
    "conversionRate": 6.7,
    "improvements": [
      {
        "quizId": "uuid1",
        "quizName": "Quiz V1",
        "improvement": 123
      }
    ]
  },
  "comparison": {
    "totalVisitors": 1800,
    "totalRevenue": 25116,
    "avgCompletionRate": 47,
    "avgConversionRate": 4.85
  }
}
```

**Análises incluídas:**
- Métricas de todos os quizzes lado a lado
- Identificação automática do vencedor
- % de melhoria do vencedor vs outros
- Estatísticas consolidadas

---

## 📊 Estrutura de Dados

### Eventos Trackados:

Todos os eventos são salvos em `quiz_events`:

```typescript
{
  id: string,
  sessionId: string,
  cardNumber: number,
  cardName: string,
  eventType: string,  // 'view', 'answer', 'abandon', 'complete'
  timeSpentSeconds: number,
  answerValue: string,
  createdAt: Date
}
```

### Sessões:

Cada usuário tem uma sessão em `quiz_sessions`:

```typescript
{
  id: string,
  quizId: string,
  userId: string,
  startedAt: Date,
  completedAt: Date | null,
  convertedAt: Date | null,
  email: string | null,
  name: string | null,
  revenue: Decimal | null,
  // UTM
  utmSource: string,
  utmMedium: string,
  utmCampaign: string,
  // Device
  deviceType: string,
  browser: string,
  os: string,
  screenWidth: number,
  screenHeight: number
}
```

---

## 🔐 Autenticação

Todas as APIs de dashboard (`/api/dashboard/*`) exigem autenticação:

```typescript
const session = await getServerSession(authOptions);

if (!session) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
```

**Login:**
```typescript
await signIn('credentials', {
  username: 'admin',
  password: 'admin123'
});
```

**Logout:**
```typescript
await signOut({ callbackUrl: '/login' });
```

---

## 🧪 Testando as APIs

### Testar Tracking (sem auth):

```bash
curl -X POST http://localhost:3000/api/track \
  -H "Content-Type: application/json" \
  -d '{
    "event": "quiz_started",
    "quizId": "quiz_test_v1",
    "sessionId": "test-session-123",
    "device": "mobile",
    "browser": "Chrome",
    "os": "Android",
    "timestamp": 1638360000000
  }'
```

### Testar Dashboard APIs (requer auth):

Primeiro fazer login no navegador em `/login`, depois:

```bash
# Overview
curl http://localhost:3000/api/dashboard/overview

# Quiz Details
curl http://localhost:3000/api/dashboard/quiz/{quiz-id}

# Compare
curl "http://localhost:3000/api/dashboard/compare?quizIds=uuid1,uuid2"
```

---

## ✅ CHECKLIST FASE 2

- [x] API NextAuth criada
- [x] API de Tracking criada
- [x] API Dashboard Overview criada
- [x] API Quiz Details criada
- [x] API Compare criada
- [x] Validação com Zod
- [x] Autenticação em rotas protegidas
- [x] Tratamento de erros
- [x] Queries otimizadas (agregações, índices)
- [x] Servidor compilando sem erros

---

## 🎯 PRÓXIMA FASE: FRONTEND

Na FASE 3, vamos criar:

1. **Página de Login** - `/login`
2. **Layout do Dashboard** - Sidebar, header
3. **Página Overview** - `/dashboard`
4. **Componentes:**
   - StatCard (métricas)
   - FunnelChart (funil)
   - LineChart (tendências)
   - CardAnalysisTable (análise card por card)
   - QuizComparison (comparação)
5. **Páginas adicionais:**
   - `/dashboard/quiz/[id]` - Detalhes do quiz
   - `/dashboard/compare` - Comparação
   - `/dashboard/settings` - Configurações

---

## 📝 Arquivos Criados na FASE 2

```
app/
├── api/
│   ├── auth/
│   │   └── [...nextauth]/
│   │       └── route.ts          ✅
│   ├── track/
│   │   └── route.ts               ✅
│   └── dashboard/
│       ├── overview/
│       │   └── route.ts           ✅
│       ├── quiz/
│       │   └── [id]/
│       │       └── route.ts       ✅
│       └── compare/
│           └── route.ts           ✅
```

---

## 🚀 Status

✅ **FASE 1 (Setup)** - Completa
✅ **FASE 2 (Backend/APIs)** - Completa
⏳ **FASE 3 (Frontend)** - Próxima

**Servidor rodando em:** http://localhost:3000

**APIs disponíveis:**
- ✅ `/api/auth/[...nextauth]`
- ✅ `/api/track`
- ✅ `/api/dashboard/overview`
- ✅ `/api/dashboard/quiz/[id]`
- ✅ `/api/dashboard/compare`

---

**🎉 FASE 2 CONCLUÍDA COM SUCESSO!**

**Me avise para começar a FASE 3 (Frontend - Dashboard UI)!**
