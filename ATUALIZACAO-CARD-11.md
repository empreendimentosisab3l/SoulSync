# Atualização do Card 11 - Quiz V2

## Resumo das Alterações

A imagem do Card 11 (BMI Summary) foi substituída pela nova imagem `plus-sized-v2.webp`.

## O que foi feito:

### 1. Upload da Imagem para Cloudinary ✅
- **Arquivo local**: `public/images/quiz-v2/plus-sized-v2.webp`
- **URL Cloudinary**: https://res.cloudinary.com/dw1p11dgq/image/upload/v1764703106/soulsync/quiz-v2/card-11-plus-sized-v2.webp
- **Script utilizado**: `upload-card-11-image.js`

### 2. Atualização do Quiz Data ✅
- **Arquivo**: `lib/quizDataV2.ts`
- **Card modificado**: Card ID 11 (type: "bmi-summary")
- **Mudança**: Adicionada propriedade `image` com a URL do Cloudinary

```typescript
{
  id: 11,
  type: "bmi-summary",
  title: "Seu ponto de partida",
  image: "https://res.cloudinary.com/dw1p11dgq/image/upload/v1764703106/soulsync/quiz-v2/card-11-plus-sized-v2.webp",
  progress: 19
}
```

### 3. Atualização do Componente ✅
- **Arquivo**: `components/QuizV2SummaryBMI.tsx`
- **Mudanças**:
  - Adicionada prop `image?: string` na interface
  - Componente agora usa a prop `image` ou fallback para a imagem anterior

```typescript
<img
  src={image || "https://res.cloudinary.com/dw1p11dgq/image/upload/v1763512245/soulsync/testimonials/review-photo-3.png"}
  alt="Body Type"
  className="w-full h-auto object-cover rounded-xl"
/>
```

### 4. Atualização da Página do Quiz ✅
- **Arquivo**: `app/quiz-v2/[step]/page.tsx`
- **Mudança**: Adicionada passagem da prop `image` do questionData para o componente

```typescript
case 'bmi-summary':
  return (
    <QuizV2SummaryBMI
      height={answers[7] ? parseFloat(answers[7]) : 0}
      weight={answers[8] ? parseFloat(answers[8]) : 0}
      bodyParts={answers[10] || []}
      onContinue={() => handleNext()}
      buttonText={questionData.buttonText}
      image={questionData.image}
    />
  );
```

### 5. Registro no Cloudinary URLs ✅
- **Arquivo**: `cloudinary-urls.json`
- Nova entrada adicionada ao registro de URLs

## Como testar:

1. Execute o servidor de desenvolvimento:
```bash
npm run dev
```

2. Acesse o Quiz V2:
```
http://localhost:3003/quiz-v2/1
```

3. Preencha os cards até chegar ao Card 11
   - Card 7: Altura
   - Card 8: Peso atual
   - Card 9: Peso desejado
   - Card 10: Partes do corpo
   - **Card 11**: BMI Summary (verá a nova imagem)

## Arquivos Criados:

- `upload-card-11-image.js` - Script de upload (pode ser mantido para futuras referências)
- `ATUALIZACAO-CARD-11.md` - Este arquivo de documentação

## Observações:

- A imagem está em formato WebP, otimizado para web
- A imagem tem fallback caso não seja carregada
- O componente é retrocompatível (funciona sem a prop image)
- A URL da imagem está armazenada no Cloudinary de forma permanente

---

**Data da atualização**: 2025-12-02
**Desenvolvido por**: Claude Code
