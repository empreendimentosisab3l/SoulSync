import { NextResponse } from 'next/server';
import cloudinaryUrls from '@/cloudinary-urls.json';

interface AudioFile {
  id: number;
  title: string;
  duration: string;
  audioUrl: string;
  order: number;
  thumbnail?: string;
}

interface Section {
  name: string;
  order: number;
  sessions: AudioFile[];
}

interface Course {
  id: number;
  title: string;
  description: string;
  sections: Section[];
  totalSessions: number;
  imageUrl?: string;
}

interface CloudinaryMapping {
  originalPath: string;
  cloudinaryUrl: string;
  filename: string;
  folder: string;
}

export async function GET() {
  const mappings = cloudinaryUrls as CloudinaryMapping[];

  // Helper function to get audio files by course
  function getAudiosByCourse(courseName: string) {
    return mappings.filter(m =>
      m.folder.startsWith(courseName) &&
      (m.cloudinaryUrl.includes('.mp3') || m.cloudinaryUrl.includes('.MP3'))
    );
  }

  // Helper function to organize audios by sections
  function organizeBySection(audios: CloudinaryMapping[]) {
    const sectionMap: { [key: string]: CloudinaryMapping[] } = {};

    audios.forEach(audio => {
      // Extract section name from folder (part after first \)
      const folderParts = audio.folder.split('\\');
      const sectionName = folderParts[1] || 'Geral';

      if (!sectionMap[sectionName]) {
        sectionMap[sectionName] = [];
      }

      sectionMap[sectionName].push(audio);
    });

    return sectionMap;
  }

  // Get image URL for a course
  function getCourseImage(courseFolder: string): string {
    const imageMapping = mappings.find(m =>
      m.folder.startsWith(courseFolder) &&
      (m.filename.toLowerCase().includes('capa') ||
       m.filename.toLowerCase().includes('lucid'))
    );

    return imageMapping?.cloudinaryUrl || '';
  }

  // Build courses with actual Cloudinary data
  const courses: Course[] = [];

  // Course 1: Mudando a relação com a comida
  const foodAudios = getAudiosByCourse('Mudando a relação com a comida');
  const foodSections = organizeBySection(foodAudios);
  let sessionCounter = 1;

  const foodSectionArray = Object.entries(foodSections).map(([name, sessions], idx) => ({
    name,
    order: idx + 1,
    sessions: sessions.map((session, sessionIdx) => ({
      id: sessionCounter++,
      title: session.filename.replace('.mp3', '').replace('.MP3', ''),
      duration: '10-15 min',
      audioUrl: session.cloudinaryUrl,
      order: sessionIdx + 1,
    }))
  }));

  courses.push({
    id: 1,
    title: 'Mudando a relação com a comida',
    description: 'Curso completo para transformar sua relação com a alimentação',
    totalSessions: foodAudios.length,
    imageUrl: getCourseImage('Mudando a relação com a comida'),
    sections: foodSectionArray
  });

  // Course 2: Decodificação da mentalidade procrastinadora
  const procAudios = getAudiosByCourse('Decodificação da mentalidade procrastinadora');
  const procSections = organizeBySection(procAudios);

  const procSectionArray = Object.entries(procSections).map(([name, sessions], idx) => ({
    name,
    order: idx + 1,
    sessions: sessions.map((session, sessionIdx) => ({
      id: sessionCounter++,
      title: session.filename.replace('.mp3', '').replace('.MP3', ''),
      duration: '10-15 min',
      audioUrl: session.cloudinaryUrl,
      order: sessionIdx + 1,
    }))
  }));

  courses.push({
    id: 2,
    title: 'Decodificação da mentalidade procrastinadora',
    description: 'Supere a procrastinação e aumente sua produtividade',
    totalSessions: procAudios.length,
    imageUrl: getCourseImage('Decodificação da mentalidade procrastinadora'),
    sections: procSectionArray
  });

  // Course 3: Bem-estar sexual
  const sexualAudios = getAudiosByCourse('Bem-estar sexual');
  const sexualSections = organizeBySection(sexualAudios);

  const sexualSectionArray = Object.entries(sexualSections).map(([name, sessions], idx) => ({
    name,
    order: idx + 1,
    sessions: sessions.map((session, sessionIdx) => ({
      id: sessionCounter++,
      title: session.filename.replace('.mp3', '').replace('.MP3', ''),
      duration: '10-15 min',
      audioUrl: session.cloudinaryUrl,
      order: sessionIdx + 1,
    }))
  }));

  courses.push({
    id: 3,
    title: 'Bem-estar sexual',
    description: 'Melhore sua confiança e desempenho íntimo',
    totalSessions: sexualAudios.length,
    imageUrl: getCourseImage('Bem-estar sexual'),
    sections: sexualSectionArray
  });

  return NextResponse.json({ courses });
}
