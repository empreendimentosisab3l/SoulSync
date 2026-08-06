import { describe, it, expect, beforeEach } from 'vitest';
import type { NextRequest } from 'next/server';
import { getPublicOrigin } from './origin';

const fakeReq = (origin: string) => ({ nextUrl: { origin } }) as unknown as NextRequest;

describe('getPublicOrigin', () => {
  beforeEach(() => {
    delete process.env.NEXT_PUBLIC_BASE_URL;
  });

  it('remove o path de NEXT_PUBLIC_BASE_URL', () => {
    process.env.NEXT_PUBLIC_BASE_URL = 'https://soul-sync-brown.vercel.app/quiz-v3';
    expect(getPublicOrigin(fakeReq('http://localhost:3000'))).toBe('https://soul-sync-brown.vercel.app');
  });

  it('mantém uma origem pura como está', () => {
    process.env.NEXT_PUBLIC_BASE_URL = 'https://soul-sync-brown.vercel.app';
    expect(getPublicOrigin(fakeReq('http://localhost:3000'))).toBe('https://soul-sync-brown.vercel.app');
  });

  it('usa a origem da request quando a env não está definida', () => {
    expect(getPublicOrigin(fakeReq('http://localhost:3000'))).toBe('http://localhost:3000');
  });
});
