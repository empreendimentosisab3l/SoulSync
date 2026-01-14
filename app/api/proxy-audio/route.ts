import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const audioUrl = searchParams.get('url');

  if (!audioUrl) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 });
  }

  try {
    // Fetch the audio from Cloudinary
    const response = await fetch(audioUrl, {
      headers: {
        'Range': request.headers.get('range') || '',
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch audio' },
        { status: response.status }
      );
    }

    // Stream the audio directly (sem carregar tudo na memória)
    const headers = new Headers({
      'Content-Type': response.headers.get('Content-Type') || 'audio/mpeg',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Range',
      'Cache-Control': 'public, max-age=31536000, immutable',
      'Accept-Ranges': 'bytes',
    });

    // Copiar headers importantes do Cloudinary
    if (response.headers.get('Content-Length')) {
      headers.set('Content-Length', response.headers.get('Content-Length')!);
    }
    if (response.headers.get('Content-Range')) {
      headers.set('Content-Range', response.headers.get('Content-Range')!);
    }

    // Retornar stream diretamente
    return new NextResponse(response.body, {
      status: response.status,
      headers,
    });
  } catch (error) {
    console.error('Error proxying audio:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Range',
    },
  });
}
