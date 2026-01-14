'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function QuizV3Landing() {
  const router = useRouter();

  useEffect(() => {
    // Track page view if needed
    console.log('Quiz V3 landing page loaded');
  }, []);

  const handleStart = () => {
    // Clear any previous quiz data
    localStorage.removeItem('quizV3Answers');
    localStorage.removeItem('userDataV3');

    // Start quiz at step 1
    router.push('/quiz-v3/1');
  };

  return (
    <div className="min-h-screen bg-hypno-bg relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-hypno-purple/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-hypno-accent/20 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-screen">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Hero Image */}
          <div className="relative w-full max-w-2xl mx-auto mb-8">
            <div className="aspect-[16/10] rounded-3xl overflow-hidden shadow-2xl">
              <img
                src="https://res.cloudinary.com/dw1p11dgq/image/upload/v1763515318/soulsync/hero/woman-headphones.jpg"
                alt="Mulher relaxada com fones de ouvido"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-hypno-purple/20 border border-hypno-purple/30 rounded-full px-6 py-2 text-hypno-accent text-sm font-medium">
            <span>⭐</span>
            <span>Junte-se a 187.432 pessoas</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
            A PERDA DE PESO COMEÇA NO SEU{' '}
            <span className="bg-gradient-to-r from-hypno-purple to-hypno-accent bg-clip-text text-transparent">
              CÉREBRO
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl sm:text-2xl text-white/80 max-w-2xl mx-auto">
            Elimine os desejos incontroláveis em poucas noites com um programa de hipnoterapia personalizado.
          </p>

          {/* Testimonials */}
          <div className="grid sm:grid-cols-3 gap-4 py-8">
            <div className="bg-hypno-dark/50 border border-hypno-purple/30 rounded-2xl p-6 space-y-2">
              <div className="text-yellow-400 text-xl">⭐⭐⭐⭐⭐</div>
              <p className="text-white/90 text-sm">"Perdi 12kg sem dieta rígida! 😊"</p>
              <p className="text-white/50 text-xs">- Tina, 47</p>
            </div>
            <div className="bg-hypno-dark/50 border border-hypno-purple/30 rounded-2xl p-6 space-y-2">
              <div className="text-yellow-400 text-xl">⭐⭐⭐⭐⭐</div>
              <p className="text-white/90 text-sm">"Perdi 9,5kg & 14% de gordura!"</p>
              <p className="text-white/50 text-xs">- Samantha, 53</p>
            </div>
            <div className="bg-hypno-dark/50 border border-hypno-purple/30 rounded-2xl p-6 space-y-2">
              <div className="text-yellow-400 text-xl">⭐⭐⭐⭐⭐</div>
              <p className="text-white/90 text-sm">"Parei de comer por emoções sem esforço"</p>
              <p className="text-white/50 text-xs">- Maya, 43</p>
            </div>
          </div>

          {/* CTA Button */}
          <button
            onClick={handleStart}
            className="group relative bg-gradient-to-r from-hypno-purple to-hypno-accent text-white px-12 py-5 rounded-full text-xl font-bold hover:scale-105 hover:shadow-2xl hover:shadow-hypno-accent/50 transition-all duration-300"
          >
            <span className="relative z-10">COMEÇAR MEU PLANO PERSONALIZADO</span>
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-hypno-accent to-hypno-purple opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>

          {/* Trust Signals */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-8 text-white/40 text-sm">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-hypno-accent" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>100% Seguro</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-hypno-accent" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
              </svg>
              <span>Sem Spam</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-hypno-accent" fill="currentColor" viewBox="0 0 20 20">
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
