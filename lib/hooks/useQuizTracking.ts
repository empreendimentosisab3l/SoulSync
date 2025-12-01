// lib/hooks/useQuizTracking.ts

import { useEffect, useRef } from 'react';

interface QuizTracker {
  trackStart: () => Promise<void>;
  trackCardView: (cardNumber: number, cardName: string) => Promise<void>;
  trackCardAnswer: (cardNumber: number, cardName: string, answer: any) => Promise<void>;
  trackEmail: (email: string) => Promise<void>;
  trackName: (name: string) => Promise<void>;
  trackComplete: (email?: string) => Promise<void>;
  trackInitiateCheckout: (email?: string, amount?: number) => Promise<void>;
  trackConversion: (email: string, amount: number, orderId: string) => Promise<void>;
}

interface TrackingData {
  quizId: string;
  sessionId: string;
  event: string;
  cardNumber?: number;
  cardName?: string;
  answer?: any;
  email?: string;
  name?: string;
  amount?: number;
  orderId?: string;
  metadata?: any;
}

export function useQuizTracking(quizId: string = 'hypnozio-weight-loss-quiz') {
  const trackerRef = useRef<QuizTracker | null>(null);
  const sessionIdRef = useRef<string>('');

  useEffect(() => {
    // Generate or retrieve session ID
    const getSessionId = () => {
      const STORAGE_KEY = `quiz_session_${quizId}`;
      const EXPIRY_KEY = `quiz_session_expiry_${quizId}`;

      let sessionId = localStorage.getItem(STORAGE_KEY);
      const expiry = localStorage.getItem(EXPIRY_KEY);
      const now = Date.now();

      // Check if session exists and is not expired (24 hours)
      if (sessionId && expiry && parseInt(expiry) > now) {
        return sessionId;
      }

      // Create new session
      sessionId = `session_${now}_${Math.random().toString(36).substr(2, 9)}`;
      const newExpiry = now + (24 * 60 * 60 * 1000); // 24 hours

      localStorage.setItem(STORAGE_KEY, sessionId);
      localStorage.setItem(EXPIRY_KEY, newExpiry.toString());

      return sessionId;
    };

    sessionIdRef.current = getSessionId();

    // Helper function to send tracking data
    const sendTrackingEvent = async (data: Partial<TrackingData>) => {
      try {
        const metadata = {
          userAgent: navigator.userAgent,
          screenWidth: window.screen.width,
          screenHeight: window.screen.height,
          language: navigator.language,
          referrer: document.referrer,
          timestamp: new Date().toISOString(),
          // Capture UTM parameters
          utmSource: new URLSearchParams(window.location.search).get('utm_source'),
          utmMedium: new URLSearchParams(window.location.search).get('utm_medium'),
          utmCampaign: new URLSearchParams(window.location.search).get('utm_campaign'),
        };

        const payload: TrackingData = {
          quizId,
          sessionId: sessionIdRef.current,
          event: data.event || '',
          ...data,
          metadata: { ...metadata, ...data.metadata },
        };

        await fetch('/api/track', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
          keepalive: true,
        });
      } catch (error) {
        console.error('Tracking error:', error);
      }
    };

    // Create tracker object
    trackerRef.current = {
      trackStart: async () => {
        await sendTrackingEvent({ event: 'quiz_started' });
      },

      trackCardView: async (cardNumber: number, cardName: string) => {
        await sendTrackingEvent({
          event: 'card_viewed',
          cardNumber,
          cardName,
        });
      },

      trackCardAnswer: async (cardNumber: number, cardName: string, answer: any) => {
        await sendTrackingEvent({
          event: 'card_answered',
          cardNumber,
          cardName,
          answer: typeof answer === 'object' ? JSON.stringify(answer) : answer,
        });
      },

      trackEmail: async (email: string) => {
        await sendTrackingEvent({
          event: 'email_collected',
          email,
        });
      },

      trackName: async (name: string) => {
        await sendTrackingEvent({
          event: 'name_collected',
          name,
        });
      },

      trackComplete: async (email?: string) => {
        await sendTrackingEvent({
          event: 'quiz_completed',
          email,
        });
      },

      trackInitiateCheckout: async (email?: string, amount?: number) => {
        await sendTrackingEvent({
          event: 'initiate_checkout',
          email,
          amount
        });
      },

      trackConversion: async (email: string, amount: number, orderId: string) => {
        await sendTrackingEvent({
          event: 'conversion',
          email,
          amount,
          orderId,
        });
      },
    };
  }, [quizId]);

  return trackerRef.current;
}
