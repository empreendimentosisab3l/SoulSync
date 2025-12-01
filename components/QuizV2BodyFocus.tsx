'use client';

import { useState } from 'react';
import Image from 'next/image';
import { QuizV2Option } from '@/lib/quizDataV2';

interface QuizV2BodyFocusProps {
  question: string;
  subtitle?: string;
  options: QuizV2Option[];
  onContinue: (values: string[]) => void;
  buttonText?: string;
}

export default function QuizV2BodyFocus({
  question,
  subtitle,
  options,
  onContinue,
  buttonText = "Continuar"
}: QuizV2BodyFocusProps) {
  const [selected, setSelected] = useState<string[]>([]);

  const toggleOption = (value: string) => {
    setSelected(prev =>
      prev.includes(value)
        ? prev.filter(v => v !== value)
        : [...prev, value]
    );
  };

  const handleContinue = () => {
    if (selected.length > 0) {
      onContinue(selected);
    }
  };

  // Get image URL from Cloudinary for body parts
  const getBodyImage = (image: string) => {
    const imageMap: Record<string, string> = {
      'legs': 'https://res.cloudinary.com/dw1p11dgq/image/upload/v1762916024/hypnozio/quiz/body-parts/legs.png',
      'belly': 'https://res.cloudinary.com/dw1p11dgq/image/upload/v1762916020/hypnozio/quiz/body-parts/belly.png',
      'arms': 'https://res.cloudinary.com/dw1p11dgq/image/upload/v1762916019/hypnozio/quiz/body-parts/arms.png',
      'glutes': 'https://res.cloudinary.com/dw1p11dgq/image/upload/v1762916023/hypnozio/quiz/body-parts/glutes.png',
      'face': 'https://res.cloudinary.com/dw1p11dgq/image/upload/v1762916021/hypnozio/quiz/body-parts/face.png',
      'back': 'https://res.cloudinary.com/dw1p11dgq/image/upload/v1762916020/hypnozio/quiz/body-parts/belly.png' // usando belly como placeholder
    };
    return imageMap[image] || 'https://res.cloudinary.com/dw1p11dgq/image/upload/v1762916020/hypnozio/quiz/body-parts/belly.png';
  };

  return (
    <div className="space-y-8 animate-fade-in pb-32">
      {/* Question */}
      <div className="text-center space-y-3">
        <h2 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
          {question}
        </h2>
        {subtitle && (
          <p className="text-lg text-white/70">
            {subtitle}
          </p>
        )}
      </div>

      {/* Body Parts List */}
      <div className="space-y-3">
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => toggleOption(option.value)}
            className={`w-full flex items-stretch overflow-hidden border-2 rounded-2xl transition-all duration-300 ${selected.includes(option.value)
                ? 'bg-hypno-purple/30 border-hypno-accent shadow-lg shadow-hypno-accent/20'
                : 'bg-hypno-dark/50 border-hypno-purple/30 hover:border-hypno-accent/50'
              }`}
          >
            {/* Body Part Image - Left Side */}
            <div className="relative w-24 flex-shrink-0 bg-white/5">
              <Image
                src={getBodyImage(option.image || '')}
                alt={option.label}
                fill
                className="object-cover"
                sizes="96px"
              />
            </div>

            {/* Label - Center */}
            <div className="flex-1 flex items-center px-4 py-4 text-left text-white font-medium text-lg">
              {option.label}
            </div>

            {/* Checkmark - Right Side */}
            <div className="flex items-center px-4">
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${selected.includes(option.value)
                  ? 'bg-hypno-accent border-hypno-accent'
                  : 'border-white/30'
                }`}>
                {selected.includes(option.value) && (
                  <svg
                    className="w-4 h-4 text-hypno-bg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Continue Button - Sticky Footer */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-hypno-bg via-hypno-bg/95 to-transparent z-50 flex justify-center">
        <div className="w-full max-w-md">
          <button
            onClick={handleContinue}
            disabled={selected.length === 0}
            className={`w-full py-4 rounded-full font-bold text-lg transition-all duration-300 shadow-lg ${selected.length > 0
                ? 'bg-gradient-to-r from-hypno-purple to-hypno-accent text-white hover:scale-105 hover:shadow-hypno-accent/50'
                : 'bg-hypno-dark/50 text-white/30 cursor-not-allowed border border-white/5'
              }`}
          >
            {buttonText}
            {selected.length > 0 && ` (${selected.length} selecionado${selected.length > 1 ? 's' : ''})`}
          </button>
        </div>
      </div>
    </div>
  );
}
