'use client';

import { useState } from 'react';

interface CourseCardProps {
  id: number;
  title: string;
  image?: string;
  isLocked?: boolean;
  size?: 'large' | 'small';
  category?: string;
  upsellId?: string;
  onClick?: () => void;
}

export default function CourseCard({
  id,
  title,
  image,
  isLocked = false,
  size = 'small',
  upsellId,
  onClick
}: CourseCardProps) {
  const [imageError, setImageError] = useState(false);

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  // Gradientes diferentes para cada curso
  const getGradient = (courseId: number) => {
    const gradients: { [key: number]: string } = {
      1: 'from-orange-400 via-red-400 to-pink-500', // Comida - cores quentes
      2: 'from-blue-500 via-purple-500 to-indigo-600', // Procrastinação - cores produtivas
      3: 'from-pink-400 via-rose-400 to-red-400', // Bem-estar sexual - cores românticas
    };
    return gradients[courseId] || 'from-teal-400 to-teal-600';
  };

  return (
    <button
      onClick={handleClick}
      className={`relative overflow-hidden rounded-2xl group transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer ${
        isLocked ? 'opacity-90' : ''
      } ${
        size === 'large' ? 'aspect-[4/3]' : 'aspect-square'
      }`}
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        {!imageError && image ? (
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${getGradient(id)}`} />
        )}
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
      </div>

      {/* Lock Icon */}
      {isLocked && (
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full p-2 z-10">
          <svg
            className="w-4 h-4 text-gray-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        </div>
      )}

      {/* Headphones Icon (for available content) */}
      {!isLocked && (
        <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-sm rounded-full p-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
          <svg
            className="w-4 h-4 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
            />
          </svg>
        </div>
      )}

      {/* Title */}
      <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
        <h3 className={`text-white font-semibold text-left leading-tight ${
          size === 'large' ? 'text-lg' : 'text-sm'
        }`}>
          {title}
        </h3>
      </div>
    </button>
  );
}
