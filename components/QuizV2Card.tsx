'use client';

import { ReactNode } from 'react';

interface QuizV2CardProps {
  children: ReactNode;
  isQuestion?: boolean;
  progress?: number;
  currentStep?: number;
  totalSteps?: number;
}

export default function QuizV2Card({
  children,
  progress = 0,
  currentStep,
  totalSteps = 50,
  isQuestion = true
}: QuizV2CardProps) {
  return (
    <div className="min-h-screen bg-hypno-bg flex flex-col">
      {/* Header with Progress */}
      <div className="px-6 pt-6 pb-2">
        <div className="max-w-2xl mx-auto w-full space-y-3">
          {/* Header Content */}
          <div className="relative flex items-center justify-center h-8 mb-2">
            {isQuestion ? (
              <>
                {/* Back Button Placeholder (if needed later) */}
                <div className="absolute left-0">
                  {/* <button className="text-white/80"><ArrowLeft /></button> */}
                </div>

                {/* Title */}
                <span className="text-white font-medium text-lg">Meu perfil</span>

                {/* Menu Placeholder (if needed later) */}
                <div className="absolute right-0">
                  {/* <button className="text-white/80"><Menu /></button> */}
                </div>
              </>
            ) : (
              <div className="w-full flex justify-start">
                <span className="text-white font-bold text-xl tracking-tight">SoulSync</span>
              </div>
            )}
          </div>

          {/* Progress Bar (Only show for questions or if desired for all) */}
          <div className="w-full bg-hypno-dark/50 h-1.5 rounded-full overflow-hidden border border-white/5">
            <div
              className="h-full bg-gradient-to-r from-hypno-purple to-hypno-accent transition-all duration-700 ease-out shadow-[0_0_10px_rgba(139,92,246,0.5)]"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Card Content */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-2xl">
          {children}
        </div>
      </div>
    </div>
  );
}
