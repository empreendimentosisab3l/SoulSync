# Como Adicionar Áudios de Hipnoterapia

Este guia explica como adicionar seus arquivos de áudio ao aplicativo Hypnozio Brasil.

## 📁 Localização dos Arquivos

Os arquivos de áudio devem ser colocados na pasta:
```
hypnozio-mvp/public/audios/
```

## 📝 Nomenclatura dos Arquivos

Os arquivos devem seguir exatamente este padrão:

| Arquivo | Título da Sessão |
|---------|------------------|
| `sessao-1.mp3` | Introdução à Hipnoterapia para Emagrecimento |
| `sessao-2.mp3` | Reprogramando Sua Relação com a Comida |
| `sessao-3.mp3` | Liberando Bloqueios Emocionais |
| `sessao-4.mp3` | Aumentando Sua Motivação e Disciplina |
| `sessao-5.mp3` | Controle da Ansiedade e Estresse |
| `sessao-6.mp3` | Visualização do Seu Corpo Ideal |
| `sessao-7.mp3` | Sono Profundo e Regenerador |
| `sessao-8.mp3` | Autoestima e Amor Próprio |

## 🎵 Formatos Suportados

O player HTML5 suporta os seguintes formatos:
- **MP3** (recomendado - compatibilidade universal)
- **WAV** (maior qualidade, arquivos maiores)
- **M4A** (boa qualidade, arquivos menores)
- **OGG** (boa compatibilidade em navegadores modernos)

## 📋 Passo a Passo

1. **Prepare seus arquivos de áudio**
   - Certifique-se de que os áudios estão no formato MP3
   - Recomendamos uma qualidade de 128-192 kbps para melhor equilíbrio entre qualidade e tamanho

2. **Renomeie os arquivos**
   ```
   sessao-1.mp3
   sessao-2.mp3
   sessao-3.mp3
   ...e assim por diante
   ```

3. **Copie os arquivos para a pasta correta**
   - Navegue até: `C:\Users\Lucas\Documents\hypnozio-mvp\public\audios\`
   - Cole todos os 8 arquivos de áudio nesta pasta

4. **Verifique a estrutura**
   ```
   hypnozio-mvp/
   └── public/
       └── audios/
           ├── sessao-1.mp3
           ├── sessao-2.mp3
           ├── sessao-3.mp3
           ├── sessao-4.mp3
           ├── sessao-5.mp3
           ├── sessao-6.mp3
           ├── sessao-7.mp3
           └── sessao-8.mp3
   ```

5. **Teste o player**
   - Acesse http://localhost:3001/membros
   - Clique em qualquer sessão
   - O player deve abrir e tocar o áudio automaticamente

## ⚠️ Solução de Problemas

### Áudio não carrega
- Verifique se o nome do arquivo está exatamente como especificado
- Certifique-se de que o arquivo está na pasta `public/audios/`
- Verifique se o formato do arquivo é suportado

### Player não aparece
- Abra o console do navegador (F12) para ver erros
- Verifique se o caminho do arquivo está correto

### Erro 404 ao tentar tocar
- O arquivo não foi encontrado. Confirme o nome e localização

## 🎨 Onde Conseguir Áudios?

Se você ainda não tem os áudios, algumas opções:

### Opção 1: Gravar Profissionalmente
- Contratar um hipnoterapeuta certificado
- Gravar em estúdio com boa qualidade de áudio
- Editar e masterizar os áudios

### Opção 2: Text-to-Speech (Para Teste)
- Google Cloud Text-to-Speech
- Amazon Polly
- ElevenLabs (vozes muito realistas)

### Opção 3: Plataformas de Freelancers
- Fiverr
- Upwork
- 99Freelas (Brasil)

## 🔧 Modificando as Sessões

Se você quiser adicionar mais sessões ou modificar as existentes:

1. Abra o arquivo: `app/membros/page.tsx`
2. Localize o array `audioSessions`
3. Adicione ou modifique as sessões conforme necessário
4. Adicione os arquivos correspondentes na pasta `public/audios/`

Exemplo:
```typescript
{
  id: 9,
  title: 'Nova Sessão',
  description: 'Descrição da nova sessão',
  duration: '25 min',
  category: 'motivacao',
  day: 9,
  audioUrl: '/audios/sessao-9.mp3',
}
```

## 📞 Precisa de Ajuda?

Se tiver dúvidas ou problemas, entre em contato ou abra uma issue no repositório.
