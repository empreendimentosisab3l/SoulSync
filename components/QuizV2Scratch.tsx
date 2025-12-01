'use client';

import { useEffect, useRef, useState } from 'react';

interface QuizV2ScratchProps {
  title?: string;
  subtitle?: string;
  discountPercent: number;
  discountText: string;
  onComplete: (couponCode: string) => void;
  buttonText?: string;
}

export default function QuizV2Scratch({
  title = "Raspe para revelar seu desconto especial!",
  subtitle = "Queremos que você comece sua jornada com uma agradável surpresa.",
  discountPercent,
  discountText,
  onComplete,
  buttonText = "Continuar"
}: QuizV2ScratchProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const couponContainerRef = useRef<HTMLDivElement>(null);
  const isScratching = useRef(false);
  const lastCheckTime = useRef(0);
  const lastPosition = useRef<{ x: number; y: number } | null>(null);
  const [scratchPercentage, setScratchPercentage] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [countdown, setCountdown] = useState<number | null>(null);

  // Generate personalized coupon code
  useEffect(() => {
    const answers = localStorage.getItem('quizV2Answers');
    let name = 'HYPNO';

    if (answers) {
      try {
        const parsed = JSON.parse(answers);
        const nameAnswer = parsed['47']; // Card 47 is Name

        if (nameAnswer) {
          // Remove accents and special characters
          const cleanName = nameAnswer.split(' ')[0].normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();
          name = cleanName;
        }
      } catch (e) {
        // Ignore parsing errors
      }
    }

    const code = `${name}50`;
    setCouponCode(code);
  }, []);

  // Auto-scratch after 7 seconds if not interacted
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isRevealed) {
        revealAll();
      }
    }, 7000);

    return () => clearTimeout(timer);
  }, [isRevealed]);

  // Start countdown when revealed
  useEffect(() => {
    if (isRevealed) {
      setCountdown(5);

      const interval = setInterval(() => {
        setCountdown(prev => {
          if (prev === null || prev <= 1) {
            clearInterval(interval);
            // Auto-advance after countdown
            setTimeout(() => {
              onComplete(couponCode);
            }, 300);
            return 0;
          }
          return prev - 1;
        });
      }, 700); // Mudado de 1000ms para 700ms

      return () => clearInterval(interval);
    }
  }, [isRevealed, couponCode, onComplete]);

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    const couponContainer = couponContainerRef.current;
    if (!canvas || !couponContainer) return;

    // Wait a bit for the DOM to be fully rendered
    const timer = setTimeout(() => {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Set canvas size
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

      const width = rect.width;
      const height = rect.height;

      // Find the separator line element to get its exact position
      const separatorElement = couponContainer.querySelector('[class*="border-dashed"]') as HTMLElement;
      const containerRect = couponContainer.getBoundingClientRect();
      let separatorY = height * 0.6; // Fallback

      if (separatorElement) {
        const separatorRect = separatorElement.getBoundingClientRect();
        // Calculate relative position from container top
        separatorY = separatorRect.top - containerRect.top + separatorRect.height / 2;
      }

      // Find the circle elements to get their exact positions
      const circleElements = couponContainer.querySelectorAll('[class*="rounded-full"]');
      let leftCircleX = 20; // Fallback
      let rightCircleX = width - 20; // Fallback
      const circleRadius = 16; // w-8 h-8 = 32px / 2 = 16px

      if (circleElements.length >= 2) {
        const leftCircle = circleElements[0] as HTMLElement;
        const rightCircle = circleElements[1] as HTMLElement;

        const leftCircleRect = leftCircle.getBoundingClientRect();
        const rightCircleRect = rightCircle.getBoundingClientRect();

        // Calculate relative positions from container left
        leftCircleX = (leftCircleRect.left - containerRect.left) + leftCircleRect.width / 2;
        rightCircleX = (rightCircleRect.left - containerRect.left) + rightCircleRect.width / 2;
      }

      // Draw scratch surface (original color)
      ctx.fillStyle = '#3D3028';
      ctx.fillRect(0, 0, width, height);

      // Draw circles on sides with background color (same as screen background)
      ctx.fillStyle = '#042f2e'; // hypno-bg color (Teal 950)
      ctx.beginPath();
      ctx.arc(leftCircleX, separatorY, circleRadius, 0, Math.PI * 2); // Left circle at exact position
      ctx.fill();
      ctx.beginPath();
      ctx.arc(rightCircleX, separatorY, circleRadius, 0, Math.PI * 2); // Right circle at exact position
      ctx.fill();

      // Draw dotted separator line (same position as the revealed coupon)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.lineWidth = 4;
      ctx.setLineDash([8, 8]); // dashed border
      ctx.beginPath();
      ctx.moveTo(leftCircleX + circleRadius + 10, separatorY); // Start after left circle
      ctx.lineTo(rightCircleX - circleRadius - 10, separatorY); // End before right circle
      ctx.stroke();
      ctx.setLineDash([]); // Reset dash

      // Draw "raspe aqui" text (above the separator line)
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 24px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('raspe aqui', width / 2, separatorY - 60);

      // Draw hand icon suggestion (above the separator line)
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.font = '48px sans-serif';
      ctx.fillText('👆', width / 2, separatorY - 10);
    }, 100);

    return () => clearTimeout(timer);
  }, [discountPercent, discountText]);

  const scratch = (x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const currentX = (x - rect.left) * scaleX;
    const currentY = (y - rect.top) * scaleY;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.lineWidth = 80 * window.devicePixelRatio;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (lastPosition.current) {
      // Draw line from last position to current position
      ctx.beginPath();
      ctx.moveTo(lastPosition.current.x, lastPosition.current.y);
      ctx.lineTo(currentX, currentY);
      ctx.stroke();
    } else {
      // First touch/click - draw a circle
      ctx.beginPath();
      ctx.arc(currentX, currentY, 40 * window.devicePixelRatio, 0, Math.PI * 2);
      ctx.fill();
    }

    lastPosition.current = { x: currentX, y: currentY };

    // Check scratch percentage (throttled to every 150ms)
    const now = Date.now();
    if (now - lastCheckTime.current > 150) {
      lastCheckTime.current = now;
      checkScratchPercentage();
    }
  };

  const checkScratchPercentage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    let transparentPixels = 0;

    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] < 128) {
        transparentPixels++;
      }
    }

    const percentage = (transparentPixels / (pixels.length / 4)) * 100;
    setScratchPercentage(percentage);

    if (percentage > 50 && !isRevealed) {
      setIsRevealed(true);
      // Clear entire canvas after revealing
      setTimeout(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }, 300);
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    isScratching.current = true;
    scratch(e.clientX, e.clientY);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (isScratching.current) {
      scratch(e.clientX, e.clientY);
    }
  };

  const handleMouseUp = () => {
    isScratching.current = false;
    lastPosition.current = null;
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    isScratching.current = true;
    const touch = e.touches[0];
    scratch(touch.clientX, touch.clientY);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (isScratching.current && e.touches.length > 0) {
      const touch = e.touches[0];
      scratch(touch.clientX, touch.clientY);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    isScratching.current = false;
    lastPosition.current = null;
  };

  const revealAll = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setIsRevealed(true);
    setScratchPercentage(100);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header - blur when revealed */}
      <div className={`text-center space-y-3 transition-all duration-700 ${isRevealed ? 'blur-sm opacity-50 scale-95' : ''}`}>
        <h2 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
          {title}
        </h2>
        <p className="text-white/60 text-base">
          {subtitle}
        </p>
      </div>

      {/* Scratch Card Container */}
      <div className={`relative transition-all duration-700 ${isRevealed ? 'scale-110 z-50' : 'scale-90'}`}>
        {/* Revealed Content (behind canvas) */}
        <div ref={couponContainerRef} className="bg-gradient-to-br from-hypno-dark to-hypno-purple rounded-3xl p-8 border-2 border-hypno-purple/50 shadow-2xl">
          <div className="text-center space-y-6">
            {/* Discount Display */}
            <div className="space-y-2">
              <div className="text-7xl sm:text-8xl font-black text-white">
                {discountPercent}%
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-white">
                desconto
              </div>
              <p className="text-white/80 text-lg mt-4">
                {discountText}
              </p>
            </div>

            {/* Dotted Separator - Coupon Style */}
            <div className="relative my-8">
              <div className="border-t-4 border-dashed border-white/50"></div>
              {/* Circles on the sides for ticket effect */}
              <div className="absolute -left-10 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-gradient-to-br from-hypno-bg to-hypno-card"></div>
              <div className="absolute -right-10 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-gradient-to-br from-hypno-bg to-hypno-card"></div>
            </div>

            {/* Coupon Code */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border-4 border-dashed border-hypno-accent/30">
              <p className="text-gray-600 text-sm mb-2 font-semibold">Código promocional</p>
              <div className="flex items-center justify-center gap-3">
                <svg className="w-7 h-7 text-hypno-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-3xl font-black text-gray-800 tracking-wide">
                  {couponCode}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Scratch Canvas (on top) */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full cursor-pointer rounded-3xl"
          style={{ touchAction: 'none' }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        />
      </div>

      {/* Info Text - blur when revealed */}
      <div className={`transition-all duration-700 ${isRevealed ? 'blur-sm opacity-50 scale-95' : ''}`}>
        <p className="text-center text-white/60 text-sm">
          Aplicado automaticamente no momento da finalização da compra.
        </p>
      </div>

      {/* Countdown - only show when revealed */}
      {isRevealed && countdown !== null && countdown > 0 && (
        <div className="flex flex-col items-center justify-center animate-fade-in">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-hypno-dark/80 border-4 border-hypno-accent flex items-center justify-center animate-pulse">
              <span className="text-5xl font-bold text-white">
                {countdown}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Progress hint - blur when revealed */}
      <div className={`transition-all duration-700 ${isRevealed ? 'blur-sm opacity-50 scale-95' : ''}`}>
        {!isRevealed && scratchPercentage > 0 && scratchPercentage < 30 && (
          <p className="text-center text-hypno-accent text-sm animate-pulse">
            Continue raspando... {Math.round(scratchPercentage)}%
          </p>
        )}

        {/* Reveal button - shows if scratching but not revealed yet */}
        {!isRevealed && scratchPercentage >= 15 && (
          <button
            onClick={revealAll}
            className="w-full bg-hypno-dark/50 border-2 border-hypno-purple/50 text-white py-3 rounded-full font-medium hover:bg-hypno-purple/30 transition-all duration-300 animate-fade-in"
          >
            ✨ Toque aqui para revelar instantaneamente
          </button>
        )}
      </div>
    </div>
  );
}
