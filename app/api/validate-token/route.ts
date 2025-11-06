import { NextRequest, NextResponse } from 'next/server';
import { validateToken } from '@/lib/auth/validateToken';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json({
        valid: false,
        message: 'Token não fornecido'
      }, { status: 400 });
    }

    const accessData = await validateToken(token);

    if (!accessData) {
      return NextResponse.json({
        valid: false,
        message: 'Token inválido ou expirado'
      }, { status: 401 });
    }

    return NextResponse.json({
      valid: true,
      name: accessData.name,
      email: accessData.email,
      planType: accessData.planType,
      expiresAt: accessData.expiresAt
    });
  } catch (error) {
    console.error('Erro ao validar token:', error);
    return NextResponse.json({
      valid: false,
      message: 'Erro ao validar token'
    }, { status: 500 });
  }
}
