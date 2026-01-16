'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface OnboardingProps {
  onComplete: () => void;
  onTopicSelect?: (audioUrl: string, title: string) => void;
}

export default function Onboarding({ onComplete, onTopicSelect }: OnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const router = useRouter();

  const steps = [
    {
      title: 'Bem-vindo!!',
      subtitle: 'Seu curso de hipnoterapia',
      image: '/images/onboarding-1.jpg',
      card: {
        badge: 'Perda de peso',
        title: 'Mudando a relação com a comida',
      },
      description: 'Para obter a melhor experiência possível durante suas sessões de hipnoterapia, siga nossas recomendações.',
    },
    {
      title: 'Nossas sessões de hipnoterapia comprovadas cientificamente oferecem uma abordagem holística para você ter bem-estar',
      benefits: [
        {
          icon: '📈',
          title: 'Níveis de estresse mais baixos',
        },
        {
          icon: '⏳',
          title: 'Resultados duradouros',
        },
        {
          icon: '📅',
          title: 'Resultados em apenas 4 dias',
        },
        {
          icon: '🧘',
          title: 'Relaxamento profundo',
        },
      ],
      cardTitle: 'Escolhendo a hipnoterapia, você obterá',
    },
    {
      title: 'Seu caminho rumo a melhores hábitos, saúde e felicidade',
      tips: [
        {
          icon: '🕐',
          text: 'Escolha seu melhor horário para as sessões. Não há horário "certo".',
        },
        {
          icon: '🔄',
          text: 'Ouça cada sessão 3 vezes para obter resultados melhores.',
        },
        {
          icon: '😴',
          text: 'Mesmo que você pegue no sono, a hipnose continua funcionando.',
        },
      ],
      cardTitle: 'Lembre-se',
    },
    {
      title: 'Escolha um tópico pelo qual você gostaria de começar',
      topics: [
        {
          image: '/images/topic-1.jpg',
          title: 'Gerenciamento de ingestão calórica',
          audioUrl: '/audios/Mudando a relação com a comida/02 - Abrace sua versão mais saudável/01 - Controle de calorias.mp3',
          sessionId: 'controle-calorias',
        },
        {
          image: '/images/topic-2.jpg',
          title: 'Rotina de alimentação saudável',
          audioUrl: '/audios/Mudando a relação com a comida/02 - Abrace sua versão mais saudável/03 - Alimentação saudável.mp3',
          sessionId: 'alimentacao-saudavel',
        },
        {
          image: '/images/topic-3.jpg',
          title: 'Mude sua visão sobre alimentos não saudáveis',
          audioUrl: '/audios/Mudando a relação com a comida/01 - Fundações de uma alimentação consciente/04 - Mude a forma de ver alimentos não saudáveis.mp3',
          sessionId: 'mude-visao-alimentos',
        },
        {
          image: '/images/topic-4.jpg',
          title: 'Elimine a compulsão alimentar',
          audioUrl: '/audios/Mudando a relação com a comida/01 - Fundações de uma alimentação consciente/05 - Elimine a compulsão alimentar.mp3',
          sessionId: 'elimine-compulsao',
        },
      ],
    },
  ];

  const currentStepData = steps[currentStep];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handleTopicClick = (topic: any) => {
    // Completar onboarding
    localStorage.setItem('hasSeenOnboarding', 'true');

    // Chamar callback para abrir o player
    if (onTopicSelect) {
      onTopicSelect(topic.audioUrl, topic.title);
    }

    // Completar onboarding (fechar modal)
    onComplete();
  };

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
      <div className="min-h-screen flex flex-col items-center justify-between p-4 sm:p-6 py-8 sm:py-12">
        {/* Logo */}
        <div className="text-center mb-4 sm:mb-8">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">SoulSync</h1>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col items-center justify-center w-full max-w-2xl">
          {/* Step 1: Welcome */}
          {currentStep === 0 && (
            <div className="text-center space-y-4 sm:space-y-6 animate-fadeIn">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
                {currentStepData.title}
              </h2>
              <p className="text-gray-600 text-base sm:text-lg">{currentStepData.subtitle}</p>

              {/* Image Card */}
              <div className="relative mx-auto max-w-md">
                <div className="rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg border border-gray-100">
                  <div className="aspect-[4/3] bg-gradient-to-br from-orange-400 to-red-400 flex items-center justify-center">
                    <div className="text-center p-4 sm:p-8">
                      <span className="inline-block bg-white/20 backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-white text-xs sm:text-sm mb-3 sm:mb-4">
                        {currentStepData.card?.badge}
                      </span>
                      <h3 className="text-xl sm:text-2xl font-bold text-white">
                        {currentStepData.card?.title}
                      </h3>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-gray-500 text-sm max-w-md mx-auto">
                {currentStepData.description}
              </p>
            </div>
          )}

          {/* Step 2: Benefits */}
          {currentStep === 1 && (
            <div className="text-center space-y-4 sm:space-y-8 animate-fadeIn">
              <p className="text-gray-700 text-base sm:text-lg max-w-xl mx-auto leading-relaxed px-2">
                {currentStepData.title}
              </p>

              {/* Benefits Card */}
              <div className="bg-teal-50 rounded-2xl sm:rounded-3xl p-4 sm:p-8 max-w-md mx-auto">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">
                  {currentStepData.cardTitle}
                </h3>
                <div className="grid grid-cols-2 gap-4 sm:gap-6">
                  {currentStepData.benefits?.map((benefit, index) => (
                    <div key={index} className="text-center">
                      <div className="text-3xl sm:text-4xl mb-1 sm:mb-2">{benefit.icon}</div>
                      <p className="text-gray-700 text-xs sm:text-sm">{benefit.title}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Tips */}
          {currentStep === 2 && (
            <div className="text-center space-y-4 sm:space-y-8 animate-fadeIn">
              <p className="text-gray-700 text-base sm:text-lg max-w-xl mx-auto px-2">
                {currentStepData.title}
              </p>

              {/* Tips Card */}
              <div className="bg-teal-50 rounded-2xl sm:rounded-3xl p-4 sm:p-8 max-w-md mx-auto">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">
                  {currentStepData.cardTitle}
                </h3>
                <div className="space-y-3 sm:space-y-4 text-left">
                  {currentStepData.tips?.map((tip, index) => (
                    <div key={index} className="flex items-start gap-3 sm:gap-4">
                      <span className="text-xl sm:text-2xl flex-shrink-0">{tip.icon}</span>
                      <p className="text-gray-700 text-xs sm:text-sm">{tip.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Topics */}
          {currentStep === 3 && (
            <div className="text-center space-y-4 sm:space-y-8 animate-fadeIn w-full">
              <p className="text-gray-900 font-medium text-base sm:text-xl max-w-2xl mx-auto px-2">
                {currentStepData.title}
              </p>

              {/* Topics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 max-w-4xl mx-auto">
                {currentStepData.topics?.map((topic, index) => (
                  <button
                    key={index}
                    onClick={() => handleTopicClick(topic)}
                    className="group relative overflow-hidden rounded-2xl sm:rounded-3xl aspect-[3/4] transition-all duration-300 active:scale-95 sm:hover:scale-105 shadow-md hover:shadow-xl"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-teal-500 to-teal-700 flex items-end p-3 sm:p-4">
                      <div className="text-left">
                        <p className="text-white text-xs sm:text-sm font-semibold leading-tight">
                          {topic.title}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="w-full max-w-md space-y-4 sm:space-y-6 mt-4 sm:mt-0">
          {/* Progress Dots */}
          <div className="flex justify-center gap-1.5 sm:gap-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
                  index === currentStep
                    ? 'w-6 sm:w-8 bg-teal-600'
                    : 'w-1.5 sm:w-2 bg-gray-200'
                }`}
              />
            ))}
          </div>

          {/* Next Button */}
          {currentStep < 3 && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleNext();
              }}
              className="w-full py-3 sm:py-4 bg-teal-600 hover:bg-teal-700 text-white font-bold text-base sm:text-lg rounded-full transition-all duration-300 sm:hover:scale-105 active:scale-95 cursor-pointer shadow-lg"
            >
              Prosseguir
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
