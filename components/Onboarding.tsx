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
    <div className="fixed inset-0 bg-gradient-to-br from-teal-700 via-teal-600 to-teal-800 z-50 overflow-y-auto">
      <div className="min-h-screen flex flex-col items-center justify-between p-6 py-12">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">SoulSync</h1>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col items-center justify-center w-full max-w-2xl">
          {/* Step 1: Welcome */}
          {currentStep === 0 && (
            <div className="text-center space-y-6 animate-fadeIn">
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                {currentStepData.title}
              </h2>
              <p className="text-white/90 text-lg">{currentStepData.subtitle}</p>

              {/* Image Card */}
              <div className="relative mx-auto max-w-md">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/20">
                  <div className="aspect-[4/3] bg-gradient-to-br from-orange-400 to-red-400 flex items-center justify-center">
                    <div className="text-center p-8">
                      <span className="inline-block bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm mb-4">
                        {currentStepData.card?.badge}
                      </span>
                      <h3 className="text-2xl font-bold text-white">
                        {currentStepData.card?.title}
                      </h3>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-white/80 text-sm max-w-md mx-auto">
                {currentStepData.description}
              </p>
            </div>
          )}

          {/* Step 2: Benefits */}
          {currentStep === 1 && (
            <div className="text-center space-y-8 animate-fadeIn">
              <p className="text-white/90 text-lg max-w-xl mx-auto leading-relaxed">
                {currentStepData.title}
              </p>

              {/* Benefits Card */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 max-w-md mx-auto">
                <h3 className="text-xl font-semibold text-white mb-6">
                  {currentStepData.cardTitle}
                </h3>
                <div className="grid grid-cols-2 gap-6">
                  {currentStepData.benefits?.map((benefit, index) => (
                    <div key={index} className="text-center">
                      <div className="text-4xl mb-2">{benefit.icon}</div>
                      <p className="text-white/90 text-sm">{benefit.title}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Tips */}
          {currentStep === 2 && (
            <div className="text-center space-y-8 animate-fadeIn">
              <p className="text-white/90 text-lg max-w-xl mx-auto">
                {currentStepData.title}
              </p>

              {/* Tips Card */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 max-w-md mx-auto">
                <h3 className="text-xl font-semibold text-white mb-6">
                  {currentStepData.cardTitle}
                </h3>
                <div className="space-y-4 text-left">
                  {currentStepData.tips?.map((tip, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <span className="text-2xl flex-shrink-0">{tip.icon}</span>
                      <p className="text-white/90 text-sm">{tip.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Topics */}
          {currentStep === 3 && (
            <div className="text-center space-y-8 animate-fadeIn w-full">
              <p className="text-white text-xl max-w-2xl mx-auto">
                {currentStepData.title}
              </p>

              {/* Topics Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
                {currentStepData.topics?.map((topic, index) => (
                  <button
                    key={index}
                    onClick={() => handleTopicClick(topic)}
                    className="group relative overflow-hidden rounded-2xl aspect-[3/4] transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-teal-400 to-teal-600 flex items-end p-4">
                      <div className="text-left">
                        <p className="text-white text-sm font-semibold leading-tight">
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
        <div className="w-full max-w-md space-y-6">
          {/* Progress Dots */}
          <div className="flex justify-center gap-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentStep
                    ? 'w-8 bg-white'
                    : 'w-2 bg-white/40'
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
              className="w-full py-4 bg-teal-400 hover:bg-teal-300 text-teal-900 font-bold rounded-xl transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
            >
              Prosseguir
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
