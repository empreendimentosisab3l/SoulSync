'use client';

import { useState, useRef, useEffect } from 'react';
import { QuizV2Option } from '@/lib/quizDataV2';

interface QuizV2WheelProps {
  question: string;
  description?: string;
  options: QuizV2Option[];
  onContinue: (value: string) => void;
  buttonText?: string;
}

export default function QuizV2Wheel({
  question,
  description,
  options,
  onContinue,
  buttonText = "Continuar"
}: QuizV2WheelProps) {
  const [selectedIndex, setSelectedIndex] = useState(Math.floor(options.length / 2));
  const scrollRef = useRef<HTMLDivElement>(null);
  const itemHeight = 50; // Altura de cada item em pixels (ajustado para ficar mais compacto como no iOS)

  // Scroll para o item inicial
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = selectedIndex * itemHeight;
    }
  }, []);

  const handleScroll = () => {
    if (scrollRef.current) {
      const scrollTop = scrollRef.current.scrollTop;
      const index = Math.round(scrollTop / itemHeight);
      if (index >= 0 && index < options.length) {
        setSelectedIndex(index);
      }
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Question */}
      <div className="text-center space-y-3">
        <h2 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
          {question}
        </h2>
        {description && (
          <p className="text-sm text-white/50 max-w-lg mx-auto">
            {description}
          </p>
        )}
      </div>

      {/* iOS Picker Style */}
      <div className="relative h-[250px] w-full max-w-xs mx-auto overflow-hidden select-none">
        {/* Gradient Overlays (Fade effect) */}
        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-hypno-bg via-hypno-bg/95 to-transparent z-20 pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-hypno-bg via-hypno-bg/95 to-transparent z-20 pointer-events-none" />

        {/* Selection Lines (The "Lens") */}
        <div className="absolute top-1/2 left-0 right-0 h-[50px] -translate-y-1/2 border-y border-white/10 z-10 pointer-events-none" />

        {/* Scroll Container */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="h-full overflow-y-auto snap-y snap-mandatory scrollbar-hide py-[100px]"
          style={{ scrollBehavior: 'smooth' }}
        >
          {options.map((option, index) => {
            const isSelected = index === selectedIndex;
            const distance = Math.abs(index - selectedIndex);

            // iOS Style Transformations
            let scale = 1;
            let opacity = 1;
            let rotateX = 0;

            if (!isSelected) {
              scale = 0.85;
              opacity = 0.4;
              rotateX = index < selectedIndex ? 25 : -25; // 3D rotation effect
            }

            if (distance > 1) {
              opacity = 0.15;
              scale = 0.75;
            }

            return (
              <div
                key={index}
                className="h-[50px] flex items-center justify-center snap-center transition-all duration-200 cursor-pointer perspective-500"
                onClick={() => {
                  if (scrollRef.current) {
                    scrollRef.current.scrollTo({
                      top: index * itemHeight,
                      behavior: 'smooth'
                    });
                  }
                }}
              >
                <span
                  className={`transition-all duration-200 block ${isSelected
                    ? 'text-white font-semibold text-2xl tracking-wide'
                    : 'text-white font-medium text-xl'
                    }`}
                  style={{
                    transform: `scale(${scale}) rotateX(${rotateX}deg)`,
                    opacity: opacity
                  }}
                >
                  {option.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Continue Button - Sticky Footer */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-hypno-bg via-hypno-bg/95 to-transparent z-50 flex justify-center">
        <div className="w-full max-w-md">
          <button
            onClick={() => onContinue(options[selectedIndex].value)}
            className="w-full bg-gradient-to-r from-hypno-purple to-hypno-accent text-white py-4 rounded-full font-bold text-lg hover:scale-105 hover:shadow-lg hover:shadow-hypno-accent/50 transition-all duration-300"
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
}
