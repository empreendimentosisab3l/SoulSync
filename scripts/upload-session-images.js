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

// Mapeamento de imagens para sessões (baseado nos nomes dos arquivos e títulos das sessões)
const imageMapping = {
  'Auto_estima.jpg': ['autoestima', 'auto-estima', 'Sessão de hipnoterapia para autoestima'],
  'açucar.jpg': ['açúcar', 'acucar', 'desintoxicação de açúcar', 'Sessão de hipnoterapia para desintoxicação de açúcar'],
  'condicionamento_físico.jpg': ['condicionamento físico', 'fitness', 'Liberte o seu potencial de condicionamento físico'],
  'disturbios_do_sono.jpg': ['sono', 'distúrbios do sono', 'Sessão de hipnoterapia para distúrbios do sono'],
  'liberdade_financeira.jpg': ['financeira', 'liberdade financeira', 'A fórmula da liberdade financeira'],
  'pare_de_procrastinar.jpg': ['procrastinar', 'procrastinação', 'Para de procrastinar'],
  'relaxamento_profundo.jpg': ['relaxamento', 'Relaxamento profundo'],
  'tdah.jpg': ['tdah', 'TDAH', 'Programa de gerenciamento de TDAH'],
  'respire.jpg': ['respire', 'respiração'],
  'pânico.jpg': ['pânico', 'panico', 'ansiedade'],
  'liberte-se_da_dor.jpg': ['dor', 'Liberte-se do Ser'],
  'saúde_intestinal.jpg': ['intestinal', 'saude intestinal'],
  'produtividade.jpg': ['produtividade', 'produtivo'],
  'conexão.jpg': ['conexao', 'conexão'],
  'futuro.jpg': ['futuro'],
  'ciclos_da_dependencia.jpg': ['dependencia', 'dependência', 'ciclos']
};

const imagesPath = 'C:\\Users\\Lucas\\Downloads\\imagens_módulos';

async function uploadImage(imageName) {
  const imagePath = path.join(imagesPath, imageName);

  if (!fs.existsSync(imagePath)) {
    console.log(`❌ Imagem não encontrada: ${imageName}`);
    return null;
  }

  try {
    console.log(`📤 Uploading ${imageName}...`);

    const result = await cloudinary.uploader.upload(imagePath, {
      folder: 'soulsync/sessions',
      public_id: path.parse(imageName).name,
      overwrite: true,
      resource_type: 'image'
    });

    console.log(`✅ Uploaded: ${result.secure_url}`);
    return result.secure_url;
  } catch (error) {
    console.error(`❌ Error uploading ${imageName}:`, error.message);
    return null;
  }
}

async function uploadAllImages() {
  console.log('🚀 Iniciando upload de imagens para o Cloudinary...\n');

  const uploadedImages = {};

  for (const [imageName, keywords] of Object.entries(imageMapping)) {
    const url = await uploadImage(imageName);
    if (url) {
      uploadedImages[imageName] = {
        url,
        keywords
      };
    }
  }

  // Salvar mapeamento em arquivo JSON
  const outputPath = path.join(__dirname, '..', 'data', 'session-images-mapping.json');
  fs.writeFileSync(outputPath, JSON.stringify(uploadedImages, null, 2));

  console.log(`\n✅ Upload completo! Mapeamento salvo em: ${outputPath}`);
  console.log(`📊 Total de imagens: ${Object.keys(uploadedImages).length}`);

  return uploadedImages;
}

// Executar upload
uploadAllImages()
  .then(() => {
    console.log('\n🎉 Processo concluído!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Erro no processo:', error);
    process.exit(1);
  });
