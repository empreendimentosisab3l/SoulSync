// app/api/track/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Schema de validação
const trackEventSchema = z.object({
  event: z.string(),
  quizId: z.string(),
  sessionId: z.string(),
  cardNumber: z.number().optional(),
  cardName: z.string().optional(),
  answer: z.union([z.string(), z.any()]).optional(),
  timeSpent: z.number().optional(),
  email: z.string().optional(),
  name: z.string().optional(),
  amount: z.number().optional(),
  orderId: z.string().optional(),
  coupon: z.string().optional(),
  paymentMethod: z.string().optional(),
  metadata: z.object({
    device: z.string().optional(),
    browser: z.string().optional(),
    os: z.string().optional(),
    screenWidth: z.number().optional(),
    screenHeight: z.number().optional(),
    utmSource: z.string().nullable().optional(),
    utmMedium: z.string().nullable().optional(),
    utmCampaign: z.string().nullable().optional(),
    utmContent: z.string().nullable().optional(),
    utmTerm: z.string().nullable().optional(),
    userAgent: z.string().optional(),
    language: z.string().optional(),
    referrer: z.string().optional(),
    timestamp: z.string().optional()
  }).optional()
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = trackEventSchema.parse(body);

    // Verificar se quiz existe, senão criar (para qualquer evento)
    let quiz = await prisma.quiz.findFirst({
      where: { name: data.quizId }
    });

    if (!quiz) {
      quiz = await prisma.quiz.create({
        data: {
          name: data.quizId,
          version: '1.0',
          isActive: true
        }
      });
    }

    // Garantir que a sessão existe (para qualquer evento)
    await prisma.quizSession.upsert({
      where: { id: data.sessionId },
      update: {
        // Atualizar metadados se disponíveis
        ...(data.metadata?.utmSource && { utmSource: data.metadata.utmSource }),
        ...(data.metadata?.utmMedium && { utmMedium: data.metadata.utmMedium }),
        ...(data.metadata?.utmCampaign && { utmCampaign: data.metadata.utmCampaign }),
      },
      create: {
        id: data.sessionId,
        quizId: quiz.id,
        utmSource: data.metadata?.utmSource,
        utmMedium: data.metadata?.utmMedium,
        utmCampaign: data.metadata?.utmCampaign,
        utmContent: data.metadata?.utmContent,
        utmTerm: data.metadata?.utmTerm,
        deviceType: data.metadata?.device,
        browser: data.metadata?.browser,
        os: data.metadata?.os,
        screenWidth: data.metadata?.screenWidth,
        screenHeight: data.metadata?.screenHeight
      }
    });

    // EVENTO: quiz_started
    if (data.event === 'quiz_started') {
      // Sessão já foi criada/atualizada acima
    }

    // EVENTO: email_collected
    if (data.event === 'email_collected' && data.email) {
      await prisma.quizSession.update({
        where: { id: data.sessionId },
        data: { email: data.email }
      });
    }

    // EVENTO: name_collected
    if (data.event === 'name_collected' && data.name) {
      await prisma.quizSession.update({
        where: { id: data.sessionId },
        data: { name: data.name }
      });
    }

    // EVENTO: quiz_completed
    if (data.event === 'quiz_completed') {
      await prisma.quizSession.update({
        where: { id: data.sessionId },
        data: { completedAt: new Date() }
      });
    }

    // EVENTO: initiate_checkout
    if (data.event === 'initiate_checkout') {
      // Apenas registra o evento, não atualiza estado da sessão (ainda)
      // Poderíamos marcar um flag "checkout_started" se tivéssemos no schema
      // Por enquanto, o evento genérico abaixo já vai salvar isso na tabela quiz_events
    }

    // EVENTO: conversion
    if (data.event === 'conversion' && data.amount) {
      await prisma.quizSession.update({
        where: { id: data.sessionId },
        data: {
          convertedAt: new Date(),
          revenue: data.amount
        }
      });

      await prisma.conversion.create({
        data: {
          sessionId: data.sessionId,
          amount: data.amount,
          couponCode: data.coupon,
          paymentMethod: data.paymentMethod
        }
      });
    }

    // Salvar evento genérico
    await prisma.quizEvent.create({
      data: {
        sessionId: data.sessionId,
        cardNumber: data.cardNumber || 0,
        cardName: data.cardName || '',
        eventType: data.event,
        timeSpentSeconds: data.timeSpent || 0,
        answerValue: data.answer || null
      }
    });

    return NextResponse.json({ success: true, sessionId: data.sessionId });
  } catch (error) {
    console.error('Tracking error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
