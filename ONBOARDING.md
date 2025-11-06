# Sistema de Onboarding - Hypnozio MVP

## Visão Geral

Foi implementado um sistema de onboarding de 4 telas que é exibido automaticamente para novos usuários ao acessarem a área de membros pela primeira vez.

## Estrutura do Onboarding

### Tela 1: Boas-vindas
**Conteúdo:**
- Título: "Bem-vindo!!"
- Subtítulo: "Seu curso de hipnoterapia"
- Card visual com badge "Perda de peso"
- Título do card: "Mudando a relação com a comida"
- Texto explicativo sobre seguir recomendações

**Objetivo:** Dar as boas-vindas e contextualizar o programa

### Tela 2: Benefícios
**Conteúdo:**
- Texto: "Nossas sessões de hipnoterapia comprovadas cientificamente..."
- Card com 4 benefícios em grid:
  - 📈 Níveis de estresse mais baixos
  - ⏳ Resultados duradouros
  - 📅 Resultados em apenas 4 dias
  - 🧘 Relaxamento profundo

**Objetivo:** Mostrar os benefícios da hipnoterapia

### Tela 3: Dicas de Uso
**Conteúdo:**
- Título: "Seu caminho rumo a melhores hábitos, saúde e felicidade"
- Card "Lembre-se" com 3 dicas:
  - 🕐 Escolha seu melhor horário (não há horário "certo")
  - 🔄 Ouça cada sessão 3 vezes para melhores resultados
  - 😴 Mesmo dormindo, a hipnose continua funcionando

**Objetivo:** Educar sobre como usar o programa efetivamente

### Tela 4: Escolha de Tópico
**Conteúdo:**
- Título: "Escolha um tópico pelo qual você gostaria de começar"
- Grid 2x2 (ou 4 colunas em desktop) com tópicos:
  - Gerenciamento de ingestão calórica
  - Rotina de alimentação saudável
  - Mude sua visão sobre alimentos não saudáveis
  - Elimine a compulsão alimentar

**Objetivo:** Engajar o usuário permitindo escolher por onde começar

**Ação:** Ao clicar em qualquer tópico, completa o onboarding

## Componentes Criados

### `components/Onboarding.tsx`
Componente React que renderiza as 4 telas em sequência.

**Props:**
- `onComplete: () => void` - Callback chamado quando o onboarding é concluído

**Features:**
- Navegação sequencial com botão "Prosseguir"
- Indicador de progresso com dots
- Animações suaves de fade-in entre telas
- Design responsivo (mobile-first)
- Estilo teal/verde-azulado com gradientes

**Estado interno:**
- `currentStep` - Controla qual tela está sendo exibida (0-3)

## Integração na Área de Membros

### `app/membros/page.tsx`

**Estado adicionado:**
```typescript
const [showOnboarding, setShowOnboarding] = useState(false);
```

**Funções:**

1. **`checkOnboardingStatus()`**
   - Verifica se `hasSeenOnboarding` existe no localStorage
   - Se não existir, exibe o onboarding

2. **`handleOnboardingComplete()`**
   - Salva `hasSeenOnboarding: 'true'` no localStorage
   - Oculta o onboarding
   - Usuário vê a área de membros normal

**Fluxo:**
```
Usuário autentica → checkOnboardingStatus() →
  Se novo: showOnboarding = true → Exibe Onboarding
  Se retornando: showOnboarding = false → Exibe Dashboard
```

## Dados no localStorage

```javascript
{
  "hasSeenOnboarding": "true" // Indica que já completou o onboarding
}
```

## Design System

### Cores
- Background: Gradiente teal (do teal-700 ao teal-800)
- Cards: `bg-white/10` com `backdrop-blur-sm`
- Bordas: `border-white/20`
- Textos: Brancos com variações de opacidade
- Botão CTA: `bg-teal-400` com hover em `teal-300`

### Tipografia
- Títulos principais: `text-3xl md:text-4xl`
- Subtítulos: `text-lg`
- Textos de cards: `text-sm`
- Fonte: Sistema padrão (Tailwind)

### Espaçamento
- Container principal: `p-6 py-12`
- Entre elementos: `space-y-6` ou `space-y-8`
- Cards: `p-8`
- Grid gaps: `gap-4` ou `gap-6`

### Animações
- Fade-in suave ao trocar de tela
- Hover scale nos cards de tópicos
- Transições suaves em todos os botões

## Comportamento

### Desktop (md+)
- Grid de tópicos em 4 colunas
- Textos maiores e mais espaçados
- Cards com mais padding

### Mobile
- Grid de tópicos em 2 colunas
- Textos responsivos menores
- Botões full-width

### Navegação
- Telas 1-3: Botão "Prosseguir" avança para próxima
- Tela 4: Clicar em qualquer tópico completa o onboarding
- Progresso visual com dots na parte inferior

## Fluxo Completo do Usuário

```
1. Novo Usuário
   └─> Autentica (checkout/login)
       └─> Redireciona para /membros
           └─> checkOnboardingStatus()
               └─> !hasSeenOnboarding
                   └─> Exibe Onboarding (Tela 1)
                       └─> Clica "Prosseguir" → Tela 2
                           └─> Clica "Prosseguir" → Tela 3
                               └─> Clica "Prosseguir" → Tela 4
                                   └─> Clica em tópico
                                       └─> handleOnboardingComplete()
                                           └─> localStorage: hasSeenOnboarding = true
                                               └─> Exibe Dashboard normal

2. Usuário Retornando
   └─> Faz login
       └─> Redireciona para /membros
           └─> checkOnboardingStatus()
               └─> hasSeenOnboarding = true
                   └─> Exibe Dashboard diretamente (sem onboarding)
```

## Resetar Onboarding

Para testar ou permitir que um usuário veja novamente o onboarding:

### Via DevTools (Console)
```javascript
localStorage.removeItem('hasSeenOnboarding');
// Depois recarregue a página /membros
```

### Via Botão (pode adicionar no futuro)
```typescript
function resetOnboarding() {
  localStorage.removeItem('hasSeenOnboarding');
  setShowOnboarding(true);
}
```

## Personalização Futura

### Adicionar mais telas
1. Adicione novo objeto ao array `steps` em `Onboarding.tsx`
2. Crie a lógica de renderização condicional
3. O indicador de progresso se ajusta automaticamente

### Customizar conteúdo
Edite o array `steps` com novos textos, ícones ou estruturas

### Adicionar tracking
```typescript
function handleOnboardingComplete() {
  // Analytics tracking
  analytics.track('onboarding_completed', {
    user_id: user?.email,
    completion_time: Date.now()
  });

  localStorage.setItem('hasSeenOnboarding', 'true');
  setShowOnboarding(false);
}
```

### Salvar preferência de tópico
Na tela 4, ao clicar em um tópico:
```typescript
function handleTopicSelect(topicId: string) {
  localStorage.setItem('preferredTopic', topicId);
  onComplete();
}
```

## Melhorias Futuras

1. **Backend Integration**
   - Salvar status do onboarding no banco de dados
   - Sincronizar entre dispositivos

2. **Skip Option**
   - Adicionar botão "Pular" para usuários apressados
   - Tracking de quantos pulam vs completam

3. **Progress Persistence**
   - Salvar em qual tela o usuário parou
   - Retomar de onde parou se sair no meio

4. **A/B Testing**
   - Testar diferentes versões de conteúdo
   - Medir taxa de conclusão

5. **Vídeos**
   - Substituir texto por vídeos curtos
   - Mais engaging e profissional

6. **Interatividade**
   - Perguntas com respostas
   - Personalização baseada nas respostas

## Arquivos Modificados

**Novos:**
- `components/Onboarding.tsx` - Componente principal

**Modificados:**
- `app/membros/page.tsx` - Integração do onboarding
- `app/globals.css` - Animação fadeIn

## Troubleshooting

### Onboarding não aparece
**Solução:** Verifique se `hasSeenOnboarding` está no localStorage. Delete para forçar exibição.

### Onboarding aparece sempre
**Solução:** Verifique se `handleOnboardingComplete()` está sendo chamado corretamente.

### Animações não funcionam
**Solução:** Certifique-se de que o CSS global com `@keyframes fadeIn` está carregado.

### Layout quebrado em mobile
**Solução:** Verifique classes responsivas Tailwind (md:, lg:, etc.)
