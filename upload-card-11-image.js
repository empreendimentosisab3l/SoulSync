// Script para fazer upload da imagem do Card 11 (BMI Summary) para o Cloudinary
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

async function uploadCard11Image() {
  try {
    console.log('🚀 Iniciando upload da imagem do Card 11...\n');

    // Path da imagem a ser enviada
    const imagePath = path.join(__dirname, 'public', 'images', 'quiz-v2', 'plus-sized-v2.webp');

    if (!fs.existsSync(imagePath)) {
      console.error('❌ Imagem não encontrada em:', imagePath);
      console.log('\nPor favor, salve a imagem em: public/images/quiz-v2/plus-sized-v2.webp');
      process.exit(1);
    }

    console.log('📤 Fazendo upload para Cloudinary...');

    const result = await cloudinary.uploader.upload(imagePath, {
      resource_type: 'image',
      folder: 'soulsync/quiz-v2',
      public_id: 'card-11-plus-sized-v2',
      use_filename: false,
      unique_filename: false,
      overwrite: true,
      format: 'webp'
    });

    console.log('\n✅ Upload completo!');
    console.log('📋 URL da imagem:\n');
    console.log(result.secure_url);
    console.log('\n');

    // Atualizar o arquivo cloudinary-urls.json
    const urlsPath = path.join(__dirname, 'cloudinary-urls.json');
    let existingUrls = [];

    if (fs.existsSync(urlsPath)) {
      existingUrls = JSON.parse(fs.readFileSync(urlsPath, 'utf-8'));
    }

    // Adicionar nova URL
    existingUrls.push({
      originalPath: 'public/images/quiz-v2/plus-sized-v2.webp',
      cloudinaryUrl: result.secure_url,
      filename: 'plus-sized-v2.webp',
      folder: 'quiz-v2',
      type: 'quiz-v2-card',
      cardId: 11
    });

    fs.writeFileSync(urlsPath, JSON.stringify(existingUrls, null, 2));

    console.log('✅ URL salva em cloudinary-urls.json');
    console.log('\nCopie esta URL e adicione no Card 11 do arquivo lib/quizDataV2.ts:');
    console.log(`image: "${result.secure_url}"`);

  } catch (error) {
    console.error('❌ Erro ao fazer upload:', error.message);
    process.exit(1);
  }
}

uploadCard11Image();
