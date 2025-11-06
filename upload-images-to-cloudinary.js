// Script para fazer upload das imagens para o Cloudinary
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

// Configurar Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

async function uploadFile(filePath, folder) {
  try {
    console.log(`📤 Uploading: ${filePath}`);

    // Normalizar o caminho da pasta para usar apenas /
    const normalizedFolder = folder.replace(/\\/g, '/');

    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: 'auto',
      folder: `soulsync/${normalizedFolder}`,
      use_filename: true,
      unique_filename: false,
      overwrite: true
    });

    console.log(`✅ Uploaded: ${result.secure_url}`);
    return result.secure_url;
  } catch (error) {
    console.error(`❌ Error uploading ${filePath}:`, error.message);
    return null;
  }
}

async function uploadDirectory(dirPath, basePath = '') {
  const urls = [];
  const items = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const item of items) {
    const fullPath = path.join(dirPath, item.name);

    if (item.isDirectory()) {
      // Recursivo para subpastas
      const subUrls = await uploadDirectory(fullPath, path.join(basePath, item.name));
      urls.push(...subUrls);
    } else if (item.isFile()) {
      // Fazer upload de imagens
      const ext = path.extname(item.name).toLowerCase();
      const imageExts = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];

      if (imageExts.includes(ext)) {
        const folder = basePath || 'root';
        const url = await uploadFile(fullPath, folder);

        if (url) {
          urls.push({
            originalPath: fullPath.replace(/\\/g, '/'),
            cloudinaryUrl: url,
            filename: item.name,
            folder: folder
          });
        }

        // Pequeno delay para não sobrecarregar a API
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
  }

  return urls;
}

async function main() {
  console.log('🚀 Iniciando upload de imagens para Cloudinary...\n');

  const imagePaths = [
    path.join(__dirname, 'public', 'animations', 'images'),
    path.join(__dirname, 'public', 'images')
  ];

  let allUrls = [];

  for (const imagePath of imagePaths) {
    if (fs.existsSync(imagePath)) {
      console.log(`📁 Processando: ${imagePath}\n`);
      const urls = await uploadDirectory(imagePath);
      allUrls.push(...urls);
    } else {
      console.log(`⚠️ Pasta não encontrada: ${imagePath}`);
    }
  }

  // Carregar URLs existentes de áudios
  const audioUrlsPath = path.join(__dirname, 'cloudinary-urls.json');
  let existingUrls = [];

  if (fs.existsSync(audioUrlsPath)) {
    existingUrls = JSON.parse(fs.readFileSync(audioUrlsPath, 'utf-8'));
  }

  // Combinar URLs de áudios e imagens
  const combinedUrls = [...existingUrls, ...allUrls];

  // Salvar mapeamento combinado
  const mappingPath = path.join(__dirname, 'cloudinary-urls.json');
  fs.writeFileSync(mappingPath, JSON.stringify(combinedUrls, null, 2));

  console.log(`\n✅ Upload completo! ${allUrls.length} imagens enviadas.`);
  console.log(`📝 Total de ${combinedUrls.length} arquivos no mapeamento.`);
  console.log(`📝 Mapeamento salvo em: ${mappingPath}`);
}

main().catch(console.error);
