'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { pageview, trackQuizV3Start } from '@/lib/analytics';

export default function QuizV3Landing() {
  const router = useRouter();

  useEffect(() => {
    // Track page view
    pageview('/quiz-v3');
  }, []);

  const handleStart = () => {
    // Track quiz start
    trackQuizV3Start();

    // Clear any previous quiz data
    localStorage.removeItem('quizV3Answers');
    localStorage.removeItem('userDataV3');

    // Start quiz at step 1
    router.push('/quiz-v3/1');
  };

  return (
    <div className="min-h-screen bg-white py-6 sm:py-8 px-4">
      <div className="max-w-4xl w-full mx-auto relative">
        {/* Top Bar - Login */}
        <div className="absolute top-0 right-0 z-10">
          <Link
            href="/login"
            className="text-sm font-medium text-teal-600 hover:text-teal-800 transition-colors flex items-center gap-1 bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm hover:shadow-md border border-teal-100"
          >
            <span>Já sou membro</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-log-in"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" /><polyline points="10 17 15 12 10 7" /><line x1="15" x2="3" y1="12" y2="12" /></svg>
          </Link>
        </div>

        {/* Content */}
        <div className="text-center space-y-6 sm:space-y-8">
          {/* Hero Image */}
          <div className="relative w-full max-w-2xl mx-auto mb-6 sm:mb-8">
            <div className="aspect-[16/10] rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg">
              <img
                src="https://res.cloudinary.com/dw1p11dgq/image/upload/v1763515318/soulsync/hero/woman-headphones.jpg"
                alt="Mulher relaxada com fones de ouvido"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-teal-50 border border-teal-200 rounded-full px-4 sm:px-6 py-2 text-teal-700 text-xs sm:text-sm font-medium">
            <span>⭐</span>
            <span>Junte-se a 187.432 pessoas</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
            A PERDA DE PESO COMEÇA NO SEU{' '}
            <span className="bg-gradient-to-r from-teal-600 to-teal-800 bg-clip-text text-transparent">
              CÉREBRO
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-xl text-gray-700 max-w-2xl mx-auto leading-relaxed">
            Elimine os desejos incontroláveis em poucas noites com um programa de hipnoterapia personalizado.
          </p>

          {/* CTA Button - First Fold */}
          <button
            onClick={handleStart}
            className="bg-teal-600 text-white px-8 sm:px-12 py-4 sm:py-5 rounded-full text-base sm:text-xl font-bold active:scale-95 sm:hover:scale-105 hover:bg-teal-700 transition-all duration-300 shadow-lg hover:shadow-xl w-full sm:w-auto"
          >
            COMEÇAR MEU PLANO PERSONALIZADO
          </button>

          {/* Testimonials - Histórias reais */}
          <div className="py-10 sm:py-16 my-6 sm:my-10">
            <h2 className="text-xl sm:text-3xl font-bold text-gray-900 mb-8 sm:mb-12 text-center">
              -Histórias reais, resultados reais-
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
              {/* Tina */}
              <div className="bg-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src="https://res.cloudinary.com/dw1p11dgq/image/upload/v1768477006/soulsync/testimonials/tina-before-after.webp"
                    alt="Tina - Antes e Depois"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4 sm:p-6">
                  <p className="text-gray-700 text-sm sm:text-base leading-relaxed mb-3 sm:mb-4">
                    Esse programa simplesmente reprogramou algo em mim. Eu me alimento melhor, me sinto melhor e já perdi 12 kg.
                  </p>
                  <p className="text-gray-500 text-sm font-medium">-Tina, 37</p>
                </div>
              </div>

              {/* Samantha */}
              <div className="bg-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src="https://res.cloudinary.com/dw1p11dgq/image/upload/v1768477007/soulsync/testimonials/samantha-before-after.webp"
                    alt="Samantha - Antes e Depois"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4 sm:p-6">
                  <p className="text-gray-700 text-sm sm:text-base leading-relaxed mb-3 sm:mb-4">
                    O que eu mais gostei foi a facilidade. Sem planos rígidos ou acompanhamento. Perdi 9,5 kg e, sinceramente, foi muito fácil.
                  </p>
                  <p className="text-gray-500 text-sm font-medium">-Samantha, 53</p>
                </div>
              </div>

              {/* Maia */}
              <div className="bg-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src="https://res.cloudinary.com/dw1p11dgq/image/upload/v1768477007/soulsync/testimonials/maya-before-after.webp"
                    alt="Maia - Antes e Depois"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4 sm:p-6">
                  <p className="text-gray-700 text-sm sm:text-base leading-relaxed mb-3 sm:mb-4">
                    A hipnoterapia me ajudou a parar de comer por razões emocionais sem nenhum esforço. Não me senti limitada, apenas com mais controle.
                  </p>
                  <p className="text-gray-500 text-sm font-medium">-Maia, 65</p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Button - After Testimonials */}
          <button
            onClick={handleStart}
            className="bg-teal-600 text-white px-8 sm:px-12 py-4 sm:py-5 rounded-full text-base sm:text-xl font-bold active:scale-95 sm:hover:scale-105 hover:bg-teal-700 transition-all duration-300 shadow-lg hover:shadow-xl w-full sm:w-auto"
          >
            COMEÇAR MEU PLANO PERSONALIZADO
          </button>

          {/* Trust Signals */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 pt-6 sm:pt-8 text-gray-500 text-xs sm:text-sm">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-teal-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>100% Seguro</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-teal-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
              </svg>
              <span>Sem Spam</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-teal-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Privacidade Garantida</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
