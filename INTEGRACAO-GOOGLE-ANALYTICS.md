# Integração Google Analytics - Quiz V2

## ✅ Integração Concluída

Este documento descreve a integração completa do Google Analytics no projeto Hypnozio MVP, especificamente para rastrear o Quiz V2.

## 📊 ID de Rastreamento

**Google Analytics ID:** `G-ZRBSTXNX5F`

## 🔧 Arquivos Modificados

### 1. Layout Principal (`app/layout.tsx`)
- Adicionado Google Analytics script usando componente `Script` do Next.js
- Estratégia `afterInteractive` para melhor performance
- Script carrega automaticamente em todas as páginas

### 2. Biblioteca de Analytics (`lib/analytics.ts`)
Funções utilitárias criadas para tracking:

#### Funções Gerais:
- `pageview(url)` - Rastreia visualizações de página
- `event({ action, category, label, value })` - Envia eventos customizados

#### Funções Específicas do Quiz V2:
- `trackQuizStart()` - Início do quiz
- `trackQuizStep(step, questionType)` - Cada passo do quiz
- `trackQuizAnswer(step, answer)` - Respostas dos usuários
- `trackQuizComplete(totalSteps)` - Quiz completo
- `trackCheckoutView()` - Visualização da página de checkout
- `trackPurchaseIntent(plan, price)` - Intenção de compra
- `trackEmailCapture(email)` - Captura de email
- `trackFreeTrialStart()` - Início do teste grátis

### 3. Quiz V2 - Página Inicial (`app/quiz-v2/page.tsx`)
- Tracking de pageview quando usuário chega na landing page
- Tracking quando clica em "COMEÇAR MEU PLANO PERSONALIZADO"

### 4. Quiz V2 - Steps (`app/quiz-v2/[step]/page.tsx`)
- Tracking de cada step visualizado
- Tracking do tipo de pergunta em cada step
- Tracking de cada resposta salva
- Tracking de email quando capturado (step 46)
- Tracking de conclusão do quiz

### 5. Quiz V2 - Checkout (`app/quiz-v2/checkout/page.tsx`)
- Tracking quando checkout é visualizado
- Tracking de intenção de compra (botão "COMEÇAR AGORA")
- Tracking de início de trial grátis

## 📈 Eventos Rastreados

| Evento | Categoria | Descrição |
|--------|-----------|-----------|
| `quiz_start` | Quiz V2 | Usuário inicia o quiz |
| `quiz_step` | Quiz V2 | Visualização de cada step (com número e tipo) |
| `quiz_answer` | Quiz V2 | Resposta salva em cada step |
| `quiz_complete` | Quiz V2 | Quiz finalizado |
| `checkout_view` | Quiz V2 | Página de checkout visualizada |
| `purchase_intent` | Quiz V2 | Botão de compra clicado |
| `email_capture` | Quiz V2 | Email capturado |
| `free_trial_start` | Quiz V2 | Trial grátis iniciado |

## 🎯 Dados Disponíveis no Google Analytics

Com esta integração, você poderá visualizar:

1. **Funil de Conversão:**
   - Quantas pessoas iniciam o quiz
   - Em qual step há maior abandono
   - Taxa de conclusão do quiz
   - Taxa de conversão checkout → compra

2. **Comportamento do Usuário:**
   - Tempo médio em cada step
   - Tipos de perguntas com maior engajamento
   - Padrões de respostas

3. **Conversões:**
   - Quantos emails capturados
   - Intenções de compra
   - Trials grátis iniciados

## 🚀 Como Visualizar no Google Analytics

1. Acesse [Google Analytics](https://analytics.google.com)
2. Selecione a propriedade com ID `G-ZRBSTXNX5F`
3. Navegue para:
   - **Relatórios > Engajamento > Eventos** - Ver todos os eventos
   - **Relatórios > Engajamento > Páginas e telas** - Ver pageviews
   - **Explorar** - Criar funis personalizados

## 📊 Criando Funil Personalizado

Para criar um funil de conversão no GA4:

1. Vá em **Explorar** > **Análise de funil**
2. Configure os steps:
   - Step 1: `quiz_start`
   - Step 2: `quiz_step` (step >= 10)
   - Step 3: `email_capture`
   - Step 4: `quiz_complete`
   - Step 5: `checkout_view`
   - Step 6: `purchase_intent`

## 🧪 Como Testar

### Desenvolvimento Local:

1. Execute o projeto:
```bash
npm run dev
```

2. Abra o navegador em `http://localhost:3000`

3. Abra o Console do navegador (F12)

4. Vá para a aba **Network** e filtre por "gtag"

5. Navegue pelo quiz e veja os eventos sendo enviados

### Verificação em Tempo Real:

1. Acesse Google Analytics
2. Vá em **Relatórios > Tempo real**
3. Navegue pelo quiz
4. Veja os eventos aparecendo em tempo real

## ✅ Status da Integração

- ✅ Google Analytics instalado no layout principal
- ✅ Biblioteca de tracking criada
- ✅ Tracking de início do quiz
- ✅ Tracking de cada step do quiz
- ✅ Tracking de respostas
- ✅ Tracking de email capture
- ✅ Tracking de conclusão do quiz
- ✅ Tracking de checkout view
- ✅ Tracking de purchase intent
- ✅ Tracking de free trial start
- ✅ Build do projeto concluído com sucesso

## 🔍 Próximos Passos (Opcional)

Para melhorar ainda mais o tracking, considere adicionar:

1. **Enhanced E-commerce:**
   - Tracking de produtos visualizados
   - Tracking de checkout steps
   - Tracking de transações completas

2. **User ID Tracking:**
   - Associar eventos a usuários específicos
   - Rastrear jornada completa do usuário

3. **Custom Dimensions:**
   - Tipo de plano escolhido
   - Segmento de usuário
   - Fonte de tráfego

4. **Goals & Conversions:**
   - Configurar metas no GA4
   - Definir valores de conversão

## 📝 Notas Importantes

- O Google Analytics pode levar até 24-48h para processar dados históricos completamente
- Eventos em tempo real aparecem instantaneamente
- Certifique-se de que o ID `G-ZRBSTXNX5F` está correto na sua conta GA
- Em desenvolvimento, os eventos são enviados normalmente (não há necessidade de modo de teste)

## 🎉 Conclusão

A integração está completa e funcional! Todos os eventos do Quiz V2 estão sendo rastreados e você poderá visualizar métricas detalhadas no Google Analytics.
