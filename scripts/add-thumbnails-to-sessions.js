const fs = require('fs');
const path = require('path');

// Carregar mapeamento de imagens
const imageMapping = require('../data/session-images-mapping.json');

// Carregar cloudinary URLs
const cloudinaryUrlsPath = path.join(__dirname, '..', 'cloudinary-urls.json');
const cloudinaryUrls = JSON.parse(fs.readFileSync(cloudinaryUrlsPath, 'utf8'));

// Função para normalizar texto (remover acentos e converter para minúsculas)
function normalizeText(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, '');
}

// Função para encontrar a melhor imagem para uma sessão
function findImageForSession(sessionTitle, sessionFilename) {
  const normalizedTitle = normalizeText(sessionTitle);
  const normalizedFilename = normalizeText(sessionFilename);

  console.log(`\n🔍 Procurando imagem para: "${sessionTitle}"`);

  for (const [imageName, imageData] of Object.entries(imageMapping)) {
    const { url, keywords } = imageData;

    for (const keyword of keywords) {
      const normalizedKeyword = normalizeText(keyword);

      if (normalizedTitle.includes(normalizedKeyword) || normalizedFilename.includes(normalizedKeyword)) {
        console.log(`✅ Match encontrado! Imagem: ${imageName} (keyword: "${keyword}")`);
        return url;
      }
    }
  }

  console.log(`⚠️  Nenhuma imagem encontrada para "${sessionTitle}"`);
  return null;
}

// Processar URLs e adicionar thumbnails
let updatedCount = 0;
const updatedUrls = cloudinaryUrls.map(item => {
  // Apenas processar arquivos de áudio (sessões)
  if (!item.cloudinaryUrl.includes('.mp3') && !item.cloudinaryUrl.includes('.MP3')) {
    return item;
  }

  // Extrair título da sessão do filename
  const sessionTitle = item.filename.replace(/\.(mp3|MP3)$/, '').replace(/_/g, ' ');

  // Procurar imagem correspondente
  const thumbnailUrl = findImageForSession(sessionTitle, item.filename);

  if (thumbnailUrl) {
    updatedCount++;
    return {
      ...item,
      thumbnail: thumbnailUrl
    };
  }

  return item;
});

// Salvar arquivo atualizado
fs.writeFileSync(cloudinaryUrlsPath, JSON.stringify(updatedUrls, null, 2));

console.log(`\n✅ Processo concluído!`);
console.log(`📊 Total de sessões atualizadas com thumbnails: ${updatedCount}`);
console.log(`📁 Arquivo atualizado: ${cloudinaryUrlsPath}`);
