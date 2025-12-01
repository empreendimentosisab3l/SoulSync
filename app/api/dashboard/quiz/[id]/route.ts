// app/api/dashboard/quiz/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const quizId = params.id;

    // Buscar quiz
    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId }
    });

    if (!quiz) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
    }

    // Total de sessões
    const totalSessions = await prisma.quizSession.count({
      where: { quizId }
    });

    // Completaram
    const completed = await prisma.quizSession.count({
      where: {
        quizId,
        completedAt: { not: null }
      }
    });

    // Converteram
    const converted = await prisma.quizSession.count({
      where: {
        quizId,
        convertedAt: { not: null }
      }
    });

    // Receita total
    const revenueData = await prisma.quizSession.aggregate({
      where: {
        quizId,
        revenue: { not: null }
      },
      _sum: {
        revenue: true
      }
    });
    const revenue = Number(revenueData._sum.revenue || 0);

    // Análise card por card (simplificada)
    const cardAnalysisFormatted: Array<{
      cardNumber: number;
      cardName: string;
      views: number;
      avgTimeSpent: number;
      abandonments: number;
      abandonmentRate: number;
    }> = [];

    // Bottlenecks
    const bottlenecks: Array<{
      cardNumber: number;
      cardName: string;
      abandonments: number;
      abandonmentRate: number;
    }> = [];

    // Funil
    const funnel = [
      { stage: 'Visitantes', count: totalSessions, percentage: 100 },
      {
        stage: 'Completaram',
        count: completed,
        percentage: totalSessions > 0 ? Math.round((completed / totalSessions) * 100) : 0
      },
      {
        stage: 'Converteram',
        count: converted,
        percentage: completed > 0 ? Math.round((converted / completed) * 100) : 0
      }
    ];

    // Breakdown por dispositivo
    const deviceBreakdown = await prisma.$queryRaw<Array<{
      deviceType: string | null;
      count: bigint;
    }>>`
      SELECT
        "deviceType",
        COUNT(*) as count
      FROM quiz_sessions
      WHERE "quizId" = ${quizId}
      GROUP BY "deviceType"
    `;

    const devices = deviceBreakdown.map(d => ({
      type: d.deviceType || 'unknown',
      count: Number(d.count)
    }));

    // Breakdown por UTM source
    const utmBreakdown = await prisma.$queryRaw<Array<{
      utmSource: string | null;
      count: bigint;
      converted: bigint;
    }>>`
      SELECT
        "utmSource",
        COUNT(*) as count,
        COUNT("convertedAt") as converted
      FROM quiz_sessions
      WHERE "quizId" = ${quizId}
      GROUP BY "utmSource"
    `;

    const sources = utmBreakdown.map(s => ({
      source: s.utmSource || 'direct',
      visitors: Number(s.count),
      conversions: Number(s.converted),
      conversionRate: Number(s.count) > 0
        ? Math.round((Number(s.converted) / Number(s.count)) * 100)
        : 0
    }));

    return NextResponse.json({
      quiz,
      funnel,
      cardAnalysis: cardAnalysisFormatted,
      bottlenecks,
      devices,
      sources,
      metrics: {
        totalSessions,
        completed,
        converted,
        revenue,
        completionRate: totalSessions > 0 ? Math.round((completed / totalSessions) * 100) : 0,
        conversionRate: completed > 0 ? Math.round((converted / completed) * 100) : 0
      }
    });
  } catch (error) {
    console.error('Quiz details API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
