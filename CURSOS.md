# Sistema de Cursos - Hypnozio MVP

## Visão Geral

Sistema de navegação de cursos com páginas dedicadas para cada curso, exibindo todas as sessões organizadas por seções.

## Estrutura

### Área de Membros (`/membros`)
- **Cursos Principais**: Ao clicar, navega para página dedicada do curso
- **Alívios Rápidos**: Ao clicar, abre player de áudio diretamente

### Página do Curso (`/curso/[id]`)
Página dedicada para cada curso com layout completo

## Rota Dinâmica

### Caminho do arquivo
```
app/curso/[id]/page.tsx
```

### URLs geradas
- `/curso/1` - Mudando a relação com a comida
- `/curso/2` - Descodificação da procrastinação
- `/curso/3` - Bem-estar natural

## Layout da Página do Curso

### 1. Header Superior
- Logo "hypnozio"
- Links: Cursos, Configurações, Pt-Br

### 2. Botão Voltar
- Volta para `/membros`
- Ícone de seta + texto

### 3. Course Header Card
**Conteúdo:**
- Thumbnail do curso (grande, quadrado, 128x128px)
- Título do curso (grande, bold)
- Descrição curta
- Descrição longa
- Metadados: número de sessões, tipo

**Estilo:**
- Background: `bg-white/10` com backdrop blur
- Border: `border-white/20`
- Padding: `p-6`
- Layout: Flexbox (coluna em mobile, linha em desktop)

### 4. Tabs de Filtro
**Duas opções:**
- **Todas**: Mostra todas as sessões do curso
- **Suas**: Mostra apenas sessões completadas

**Estilo:**
- Tab ativa: fundo branco, texto teal
- Tab inativa: fundo semi-transparente, texto branco/80%

### 5. Seções de Sessões
Sessões agrupadas por seção com headers

**Exemplo de seções:**
- Introdução à autoconsciência
- Acesse sua autoconsciência
- Pare de comer quando estiver satisfeito
- Desenvolvendo da curiosidade para estar Anonimo

### 6. Lista de Sessões

**Cada item contém:**
- **Thumbnail**: 64x64px com ícone de play
- **Título**: Nome da sessão
- **Duração**: Formato MM:SS
- **Ícone de headphone**: Indicador clicável
- **Badge de completado**: Check verde se já foi completado

**Layout:**
```
[Thumbnail] [Título --------------------] [Duração] [🎵]
```

**Comportamento:**
- Hover: Background fica mais claro
- Click: Abre player de áudio
- Completed: Badge verde no thumbnail

## Dados dos Cursos

### Interface CourseSession
```typescript
interface CourseSession {
  id: number;
  title: string;
  duration: string;
  thumbnail?: string;
  audioUrl: string;
  section: string;
}
```

### Interface Course
```typescript
interface Course {
  id: number;
  title: string;
  description: string;
  longDescription: string;
  thumbnail: string;
  sessions: CourseSession[];
}
```

## Curso 1: Mudando a relação com a comida

### Informações
- **ID**: 1
- **Título**: Mudando a relação com a comida
- **Descrição**: Transforme sua relação com a alimentação através da hipnoterapia
- **Total de sessões**: 18

### Seções e Sessões

**1. Introdução à autoconsciência** (5 sessões)
- Comece sua jornada aqui (02:04)
- O que é hipnose? (01:51)
- Recomendações de escuta (01:50)
- O que é fome real, fome emocional e sede daquelas? (02:39)
- Entenda a importância comunitar (03:22)

**2. Acesse sua autoconsciência** (5 sessões)
- Identifique-se com comida (11:36)
- Entendendo idéias (11:01)
- Ansiedade finalmente (13:52)
- Combate as emoções (11:05)
- Rejeite lanches entre refeições (10:58)

**3. Pare de comer quando estiver satisfeito** (3 sessões)
- Pare de comer quando estiver satisfeito (09:38)
- Autoestima seguidores (11:35)
- Soltar emoções (09:27)

**4. Desenvolvendo da curiosidade para estar Anonimo** (5 sessões)
- Como ter a parte do jejum (05:33)
- Como você bem boteinho? (02:51)
- Desenvolvendo a curiosidade (11:34)
- Exercício físico (11:40)
- Imagine seu futuro copo (15:58)

## Curso 2: Descodificação da procrastinação

### Informações
- **ID**: 2
- **Título**: Descodificação da procrastinação
- **Descrição**: Supere a procrastinação e seja mais produtivo
- **Total de sessões**: 3

### Seções e Sessões

**1. Fundamentos** (2 sessões)
- Introdução à produtividade (05:00)
- Quebrando padrões de procrastinação (12:30)

**2. Técnicas avançadas** (1 sessão)
- Foco e concentração (15:00)

## Curso 3: Bem-estar natural

### Informações
- **ID**: 3
- **Título**: Bem-estar natural
- **Descrição**: Encontre equilíbrio e bem-estar através da hipnoterapia
- **Total de sessões**: 3

### Seções e Sessões

**1. Práticas iniciais** (2 sessões)
- Relaxamento profundo (20:00)
- Conexão mente-corpo (18:00)

**2. Práticas avançadas** (1 sessão)
- Harmonia interior (22:00)

## Funcionalidades

### Tab "Todas"
- Exibe todas as sessões do curso
- Agrupadas por seção
- Marca sessões completadas com badge verde

### Tab "Suas"
- Filtra apenas sessões já completadas
- Mostra apenas seções que tenham sessões completadas
- Mensagem se nenhuma sessão foi completada

### Rastreamento de Progresso
```javascript
// localStorage
{
  "completedSessions": [1, 2, 3, 5, 8]
}
```

### Ao Completar Sessão
1. Player de áudio é fechado
2. Session ID é adicionado ao array `completedSessions`
3. Badge verde aparece no thumbnail
4. Sessão fica disponível na tab "Suas"

## Navegação

### De Membros para Curso
```typescript
// Ao clicar em curso principal
if (session.category === 'principal') {
  router.push(`/curso/${session.id}`);
}
```

### De Curso para Player
```typescript
// Ao clicar em sessão
handleSessionClick(session);
setCurrentAudio(session);
```

### De Curso para Membros
```typescript
// Botão voltar
router.push('/membros');
```

## Responsividade

### Desktop (md+)
- Header do curso: Layout horizontal (imagem + texto lado a lado)
- Sessions: Lista vertical full-width
- Thumbnails: 64x64px

### Mobile
- Header do curso: Layout vertical (imagem acima, texto abaixo)
- Sessions: Lista vertical responsiva
- Thumbnails: 64x64px (mantém tamanho)

## Estilo Visual

### Paleta de Cores
- Background: Gradiente teal-700 → teal-600 → teal-800
- Cards: `bg-white/10` com `backdrop-blur-sm`
- Borders: `border-white/20`
- Texto: Branco com variações de opacidade

### Tipografia
- Título do curso: `text-3xl font-bold`
- Títulos de seção: `text-xl font-bold`
- Títulos de sessão: `text-white font-semibold`
- Durações: `text-white/60 text-sm`

### Efeitos
- Hover em sessão: `bg-white/15`
- Transições: `transition-all`
- Icons: SVG inline
- Badges: Green check circle

## Adicionar Novo Curso

1. **Adicione dados ao objeto `courses`** em `/app/curso/[id]/page.tsx`:

```typescript
'4': {
  id: 4,
  title: 'Nome do Novo Curso',
  description: 'Descrição curta',
  longDescription: 'Descrição detalhada',
  thumbnail: '/images/course-4.jpg',
  sessions: [
    {
      id: 25,
      title: 'Primeira sessão',
      duration: '10:00',
      section: 'Seção 1',
      audioUrl: '/audios/sessao-25.mp3'
    },
    // ... mais sessões
  ],
}
```

2. **Adicione o curso na área de membros** em `/app/membros/page.tsx`:

```typescript
{
  id: 4,
  title: 'Nome do Novo Curso',
  description: 'Descrição',
  duration: 'X sessões',
  category: 'principal',
  audioUrl: '/audios/sessao-placeholder.mp3',
  isLocked: false,
}
```

3. **Adicione áudios** em `/public/audios/`

## Melhorias Futuras

1. **Backend Integration**
   - Buscar dados dos cursos via API
   - Salvar progresso no servidor
   - Sincronizar entre dispositivos

2. **Mais Metadados**
   - Duração total do curso
   - Nível de dificuldade
   - Categorias/tags
   - Instrutor

3. **Progresso Visual**
   - Barra de progresso do curso
   - Porcentagem de conclusão
   - Próxima sessão sugerida

4. **Favoritos**
   - Marcar sessões favoritas
   - Lista de favoritos
   - Acesso rápido

5. **Downloads**
   - Baixar sessões para offline
   - Gerenciar downloads

6. **Notas**
   - Adicionar notas pessoais
   - Marcar timestamps importantes

7. **Certificados**
   - Gerar certificado ao completar curso
   - Compartilhar conquistas

## Troubleshooting

### Curso não carrega
**Solução:** Verifique se o ID do curso existe no objeto `courses`

### Sessões não aparecem
**Solução:** Verifique estrutura das sessões e nomes das seções

### Badge de completado não aparece
**Solução:** Verifique se session ID está em `completedSessions` no localStorage

### Player não abre
**Solução:** Verifique se `audioUrl` está correto e arquivo existe
