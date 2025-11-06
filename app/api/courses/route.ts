import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

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

function extractOrderAndName(filename: string): { order: number; name: string } {
  // Remove extensão se tiver
  const nameWithoutExt = filename.replace(/\.(mp3|wav|m4a)$/i, '');

  // Regex para pegar "1 - Nome da coisa" ou "1 - Nome"
  const match = nameWithoutExt.match(/^(\d+)\s*-\s*(.+)$/);

  if (match) {
    return {
      order: parseInt(match[1], 10),
      name: match[2].trim()
    };
  }

  // Se não tiver o padrão, retorna como está
  return {
    order: 0,
    name: nameWithoutExt
  };
}

function findCourseImage(coursePath: string, courseFolder: string): string | undefined {
  try {
    // Buscar arquivos de imagem na pasta raiz do curso
    const files = fs.readdirSync(coursePath);
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];

    const imageFile = files.find(file => {
      const ext = path.extname(file).toLowerCase();
      return imageExtensions.includes(ext);
    });

    if (imageFile) {
      return `/audios/${courseFolder}/${imageFile}`;
    }

    return undefined;
  } catch (error) {
    console.error(`Erro ao buscar imagem para o curso ${courseFolder}:`, error);
    return undefined;
  }
}

function findSectionImage(sectionPath: string, courseFolder: string, sectionFolder: string): string | undefined {
  try {
    // Buscar arquivos de imagem na pasta da seção
    const files = fs.readdirSync(sectionPath);
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];

    const imageFile = files.find(file => {
      const ext = path.extname(file).toLowerCase();
      return imageExtensions.includes(ext);
    });

    if (imageFile) {
      return `/audios/${courseFolder}/${sectionFolder}/${imageFile}`;
    }

    return undefined;
  } catch (error) {
    console.error(`Erro ao buscar imagem para a seção ${sectionFolder}:`, error);
    return undefined;
  }
}

export async function GET() {
  try {
    const audiosPath = path.join(process.cwd(), 'public', 'audios');

    // Verificar se a pasta existe
    if (!fs.existsSync(audiosPath)) {
      return NextResponse.json({ courses: [] });
    }

    const courseFolders = fs.readdirSync(audiosPath, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);

    const courses: Course[] = [];
    let courseIdCounter = 1;
    let sessionIdCounter = 1;

    for (const courseFolder of courseFolders) {
      const coursePath = path.join(audiosPath, courseFolder);

      // Ler módulos (seções)
      const sectionFolders = fs.readdirSync(coursePath, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);

      const sections: Section[] = [];

      for (const sectionFolder of sectionFolders) {
        const sectionPath = path.join(coursePath, sectionFolder);
        const { order: sectionOrder, name: sectionName } = extractOrderAndName(sectionFolder);

        // Buscar imagem da seção (todas as sessões da seção compartilham a mesma imagem)
        const sectionImageUrl = findSectionImage(sectionPath, courseFolder, sectionFolder);

        // Ler arquivos de áudio
        const audioFiles = fs.readdirSync(sectionPath)
          .filter(file => /\.(mp3|wav|m4a)$/i.test(file));

        const sessions: AudioFile[] = audioFiles.map(audioFile => {
          const { order, name } = extractOrderAndName(audioFile);
          const audioUrl = `/audios/${courseFolder}/${sectionFolder}/${audioFile}`;

          return {
            id: sessionIdCounter++,
            title: name,
            duration: '00:00', // Será calculado no cliente
            audioUrl,
            order,
            thumbnail: sectionImageUrl
          };
        });

        // Ordenar sessões por ordem
        sessions.sort((a, b) => a.order - b.order);

        sections.push({
          name: sectionName,
          order: sectionOrder,
          sessions
        });
      }

      // Ordenar seções por ordem
      sections.sort((a, b) => a.order - b.order);

      const totalSessions = sections.reduce((sum, section) => sum + section.sessions.length, 0);

      // Buscar imagem do curso
      const imageUrl = findCourseImage(coursePath, courseFolder);

      courses.push({
        id: courseIdCounter++,
        title: courseFolder,
        description: `Curso completo de ${courseFolder}`,
        sections,
        totalSessions,
        imageUrl
      });
    }

    return NextResponse.json({ courses });
  } catch (error) {
    console.error('Erro ao ler estrutura de cursos:', error);
    return NextResponse.json({ error: 'Erro ao carregar cursos' }, { status: 500 });
  }
}
