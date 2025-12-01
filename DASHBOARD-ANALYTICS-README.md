# Dashboard de Analytics - Hypnozio MVP

## ✅ FASE 1: SETUP - COMPLETA!

### O que foi implementado:

#### 1. Dependências Instaladas ✅
- `@prisma/client` e `prisma` - ORM para banco de dados
- `next-auth` - Autenticação
- `bcryptjs` e `@types/bcryptjs` - Hash de senhas
- `recharts` - Gráficos e visualizações
- `swr` - Data fetching e cache
- `date-fns` - Manipulação de datas
- `zod` - Validação de dados

#### 2. Arquivos Criados ✅

**Configuração do Banco de Dados:**
- `prisma/schema.prisma` - Schema completo com 5 tabelas:
  - `Quiz` - Diferentes versões de quizzes
  - `QuizSession` - Sessões de usuários
  - `QuizEvent` - Eventos detalhados (views, respostas, etc)
  - `Conversion` - Conversões e compras
  - `User` - Usuários admin do dashboard

**Seed e Configuração:**
- `prisma/seed.js` - Cria usuário admin inicial
- `.env.example` - Variáveis de ambiente necessárias

**Tracking:**
- `public/tracking.js` - Sistema completo de tracking para os quizzes

**Bibliotecas:**
- `lib/prisma.ts` - Cliente Prisma configurado
- `lib/auth.ts` - Configuração NextAuth

**Scripts npm adicionados:**
```json
{
  "db:migrate": "Rodar migrations",
  "db:generate": "Gerar Prisma Client",
  "db:studio": "Abrir Prisma Studio",
  "db:seed": "Criar usuário admin",
  "db:reset": "Resetar banco (CUIDADO!)"
}
```

---

## 🚀 PRÓXIMOS PASSOS

### Você precisa configurar o banco de dados:

#### **Opção A: Supabase (Recomendado - Gratuito)**

1. Acesse https://supabase.com
2. Crie uma conta gratuita
3. Clique em "New Project"
4. Preencha:
   - Nome do projeto: hypnozio-analytics
   - Database Password: (crie uma senha forte)
   - Region: South America (São Paulo)
5. Aguarde ~2 minutos para criar
6. Vá em "Settings" → "Database"
7. Copie a "Connection String" (URI)
8. Cole no seu `.env.local`

#### **Opção B: Railway (Alternativa Gratuita)**

1. Acesse https://railway.app
2. Crie uma conta gratuita
3. New Project → Provision PostgreSQL
4. Clique no PostgreSQL criado
5. Vá na aba "Connect"
6. Copie "Postgres Connection URL"
7. Cole no seu `.env.local`

---

### Configurar `.env.local`

Crie ou edite o arquivo `.env.local` na raiz do projeto:

```bash
# Database (Cole a URL do Supabase ou Railway aqui)
DATABASE_URL="postgresql://usuario:senha@host:5432/database"

# NextAuth (Gere uma chave secreta)
NEXTAUTH_SECRET="sua-chave-secreta-aqui"
NEXTAUTH_URL="http://localhost:3002"

# Suas variáveis existentes (não apague!)
RESEND_API_KEY=re_sua_api_key_aqui
NEXT_PUBLIC_BASE_URL=http://localhost:3002
```

**Para gerar NEXTAUTH_SECRET:**

**Windows PowerShell:**
```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

**Git Bash / WSL / Linux / Mac:**
```bash
openssl rand -base64 32
```

---

### Rodar as Migrations

Depois de configurar o `.env.local` com o DATABASE_URL:

```bash
# 1. Gerar Prisma Client
npm run db:generate

# 2. Criar tabelas no banco
npm run db:migrate

# 3. Criar usuário admin
npm run db:seed
```

**Credenciais do Admin criadas:**
- Username: `admin`
- Email: `admin@hypnozio.com`
- Senha: `admin123`

⚠️ **IMPORTANTE:** Altere a senha após o primeiro login!

---

### Verificar se funcionou

```bash
# Abrir Prisma Studio para visualizar o banco
npm run db:studio
```

Isso abrirá um navegador em `http://localhost:5555` onde você pode ver todas as tabelas.

---

## 📊 ESTRUTURA DO BANCO

### Tabelas Criadas:

1. **quizzes** - Armazena informações dos quizzes
2. **quiz_sessions** - Cada vez que alguém inicia o quiz
3. **quiz_events** - Todos os eventos (card viewed, answered, etc)
4. **conversions** - Compras e conversões
5. **users** - Usuários admin do dashboard

### Relacionamentos:

```
Quiz (1) ──→ (N) QuizSession
QuizSession (1) ──→ (N) QuizEvent
QuizSession (1) ──→ (N) Conversion
```

---

## 🎯 FASE 2: BACKEND (Próxima)

Na FASE 2, vamos implementar:

1. **API de Tracking** (`/api/track`)
   - Receber eventos do quiz
   - Salvar no banco de dados

2. **API de Dashboard** (`/api/dashboard/overview`)
   - Métricas gerais
   - KPIs principais

3. **API de Quiz Detalhes** (`/api/dashboard/quiz/[id]`)
   - Análise card por card
   - Funil de conversão

4. **API de Comparação** (`/api/dashboard/compare`)
   - Comparar múltiplos quizzes

5. **NextAuth Route** (`/api/auth/[...nextauth]`)
   - Autenticação do dashboard

---

## 🆘 PROBLEMAS COMUNS

### "Can't reach database server"
- Verifique se copiou o DATABASE_URL corretamente
- Certifique-se de estar conectado à internet
- Tente novamente em alguns minutos

### "Environment variable not found: DATABASE_URL"
- Certifique-se que criou o arquivo `.env.local`
- Verifique se está na raiz do projeto
- Reinicie o terminal após criar o arquivo

### "Error: P3009: migrate found failed migrations"
- Execute: `npm run db:reset` (isso vai limpar o banco!)
- Ou delete a pasta `prisma/migrations` e rode `npm run db:migrate` novamente

---

## 📞 SUPORTE

Qualquer dúvida, me avise para continuar com a FASE 2!

---

## 🎉 RESUMO DO QUE FAZER AGORA:

1. ✅ Configure o banco de dados (Supabase ou Railway)
2. ✅ Atualize o `.env.local` com DATABASE_URL e NEXTAUTH_SECRET
3. ✅ Rode `npm run db:generate`
4. ✅ Rode `npm run db:migrate`
5. ✅ Rode `npm run db:seed`
6. ✅ Verifique com `npm run db:studio`
7. ✅ Me avise para começar a FASE 2!
