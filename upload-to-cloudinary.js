// Script para fazer upload dos áudios e imagens para o Cloudinary
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

    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: 'auto', // Detecta automaticamente (audio, image, etc)
      folder: `soulsync/${folder}`,
      use_filename: true,
      unique_filename: false
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
      // Fazer upload de arquivos de áudio e imagem
      const ext = path.extname(item.name).toLowerCase();
      const audioExts = ['.mp3', '.wav', '.m4a'];
      const imageExts = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];

      if (audioExts.includes(ext) || imageExts.includes(ext)) {
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
  console.log('🚀 Iniciando upload para Cloudinary...\n');

  const audiosPath = path.join(__dirname, 'public', 'audios');

  if (!fs.existsSync(audiosPath)) {
    console.error('❌ Pasta public/audios não encontrada!');
    process.exit(1);
  }

  const urls = await uploadDirectory(audiosPath);

  // Salvar mapeamento de URLs em arquivo JSON
  const mappingPath = path.join(__dirname, 'cloudinary-urls.json');
  fs.writeFileSync(mappingPath, JSON.stringify(urls, null, 2));

  console.log(`\n✅ Upload completo! ${urls.length} arquivos enviados.`);
  console.log(`📝 Mapeamento salvo em: ${mappingPath}`);
  console.log('\n💡 Próximos passos:');
  console.log('1. Atualize as URLs dos áudios no código para usar as URLs do Cloudinary');
  console.log('2. Remova a pasta public/audios local');
  console.log('3. Faça commit e push das mudanças');
}

main().catch(console.error);
