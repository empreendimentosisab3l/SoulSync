# 📋 QUIZ V2 - HIPNOTERAPIA PARA EMAGRECIMENTO

## Visão Geral

O **Quiz V2** é uma versão premium e otimizada para conversão do quiz de hipnoterapia, baseado em pesquisa de mercado dos quizzes mais escalados e com foco específico em emagrecimento. Possui **50 cards** completos com elementos de persuasão científica, prova social e urgência.

## 🎨 Identidade Visual

### Paleta de Cores Premium Dark

```css
--hypno-dark: #1A1A2E      /* Roxo escuro - Primária */
--hypno-purple: #6A4C93     /* Roxo médio - Secundária */
--hypno-accent: #00D9FF     /* Azul neon - Accent */
--hypno-bg: #0F0F1E         /* Quase preto - Background */
```

**Inspiração**: Design premium dark que transmite seriedade e profissionalismo (similar ao Kure).

## 🗂️ Estrutura do Projeto

```
app/
├── quiz-v2/
│   ├── page.tsx                    # Landing page do quiz
│   ├── [step]/
│   │   └── page.tsx                # Páginas dinâmicas dos 50 cards
│   └── checkout/
│       └── page.tsx                # Página de oferta final

components/
├── QuizV2Card.tsx                  # Container base com progress bar
├── QuizV2Choice.tsx                # Perguntas de escolha única
├── QuizV2Multiple.tsx              # Perguntas de múltipla escolha
├── QuizV2Input.tsx                 # Inputs (texto, email, número)
├── QuizV2Range.tsx                 # Escala de 1-5
├── QuizV2Info.tsx                  # Cards educacionais/testimonials
├── QuizV2BodyFocus.tsx            # Seleção de partes do corpo
└── QuizV2Wheel.tsx                # Roleta de seleção (prazo)

lib/
└── quizDataV2.ts                   # Dados dos 50 cards
```

## 📱 Tipos de Cards

### 1. **Choice** (Escolha Única)
- Interface com botões grandes
- Seleção automática e navegação
- Usado para: gênero, idade, motivação, etc.

### 2. **Multiple** (Múltipla Escolha)
- Checkboxes customizados
- Botão "Continuar" com contador
- Usado para: dificuldades, hábitos, restrições alimentares

### 3. **Input** (Entrada de Dados)
- Suporta text, email, number
- Campo com unidade opcional (kg, cm)
- Auto-focus e Enter para continuar
- Usado para: peso, altura, nome, email

### 4. **Range** (Escala 1-5)
- Slider interativo com visual premium
- Labels min/max personalizáveis
- Valor grande centralizado
- Usado para: identificação emocional

### 5. **Info** (Informacional)
- Tipos: testimonial, educational, social-proof, comparison
- Ícones e cores específicas por tipo
- Formatação rica (bullets, divisores, emojis)
- Usado para: prova social, educação, quebra de objeções

### 6. **Body Focus** (Partes do Corpo)
- Grid visual com emojis
- Seleção múltipla com checkmarks
- Usado para: áreas de foco do corpo

### 7. **Wheel** (Roleta)
- Seletor giratório animado
- Navegação por setas
- Usado para: seleção de prazo

## 📊 Estrutura dos 50 Cards

### Cards 01-05: Abertura Impactante
- Landing page com prova social
- Qualificação inicial
- Tentativas anteriores

### Cards 06-15: Coleta de Dados
- Peso, altura, meta
- Idade, motivação
- Atividade física e alimentação

### Cards 16-25: Dores e Dificuldades
- Dificuldades físicas
- Hábitos ruins
- Identificação emocional
- Obstáculos principais

### Cards 26-32: Qualificação
- Disponibilidade de tempo
- Rotina de trabalho
- Restrições alimentares

### Cards 33-38: Tese Científica
- Introdução de urgência
- Tese principal (mente → corpo)
- Provas científicas reais
- Quebra de objeções

### Cards 39-42: Future Pacing
- Visualização de resultados
- Mudanças na vida
- Prazo desejado
- Compromisso

### Cards 43-46: Loading e Coleta Final
- Análise de respostas
- Criação do plano
- Captura de email e nome

### Cards 47-50: Resultado e Oferta
- Plano personalizado
- Benefícios detalhados
- Prova social massiva
- Oferta final com urgência

## 🔄 Fluxo de Dados

### localStorage Keys

```javascript
// Respostas do quiz
'quizV2Answers' = {
  "1": "value",
  "2": "value",
  ...
  "50": "value"
}

// Dados do usuário
'quizV2UserData' = {
  name: "string",
  email: "string",
  weight: "number",
  height: "number",
  targetWeight: "number"
}
```

### Navegação

```
/quiz-v2           →  Landing page
/quiz-v2/1         →  Card 1 (início do quiz)
/quiz-v2/2         →  Card 2
...
/quiz-v2/50        →  Card 50
/quiz-v2/checkout  →  Oferta final
```

## 🎯 Elementos de Conversão

### 1. Progress Bar
- Barra visual no topo
- Indicador "X de 50"
- Feedback constante de progresso

### 2. Prova Social
- Card 01: Landing com 3 depoimentos
- Card 12: Primeira prova social (+180k transformações)
- Card 29: Testemunho detalhado
- Card 49: Prova social massiva (187k pessoas)

### 3. Educação Científica
- Card 19: "87% das dietas falham"
- Card 33: Urgência (riscos de saúde)
- Card 34: Tese principal
- Card 36: Estudos científicos reais

### 4. Quebra de Objeções
- Card 21: "Você NÃO precisa..."
- Card 37: Comparação (Dietas vs Hipnoterapia)

### 5. Future Pacing
- Cards 39-41: Visualização de resultados
- Compromisso emocional

### 6. Urgência e Escassez
- Countdown de 15 minutos
- Oferta exclusiva com desconto
- "Última chance"

## 💰 Página de Checkout

### Elementos Principais

1. **Countdown Timer** - 15 minutos em tempo real
2. **Badge Personalizado** - Com nome do usuário
3. **Pricing** - De R$ 597 por R$ 297 (50% off)
4. **7 Benefícios Detalhados** - Com ícones de check
5. **Bônus Exclusivo** - Acelerador Mental (R$ 97 grátis)
6. **CTA Destacado** - Botão grande com gradiente
7. **Trust Signals** - Garantia 30 dias, seguro, suporte
8. **Testemunho Final** - Reforço social proof

## 🔧 Configuração Técnica

### Tailwind Config

As cores foram adicionadas em `tailwind.config.ts`:

```typescript
hypno: {
  'dark': '#1A1A2E',
  'purple': '#6A4C93',
  'accent': '#00D9FF',
  'bg': '#0F0F1E',
}
```

### Animações CSS

Adicionadas em `globals.css`:

```css
.animate-fade-in       /* Fade in suave */
.animate-pulse-glow    /* Pulsação com glow */
```

## 📈 Métricas Esperadas

Baseado no documento de pesquisa:

- **Taxa de início**: 55-70%
- **Taxa de conclusão**: 35-50%
- **Taxa de conversão**: 12-18%
- **Tempo médio**: 4-5 minutos
- **Ticket médio**: R$ 297,00

## 🚀 Como Usar

### 1. Acessar o Quiz

```
http://localhost:3000/quiz-v2
```

### 2. Testar o Fluxo Completo

1. Landing page → "Começar"
2. Responder aos 50 cards
3. Ver página de checkout
4. (Integração de pagamento a ser implementada)

### 3. Visualizar Respostas

Abra o DevTools e execute:

```javascript
JSON.parse(localStorage.getItem('quizV2Answers'))
```

## 🔗 Integração com Pagamento

### LastLink (Atual)

O botão de checkout pode ser integrado com:

```javascript
// app/quiz-v2/checkout/page.tsx
const handleCheckout = () => {
  const userData = JSON.parse(localStorage.getItem('quizV2Answers'));

  // Redirecionar para LastLink
  window.location.href = `https://lastlink.com/checkout?email=${userData['45']}&...`;
};
```

### Outras Opções

- **Stripe**: Checkout personalizado
- **Hotmart**: Redirecionamento direto
- **Monetizze**: Integração por iframe

## 🎨 Personalização

### Alterar Cores

Edite `tailwind.config.ts`:

```typescript
hypno: {
  'dark': '#SEU_COR',     // Cor primária
  'purple': '#SEU_COR',    // Cor secundária
  'accent': '#SEU_COR',    // Cor de destaque
  'bg': '#SEU_COR',        // Background
}
```

### Adicionar/Remover Cards

Edite `lib/quizDataV2.ts`:

```typescript
export const quizV2Data: QuizV2Question[] = [
  {
    id: 51,  // Novo card
    type: "choice",
    question: "Nova pergunta?",
    options: [...]
  }
];
```

### Modificar Oferta

Edite `app/quiz-v2/checkout/page.tsx`:

- Preço original/final
- Benefícios
- Bônus
- Countdown inicial

## 📱 Responsividade

Todos os componentes são **mobile-first** e responsivos:

- **Mobile**: < 640px (sm)
- **Tablet**: 640px - 1024px (md)
- **Desktop**: > 1024px (lg)

Breakpoints do Tailwind:

```css
sm: 640px
md: 768px
lg: 1024px
xl: 1280px
```

## 🐛 Troubleshooting

### Progress não atualiza
- Verifique se `progress` está definido em `quizDataV2.ts`
- Deve ir de 0 a 100 gradualmente

### Respostas não salvam
- Verifique localStorage no DevTools
- Limpe cache: `localStorage.clear()`

### Componente não renderiza
- Verifique o `type` do card
- Certifique-se que o componente está importado em `[step]/page.tsx`

### Countdown não funciona
- Verifique se `useEffect` está executando
- O timer usa `setInterval` de 1 segundo

## 🔐 Segurança e Privacidade

### Dados Coletados

- Respostas do quiz (armazenadas localmente)
- Nome e email (cards 45-46)
- Peso, altura, meta (cards 6-8)

### LGPD Compliance

- Dados armazenados apenas no navegador
- Nenhum tracking externo implementado
- Email enviado apenas após compra (via webhook)

### Recomendações para Produção

1. Adicionar Política de Privacidade
2. Cookie consent banner
3. Termo de uso no checkout
4. Criptografar dados sensíveis
5. HTTPS obrigatório

## 📊 A/B Testing Sugerido

### Testes Prioritários (Mês 1)

1. **Headline** (Card 01)
   - A: "A perda de peso começa no seu cérebro"
   - B: "Reprograme sua mente e emagreça dormindo"

2. **Desconto** (Checkout)
   - A: 50% OFF (R$ 297)
   - B: 40% OFF (R$ 357)

3. **Countdown**
   - A: 15 minutos
   - B: 30 minutos

### Métricas para Monitorar

```javascript
// Taxa de conclusão por card
const completionRate = (completions / starts) * 100;

// Abandono por card
const dropoffRate = {
  card1: starts - card2Reached,
  card2: card2Reached - card3Reached,
  // ...
};

// Conversão final
const conversionRate = (purchases / completions) * 100;
```

## 🎯 Próximos Passos

### Implementação Imediata

- [x] Estrutura base do Quiz V2
- [x] 50 cards implementados
- [x] Componentes reutilizáveis
- [x] Página de checkout
- [ ] Integração de pagamento
- [ ] Teste end-to-end

### Melhorias Futuras

- [ ] Backend para salvar respostas
- [ ] Dashboard admin
- [ ] Analytics integrado (GA4)
- [ ] Envio de email automatizado
- [ ] Recuperação de carrinho abandonado
- [ ] Página de resultado dinâmica (com cálculos de IMC, etc.)
- [ ] Sistema de cupons personalizados
- [ ] Retargeting via pixel

## 📚 Recursos Adicionais

### Estudos Científicos Citados

1. **Kirsch, I. (1995)** - Journal of Consulting and Clinical Psychology
   - "Hipnose pode DOBRAR a perda de peso"

2. **Bolocofsky, D. N. (1985)** - Journal of Consulting and Clinical Psychology
   - "Manutenção de peso por 2+ anos com hipnose"

3. **Milling, L. S. et al. (2018)** - Int. Journal of Clinical and Experimental Hypnosis
   - "Hipnose eficaz para emagrecimento duradouro"

### Links Úteis

- [Documento Original do Quiz](../Downloads/quiz_hipnoterapia_COMPLETO.md)
- [Documentação Geral](./CLAUDE.md)
- [Integração LastLink](./INTEGRACAO-LASTLINK.md)
- [Deploy](./DEPLOY-PRODUCAO.md)

## 🤝 Comparação: Quiz V1 vs Quiz V2

| Característica | Quiz V1 (Atual) | Quiz V2 (Premium) |
|----------------|-----------------|-------------------|
| **Cards** | 21 | 50 |
| **Design** | Soul (pastel) | Premium Dark |
| **Foco** | Hipnoterapia geral | Emagrecimento |
| **Prova Social** | Básica | Massiva (187k pessoas) |
| **Científico** | Não | Sim (3 estudos reais) |
| **Urgência** | Não | Sim (countdown) |
| **Quebra Objeção** | Não | Sim (2 cards) |
| **Future Pacing** | Não | Sim (4 cards) |
| **Checkout** | Externo | Integrado |
| **Taxa Esperada** | ~ 8-12% | ~ 12-18% |

## ✅ Status da Implementação

- ✅ Paleta de cores configurada
- ✅ 50 cards de dados criados
- ✅ 7 componentes reutilizáveis
- ✅ Rota dinâmica [step]
- ✅ Landing page
- ✅ Página de checkout
- ✅ Animações CSS
- ✅ Progress bar
- ✅ localStorage integration
- ⏳ Integração de pagamento (próximo)
- ⏳ Testes E2E (próximo)

## 💡 Dicas de Uso

1. **Testar localmente**: `npm run dev` e acesse `/quiz-v2`
2. **Limpar dados**: Execute `localStorage.clear()` no console
3. **Ver respostas**: `console.log(JSON.parse(localStorage.getItem('quizV2Answers')))`
4. **Pular para card específico**: `/quiz-v2/30` (por exemplo)
5. **Testar checkout**: Complete o quiz ou acesse `/quiz-v2/checkout` direto

## 🎬 Demo Flow

```
1. Usuário clica "Começar" na landing
2. Responde aos 50 cards (4-5 min)
3. Chega no checkout com oferta exclusiva
4. Vê countdown de 15 minutos
5. Converte com 50% de desconto
6. Recebe acesso imediato ao programa
```

---

**Versão**: 1.0
**Data**: Janeiro 2025
**Status**: ✅ Pronto para testes
**Próximo passo**: Integração de pagamento
