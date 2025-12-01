'use client';

import { useState, useEffect, useRef } from 'react';

interface QuizV2DatePickerProps {
  question: string;
  description?: string;
  onContinue: (value: string) => void;
  onSkip?: () => void;
  buttonText?: string;
}

export default function QuizV2DatePicker({
  question,
  description,
  onContinue,
  onSkip,
  buttonText = "Avançar"
}: QuizV2DatePickerProps) {
  // Generate arrays for days, months, years
  const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString().padStart(2, '0'));
  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => (currentYear + i).toString());

  // Set default date to 3 months from now
  const getDefaultDate = () => {
    const today = new Date();
    const threeMonthsLater = new Date(today.setMonth(today.getMonth() + 3));
    return {
      day: threeMonthsLater.getDate() - 1, // index
      month: threeMonthsLater.getMonth(), // index (0-11)
      year: years.indexOf(threeMonthsLater.getFullYear().toString()) // index in years array
    };
  };

  const defaultDate = getDefaultDate();
  const [selectedDay, setSelectedDay] = useState(defaultDate.day);
  const [selectedMonth, setSelectedMonth] = useState(defaultDate.month);
  const [selectedYear, setSelectedYear] = useState(defaultDate.year >= 0 ? defaultDate.year : 0);

  const dayScrollRef = useRef<HTMLDivElement>(null);
  const monthScrollRef = useRef<HTMLDivElement>(null);
  const yearScrollRef = useRef<HTMLDivElement>(null);

  const itemHeight = 50;

  // Scroll to initial positions
  useEffect(() => {
    if (dayScrollRef.current) dayScrollRef.current.scrollTop = selectedDay * itemHeight;
    if (monthScrollRef.current) monthScrollRef.current.scrollTop = selectedMonth * itemHeight;
    if (yearScrollRef.current) yearScrollRef.current.scrollTop = selectedYear * itemHeight;
  }, []);

  const handleDayScroll = () => {
    if (dayScrollRef.current) {
      const index = Math.round(dayScrollRef.current.scrollTop / itemHeight);
      if (index >= 0 && index < days.length) {
        setSelectedDay(index);
      }
    }
  };

  const handleMonthScroll = () => {
    if (monthScrollRef.current) {
      const index = Math.round(monthScrollRef.current.scrollTop / itemHeight);
      if (index >= 0 && index < months.length) {
        setSelectedMonth(index);
      }
    }
  };

  const handleYearScroll = () => {
    if (yearScrollRef.current) {
      const index = Math.round(yearScrollRef.current.scrollTop / itemHeight);
      if (index >= 0 && index < years.length) {
        setSelectedYear(index);
      }
    }
  };

  const handleContinue = () => {
    const monthNumber = (selectedMonth + 1).toString().padStart(2, '0');
    const dayNumber = days[selectedDay];
    const yearNumber = years[selectedYear];
    const dateString = `${yearNumber}-${monthNumber}-${dayNumber}`;
    onContinue(dateString);
  };

  const renderWheel = (
    items: string[],
    selectedIndex: number,
    scrollRef: React.RefObject<HTMLDivElement>,
    onScroll: () => void
  ) => {
    return (
      <div className="relative h-[250px] flex-1 overflow-hidden select-none" style={{ perspective: '1000px' }}>
        {/* Gradient Overlays */}
        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-hypno-bg via-hypno-bg/95 to-transparent z-20 pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-hypno-bg via-hypno-bg/95 to-transparent z-20 pointer-events-none" />

        {/* Selection Line - iOS style */}
        <div className="absolute top-1/2 left-0 right-0 h-[50px] -translate-y-1/2 z-10 pointer-events-none">
          <div className="absolute inset-0 border-y border-white/20" />
          <div className="absolute inset-0 bg-white/5" />
        </div>

        {/* Scroll Container */}
        <div
          ref={scrollRef}
          onScroll={onScroll}
          className="h-full overflow-y-scroll snap-y snap-mandatory py-[100px]"
          style={{
            scrollBehavior: 'auto',
            WebkitOverflowScrolling: 'touch',
            scrollSnapType: 'y mandatory',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}
        >
          <style jsx>{`
            div::-webkit-scrollbar {
              display: none;
            }
          `}</style>
          {items.map((item, index) => {
            const isSelected = index === selectedIndex;
            const distance = index - selectedIndex;
            const absDistance = Math.abs(distance);

            // Calculate 3D rotation based on distance from center
            const maxRotation = 45; // degrees
            const rotateX = distance * (maxRotation / 3); // Gradual rotation

            // Calculate scale - items further away are smaller
            let scale = 1;
            if (absDistance === 1) scale = 0.85;
            else if (absDistance === 2) scale = 0.7;
            else if (absDistance > 2) scale = 0.6;

            // Calculate opacity - fade out distant items
            let opacity = 1;
            if (absDistance === 1) opacity = 0.6;
            else if (absDistance === 2) opacity = 0.3;
            else if (absDistance > 2) opacity = 0.15;

            // Calculate Z-axis translation for depth effect
            const translateZ = isSelected ? 0 : -absDistance * 20;

            return (
              <div
                key={index}
                className="h-[50px] flex items-center justify-center snap-center cursor-pointer"
                style={{
                  scrollSnapAlign: 'center',
                  scrollSnapStop: 'always'
                }}
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
                  className={`block transition-all duration-100 ${isSelected
                      ? 'text-white font-semibold text-2xl tracking-wide'
                      : 'text-white/70 font-medium text-xl'
                    }`}
                  style={{
                    transform: `
                      perspective(1000px)
                      rotateX(${-rotateX}deg)
                      scale(${scale})
                      translateZ(${translateZ}px)
                    `,
                    transformStyle: 'preserve-3d',
                    opacity: opacity,
                    transition: 'all 0.1s cubic-bezier(0.4, 0.0, 0.2, 1)'
                  }}
                >
                  {item}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-fade-in pb-32">
      {/* Question */}
      <div className="text-center space-y-3">
        <h2 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
          Parece empolgante!
        </h2>
        <p className="text-xl text-hypno-accent font-semibold">
          {question}
        </p>
        {description && (
          <p className="text-sm text-white/50 max-w-lg mx-auto">
            {description}
          </p>
        )}
      </div>

      {/* Date Pickers (3 wheels) */}
      <div className="space-y-4">
        <div className="flex gap-2 max-w-md mx-auto">
          {/* Day Wheel */}
          {renderWheel(days, selectedDay, dayScrollRef, handleDayScroll)}

          {/* Month Wheel */}
          {renderWheel(months, selectedMonth, monthScrollRef, handleMonthScroll)}

          {/* Year Wheel */}
          {renderWheel(years, selectedYear, yearScrollRef, handleYearScroll)}
        </div>

        {/* Helper Text */}
        <p className="text-center text-white/60 text-sm">
          Vamos lembrar disso durante a sua jornada.
        </p>

        {/* Skip Link */}
        {onSkip && (
          <div className="text-center">
            <button
              onClick={onSkip}
              className="text-hypno-accent hover:text-hypno-accent/80 transition-colors text-sm underline"
            >
              Pular esta pergunta
            </button>
          </div>
        )}
      </div>

      {/* Continue Button - Sticky Footer */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-hypno-bg via-hypno-bg/95 to-transparent z-50 flex justify-center">
        <div className="w-full max-w-md">
          <button
            onClick={handleContinue}
            className="w-full bg-gradient-to-r from-hypno-purple to-hypno-accent text-white py-4 rounded-full font-bold text-lg hover:scale-105 hover:shadow-lg hover:shadow-hypno-accent/50 transition-all duration-300"
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
}
