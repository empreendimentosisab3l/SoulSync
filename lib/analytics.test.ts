// NÃO usar o pragma de ambiente jsdom do Vitest (pacote jsdom não instalado no projeto);
// simulamos window/localStorage manualmente em ambiente node:
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// O módulo usa `window` e `localStorage` (via getTrafficSource). Simulamos globals mínimos.
function setupWindow(withGtag = true) {
  const calls: any[] = [];
  const gtag = withGtag ? (...args: any[]) => calls.push(args) : undefined;
  (globalThis as any).window = { gtag };
  (globalThis as any).localStorage = {
    store: {} as Record<string, string>,
    getItem(k: string) { return this.store[k] ?? null; },
    setItem(k: string, v: string) { this.store[k] = v; },
    removeItem(k: string) { delete this.store[k]; },
  };
  return calls;
}

afterEach(() => {
  delete (globalThis as any).window;
  delete (globalThis as any).localStorage;
  vi.resetModules();
});

async function loadAnalytics() {
  return await import('./analytics');
}

describe('analytics GA4', () => {
  it('quiz_v3_start dispara com src do trafficSource', async () => {
    const calls = setupWindow();
    (globalThis as any).localStorage.setItem('trafficSourceV3', 'whats-m1');
    const a = await loadAnalytics();
    a.trackQuizV3Start();
    expect(calls).toContainEqual(['event', 'quiz_v3_start', { src: 'whats-m1' }]);
  });

  it('src ausente vira "(sem origem)"', async () => {
    const calls = setupWindow();
    const a = await loadAnalytics();
    a.trackQuizV3CheckoutView();
    expect(calls).toContainEqual(['event', 'quiz_v3_checkout_view', { src: '(sem origem)' }]);
  });

  it('quiz_v3_step leva step e question_type', async () => {
    const calls = setupWindow();
    const a = await loadAnalytics();
    a.trackQuizV3Step(7, 'choice');
    expect(calls).toContainEqual(['event', 'quiz_v3_step', { step: 7, question_type: 'choice', src: '(sem origem)' }]);
  });

  it('quiz_v3_answer trunca a resposta a 100 chars', async () => {
    const calls = setupWindow();
    const a = await loadAnalytics();
    a.trackQuizV3Answer(3, 'x'.repeat(150));
    const call = calls.find(c => c[1] === 'quiz_v3_answer');
    expect(call[2].answer).toHaveLength(100);
    expect(call[2].step).toBe(3);
  });

  it('quiz_v3_purchase_intent leva plan, value e currency BRL', async () => {
    const calls = setupWindow();
    const a = await loadAnalytics();
    a.trackQuizV3PurchaseIntent('trial 3 dias', 4.9);
    expect(calls).toContainEqual(['event', 'quiz_v3_purchase_intent', { plan: 'trial 3 dias', value: 4.9, currency: 'BRL', src: '(sem origem)' }]);
  });

  it('pageview dispara page_view com page_path', async () => {
    const calls = setupWindow();
    const a = await loadAnalytics();
    a.pageview('/quiz-v3/5');
    expect(calls).toContainEqual(['event', 'page_view', { page_path: '/quiz-v3/5', src: '(sem origem)' }]);
  });

  it('sem window.gtag nada lança', async () => {
    setupWindow(false);
    const a = await loadAnalytics();
    expect(() => a.trackQuizV3Start()).not.toThrow();
    expect(() => a.pageview('/x')).not.toThrow();
  });
});
