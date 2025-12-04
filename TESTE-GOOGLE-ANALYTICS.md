# 🔍 Guia Completo de Teste - Google Analytics

## ⚠️ IMPORTANTE: Reinicie o Servidor!

Antes de testar, você DEVE reiniciar o servidor de desenvolvimento:

```bash
# Pare o servidor (Ctrl+C se estiver rodando)
# Depois execute:
npm run dev
```

## 📋 Teste 1: Página HTML Simples (MAIS FÁCIL)

Este é o teste mais direto para verificar se o ID do Google Analytics está funcionando:

1. **Inicie o servidor:**
   ```bash
   npm run dev
   ```

2. **Acesse no navegador:**
   ```
   http://localhost:3000/teste-ga.html
   ```

3. **Abra o Console (F12)** e verifique se aparece:
   ```
   ✅ Google Analytics carregado com sucesso!
   ```

4. **Clique no botão "Testar Evento"**

5. **Vá para Google Analytics:**
   - Acesse: https://analytics.google.com
   - Clique em "Relatórios" → "Tempo real"
   - Você deve ver 1 usuário ativo

### ✅ Se funcionar neste teste:
O problema está na integração com Next.js, não no ID do GA.

### ❌ Se NÃO funcionar neste teste:
O problema pode ser:
- ID do Google Analytics incorreto
- Propriedade do GA ainda não está ativa
- Bloqueador de anúncios ativo

---

## 📋 Teste 2: Verificar no Console do Navegador

1. **Acesse qualquer página do projeto:**
   ```
   http://localhost:3000/quiz-v2
   ```

2. **Abra o Console (F12)**

3. **Digite e execute os seguintes comandos:**

```javascript
// 1. Verificar se gtag existe
console.log('gtag existe?', typeof window.gtag);
// Deve retornar: "function"

// 2. Verificar dataLayer
console.log('dataLayer:', window.dataLayer);
// Deve retornar: um array com objetos

// 3. Enviar evento de teste
gtag('event', 'teste_manual', {
  event_category: 'teste',
  event_label: 'Teste Manual'
});
console.log('Evento enviado!');
```

### ✅ Resultados Esperados:
- `typeof window.gtag` = `"function"`
- `window.dataLayer` = Array com objetos
- Nenhum erro no console

---

## 📋 Teste 3: Verificar Network (Requisições)

1. **Abra DevTools (F12) → aba Network**

2. **Filtre por "collect"** (digite "collect" no campo de filtro)

3. **Navegue pelo quiz**

4. **Você deve ver requisições para:**
   - `https://www.google-analytics.com/g/collect?...`
   - Várias requisições com parâmetros como `en=page_view`, `en=quiz_start`, etc.

### ✅ Se aparecer requisições:
O Google Analytics está funcionando! O GA4 pode levar alguns minutos para processar.

---

## 📋 Teste 4: Usar Extensão do Chrome

### Opção 1: Tag Assistant (Google)
1. Instale: https://chrome.google.com/webstore/detail/tag-assistant-companion/jmekfmbnaedfebfnmakmokmlfpblbfdm
2. Abra a extensão
3. Clique em "Enable" e recarregue a página
4. Deve mostrar a tag do Google Analytics sendo disparada

### Opção 2: GA Debugger
1. Instale: https://chrome.google.com/webstore/detail/google-analytics-debugger/jnkmfdileelhofjcijamephohjechhna
2. Ative a extensão
3. Abra o Console (F12)
4. Deve aparecer logs detalhados do GA

---

## 🚨 Problemas Comuns e Soluções

### Problema 1: "A tag não foi detectada"

**Possíveis causas:**
- ✅ Servidor não foi reiniciado após as mudanças
- ✅ Cache do navegador (pressione Ctrl+Shift+R para hard reload)
- ✅ Bloqueador de anúncios ativo (desative ou adicione exceção para localhost)
- ✅ ID do GA incorreto

**Solução:**
```bash
# 1. Pare o servidor (Ctrl+C)
# 2. Limpe o cache do Next.js
rm -rf .next

# 3. Reinicie
npm run dev
```

### Problema 2: Console mostra "gtag is not defined"

**Solução:**
- O script não carregou ainda. Aguarde 2-3 segundos após a página carregar
- Verifique se não há erro 404 para o script do gtag.js na aba Network

### Problema 3: Bloqueadores de Anúncios

**Extensões que bloqueiam GA:**
- AdBlock
- uBlock Origin
- Privacy Badger
- Brave Browser (proteção nativa)

**Solução:**
- Desative temporariamente para teste
- Ou adicione `localhost` nas exceções

---

## 🔧 Verificação Direta no Google Analytics

### Configuração da Propriedade:

1. **Acesse:** https://analytics.google.com
2. **Vá em:** Admin (ícone de engrenagem)
3. **Fluxos de Dados:** Clique no seu fluxo de dados
4. **Verificar:**
   - Status: Deve estar "Coletando dados"
   - ID do Fluxo: Deve ser `G-ZRBSTXNX5F`

### Teste de Conexão:

1. Na página de Fluxos de Dados
2. Clique em "Ver instruções da tag"
3. Role até "Testar a tag"
4. Abra seu site em outra aba
5. A página de teste deve mostrar que detectou a tag

---

## ⏱️ Tempo de Processamento

- **Tempo Real:** Instantâneo (segundos)
- **Relatórios Padrão:** 24-48 horas
- **Primeira Detecção:** Pode levar 5-30 minutos na primeira vez

---

## ✅ Checklist Final

Execute este checklist passo a passo:

- [ ] Servidor reiniciado com `npm run dev`
- [ ] Cache do navegador limpo (Ctrl+Shift+R)
- [ ] Bloqueador de anúncios desativado
- [ ] Acessou `http://localhost:3000/teste-ga.html`
- [ ] Console mostra "Google Analytics carregado com sucesso"
- [ ] Clicou no botão de teste
- [ ] Verificou aba Network (filtrando por "collect")
- [ ] Vê requisições para google-analytics.com
- [ ] Acessou Google Analytics → Tempo Real
- [ ] Vê 1 usuário ativo

---

## 📞 Se ainda não funcionar

Me envie as seguintes informações:

1. **Screenshot do Console (F12)** mostrando erros
2. **Screenshot da aba Network** (filtrado por "collect")
3. **Resposta dos comandos:**
   ```javascript
   console.log(typeof window.gtag);
   console.log(window.dataLayer);
   ```
4. **Está usando bloqueador de anúncios?** Qual?
5. **O teste em `/teste-ga.html` funcionou?**

Assim consigo identificar exatamente onde está o problema!
