# Fluxo de Autenticação - Hypnozio MVP

## Visão Geral

O sistema de autenticação foi implementado para permitir que usuários criem contas após a compra e façam login posteriormente para acessar a área de membros.

## Componentes Criados

### 1. AuthContext (`contexts/AuthContext.tsx`)
- Contexto React para gerenciar estado de autenticação globalmente
- Funções disponíveis:
  - `login(email, token?)`: Faz login com email e opcionalmente token
  - `logout()`: Faz logout e limpa dados
  - `validateToken(token)`: Valida token da API
- Estados:
  - `user`: Dados do usuário logado
  - `isAuthenticated`: Boolean indicando se está autenticado
  - `isLoading`: Boolean para estado de carregamento

### 2. Página de Login (`app/login/page.tsx`)
- Interface para usuários existentes fazerem login
- Aceita apenas email (senha é armazenada mas não validada no MVP)
- Aceita token via URL query parameter para login automático
- Redireciona para `/membros` após login bem-sucedido

### 3. Página Atualizada de Obrigado (`app/obrigado/page.tsx`)
- Formulário de criação de senha após checkout
- Salva credenciais no localStorage
- Redireciona automaticamente para `/membros` após criar conta

## Fluxo do Usuário

### Fluxo 1: Nova Compra
```
1. Usuário completa checkout (/checkout)
   ↓
2. Email é salvo no sessionStorage
   ↓
3. Redireciona para /obrigado
   ↓
4. Usuário cria senha no formulário
   ↓
5. Credenciais são salvas no localStorage
   ↓
6. Redireciona automaticamente para /membros (já logado)
```

### Fluxo 2: Login Existente
```
1. Usuário clica em "Área de membros" no footer
   ↓
2. Vai para /login
   ↓
3. Digita email cadastrado
   ↓
4. Sistema verifica localStorage
   ↓
5. Se email encontrado: login bem-sucedido
   ↓
6. Redireciona para /membros
```

### Fluxo 3: Login via Email (Token)
```
1. Usuário recebe email com link mágico
   ↓
2. Link contém: /login?token=xxx ou /membros?token=xxx
   ↓
3. Token é validado via API
   ↓
4. Se válido: salva dados e faz login automático
   ↓
5. Redireciona para /membros
```

## Estrutura de Dados

### localStorage
```javascript
{
  "accessToken": "token-string", // Token de acesso (se aplicável)
  "userEmail": "user@email.com", // Email do usuário
  "userData": {
    "name": "Nome do Usuário",
    "email": "user@email.com",
    "password": "hashed-password", // No MVP, senha em texto (mudar em produção!)
    "planType": "plan-1",
    "createdAt": "2025-01-15T10:30:00.000Z"
  },
  "completedSessions": [1, 2, 3] // IDs das sessões completadas
}
```

### sessionStorage (temporário durante checkout)
```javascript
{
  "userEmail": "user@email.com",
  "selectedPlan": "6-months"
}
```

## Segurança - Notas Importantes

### ⚠️ MVP vs Produção

**No MVP atual:**
- Senhas são armazenadas em texto plano no localStorage
- Não há hash ou criptografia
- Validação é apenas no frontend
- Token é simples e não expira

**Para Produção, IMPLEMENTAR:**
1. **Backend Real**
   - API para autenticação com JWT
   - Hash de senhas com bcrypt
   - Validação server-side

2. **Banco de Dados**
   - PostgreSQL ou MongoDB
   - Migracao do access-tokens.json

3. **Segurança**
   - HTTPS obrigatório
   - HTTP-only cookies ao invés de localStorage
   - Rate limiting para login
   - Tokens com expiração
   - Refresh tokens
   - 2FA opcional

4. **Validações**
   - Email único no banco
   - Força de senha
   - Verificação de email
   - Reset de senha

## Páginas Atualizadas

### `/` (Home)
- Link "Área de membros" aponta para `/login`

### `/checkout`
- Salva email no sessionStorage
- Redireciona para `/obrigado` após pagamento

### `/obrigado`
- Auto-preenche email do sessionStorage
- Formulário de criação de senha
- Salva credenciais e faz login automático

### `/login`
- Formulário de login com email
- Aceita token via URL
- Mensagens de erro apropriadas
- Links para checkout e reenvio de email

### `/membros`
- Usa AuthContext para verificar autenticação
- Tela de carregamento durante validação
- Tela de acesso negado com opções de login/checkout
- Botão de logout funcional

## Testando o Sistema

### Teste 1: Nova Compra
```bash
1. Acesse: http://localhost:3000
2. Navegue até: /checkout
3. Preencha formulário e submeta
4. Deve ir para: /obrigado
5. Crie senha no formulário
6. Deve redirecionar para: /membros (já logado)
```

### Teste 2: Login Existente
```bash
1. Depois do Teste 1, faça logout em /membros
2. Clique em "Área de membros" no footer
3. Vai para: /login
4. Digite o email usado no checkout
5. Deve logar e ir para: /membros
```

### Teste 3: Acesso Direto sem Login
```bash
1. Limpe localStorage (DevTools > Application > Local Storage)
2. Acesse diretamente: http://localhost:3000/membros
3. Deve mostrar tela de acesso negado
4. Com opções para Login ou Adquirir Plano
```

## Próximos Passos Recomendados

1. **Integração com Backend Real**
   - Criar API de autenticação
   - Implementar hash de senhas
   - Validação server-side

2. **Melhorias de UX**
   - "Lembrar-me" checkbox
   - Mostrar/ocultar senha
   - Indicador de força de senha
   - Validação de email em tempo real

3. **Recuperação de Senha**
   - Página de "Esqueci minha senha"
   - Email de reset
   - Fluxo de redefinição

4. **Perfil do Usuário**
   - Página de configurações
   - Editar nome/email
   - Trocar senha
   - Cancelar assinatura

5. **Analytics**
   - Tracking de login/logout
   - Monitoramento de sessões
   - Métricas de engajamento

## Troubleshooting

### Problema: Não consigo fazer login
**Solução:** Verifique se completou o checkout e criou senha em /obrigado

### Problema: Logout não funciona
**Solução:** Verifique se o AuthContext está sendo usado corretamente

### Problema: Dados não persistem
**Solução:** Verifique localStorage no DevTools (pode estar sendo bloqueado)

### Problema: Tela branca após login
**Solução:** Verifique erros no console do navegador

## Suporte

Para dúvidas ou problemas:
- Verifique os logs do console do navegador
- Inspecione localStorage/sessionStorage
- Revise os componentes AuthContext e páginas de auth
