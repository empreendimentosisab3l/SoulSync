# Reordenação dos Cards do Quiz V2

## Resumo das Alterações

O card de **Nível de Atividade Física** foi movido para **antes do Card 12 (BMI Summary)** para que o sistema possa exibir corretamente o "Estilo de Vida" baseado na resposta do usuário.

## Motivação

O Card 12 (BMI Summary) exibe um resumo com:
- Tipo de Corpo
- Zonas-Alvo (partes do corpo)
- **Estilo de Vida** ← precisa do nível de atividade física

Anteriormente, o nível de atividade física era perguntado **depois** do resumo do IMC, o que não fazia sentido lógico.

## Nova Ordem dos Cards

### Cards Modificados:

| Card ID | Antigo | Novo | Tipo | Pergunta |
|---------|--------|------|------|----------|
| 6 | Faixa Etária | Faixa Etária | choice | Qual é a sua faixa etária? |
| **7** | **Altura** | **Nível de Atividade Física** | **choice** | **Qual é o seu nível de atividade física atual?** |
| 8 | Peso Atual | Altura | input | Qual é a sua altura? |
| 9 | Peso Desejado | Peso Atual | input | Qual é o seu peso atual? |
| 10 | Partes do Corpo | Peso Desejado | input | Qual é o seu peso desejado? |
| 11 | BMI Summary | Partes do Corpo | body-focus | Em que partes do seu corpo você deseja se concentrar? |
| **12** | **Motivação Principal** | **BMI Summary** | **bmi-summary** | **Seu ponto de partida** |
| 13 | Prova Social #1 | Motivação Principal | choice | Por que você quer perder peso? |
| 14 | ~~Atividade Física~~ | Prova Social #1 | info | Mais de 180.000 transformações |
| 15 | Alimentação Atual | Alimentação Atual | choice | Como você descreveria sua alimentação atual? |

### Fluxo Lógico Atualizado:

```
1-6   → Perfil Básico (gênero, idade, tentativas anteriores, etc.)
7     → 🆕 Nível de Atividade Física (MOVIDO)
8-10  → Medidas Corporais (altura, peso atual, peso desejado)
11    → Partes do Corpo (zonas-alvo)
12    → ✅ BMI Summary (agora tem TODOS os dados necessários!)
13+   → Restante do quiz...
```

## Arquivos Modificados

### 1. `lib/quizDataV2.ts`

**Mudanças:**
- Card 7: Agora é "Nível de Atividade Física" (antes era id 14)
- Cards 8-11: IDs incrementados em 1
- Card 12: Agora é "BMI Summary" (antes era id 11)
- Card 14 antigo (Nível de Atividade Física): **REMOVIDO** (duplicata)
- Todos os IDs subsequentes ajustados

**Código Atualizado:**
```typescript
// CARD 07: NÍVEL DE ATIVIDADE FÍSICA (MOVIDO PARA ANTES DO IMC)
{
  id: 7,
  type: "choice",
  question: "Qual é o seu nível de atividade física atual?",
  options: [
    { label: "Sedentário (pouco/nenhum exercício)", value: "sedentario" },
    { label: "Levemente ativo (1-2x/semana)", value: "leve" },
    { label: "Moderadamente ativo (3-4x/semana)", value: "moderado" },
    { label: "Muito ativo (5-6x/semana)", value: "muito-ativo" },
    { label: "Extremamente ativo (diariamente)", value: "extremo" }
  ],
  progress: 12
},

// CARD 08: ALTURA (antes era id 7)
{
  id: 8,
  type: "input",
  question: "Qual é a sua altura?",
  // ...
}

// ... cards 9, 10, 11 ...

// CARD 12: BMI SUMMARY (antes era id 11)
{
  id: 12,
  type: "bmi-summary",
  title: "Seu ponto de partida",
  // ...
}
```

### 2. `components/QuizV2SummaryBMI.tsx`

**Mudanças:**
- Adicionada prop `activityLevel?: string`
- Adicionado mapeamento de nível de atividade para texto amigável
- Campo "Estilo de Vida" agora exibe o nível de atividade do usuário

**Código Adicionado:**
```typescript
interface QuizV2SummaryBMIProps {
    height: number;
    weight: number;
    bodyParts: string[];
    activityLevel?: string; // 🆕 NOVO
    onContinue: () => void;
    buttonText?: string;
    image?: string;
}

// Mapeamento de atividade
const activityLabels: Record<string, string> = {
    'sedentario': 'Sedentário',
    'leve': 'Levemente Ativo',
    'moderado': 'Moderadamente Ativo',
    'muito-ativo': 'Muito Ativo',
    'extremo': 'Extremamente Ativo'
};

const activityText = activityLevel
    ? activityLabels[activityLevel] || 'Ativo'
    : 'Ativo';

// No componente:
<p className="text-sm font-bold text-gray-800">{activityText}</p>
```

### 3. `app/quiz-v2/[step]/page.tsx`

**Mudanças:**
- Atualizadas referências de IDs nos inputs (altura, peso)
- Atualizado case 'bmi-summary' para passar novos IDs
- Atualizado case 'visualization' para usar novos IDs de peso

**Código Atualizado:**
```typescript
case 'input':
  return (
    <QuizV2Input
      // ...
      otherValue={
        step === 9 ? answers[8] :  // peso → altura (8 agora)
        step === 10 ? answers[9] : // meta → peso atual (9 agora)
        undefined
      }
      measurementType={
        step === 8 ? 'height' :    // card 8 agora é altura
        step === 9 ? 'weight' :    // card 9 agora é peso
        undefined
      }
    />
  );

case 'bmi-summary':
  return (
    <QuizV2SummaryBMI
      height={answers[8] ? parseFloat(answers[8]) : 0}      // 8 agora
      weight={answers[9] ? parseFloat(answers[9]) : 0}      // 9 agora
      bodyParts={answers[11] || []}                        // 11 agora
      activityLevel={answers[7]}                           // 🆕 NOVO (id 7)
      onContinue={() => handleNext()}
      buttonText={questionData.buttonText}
      image={questionData.image}
    />
  );

case 'visualization':
  return (
    <QuizV2Visualization
      currentWeight={answers[9] ? parseFloat(answers[9]) : undefined}  // 9 agora
      targetWeight={answers[10] ? parseFloat(answers[10]) : undefined} // 10 agora
      // ...
    />
  );
```

## Mapeamento de IDs - Referência Rápida

Para desenvolvedores que precisam acessar as respostas:

```typescript
// ANTES da mudança:
answers[7]  → Altura
answers[8]  → Peso Atual
answers[9]  → Peso Desejado
answers[10] → Partes do Corpo
answers[14] → Nível de Atividade Física (depois do IMC)

// DEPOIS da mudança:
answers[7]  → 🆕 Nível de Atividade Física (MOVIDO AQUI)
answers[8]  → Altura
answers[9]  → Peso Atual
answers[10] → Peso Desejado
answers[11] → Partes do Corpo
```

## Benefícios da Mudança

1. **Lógica Melhorada**: Pergunta sobre atividade física ANTES de mostrar o resumo
2. **Dados Completos**: O Card 12 (BMI Summary) agora tem TODOS os dados necessários
3. **UX Melhor**: Fluxo mais natural e intuitivo para o usuário
4. **Personalização**: "Estilo de Vida" exibe o nível real do usuário

## Exemplo de Uso no Card 12

Agora o card BMI Summary exibe:

```
┌─────────────────────────────┐
│ TIPO DE CORPO               │
│ Endomorfo                   │
├─────────────────────────────┤
│ ZONAS-ALVO                  │
│ Barriga, Pernas             │
├─────────────────────────────┤
│ ESTILO DE VIDA              │
│ Moderadamente Ativo ✅      │  ← Vem de answers[7]
└─────────────────────────────┘
```

## Como Testar

1. Acesse o Quiz V2: `http://localhost:3003/quiz-v2/1`
2. Preencha até o card 7 (Nível de Atividade Física)
3. Selecione, por exemplo: "Moderadamente ativo"
4. Continue preenchendo altura (8), peso (9), peso desejado (10), partes do corpo (11)
5. No card 12 (BMI Summary), verifique se "Estilo de Vida" mostra "Moderadamente Ativo"

## Possíveis Problemas

⚠️ **ATENÇÃO**: Se houver dados antigos no `localStorage` com os IDs antigos, pode haver conflito.

**Solução**: Limpar o localStorage ao iniciar o quiz:
```javascript
localStorage.removeItem('quizV2Answers');
localStorage.removeItem('quizV2UserData');
```

Isso já está implementado no `page.tsx` quando o usuário acessa o step 1.

---

**Data da alteração**: 2025-12-02
**Desenvolvido por**: Claude Code
**Status**: ✅ Completo e testado
