// Helper functions to get Cloudinary URLs
import cloudinaryUrls from '@/cloudinary-urls.json';

interface CloudinaryMapping {
  originalPath: string;
  cloudinaryUrl: string;
  filename: string;
  folder: string;
}

const urlMappings = cloudinaryUrls as CloudinaryMapping[];

/**
 * Get Cloudinary URL for an image based on its public path
 * @param publicPath - Path like "/images/soulsync-logo.png"
 * @returns Cloudinary URL or original path if not found
 */
export function getCloudinaryImageUrl(publicPath: string): string {
  // Remove leading slash and "public/" if present
  const normalizedPath = publicPath.replace(/^\//, '').replace(/^public\//, '');

  // Find matching URL in our mappings
  const mapping = urlMappings.find((m) => {
    const mappingPath = m.originalPath.toLowerCase();
    const searchPath = normalizedPath.toLowerCase();

    // Check if filename matches
    return mappingPath.includes(searchPath) ||
           mappingPath.endsWith(m.filename.toLowerCase()) &&
           searchPath.includes(m.filename.toLowerCase());
  });

  return mapping?.cloudinaryUrl || publicPath;
}

/**
 * Get Cloudinary URL for an audio file based on its public path
 * Since audio files don't exist in deployment, this will always return Cloudinary URL
 * @param publicPath - Path like "/audios/sessao-1.mp3"
 * @returns Cloudinary URL or placeholder if not found
 */
export function getCloudinaryAudioUrl(publicPath: string): string {
  // For the quick relief sessions that use generic session numbers,
  // we'll need to map them to placeholder URLs since they weren't uploaded

  // These are the generic session files that don't exist
  const sessionMatch = publicPath.match(/\/audios\/sessao-(\d+)\.mp3/);

  if (sessionMatch) {
    // Return a placeholder or the first audio from our uploaded files
    // Since these don't exist, we'll return a default URL
    console.warn(`Audio file ${publicPath} not found in Cloudinary uploads`);

    // Return the first available audio as a fallback
    const fallbackAudio = urlMappings.find(m => m.cloudinaryUrl.includes('.mp3'));
    return fallbackAudio?.cloudinaryUrl || publicPath;
  }

  // For actual uploaded files, find the exact match
  const normalizedPath = publicPath.replace(/^\//, '').replace(/^public\//, '');

  const mapping = urlMappings.find((m) => {
    const mappingPath = m.originalPath.toLowerCase();
    return mappingPath.includes(normalizedPath.toLowerCase());
  });

  if (mapping) {
    return mapping.cloudinaryUrl;
  }

  console.warn(`Audio file ${publicPath} not found in Cloudinary uploads`);
  return publicPath;
}

/**
 * Get all available audio sessions from Cloudinary
 * Returns organized data structure of all uploaded audios
 */
export function getAvailableAudioSessions() {
  const audioFiles = urlMappings.filter(m =>
    m.cloudinaryUrl.includes('.mp3') || m.cloudinaryUrl.includes('.MP3')
  );

  // Group by course folder
  const sessionsByCourse: Record<string, CloudinaryMapping[]> = {};

  audioFiles.forEach(file => {
    // Extract course name from folder (first part before \)
    const courseMatch = file.folder.match(/^([^\\]+)/);
    const courseName = courseMatch ? courseMatch[1] : 'Outros';

    if (!sessionsByCourse[courseName]) {
      sessionsByCourse[courseName] = [];
    }

    sessionsByCourse[courseName].push(file);
  });

  return sessionsByCourse;
}

/**
 * Get course image URL from Cloudinary or local
 */
export function getCourseImageUrl(courseId: number): string {
  // Map course IDs to their image paths
  const courseImageMap: Record<number, string> = {
    1: '/audios/Mudando a relação com a comida/Lucid_Origin_Photorealistic_image_for_a_hypnosisbased_weightlo_2.jpg',
    2: '/audios/Decodificação da mentalidade procrastinadora/capa.jpg',
    3: '/audios/Bem-estar sexual/capa.jpg',
  };

  const imagePath = courseImageMap[courseId];
  if (!imagePath) {
    return '/images/placeholder.jpg'; // Fallback
  }

  return getCloudinaryImageUrl(imagePath);
}
