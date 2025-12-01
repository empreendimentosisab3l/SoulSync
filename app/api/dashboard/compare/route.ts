// app/api/dashboard/compare/route.ts

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
    const { searchParams } = new URL(request.url);
    const quizIdsParam = searchParams.get('quizIds');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    if (!quizIdsParam) {
      return NextResponse.json(
        { error: 'quizIds parameter is required' },
        { status: 400 }
      );
    }

    const quizIds = quizIdsParam.split(',');

    // Filtro de data
    const dateFilter = startDate && endDate ? {
      startedAt: {
        gte: new Date(startDate),
        lte: new Date(endDate)
      }
    } : {};

    // Buscar dados de cada quiz
    const quizzesData = await Promise.all(
      quizIds.map(async (quizId) => {
        const quiz = await prisma.quiz.findUnique({
          where: { id: quizId }
        });

        if (!quiz) return null;

        const totalSessions = await prisma.quizSession.count({
          where: { quizId, ...dateFilter }
        });

        const started = await prisma.quizSession.count({
          where: {
            quizId,
            ...dateFilter,
            events: { some: {} }
          }
        });

        const completed = await prisma.quizSession.count({
          where: {
            quizId,
            ...dateFilter,
            completedAt: { not: null }
          }
        });

        const converted = await prisma.quizSession.count({
          where: {
            quizId,
            ...dateFilter,
            convertedAt: { not: null }
          }
        });

        const revenueData = await prisma.quizSession.aggregate({
          where: {
            quizId,
            ...dateFilter,
            revenue: { not: null }
          },
          _sum: { revenue: true }
        });

        const revenue = Number(revenueData._sum.revenue || 0);

        return {
          id: quiz.id,
          name: quiz.name,
          version: quiz.version,
          metrics: {
            visitors: totalSessions,
            started,
            startRate: totalSessions > 0 ? Math.round((started / totalSessions) * 100) : 0,
            completed,
            completionRate: started > 0 ? Math.round((completed / started) * 100) : 0,
            converted,
            conversionRate: completed > 0 ? Math.round((converted / completed) * 100) : 0,
            finalConversionRate: totalSessions > 0 ? Math.round((converted / totalSessions) * 100) : 0,
            revenue,
            avgRevenue: converted > 0 ? Math.round(revenue / converted) : 0
          }
        };
      })
    );

    // Filtrar nulls (quizzes não encontrados)
    const validQuizzes = quizzesData.filter(q => q !== null);

    if (validQuizzes.length === 0) {
      return NextResponse.json(
        { error: 'No valid quizzes found' },
        { status: 404 }
      );
    }

    // Determinar o vencedor (melhor taxa de conversão final)
    const winner = validQuizzes.reduce((best, current) => {
      return current.metrics.finalConversionRate > best.metrics.finalConversionRate
        ? current
        : best;
    });

    // Calcular melhoria percentual do vencedor vs outros
    const improvements = validQuizzes
      .filter(q => q.id !== winner.id)
      .map(q => {
        const improvement = winner.metrics.finalConversionRate > 0
          ? Math.round(
              ((winner.metrics.finalConversionRate - q.metrics.finalConversionRate) /
                q.metrics.finalConversionRate) * 100
            )
          : 0;
        return {
          quizId: q.id,
          quizName: q.name,
          improvement: improvement > 0 ? improvement : 0
        };
      });

    return NextResponse.json({
      quizzes: validQuizzes,
      winner: {
        quizId: winner.id,
        quizName: winner.name,
        conversionRate: winner.metrics.finalConversionRate,
        improvements
      },
      comparison: {
        totalVisitors: validQuizzes.reduce((sum, q) => sum + q.metrics.visitors, 0),
        totalRevenue: validQuizzes.reduce((sum, q) => sum + q.metrics.revenue, 0),
        avgCompletionRate: Math.round(
          validQuizzes.reduce((sum, q) => sum + q.metrics.completionRate, 0) /
            validQuizzes.length
        ),
        avgConversionRate: Math.round(
          validQuizzes.reduce((sum, q) => sum + q.metrics.finalConversionRate, 0) /
            validQuizzes.length
        )
      }
    });
  } catch (error) {
    console.error('Compare API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
