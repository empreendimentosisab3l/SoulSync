import { NextResponse } from 'next/server';

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

export async function GET() {
  // Dados mockados dos cursos (sem ler filesystem para reduzir tamanho da função)
  const courses: Course[] = [
    {
      id: 1,
      title: 'Mudando a relação com a comida',
      description: 'Curso completo para transformar sua relação com a alimentação',
      totalSessions: 20,
      imageUrl: '/audios/Mudando a relação com a comida/Lucid_Origin_Photorealistic_image_for_a_hypnosisbased_weightlo_2.jpg',
      sections: []
    },
    {
      id: 2,
      title: 'Decodificação da mentalidade procrastinadora',
      description: 'Supere a procrastinação e aumente sua produtividade',
      totalSessions: 13,
      imageUrl: '/audios/Decodificação da mentalidade procrastinadora/capa.jpg',
      sections: []
    },
    {
      id: 3,
      title: 'Bem-estar sexual',
      description: 'Melhore sua confiança e desempenho íntimo',
      totalSessions: 10,
      imageUrl: '/audios/Bem-estar sexual/capa.jpg',
      sections: []
    }
  ];

  return NextResponse.json({ courses });
}
