// Script para fazer upload das imagens do Quiz V2 para o Cloudinary
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

async function uploadBodyPartImage(filePath, imageName) {
  try {
    console.log(`📤 Uploading: ${imageName}`);

    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: 'image',
      folder: 'hypnozio/quiz/body-parts',
      public_id: imageName.replace('.png', ''),
      use_filename: false,
      unique_filename: false,
      overwrite: true
    });

    console.log(`✅ Uploaded: ${result.secure_url}`);
    return {
      name: imageName.replace('.png', ''),
      url: result.secure_url
    };
  } catch (error) {
    console.error(`❌ Error uploading ${imageName}:`, error.message);
    return null;
  }
}

async function main() {
  console.log('🚀 Iniciando upload de imagens do Quiz V2 para Cloudinary...\n');

  const bodyPartsPath = path.join(__dirname, 'public', 'images', 'body-parts');

  if (!fs.existsSync(bodyPartsPath)) {
    console.error('❌ Pasta de imagens não encontrada:', bodyPartsPath);
    process.exit(1);
  }

  const images = fs.readdirSync(bodyPartsPath).filter(file => file.endsWith('.png'));

  console.log(`📁 Encontradas ${images.length} imagens:\n`);
  images.forEach(img => console.log(`   - ${img}`));
  console.log('');

  const uploadedUrls = [];

  for (const imageName of images) {
    const imagePath = path.join(bodyPartsPath, imageName);
    const result = await uploadBodyPartImage(imagePath, imageName);

    if (result) {
      uploadedUrls.push(result);
    }

    // Pequeno delay para não sobrecarregar a API
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  // Carregar URLs existentes
  const urlsPath = path.join(__dirname, 'cloudinary-urls.json');
  let existingUrls = [];

  if (fs.existsSync(urlsPath)) {
    existingUrls = JSON.parse(fs.readFileSync(urlsPath, 'utf-8'));
  }

  // Adicionar novas URLs do quiz
  const combinedUrls = [
    ...existingUrls,
    ...uploadedUrls.map(item => ({
      originalPath: `public/images/body-parts/${item.name}.png`,
      cloudinaryUrl: item.url,
      filename: `${item.name}.png`,
      folder: 'quiz/body-parts',
      type: 'quiz-v2-body-part'
    }))
  ];

  // Salvar mapeamento
  fs.writeFileSync(urlsPath, JSON.stringify(combinedUrls, null, 2));

  console.log(`\n✅ Upload completo! ${uploadedUrls.length} imagens enviadas.`);
  console.log(`📝 URLs salvas em: ${urlsPath}\n`);

  // Exibir URLs para copiar
  console.log('📋 URLs para usar no componente:\n');
  uploadedUrls.forEach(item => {
    console.log(`${item.name}: '${item.url}'`);
  });
}

main().catch(console.error);
