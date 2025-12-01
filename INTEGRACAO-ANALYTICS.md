# Integração do Sistema de Analytics

Este documento explica como integrar o sistema de analytics no quiz existente.

## Sistema Implementado

O dashboard de analytics está completo e funcionando em:
- **Login**: http://localhost:3001/admin (usuário: `admin`, senha: `admin123`)
- **Dashboard Overview**: http://localhost:3001/dashboard
- **Lista de Quizzes**: http://localhost:3001/dashboard/quizzes
- **Detalhes do Quiz**: http://localhost:3001/dashboard/quiz/[id]
- **Comparar Quizzes**: http://localhost:3001/dashboard/compare
- **Configurações**: http://localhost:3001/dashboard/settings

## Hook de Tracking

Foi criado um hook customizado em `lib/hooks/useQuizTracking.ts` que facilita a integração.

### Uso Básico

```tsx
import { useQuizTracking } from '@/lib/hooks/useQuizTracking';

function QuizPage() {
  const tracker = useQuizTracking('hypnozio-weight-loss-quiz');

  // Rastrear início do quiz (primeira página)
  useEffect(() => {
    tracker?.trackStart();
  }, []);

  // Rastrear visualização de card
  useEffect(() => {
    tracker?.trackCardView(stepNumber, 'Nome do Card');
  }, [stepNumber]);

  // Rastrear resposta
  const handleAnswer = (answer: string) => {
    tracker?.trackCardAnswer(stepNumber, 'Nome do Card', answer);
  };

  // Rastrear conclusão
  const handleComplete = () => {
    tracker?.trackComplete(userEmail);
  };

  // Rastrear conversão (no checkout)
  const handleConversion = () => {
    tracker?.trackConversion(email, amount, orderId);
  };
}
```

## Integração Passo a Passo

### 1. Página Inicial do Quiz (app/quiz/[step]/page.tsx)

Adicione no início da página:

```tsx
import { useQuizTracking } from '@/lib/hooks/useQuizTracking';

export default function QuizStep() {
  const tracker = useQuizTracking();

  // No useEffect, rastrear início se for step 1
  useEffect(() => {
    if (step === 1) {
      tracker?.trackStart();
    }
    tracker?.trackCardView(step, question.question);
  }, [step]);

  // Ao responder
  const saveAndNavigate = (answer: string | string[]) => {
    const newAnswers = { ...answers, [step]: answer };
    setAnswers(newAnswers);
    localStorage.setItem("quizAnswers", JSON.stringify(newAnswers));

    // ADICIONAR: Rastrear resposta
    tracker?.trackCardAnswer(step, question.question, answer);

    navigateNext();
  };
}
```

### 2. Página de Email (app/quiz/email/page.tsx)

```tsx
import { useQuizTracking } from '@/lib/hooks/useQuizTracking';

export default function EmailPage() {
  const tracker = useQuizTracking();

  const handleSubmit = (email: string, name: string) => {
    // Salvar dados
    localStorage.setItem('userData', JSON.stringify({ email, name }));

    // ADICIONAR: Rastrear conclusão do quiz
    tracker?.trackComplete(email);

    // Redirecionar
    router.push('/quiz/loading');
  };
}
```

### 3. Webhook de Pagamento (app/api/webhook/lastlink/route.ts)

Quando receber confirmação de pagamento:

```tsx
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  const body = await request.json();

  if (body.event === 'Purchase_Order_Confirmed') {
    const email = body.customer.email;
    const amount = body.order.total_amount;
    const orderId = body.order.id;

    // Buscar sessionId do usuário (pode ser armazenado junto com userData)
    const sessionId = await getSessionIdForEmail(email); // Implementar esta função

    // Enviar tracking de conversão
    await fetch(`${process.env.NEXTAUTH_URL}/api/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event: 'conversion',
        quizId: 'hypnozio-weight-loss-quiz',
        sessionId: sessionId,
        email: email,
        amount: parseFloat(amount),
        orderId: orderId,
        metadata: {
          timestamp: new Date().toISOString()
        }
      })
    });
  }
}
```

## Armazenar Session ID

Para conectar conversões ao quiz, armazene o sessionId junto com userData:

```tsx
// No início do quiz
useEffect(() => {
  const sessionId = sessionStorage.getItem('quiz_session_hypnozio-weight-loss-quiz');
  if (sessionId) {
    localStorage.setItem('quizSessionId', sessionId);
  }
}, []);
```

## Dados Coletados Automaticamente

O sistema coleta automaticamente:
- User Agent e informações do navegador
- Tamanho da tela
- Idioma do navegador
- Página de referência
- Parâmetros UTM (utm_source, utm_medium, utm_campaign, etc)
- Timestamp de cada ação

## Eventos Rastreados

1. **quiz_started**: Quando o usuário inicia o quiz (step 1)
2. **card_viewed**: Cada vez que uma pergunta é visualizada
3. **card_answered**: Quando o usuário responde uma pergunta
4. **quiz_completed**: Quando o email é coletado
5. **conversion**: Quando o pagamento é confirmado

## Visualizar Dados

Após integrar, os dados aparecerão em:
- **Dashboard Overview**: Métricas gerais (visitantes, conversão, receita)
- **Quizzes**: Lista de todos os quizzes com suas métricas
- **Quiz Detail**: Análise detalhada por quiz (funil, dispositivos, fontes de tráfego)
- **Comparar**: Comparação lado a lado de dois quizzes

## Testar a Integração

1. Limpe localStorage e sessionStorage
2. Acesse o quiz como um novo usuário
3. Complete todo o fluxo
4. Verifique o dashboard em `/dashboard`
5. Os dados devem aparecer imediatamente

## Estrutura do Banco de Dados

- **quizzes**: Armazena os quizzes
- **quiz_sessions**: Uma sessão por usuário
- **quiz_events**: Cada ação do usuário (visualização, resposta)
- **conversions**: Dados de pagamento

## Próximos Passos

1. Integrar o tracking conforme exemplos acima
2. Testar com usuários reais
3. Monitorar métricas no dashboard
4. Otimizar com base nos dados coletados

## Suporte

Em caso de dúvidas, verifique:
- Logs do navegador (F12 > Console)
- Logs do servidor (terminal onde roda `npm run dev`)
- API de tracking: POST /api/track

O sistema está pronto para uso em produção!
