# 🆓 Guia de Testes Gratuitos - SoulSync

## 🎯 Como Testar Sem Gastar Nada

Você tem **5 formas gratuitas** de testar a área de membros!

---

## ✅ **OPÇÃO 1: Botão "Teste Grátis" (Mais Fácil!)**

### Passo a Passo:

1. **Acesse o site:**
   ```
   http://localhost:3003
   ```

2. **Faça o quiz completo** (21 perguntas)

3. **Na página de planos**, procure o botão:
   ```
   🎁 Teste Grátis por 7 Dias
   ```
   (Botão com gradiente rosa/pêssego, acima dos planos)

4. **Clique no botão** → Você vai **direto** para a área de membros!

**Vantagens:**
- ✅ Zero configuração
- ✅ Experiência completa do usuário
- ✅ Testa o fluxo do quiz
- ✅ Instantâneo

---

## ✅ **OPÇÃO 2: Criar Token Manualmente**

### Forma Rápida (Clique Duplo):

1. **Dê duplo clique no arquivo:**
   ```
   criar-acesso-teste.bat
   ```

2. **Digite o nome e email** (ou pressione Enter para usar padrão)

3. **Copie o link gerado** e cole no navegador!

### Forma por Comando:

```bash
cd C:\Users\Lucas\Documents\hypnozio-mvp
node criar-token-teste.js "Nome do Cliente" "email@exemplo.com"
```

**Exemplo:**
```bash
node criar-token-teste.js "João Silva" "joao@teste.com"
```

**Saída:**
```
✅ TOKEN CRIADO COM SUCESSO!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
👤 Nome: João Silva
📧 Email: joao@teste.com
🎟️ Token: abc123...

🔗 LINK DE ACESSO:
http://localhost:3003/membros?token=abc123...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Vantagens:**
- ✅ Cria quantos acessos quiser
- ✅ Personaliza nome e email
- ✅ Token válido permanentemente
- ✅ Não precisa de internet

---

## ✅ **OPÇÃO 3: Usar Token Já Criado**

Você já tem tokens válidos! Basta colar no navegador:

```
http://localhost:3003/membros?token=1c1ab9f27b0af6b209a673ea60dabbc23c2eff1fef57e8ea7420481ccdafc0f0
```

**Ver todos os tokens criados:**
```bash
# Windows
type data\access-tokens.json

# Mac/Linux
cat data/access-tokens.json
```

---

## ✅ **OPÇÃO 4: Simular Webhook (Com Email)**

**⚠️ Apenas envia email para: lsbempreendimentos@gmail.com**

```bash
cd C:\Users\Lucas\Documents\hypnozio-mvp
test-webhook.bat
```

O que acontece:
1. Simula compra na LastLink
2. Gera token automaticamente
3. **Envia email para lsbempreendimentos@gmail.com**
4. Você recebe email lindo com botão de acesso

**Vantagens:**
- ✅ Testa sistema completo (webhook + email)
- ✅ Vê como cliente receberá o email
- ✅ Email profissional com template bonito

---

## ✅ **OPÇÃO 5: Acesso Direto (Desenvolvedor)**

Se quiser pular validação temporariamente (só para testes):

1. Abra: `app/membros/page.tsx`
2. Temporariamente comente a validação
3. Acesse direto: `http://localhost:3003/membros`

**⚠️ Lembre-se de descomentar depois!**

---

## 🎮 **Comparação das Opções**

| Opção | Facilidade | Testa Email | Testa Fluxo Completo |
|-------|------------|-------------|---------------------|
| 1. Botão "Teste Grátis" | ⭐⭐⭐⭐⭐ | ❌ | ✅ |
| 2. Criar Token Manual | ⭐⭐⭐⭐ | ❌ | ❌ |
| 3. Token Existente | ⭐⭐⭐⭐⭐ | ❌ | ❌ |
| 4. Webhook Simulado | ⭐⭐⭐ | ✅ | ✅ |
| 5. Acesso Direto | ⭐⭐ | ❌ | ❌ |

---

## 🧪 **Cenários de Teste Recomendados**

### **Teste 1: Experiência do Cliente**
```
1. Use Opção 1 (Botão Teste Grátis)
2. Complete o quiz inteiro
3. Clique no botão
4. Explore área de membros
5. Teste player de áudio
6. Marque sessões como completas
```

### **Teste 2: Sistema de Email**
```
1. Use Opção 4 (Webhook Simulado)
2. Verifique email recebido
3. Clique no botão do email
4. Confirme que acessa corretamente
```

### **Teste 3: Criar Múltiplos Usuários**
```
1. Use Opção 2 várias vezes:
   node criar-token-teste.js "João" "joao@teste.com"
   node criar-token-teste.js "Maria" "maria@teste.com"
   node criar-token-teste.js "Pedro" "pedro@teste.com"

2. Teste cada link em abas diferentes
3. Veja que cada um mantém sessão independente
```

---

## 📊 **O Que Você Pode Testar**

### **Área de Membros:**
- ✅ Validação de token
- ✅ Tela de loading
- ✅ Tela de acesso negado (tente sem token)
- ✅ Dashboard com estatísticas
- ✅ Filtros por categoria
- ✅ Player de áudio HTML5
- ✅ Marcação de progresso
- ✅ Persistência no localStorage
- ✅ Botão "Sair"

### **Fluxo Completo:**
- ✅ Quiz de 21 perguntas
- ✅ Validação de respostas
- ✅ Captura de email
- ✅ Tela de loading
- ✅ Resultados personalizados
- ✅ Página de planos
- ✅ Redirecionamento para checkout

---

## 🎯 **Teste Rápido (1 Minuto)**

Execute isso no terminal:

```bash
cd C:\Users\Lucas\Documents\hypnozio-mvp
node criar-token-teste.js "Meu Teste" "teste@exemplo.com"
```

Copie o link que aparecer e cole no navegador. **Pronto!** 🎉

---

## 📱 **Testar em Outros Dispositivos**

### **No Celular (mesma rede WiFi):**

1. Veja o IP do seu PC:
   ```bash
   ipconfig
   # Procure por: IPv4 Address
   ```

2. No celular, acesse:
   ```
   http://SEU_IP:3003
   ```

3. Crie um token de teste e envie o link para seu celular!

---

## 🔍 **Verificar Tokens Criados**

```bash
# Ver todos os tokens
cd C:\Users\Lucas\Documents\hypnozio-mvp
type data\access-tokens.json
```

**Ver no formato bonito:**
```bash
node -e "console.log(JSON.stringify(require('./data/access-tokens.json'), null, 2))"
```

---

## 💰 **Custos**

| Item | Custo |
|------|-------|
| Testes locais | **R$ 0,00** ✅ |
| Tokens ilimitados | **R$ 0,00** ✅ |
| Servidor local | **R$ 0,00** ✅ |
| Emails de teste (até 3000/mês) | **R$ 0,00** ✅ |

**TUDO GRATUITO!** 🎉

---

## 🆘 **Problemas Comuns**

### **"Acesso Restrito" mesmo com token válido**

**Solução:**
```bash
# 1. Limpar localStorage
# Abra console do navegador (F12) e digite:
localStorage.clear()

# 2. Verificar se token existe
type data\access-tokens.json

# 3. Criar novo token
node criar-token-teste.js "Teste" "teste@teste.com"
```

### **Servidor não está rodando**

```bash
cd C:\Users\Lucas\Documents\hypnozio-mvp
npm run dev
```

Aguarde ver:
```
✓ Ready in 2.2s
```

### **Email não chega**

1. **Verifique se usou o email correto:**
   ```
   lsbempreendimentos@gmail.com
   ```

2. **Veja os logs do servidor** para confirmar envio

3. **Verifique pasta SPAM**

---

## 🚀 **Dicas**

### **Limpar Tokens de Teste**

Antes de ir para produção, limpe os tokens de teste:

```bash
# Criar arquivo vazio
echo [] > data\access-tokens.json
```

### **Criar Tokens em Massa**

```bash
for i in {1..10}; do
  node criar-token-teste.js "Cliente $i" "cliente$i@teste.com"
done
```

### **Compartilhar com Amigos**

1. Crie um token de teste
2. Envie o link por WhatsApp
3. Peça feedback da experiência!

---

## ✅ **Checklist de Testes**

Antes de lançar, teste:

- [ ] Quiz completo (21 perguntas)
- [ ] Validação de todas as respostas
- [ ] Botão "Teste Grátis" funciona
- [ ] Token válido dá acesso
- [ ] Token inválido mostra erro
- [ ] Email é enviado (webhook)
- [ ] Email chega com formatação correta
- [ ] Link do email funciona
- [ ] Área de membros carrega
- [ ] Player de áudio funciona
- [ ] Filtros por categoria funcionam
- [ ] Progresso é salvo
- [ ] Botão "Sair" funciona
- [ ] Após sair, não consegue acessar sem token
- [ ] Teste em celular

---

**Agora você pode testar infinitamente, sem gastar nada! 🎉**

**Recomendação:** Comece pela **Opção 1** (Botão Teste Grátis) para testar o fluxo completo!
