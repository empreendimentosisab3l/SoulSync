// app/api/dashboard/quizzes/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Buscar todos os quizzes
    const quizzes = await prisma.quiz.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Para cada quiz, buscar estatísticas
    const quizzesWithStats = await Promise.all(
      quizzes.map(async (quiz) => {
        const totalSessions = await prisma.quizSession.count({
          where: { quizId: quiz.id }
        });

        const completed = await prisma.quizSession.count({
          where: {
            quizId: quiz.id,
            completedAt: { not: null }
          }
        });

        const converted = await prisma.quizSession.count({
          where: {
            quizId: quiz.id,
            convertedAt: { not: null }
          }
        });

        const conversionRate = totalSessions > 0
          ? (converted / totalSessions) * 100
          : 0;

        return {
          ...quiz,
          totalSessions,
          completed,
          converted,
          conversionRate
        };
      })
    );

    return NextResponse.json({ quizzes: quizzesWithStats });
  } catch (error) {
    console.error('Quizzes API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
