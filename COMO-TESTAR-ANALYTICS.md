# Como Testar o Sistema de Analytics

## ✅ Integração Completa

O sistema de analytics está **100% integrado** no quiz! Os seguintes eventos estão sendo rastreados automaticamente:

- ✅ Início do quiz (step 1)
- ✅ Visualização de cada pergunta
- ✅ Resposta de cada pergunta
- ✅ Conclusão do quiz (coleta de email)

## Métodos de Teste

### Método 1: Teste Automático com Script (Recomendado)

Este método gera dados simulados instantaneamente:

```bash
# No terminal, execute:
node scripts/test-analytics.js
```

Este script irá:
- Criar 10 jornadas completas de usuários
- Simular navegação por 10 perguntas
- 60% dos usuários convertem (pagam)
- 40% apenas completam o quiz
- Dados com UTMs variadas (Google, Facebook, Instagram)

**Resultado**: Em ~30 segundos você terá dados suficientes para visualizar todas as métricas no dashboard!

### Método 2: Teste Manual no Quiz Real

Este método testa o fluxo real do usuário:

1. **Limpe os dados anteriores**:
   ```javascript
   // No console do navegador (F12):
   localStorage.clear();
   sessionStorage.clear();
   ```

2. **Acesse o quiz**:
   ```
   http://localhost:3001/quiz/1
   ```

3. **Complete o fluxo**:
   - Responda as perguntas
   - Avance pelas etapas
   - Insira um email na página final
   - Observe o console do navegador (F12) para ver os eventos sendo enviados

4. **Verifique o Dashboard**:
   - Login: http://localhost:3001/admin
   - Usuário: `admin`
   - Senha: `admin123`
   - Vá para: http://localhost:3001/dashboard

### Método 3: Teste com Múltiplos Usuários

Para testar taxas de conversão variadas:

1. **Usuário 1** - Abandona no meio:
   - Acesse `/quiz/1`
   - Responda apenas 3-4 perguntas
   - Feche o navegador

2. **Usuário 2** - Completa mas não converte:
   - Acesse `/quiz/1` (nova aba anônima)
   - Complete todo o quiz
   - Insira email
   - Não faça checkout

3. **Usuário 3** - Converte:
   - Complete todo o quiz
   - Insira email
   - (Conversão seria rastreada via webhook do LastLink)

## O que Verificar no Dashboard

### 1. Página Overview (`/dashboard`)

Deve mostrar:
- **Visitors**: Número total de sessões iniciadas
- **Completion**: Taxa de pessoas que completaram o quiz
- **Conversion**: Taxa de conversão (se houver conversões simuladas)
- **Revenue**: Receita total
- **Funnel**: Visualização do funil (Visitantes → Completaram → Converteram)

### 2. Página Quizzes (`/dashboard/quizzes`)

Deve mostrar:
- Card do quiz "hypnozio-weight-loss-quiz"
- Total de visitantes
- Taxa de conversão
- Botão para ver detalhes

### 3. Página Quiz Detail (`/dashboard/quiz/[id]`)

Deve mostrar:
- Métricas específicas do quiz
- Funil de conversão
- **Dispositivos**: Desktop/Mobile
- **Fontes de Tráfego**: Google, Facebook, Instagram, Direct
  - Visitantes por fonte
  - Conversões por fonte
  - Taxa de conversão por fonte

### 4. Comparar Quizzes (`/dashboard/compare`)

- Se houver mais de um quiz, você pode compará-los
- Métricas lado a lado

## Verificar Eventos no Console

Abra o console do navegador (F12) enquanto navega pelo quiz. Você verá:

```javascript
// Quando iniciar o quiz (step 1)
POST /api/track
{
  event: "quiz_started",
  quizId: "hypnozio-weight-loss-quiz",
  sessionId: "session_..."
}

// Quando visualizar uma pergunta
POST /api/track
{
  event: "card_viewed",
  cardNumber: 2,
  cardName: "Qual é seu objetivo principal?"
}

// Quando responder
POST /api/track
{
  event: "card_answered",
  cardNumber: 2,
  answer: "Perder peso"
}

// Quando completar (inserir email)
POST /api/track
{
  event: "quiz_completed",
  email: "usuario@teste.com"
}
```

## Verificar no Banco de Dados

Se quiser ver os dados diretamente no banco:

```bash
# Instalar Prisma Studio
npx prisma studio
```

Isso abrirá uma interface web onde você pode ver:
- Tabela `quizzes`
- Tabela `quiz_sessions`
- Tabela `quiz_events`
- Tabela `conversions`

## Testes com UTM Parameters

Para testar rastreamento de UTM, acesse o quiz com parâmetros:

```
http://localhost:3001/quiz/1?utm_source=facebook&utm_medium=cpc&utm_campaign=test-campaign
```

No dashboard, em "Fontes de Tráfego", você verá:
- facebook: 1 visitante

## Solução de Problemas

### Não vejo dados no dashboard
1. Certifique-se de que completou ao menos um quiz
2. Verifique se o evento `quiz_started` foi enviado (console F12)
3. Verifique se há erros no console do navegador
4. Verifique logs do servidor (terminal onde roda `npm run dev`)

### Erro "quiz not found"
- O quiz é criado automaticamente no primeiro evento `quiz_started`
- Certifique-se de começar do step 1

### Eventos não estão sendo enviados
1. Verifique se está em `http://localhost:3001` (porta correta)
2. Limpe localStorage e sessionStorage
3. Recarregue a página do quiz
4. Verifique Network tab (F12) para ver requisições POST para `/api/track`

## Próximos Passos

Após testar e verificar que tudo funciona:

1. **Em produção**, configure:
   - Webhook do LastLink para enviar conversões
   - Parâmetros UTM nas suas campanhas
   - Links de afiliados com tracking

2. **Monitore**:
   - Taxas de abandono por pergunta
   - Fontes de tráfego com melhor conversão
   - Dispositivos mais usados

3. **Otimize**:
   - Ajuste perguntas com alta taxa de abandono
   - Invista nas fontes de tráfego que convertem melhor
   - Melhore a experiência mobile se necessário

## Comandos Úteis

```bash
# Ver logs do servidor em tempo real
npm run dev

# Rodar script de teste
node scripts/test-analytics.js

# Acessar banco de dados visualmente
npx prisma studio

# Limpar todos os dados (cuidado!)
# Execute no Prisma Studio ou via SQL
```

## Métricas Importantes

- **Taxa de Conclusão**: % de visitantes que completam o quiz
  - Ideal: > 60%

- **Taxa de Conversão**: % de quem completa e paga
  - Ideal: > 3-5%

- **Conversão Final**: % de visitantes que pagam
  - Ideal: > 2%

Agora é só testar! 🚀
