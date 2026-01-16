// Google Analytics tracking utilities

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

export const GA_TRACKING_ID = 'G-ZRBSTXNX5F';

// Track pageviews
export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_TRACKING_ID, {
      page_path: url,
    });
  }
};

// Track custom events
export const event = ({ action, category, label, value }: {
  action: string;
  category: string;
  label?: string;
  value?: number;
}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Specific tracking functions for Quiz V2
export const trackQuizStart = () => {
  event({
    action: 'quiz_start',
    category: 'Quiz V2',
    label: 'Quiz Started',
  });
};

export const trackQuizStep = (step: number, questionType: string) => {
  event({
    action: 'quiz_step',
    category: 'Quiz V2',
    label: `Step ${step} - ${questionType}`,
    value: step,
  });
};

export const trackQuizAnswer = (step: number, answer: any) => {
  event({
    action: 'quiz_answer',
    category: 'Quiz V2',
    label: `Step ${step}`,
    value: step,
  });
};

export const trackQuizComplete = (totalSteps: number) => {
  event({
    action: 'quiz_complete',
    category: 'Quiz V2',
    label: 'Quiz Completed',
    value: totalSteps,
  });
};

export const trackCheckoutView = () => {
  event({
    action: 'checkout_view',
    category: 'Quiz V2',
    label: 'Checkout Page Viewed',
  });
};

export const trackPurchaseIntent = (plan: string, price: number) => {
  event({
    action: 'purchase_intent',
    category: 'Quiz V2',
    label: `Plan: ${plan}`,
    value: price,
  });
};

export const trackEmailCapture = (email: string) => {
  event({
    action: 'email_capture',
    category: 'Quiz V2',
    label: 'Email Captured',
  });
};

export const trackFreeTrialStart = () => {
  event({
    action: 'free_trial_start',
    category: 'Quiz V2',
    label: 'Free Trial Started',
  });
};

// =====================
// Quiz V3 Tracking Functions
// =====================

export const trackQuizV3Start = () => {
  event({
    action: 'quiz_start',
    category: 'Quiz V3',
    label: 'Quiz V3 Started',
  });
};

export const trackQuizV3Step = (step: number, questionType: string) => {
  event({
    action: 'quiz_step',
    category: 'Quiz V3',
    label: `Step ${step} - ${questionType}`,
    value: step,
  });
};

export const trackQuizV3Answer = (step: number, answer: any) => {
  event({
    action: 'quiz_answer',
    category: 'Quiz V3',
    label: `Step ${step}`,
    value: step,
  });
};

export const trackQuizV3Complete = (totalSteps: number) => {
  event({
    action: 'quiz_complete',
    category: 'Quiz V3',
    label: 'Quiz V3 Completed',
    value: totalSteps,
  });
};

export const trackQuizV3CheckoutView = () => {
  event({
    action: 'checkout_view',
    category: 'Quiz V3',
    label: 'Checkout Page Viewed',
  });
};

export const trackQuizV3PurchaseIntent = (plan: string, price: number) => {
  event({
    action: 'purchase_intent',
    category: 'Quiz V3',
    label: `Plan: ${plan}`,
    value: price,
  });
};

export const trackQuizV3EmailCapture = () => {
  event({
    action: 'email_capture',
    category: 'Quiz V3',
    label: 'Email Captured',
  });
};

export const trackQuizV3FreeTrialStart = () => {
  event({
    action: 'free_trial_start',
    category: 'Quiz V3',
    label: 'Free Trial Started',
  });
};
