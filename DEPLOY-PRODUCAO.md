# 🚀 Guia de Deploy - Colocar SoulSync no Ar

## ⚠️ IMPORTANTE: Deploy é Obrigatório!

O webhook da LastLink **só funciona com URL pública**.

Localhost (`http://localhost:3003`) **NÃO** funciona porque a LastLink não consegue acessar seu computador.

---

## 🎯 Opções de Deploy (Todas Gratuitas!)

### **OPÇÃO 1: Vercel** ⭐ **RECOMENDADO**

**Por quê:**
- ✅ Deploy em 2 minutos
- ✅ 100% gratuito para sempre
- ✅ SSL automático (HTTPS)
- ✅ Domínio grátis (.vercel.app)
- ✅ Git integration automático
- ✅ Variables de ambiente fácil

---

### **📋 Passo a Passo Completo - Vercel**

#### **1. Instalar Vercel CLI**

```bash
npm install -g vercel
```

#### **2. Fazer Login**

```bash
vercel login
```

Escolha uma opção:
- Email
- GitHub
- GitLab
- Bitbucket

#### **3. Fazer Deploy**

```bash
cd C:\Users\Lucas\Documents\hypnozio-mvp
vercel
```

**Perguntas que vão aparecer:**

```
? Set up and deploy "hypnozio-mvp"? [Y/n]
→ Digite: Y

? Which scope do you want to deploy to?
→ Escolha sua conta

? Link to existing project? [y/N]
→ Digite: N

? What's your project's name?
→ Digite: soulsync (ou deixe padrão)

? In which directory is your code located?
→ Pressione Enter (./  está correto)

? Want to override the settings? [y/N]
→ Digite: N
```

**Aguarde o deploy (~2 minutos)**

Você verá algo como:
```
✅  Production: https://soulsync-abc123.vercel.app
```

**Copie essa URL!** 🔗

---

#### **4. Configurar Variáveis de Ambiente**

**Online (Mais Fácil):**

1. Acesse: https://vercel.com
2. Clique no seu projeto
3. Vá em **Settings** → **Environment Variables**
4. Adicione as variáveis:

| Name | Value |
|------|-------|
| `RESEND_API_KEY` | `re_jReQY8HW_6YuK9yEMHGwYrLiMg8eoETa5` |
| `NEXT_PUBLIC_BASE_URL` | `https://soulsync-abc123.vercel.app` |

5. Clique em **Save**

**Via CLI (Alternativa):**

```bash
# Configurar Resend
vercel env add RESEND_API_KEY production
# Cole: re_jReQY8HW_6YuK9yEMHGwYrLiMg8eoETa5

# Configurar URL base
vercel env add NEXT_PUBLIC_BASE_URL production
# Cole: https://SEU-DOMINIO.vercel.app
```

---

#### **5. Fazer Redeploy (Aplicar Variáveis)**

```bash
vercel --prod
```

**Pronto! Seu site está no ar!** 🎉

---

### **📝 Sua URL Final Será:**

```
https://soulsync-abc123.vercel.app
```

**Webhook URL para LastLink:**
```
https://soulsync-abc123.vercel.app/api/webhook/lastlink
```

---

## 🔧 **Configurar Webhook na LastLink**

Agora que você tem uma URL pública:

### **Passo 1: Acessar LastLink**

1. Entre em: https://app.lastlink.com
2. Faça login

### **Passo 2: Encontrar Seu Produto**

1. Vá em **Produtos**
2. Encontre o produto do link: `https://lastlink.com/p/CDD3C0290/checkout-payment`
3. Clique para editar

### **Passo 3: Configurar Webhook**

1. Procure por **Integrações** ou **Webhooks**
2. Clique em **Novo Webhook** ou **Adicionar Webhook**

3. Preencha:

```
Nome: SoulSync - Acesso Automático
URL: https://SEU-DOMINIO.vercel.app/api/webhook/lastlink
```

4. **Selecione os eventos:**
   - ✅ `Purchase_Order_Confirmed` ⭐ **PRINCIPAL**
   - ✅ `Product_access_started`
   - ✅ `Product_access_ended`
   - ✅ `Subscription_Canceled`
   - ✅ `Subscription_Expired`
   - ✅ `Payment_Refund`

5. Clique em **Salvar** ou **Ativar**

---

### **Passo 4: Testar o Webhook**

A LastLink tem um botão **"Testar Webhook"**:

1. Clique em **Testar**
2. Veja se aparece "Sucesso" ✅
3. Verifique os logs

**Ver logs do webhook:**
- Na Vercel: https://vercel.com → Seu projeto → **Logs**
- Ou na LastLink: Veja o histórico de webhooks

---

## 🧪 **Testar Compra Real**

### **Opção 1: Compra de Teste (Simulação)**

Se a LastLink tem modo de teste:

1. Ative **Modo de Teste** no painel
2. Faça uma compra de teste
3. Use cartão de teste da LastLink
4. Veja se o webhook chega

### **Opção 2: Compra Real Pequena**

Crie um produto de **R$ 1,00** para teste:

1. Crie produto teste na LastLink
2. Configure mesmo webhook
3. Compre você mesmo
4. Veja se recebe o email

---

## 📊 **Verificar se Funcionou**

### **1. Logs da Vercel**

```
https://vercel.com → Seu Projeto → Logs
```

Procure por:
```
📩 Webhook recebido
✅ Token gerado
📨 Email enviado
```

### **2. Ver Tokens Criados**

No projeto local:
```bash
# Baixar o arquivo de produção
vercel logs
```

Ou adicione uma rota de admin (futuro).

---

## 🌐 **Domínio Customizado (Opcional)**

Se quiser usar seu próprio domínio:

### **Comprar Domínio:**
- Registro.br (R$ 40/ano)
- Hostinger (R$ 30/ano)
- GoDaddy

### **Conectar na Vercel:**

1. Vercel → Seu projeto → **Settings** → **Domains**
2. Adicione: `soulsync.com.br`
3. Configure DNS:
   ```
   Type: CNAME
   Name: @
   Value: cname.vercel-dns.com
   ```
4. Aguarde propagação (pode levar 24h)

Depois seu site será:
```
https://soulsync.com.br
```

---

## 🔄 **Fluxo Completo (Produção)**

```
1. Cliente acessa: https://soulsync.com.br
   ↓
2. Faz quiz e escolhe plano
   ↓
3. Redireciona para: https://lastlink.com/p/CDD3C0290/checkout-payment
   ↓
4. Cliente paga
   ↓
5. LastLink confirma pagamento
   ↓
6. LastLink envia webhook para: https://soulsync.com.br/api/webhook/lastlink
   ↓
7. Seu servidor:
   • Gera token único
   • Salva em access-tokens.json
   • Envia email automaticamente
   ↓
8. Cliente recebe email com link mágico
   ↓
9. Cliente clica no link
   ↓
10. Acessa área de membros!
```

**TUDO AUTOMÁTICO! 🎉**

---

## ⚡ **Deploy Rápido (Resumo)**

```bash
# 1. Instalar Vercel
npm install -g vercel

# 2. Fazer login
vercel login

# 3. Deploy
cd C:\Users\Lucas\Documents\hypnozio-mvp
vercel

# 4. Copiar URL que aparecer
# Exemplo: https://soulsync-abc123.vercel.app

# 5. Configurar variáveis no site da Vercel:
# RESEND_API_KEY=re_jReQY8HW_6YuK9yEMHGwYrLiMg8eoETa5
# NEXT_PUBLIC_BASE_URL=https://soulsync-abc123.vercel.app

# 6. Redeploy
vercel --prod

# 7. Configurar webhook na LastLink:
# URL: https://soulsync-abc123.vercel.app/api/webhook/lastlink
```

**Tempo total: ~10 minutos** ⏱️

---

## 🆘 **Problemas Comuns**

### **Erro: "Build failed"**

**Solução:**
```bash
# Testar build localmente primeiro
npm run build

# Ver se há erros
# Corrigir e fazer deploy novamente
```

### **Webhook não chega**

**Verificar:**
1. URL está correta na LastLink?
2. Eventos selecionados?
3. Webhook está ativo?
4. Ver logs da Vercel

### **Email não envia**

**Verificar:**
1. Variável `RESEND_API_KEY` configurada?
2. Ver logs: "Email enviado com sucesso"
3. Destinatário é o email da conta Resend?

---

## 💰 **Custos**

| Item | Vercel Grátis | Vercel Pro |
|------|---------------|------------|
| Preço | R$ 0/mês | ~R$ 100/mês |
| Deploys | Ilimitados | Ilimitados |
| Banda | 100GB/mês | 1TB/mês |
| Builds | 6000 min/mês | Ilimitado |
| Domínio custom | ✅ | ✅ |

**Para começar: Vercel Grátis é MAIS que suficiente!** ✅

---

## 📱 **Outras Opções de Deploy**

### **OPÇÃO 2: Netlify**

```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod
```

**Vantagens:**
- ✅ Interface amigável
- ✅ Gratuito
- ✅ Fácil configuração

### **OPÇÃO 3: Railway**

1. Acesse: https://railway.app
2. Conecte GitHub
3. Selecione repositório
4. Deploy automático

**Vantagens:**
- ✅ Deploy via Git
- ✅ R$ 5 grátis/mês
- ✅ PostgreSQL gratuito

---

## ✅ **Checklist de Deploy**

Antes de considerar pronto:

- [ ] Deploy feito com sucesso
- [ ] Variáveis de ambiente configuradas
- [ ] Site acessível via HTTPS
- [ ] Webhook configurado na LastLink
- [ ] Webhook testado (botão "Testar")
- [ ] Compra de teste realizada
- [ ] Email recebido com sucesso
- [ ] Link do email funciona
- [ ] Cliente acessa área de membros
- [ ] (Opcional) Domínio próprio configurado

---

## 🚀 **Próximo Passo**

**Faça o deploy AGORA!**

```bash
cd C:\Users\Lucas\Documents\hypnozio-mvp
npm install -g vercel
vercel login
vercel
```

**Em 10 minutos você estará no ar!** 🎉

---

**Depois do deploy, volte aqui e continue o guia para configurar o webhook na LastLink!**
