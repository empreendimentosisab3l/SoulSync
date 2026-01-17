/**
 * Analytics Stub
 *
 * Este arquivo é um stub vazio para manter compatibilidade com código existente.
 * O tracking real de analytics agora é feito via Google Analytics.
 *
 * Todas as funções abaixo são no-ops (não fazem nada).
 */

// No-op functions para evitar erros de build
export const pageview = (...args: any[]) => {
  // Google Analytics deve ser adicionado via Google Tag Manager ou script no layout
};

// Quiz V2
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
export const trackQuizV3Start = (...args: any[]) => {};
export const trackQuizV3Step = (...args: any[]) => {};
export const trackQuizV3Answer = (...args: any[]) => {};
export const trackQuizV3Complete = (...args: any[]) => {};
export const trackQuizV3EmailCapture = (...args: any[]) => {};
export const trackQuizV3CheckoutView = (...args: any[]) => {};
export const trackQuizV3PurchaseIntent = (...args: any[]) => {};
export const trackQuizV3FreeTrialStart = (...args: any[]) => {};

// Para compatibilidade com qualquer outro código
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
