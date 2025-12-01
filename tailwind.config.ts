import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
        },
        soul: {
          purple: '#5B4B8A',
          lavender: '#9B8BC4',
          rose: '#D4A5A5',
          peach: '#E8C4B8',
          cream: '#F5F3ED',
          sand: '#E8E4DC',
        },
        // Premium Dark palette for Quiz V2 (Hypnotherapy)
        hypno: {
          'dark': '#1A1A2E',      // Roxo escuro - Primária
          'purple': '#6A4C93',     // Roxo médio - Secundária
          'accent': '#00D9FF',     // Azul neon - Accent
          'bg': '#0F0F1E',         // Quase preto - Background
        },
      },
    },
  },
  plugins: [],
};
export default config;
