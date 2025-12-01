// app/api/dashboard/overview/route.ts

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
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const quizId = searchParams.get('quizId');

    // Filtro base
    let whereFilter: any = {};

    // Filtro de data
    if (startDate && endDate) {
      whereFilter.startedAt = {
        gte: new Date(startDate),
        lte: new Date(endDate)
      };
    }

    // Filtro de Quiz ID (se fornecido e não for 'all')
    if (quizId && quizId !== 'all') {
      // Primeiro buscamos o ID interno do quiz com base no nome (que é o ID público usado no tracking)
      // OU assumimos que o quizId passado já é o ID interno se vier do dropdown
      // Vamos suportar ambos: se for UUID usa direto, se não busca pelo name

      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(quizId);

      if (isUuid) {
        whereFilter.quizId = quizId;
      } else {
        // Se passou o nome (ex: hypnozio-quiz-v2), busca o ID
        const quiz = await prisma.quiz.findFirst({
          where: { name: quizId }
        });
        if (quiz) {
          whereFilter.quizId = quiz.id;
        } else {
          // Se não achou o quiz pelo nome, retorna zeros
          return NextResponse.json({
            visitors: 0, started: 0, startRate: 0, completed: 0, completionRate: 0,
            converted: 0, conversionRate: 0, finalConversionRate: 0, revenue: 0, cac: 0, roi: 0, trend: []
          });
        }
      }
    }

    // Total de visitantes (sessões iniciadas)
    const visitors = await prisma.quizSession.count({
      where: whereFilter
    });

    // Total que iniciaram quiz (tem pelo menos 1 evento)
    const started = await prisma.quizSession.count({
      where: {
        ...whereFilter,
        events: {
          some: {}
        }
      }
    });

    // Total que completaram
    const completed = await prisma.quizSession.count({
      where: {
        ...whereFilter,
        completedAt: { not: null }
      }
    });

    // Total que converteram
    const converted = await prisma.quizSession.count({
      where: {
        ...whereFilter,
        convertedAt: { not: null }
      }
    });

    // Receita total
    const revenueData = await prisma.quizSession.aggregate({
      where: {
        ...whereFilter,
        revenue: { not: null }
      },
      _sum: {
        revenue: true
      }
    });
    const revenue = Number(revenueData._sum.revenue || 0);

    // Calcular taxas
    const startRate = visitors > 0 ? (started / visitors) * 100 : 0;
    const completionRate = started > 0 ? (completed / started) * 100 : 0;
    const conversionRate = completed > 0 ? (converted / completed) * 100 : 0;
    const finalConversionRate = visitors > 0 ? (converted / visitors) * 100 : 0;

    // CAC (assumindo investimento - você pode adicionar no banco)
    const investment = 0; // TODO: adicionar tabela de investimentos
    const cac = converted > 0 ? investment / converted : 0;

    // ROI
    const roi = investment > 0 ? ((revenue - investment) / investment) * 100 : 0;

    // Dados para gráfico de tendência (últimos 30 dias)
    // Por enquanto retornando vazio até ter dados suficientes
    const trend: Array<{ date: string; visitors: number; completed: number; converted: number }> = [];

    return NextResponse.json({
      visitors,
      started,
      startRate,
      completed,
      completionRate,
      converted,
      conversionRate,
      finalConversionRate,
      revenue,
      cac,
      roi,
      trend
    });
  } catch (error) {
    console.error('Overview API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
