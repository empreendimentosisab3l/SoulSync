/**
 * Analytics GA4 (gtag.js carregado em components/GoogleAnalytics.tsx).
 * Eventos do funil quiz-v3, todos com o parâmetro `src` (campanha).
 * Funções V2 permanecem no-ops (funis antigos).
 */

import { getTrafficSource } from './trafficSource';

type GaParams = Record<string, string | number>;

function gaEvent(name: string, params: GaParams = {}): void {
  if (typeof window === 'undefined') return;
  const gtag = (window as any).gtag;
  if (typeof gtag !== 'function') return;
  try {
    gtag('event', name, { ...params, src: getTrafficSource() || '(sem origem)' });
  } catch {
    // analytics nunca quebra a página
  }
}

export const pageview = (path: string) => gaEvent('page_view', { page_path: path });

// Quiz V2 (no-ops — funis antigos)
export const trackQuizStart = (...args: any[]) => {};
export const trackQuizStep = (...args: any[]) => {};
export const trackQuizAnswer = (...args: any[]) => {};
export const trackQuizComplete = (...args: any[]) => {};
export const trackEmailCapture = (...args: any[]) => {};
export const trackCheckoutView = (...args: any[]) => {};
export const trackPurchaseIntent = (...args: any[]) => {};
export const trackFreeTrialStart = (...args: any[]) => {};
export const trackConversion = (...args: any[]) => {};

// Quiz V3
export const trackQuizV3Start = () => gaEvent('quiz_v3_start');
export const trackQuizV3Step = (step: number | string, questionType?: string) =>
  gaEvent('quiz_v3_step', { step: Number(step), question_type: questionType ?? '' });
export const trackQuizV3Answer = (step: number | string, value: unknown) =>
  gaEvent('quiz_v3_answer', { step: Number(step), answer: String(value).slice(0, 100) });
export const trackQuizV3Complete = (step: number | string) =>
  gaEvent('quiz_v3_complete', { step: Number(step) });
export const trackQuizV3EmailCapture = () => gaEvent('quiz_v3_email_capture');
export const trackQuizV3CheckoutView = () => gaEvent('quiz_v3_checkout_view');
export const trackQuizV3PurchaseIntent = (plan: string, value: number) =>
  gaEvent('quiz_v3_purchase_intent', { plan, value, currency: 'BRL' });
export const trackQuizV3FreeTrialStart = () => gaEvent('quiz_v3_free_trial_start');

export default {
  pageview,
  trackQuizStart,
  trackQuizStep,
  trackQuizAnswer,
  trackQuizComplete,
  trackEmailCapture,
  trackCheckoutView,
  trackPurchaseIntent,
  trackFreeTrialStart,
  trackConversion,
  trackQuizV3Start,
  trackQuizV3Step,
  trackQuizV3Answer,
  trackQuizV3Complete,
  trackQuizV3EmailCapture,
  trackQuizV3CheckoutView,
  trackQuizV3PurchaseIntent,
  trackQuizV3FreeTrialStart,
};
