require('dotenv').config({ path: '.env.local' });
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

// Configurar Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const imagesPath = 'C:\\Users\\Lucas\\Downloads\\imagens_módulos';
const imageName = 'Quit_canbis_for_god.jpg';

async function uploadImage() {
  const imagePath = path.join(imagesPath, imageName);

  if (!fs.existsSync(imagePath)) {
    console.log(`❌ Imagem não encontrada: ${imageName}`);
    process.exit(1);
  }

  try {
    console.log(`📤 Uploading ${imageName}...`);

    const result = await cloudinary.uploader.upload(imagePath, {
      folder: 'soulsync/sessions',
      public_id: 'Quit_cannabis_for_good',
      overwrite: true,
      resource_type: 'image'
    });

    console.log(`✅ Uploaded: ${result.secure_url}`);

    // Atualizar o mapeamento
    const mappingPath = path.join(__dirname, '..', 'data', 'session-images-mapping.json');
    const mapping = JSON.parse(fs.readFileSync(mappingPath, 'utf8'));

    mapping['Quit_canbis_for_god.jpg'] = {
      url: result.secure_url,
      keywords: ['cannabis', 'quit cannabis', 'Quit cannabis for good']
    };

    fs.writeFileSync(mappingPath, JSON.stringify(mapping, null, 2));
    console.log(`✅ Mapeamento atualizado!`);

    return result.secure_url;
  } catch (error) {
    console.error(`❌ Error uploading ${imageName}:`, error.message);
    process.exit(1);
  }
}

uploadImage()
  .then(() => {
    console.log('\n🎉 Upload concluído!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Erro:', error);
    process.exit(1);
  });
