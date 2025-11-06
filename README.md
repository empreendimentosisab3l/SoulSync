# 🌟 SoulSync - Plataforma de Hipnoterapia

**Reprograme sua mente. Renasça em leveza.**

---

## 📖 Sobre o Projeto

SoulSync é uma plataforma completa de hipnoterapia para emagrecimento que combina:
- Quiz personalizado de 21 perguntas
- Sistema de checkout integrado com LastLink
- Área de membros com 8 sessões de áudio
- Controle de acesso via tokens mágicos

---

## 🚀 Funcionalidades

### ✅ Funil Completo
1. **Landing Page** - Hero com CTA principal
2. **Quiz Interativo** - 21 perguntas personalizadas
3. **Resultados** - Análise personalizada e planos
4. **Checkout** - Integração com LastLink
5. **Área de Membros** - 8 sessões de hipnoterapia

### ✅ Sistema de Acesso
- Tokens mágicos (link único por cliente)
- Validação automática
- Persistência em localStorage
- Telas de loading e acesso negado

### ✅ Área de Membros
- 8 sessões de áudio HTML5
- Player completo com controles
- Filtros por categoria
- Rastreamento de progresso
- Dashboard de estatísticas

---

## 💻 Tecnologias

- **Next.js 15** - Framework React
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **LastLink** - Processamento de pagamentos
- **Webhooks** - Automação de acesso

---

## 🎨 Design

### Paleta de Cores SoulSync
- `soul-purple`: #5B4B8A - Roxo principal
- `soul-lavender`: #9B8BC4 - Lavanda suave
- `soul-rose`: #D4A5A5 - Rosa suave
- `soul-peach`: #E8C4B8 - Pêssego
- `soul-cream`: #F5F3ED - Creme (backgrounds)
- `soul-sand`: #E8E4DC - Areia clara

---

## 📂 Estrutura do Projeto

```
hypnozio-mvp/
├── app/
│   ├── page.tsx                          # Landing page
│   ├── quiz/                             # Quiz completo
│   │   ├── [step]/                       # 21 etapas dinâmicas
│   │   ├── email/                        # Captura de email
│   │   ├── loading/                      # Tela de loading
│   │   └── result/                       # Resultados e planos
│   ├── membros/                          # Área de membros protegida
│   └── api/
│       ├── webhook/lastlink/             # Recebe webhooks
│       └── validate-token/               # Valida tokens
│
├── components/
│   ├── AudioPlayer.tsx                   # Player de áudio
│   ├── ProgressBar.tsx                   # Barra de progresso
│   ├── QuizChoice.tsx                    # Seleção única
│   ├── QuizMultiple.tsx                  # Seleção múltipla
│   ├── QuizRange.tsx                     # Slider
│   ├── QuizInfo.tsx                      # Telas informativas
│   └── QuizMeasurements.tsx              # Formulário de medidas
│
├── lib/
│   ├── quizData.ts                       # 21 perguntas
│   └── auth/
│       └── validateToken.ts              # Validação de tokens
│
├── data/
│   └── access-tokens.json                # Tokens de acesso (criado automaticamente)
│
└── public/
    └── audios/                           # Áudios de hipnoterapia
        ├── sessao-1.mp3
        ├── sessao-2.mp3
        └── ...
```

---

## ⚙️ Como Executar

### 1. Instalar Dependências

```bash
npm install
```

### 2. Configurar Variáveis de Ambiente

Copie o arquivo de exemplo:
```bash
cp .env.example .env.local
```

Edite `.env.local` e adicione sua API key do Resend:
```bash
RESEND_API_KEY=re_sua_api_key_aqui
NEXT_PUBLIC_BASE_URL=http://localhost:3002
```

📧 **Para obter API key gratuita**: Veja `CONFIGURAR-EMAIL.md`

### 3. Iniciar Servidor

```bash
npm run dev
```

### 4. Acessar

```
http://localhost:3002
```

---

## 🔗 Integração com LastLink

### ✅ Sistema de Envio Automático de Emails

**Agora 100% automatizado!** Cliente compra → Recebe email automaticamente

### Configuração Rápida

1. **Configure API do Resend** (emails automáticos)
   - Crie conta em: https://resend.com (GRÁTIS)
   - Obtenha API key
   - Configure no `.env.local`
   - 📧 Ver guia completo: `CONFIGURAR-EMAIL.md`

2. **Configure o Produto** na LastLink
   - Nome: SoulSync
   - Planos: Trimestral, Semestral, Anual

3. **Configure o Webhook**
   - URL: `https://seu-dominio.com/api/webhook/lastlink`
   - Evento: `Purchase_Order_Confirmed`

4. **Teste a Integração**
   - Use webhook.site para debug
   - Execute: `test-webhook.bat` (Windows)
   - Receba email automaticamente!

### Documentação Completa

📄 `CONFIGURAR-EMAIL.md` - **Como configurar envio automático de emails**
📄 `INTEGRACAO-LASTLINK.md` - Guia detalhado de integração
📄 `TESTE-INTEGRACAO.md` - Como testar o sistema

---

## 🧪 Testar o Sistema (GRÁTIS!)

### 🎁 Teste Rápido (Mais Fácil!)

1. Acesse `http://localhost:3003`
2. Complete o quiz (21 perguntas)
3. Na página de planos, clique em **"🎁 Teste Grátis por 7 Dias"**
4. Você será levado para a área de membros!

### 🎟️ Criar Tokens de Teste

**Forma fácil:**
```bash
# Dê duplo clique no arquivo:
criar-acesso-teste.bat
```

**Ou via comando:**
```bash
node criar-token-teste.js "Nome do Cliente" "email@exemplo.com"
```

### 📧 Simular Webhook (Com Email)

### Teste com Webhook (Real)

```bash
curl -X POST http://localhost:3000/api/webhook/lastlink \
  -H "Content-Type: application/json" \
  -d '{
    "event_type": "Purchase_Order_Confirmed",
    "customer": {"email": "teste@exemplo.com", "name": "Teste"},
    "product": {"name": "SoulSync - Anual"}
  }'
```

Copie o link gerado no console e acesse!

---

## 📊 Fluxo de Compra

```
Cliente → Quiz (21 etapas) → Resultados → Checkout LastLink
                                              ↓
                                        Pagamento OK
                                              ↓
                                    Webhook para seu servidor
                                              ↓
                                    Token gerado e salvo
                                              ↓
                              [Manual] Enviar email com link
                                              ↓
                                Cliente clica no link mágico
                                              ↓
                                    Token validado e salvo
                                              ↓
                                    Acesso à área de membros!
```

---

## 🔒 Segurança

- ✅ Tokens únicos e aleatórios
- ✅ Validação server-side
- ✅ Persistência segura em localStorage
- ✅ Telas de acesso negado
- ⚠️ **Futuro**: Adicionar expiração de tokens
- ⚠️ **Futuro**: Criptografia JWT

---

## 🚀 Deploy (Produção)

### Opções Gratuitas

1. **Vercel** (Recomendado)
   ```bash
   npm install -g vercel
   vercel --prod
   ```

2. **Netlify**
   ```bash
   npx netlify-cli deploy --prod
   ```

3. **Railway**
   - Conecte seu repositório GitHub
   - Deploy automático

### Após Deploy

1. Configure webhook na LastLink com sua URL
2. Teste com compra real
3. Configure envio de emails (Resend, SendGrid)

---

## 📧 Envio de Emails (Opcional)

Para automação completa, integre com:
- **Resend** - 3000 emails/mês grátis
- **SendGrid** - 100 emails/dia grátis
- **Mailgun** - 5000 emails/mês grátis

Código exemplo em `INTEGRACAO-LASTLINK.md`

---

## 📈 Próximas Melhorias

- [ ] Envio automático de emails
- [ ] Migrar para banco de dados
- [ ] Dashboard de administração
- [ ] Analytics de conversão
- [ ] Sistema de renovação automática
- [ ] Notificações push
- [ ] App mobile

---

## 📝 Scripts Disponíveis

```bash
npm run dev        # Servidor de desenvolvimento
npm run build      # Build para produção
npm start          # Servidor de produção
npm run lint       # Verificar código
```

---

## 🆘 Suporte

### Arquivos de Documentação

- `README.md` - Este arquivo
- `TESTAR-GRATIS.md` - **Como testar sem gastar nada** 🆓 ⭐
- `CONFIGURAR-EMAIL.md` - **Guia de envio automático de emails** 📧
- `INTEGRACAO-LASTLINK.md` - Guia completo de integração
- `TESTE-INTEGRACAO.md` - Como testar o sistema
- `FLUXO-COMPLETO.md` - Visão geral do sistema
- `COMO-ADICIONAR-AUDIOS.md` - Como adicionar áudios

### Problemas Comuns

**Acesso negado mesmo com token válido:**
- Limpe o localStorage
- Verifique `data/access-tokens.json`
- Confirme que `isActive: true`

**Webhook não chega:**
- Use webhook.site para debug
- Verifique logs da LastLink
- Confirme URL pública

**Player de áudio não funciona:**
- Adicione arquivos MP3 em `public/audios/`
- Nomeie como `sessao-1.mp3` até `sessao-8.mp3`

---

## 📄 Licença

Este é um projeto privado para uso comercial.

---

## 👨‍💻 Desenvolvido com

- ❤️ Next.js
- 🎨 Tailwind CSS
- 🎧 HTML5 Audio API
- 🔗 LastLink Webhooks

---

**SoulSync** - Transforme vidas através da hipnoterapia 🌟
