// Script para fazer upload das imagens dos cursos para o Cloudinary
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

async function uploadCourseImages() {
  console.log('🚀 Iniciando upload de imagens dos cursos...\n');

  const imagesPath = 'C:\\Users\\Lucas\\Downloads\\images';

  const imageFiles = [
    {
      path: path.join(imagesPath, 'Mudando_a_relação_com_a_comida.jpg'),
      publicId: 'soulsync/courses/course-1',
      courseName: 'Mudando a relação com a comida'
    },
    {
      path: path.join(imagesPath, 'Decodificação_da_mentalidade_procrastinadora.jpg'),
      publicId: 'soulsync/courses/course-2',
      courseName: 'Decodificação da mentalidade procrastinadora'
    },
    {
      path: path.join(imagesPath, 'Bem-estar_sexual.jpg'),
      publicId: 'soulsync/courses/course-3',
      courseName: 'Bem-estar sexual'
    }
  ];

  const uploadedUrls = [];

  for (const image of imageFiles) {
    if (!fs.existsSync(image.path)) {
      console.log(`⚠️ Arquivo não encontrado: ${image.path}`);
      continue;
    }

    try {
      console.log(`📤 Uploading: ${image.courseName}`);

      const result = await cloudinary.uploader.upload(image.path, {
        public_id: image.publicId,
        overwrite: true,
        resource_type: 'image'
      });

      console.log(`✅ Uploaded: ${result.secure_url}`);

      uploadedUrls.push({
        courseName: image.courseName,
        cloudinaryUrl: result.secure_url
      });

      // Delay para não sobrecarregar a API
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error(`❌ Error uploading ${image.courseName}:`, error.message);
    }
  }

  // Salvar URLs em arquivo
  const outputPath = path.join(__dirname, 'course-images-urls.json');
  fs.writeFileSync(outputPath, JSON.stringify(uploadedUrls, null, 2));

  console.log(`\n✅ Upload completo! ${uploadedUrls.length} imagens enviadas.`);
  console.log(`📝 URLs salvas em: ${outputPath}`);
  console.log('\n📋 URLs:');
  uploadedUrls.forEach(img => {
    console.log(`${img.courseName}: ${img.cloudinaryUrl}`);
  });
}

uploadCourseImages().catch(console.error);
