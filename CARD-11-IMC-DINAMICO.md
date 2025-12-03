# Card 11 - Sistema Dinâmico de IMC

## Resumo das Alterações

O Card 11 (BMI Summary) agora exibe **imagens e mensagens diferentes** baseadas no resultado do IMC do usuário.

## Funcionalidades Implementadas:

### 1. Imagens Dinâmicas por Categoria de IMC

#### IMC Normal/Saudável (18.5 - 24.9)
- **Imagem**: `mid-sized.webp` (corpo fitness/saudável)
- **URL**: https://res.cloudinary.com/dw1p11dgq/image/upload/v1764703550/soulsync/quiz-v2/card-11-mid-sized-healthy.webp
- **Mensagem**: Card verde com texto motivacional

#### IMC Sobrepeso/Alto (≥ 25)
- **Imagem**: `plus-sized-v2.webp` (corpo plus size)
- **URL**: https://res.cloudinary.com/dw1p11dgq/image/upload/v1764703106/soulsync/quiz-v2/card-11-plus-sized-v2.webp
- **Mensagem**: Card laranja com alerta de riscos

#### IMC Abaixo do Peso (< 18.5)
- **Imagem**: `mid-sized.webp` (mesma do saudável)
- **URL**: https://res.cloudinary.com/dw1p11dgq/image/upload/v1764703550/soulsync/quiz-v2/card-11-mid-sized-healthy.webp
- **Mensagem**: Sem card especial

### 2. Mensagens Personalizadas

#### 🟢 IMC Saudável (18.5-24.9)
```
┌─────────────────────────────────────┐
│ ✓ IMC saudável                      │
│                                     │
│ Uma excelente base para começar a   │
│ definir e alcançar o seu corpo      │
│ ideal.                              │
└─────────────────────────────────────┘
```
- Background: Verde claro (`bg-green-50`)
- Borda: Verde (`border-green-100`)
- Ícone: Check verde

#### 🟠 IMC Não Saudável (≥ 25)
```
┌─────────────────────────────────────┐
│ ⚠ Riscos de um IMC não saudável:   │
│                                     │
│ Hipertensão, aumento do risco de    │
│ ataque cardíaco, derrame, diabetes  │
│ tipo 2, dor crônica nas costas e    │
│ nas articulações.                   │
│                                     │
│ Fonte: Associação Americana do      │
│ Coração (AHA)                       │
└─────────────────────────────────────┘
```
- Background: Laranja claro (`bg-orange-50`)
- Borda: Laranja (`border-orange-100`)
- Ícone: Alerta laranja

## Lógica de Exibição

### Categorias de IMC:

```typescript
if (bmi < 18.5) {
  // ABAIXO DO PESO
  categoria: "ABAIXO DO PESO"
  cor: azul
  posição_slider: 15%
  imagem: mid-sized (saudável)
  mensagem: nenhuma
}

else if (bmi < 25) {
  // NORMAL/SAUDÁVEL ⭐
  categoria: "NORMAL"
  cor: verde
  posição_slider: 40%
  imagem: mid-sized (saudável)
  mensagem: "IMC saudável" (verde)
}

else if (bmi < 30) {
  // SOBREPESO
  categoria: "SOBREPESO"
  cor: amarelo
  posição_slider: 65%
  imagem: plus-sized
  mensagem: "Riscos" (laranja)
}

else {
  // ALTO
  categoria: "ALTO"
  cor: vermelho
  posição_slider: 90%
  imagem: plus-sized
  mensagem: "Riscos" (laranja)
}
```

## Arquivos Modificados:

### 1. `components/QuizV2SummaryBMI.tsx`
- Adicionadas variáveis `bmiImage` e `isHealthy`
- Lógica condicional para selecionar imagem baseada no IMC
- Novo card verde para IMC saudável
- Card laranja para IMC alto/sobrepeso (existente)
- Imagem dinâmica usando a variável `bmiImage`

### 2. `cloudinary-urls.json`
- Adicionadas 2 novas entradas:
  - `mid-sized.webp` (IMC saudável)
  - `plus-sized-v2.webp` (IMC alto)

## Estrutura de Dados:

```json
{
  "originalPath": "public/images/quiz-v2/mid-sized.webp",
  "cloudinaryUrl": "https://res.cloudinary.com/dw1p11dgq/image/upload/v1764703550/soulsync/quiz-v2/card-11-mid-sized-healthy.webp",
  "filename": "mid-sized.webp",
  "folder": "quiz-v2",
  "type": "quiz-v2-card",
  "cardId": 11,
  "bmiCategory": "normal"
}
```

## Como Testar:

### Teste 1: IMC Normal (exemplo)
```
Altura: 170 cm
Peso: 65 kg
IMC = 22.5 (NORMAL)

Resultado esperado:
✅ Imagem mid-sized (corpo fitness)
✅ Card verde: "IMC saudável"
✅ Texto: "Uma excelente base para começar..."
```

### Teste 2: IMC Sobrepeso (exemplo)
```
Altura: 170 cm
Peso: 80 kg
IMC = 27.7 (SOBREPESO)

Resultado esperado:
✅ Imagem plus-sized
✅ Card laranja: "Riscos de um IMC não saudável"
✅ Texto com riscos de saúde
```

### Teste 3: IMC Alto (exemplo)
```
Altura: 165 cm
Peso: 90 kg
IMC = 33.1 (ALTO)

Resultado esperado:
✅ Imagem plus-sized
✅ Card laranja: "Riscos de um IMC não saudável"
✅ Posição do slider em 90%
```

## Benefícios da Implementação:

1. **Personalização**: Cada usuário vê conteúdo relevante ao seu estado
2. **Motivação**: IMC saudável recebe mensagem positiva
3. **Conscientização**: IMC alto recebe alerta de riscos
4. **Visual Apropriado**: Imagens representam realidade do usuário
5. **Empatia**: Usuários se identificam melhor com as imagens

## Próximas Melhorias Possíveis:

- [ ] Adicionar mais variações de imagens (diferentes etnias, idades)
- [ ] Criar mensagens específicas para IMC abaixo do peso
- [ ] Adicionar animação na transição das imagens
- [ ] Personalizar ainda mais baseado no gênero selecionado
- [ ] Adicionar dicas personalizadas por categoria de IMC

## Scripts Criados:

- `upload-card-11-image.js` - Upload da imagem plus-sized
- `upload-healthy-image.js` - Upload da imagem mid-sized

---

**Data da implementação**: 2025-12-02
**Desenvolvido por**: Claude Code
**Status**: ✅ Completo e funcional
