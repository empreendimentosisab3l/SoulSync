'use client';

import { useEffect, useState } from 'react';

interface WeightLossChartProps {
  currentWeight: number;
  targetWeight: number;
  eventDate?: string;
}

export default function WeightLossChart({
  currentWeight,
  targetWeight,
  eventDate
}: WeightLossChartProps) {
  const [animateChart, setAnimateChart] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimateChart(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const formatDate = (dateString?: string) => {
    if (!dateString) {
      const futureDate = new Date('2025-11-20');
      futureDate.setMonth(futureDate.getMonth() + 3);
      return futureDate.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' }).toUpperCase().replace('.', '');
    }
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' }).toUpperCase().replace('.', '');
  };

  return (
    <div className="bg-gradient-to-br from-purple-900/20 via-blue-900/10 to-cyan-900/20 rounded-3xl p-8 border-2 border-purple-500/30 shadow-2xl">
      <svg
        viewBox="0 0 320 180"
        className="w-full h-auto"
      >
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#A78BFA" />
            <stop offset="50%" stopColor="#60A5FA" />
            <stop offset="100%" stopColor="#22D3EE" />
          </linearGradient>
          <linearGradient id="fillGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#0EA5E9" stopOpacity="0.05" />
          </linearGradient>
        </defs>

        {/* Background grid subtle */}
        <line x1="40" y1="120" x2="280" y2="120" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />

        {/* Filled area under curve */}
        <path
          d="M 40 50 Q 160 120, 280 120 L 280 120 L 40 120 Z"
          fill="url(#fillGradient)"
          className={`transition-all duration-1500 ${animateChart ? 'opacity-100' : 'opacity-0'}`}
        />

        {/* Main curve - smooth and beautiful */}
        <path
          d="M 40 50 Q 160 120, 280 120"
          fill="none"
          stroke="url(#lineGradient)"
          strokeWidth="4"
          strokeLinecap="round"
          className={`transition-all duration-1500 ${animateChart ? 'opacity-100' : 'opacity-0'}`}
        />

        {/* Start point */}
        <circle
          cx="40"
          cy="50"
          r="6"
          fill="#8B5CF6"
          className={`transition-all duration-500 delay-300 ${animateChart ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}
          style={{ transformOrigin: '40px 50px' }}
        />
        <circle cx="40" cy="50" r="10" fill="#8B5CF6" opacity="0.3" />

        {/* Start label */}
        <text
          x="40"
          y="35"
          textAnchor="middle"
          fill="#A78BFA"
          fontSize="14"
          fontWeight="700"
        >
          {currentWeight} kg
        </text>

        {/* Target point - at the end */}
        <circle
          cx="280"
          cy="120"
          r="6"
          fill="#22D3EE"
          className={`transition-all duration-500 delay-700 ${animateChart ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}
          style={{ transformOrigin: '280px 120px' }}
        />
        <circle cx="280" cy="120" r="10" fill="#22D3EE" opacity="0.3" />

        {/* Target badge - positioned above the end point */}
        <g className={`transition-all duration-500 delay-900 ${animateChart ? 'opacity-100' : 'opacity-0'}`}>
          <rect
            x="245"
            y="75"
            width="70"
            height="26"
            rx="13"
            fill="#22D3EE"
            filter="drop-shadow(0 4px 12px rgba(34, 211, 238, 0.4))"
          />
          <text
            x="280"
            y="84"
            textAnchor="middle"
            fill="#0F172A"
            fontSize="10"
            fontWeight="700"
          >
            Objetivo
          </text>
          <text
            x="280"
            y="95"
            textAnchor="middle"
            fill="#0F172A"
            fontSize="13"
            fontWeight="800"
          >
            {targetWeight}kg
          </text>
        </g>

        {/* X-axis labels - beautiful typography */}
        <text
          x="40"
          y="165"
          textAnchor="start"
          fill="rgba(255,255,255,0.5)"
          fontSize="12"
          fontWeight="600"
          letterSpacing="0.5"
        >
          AGORA
        </text>
        <text
          x="280"
          y="165"
          textAnchor="end"
          fill="rgba(255,255,255,0.5)"
          fontSize="12"
          fontWeight="600"
          letterSpacing="0.5"
        >
          {formatDate(eventDate)}
        </text>
      </svg>

      {/* Disclaimer */}
      <p className="text-center text-white/20 text-xs mt-4">
        Este gráfico é apenas para fins ilustrativos
      </p>
    </div>
  );
}
