/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['-apple-system', 'SF Pro Text', 'Helvetica Neue', 'sans-serif'],
        display: ['-apple-system', 'SF Pro Display', 'Helvetica Neue', 'sans-serif'],
        mono: ['SF Mono', 'Menlo', 'monospace'],
      },
      colors: {
        accent: {
          DEFAULT: '#0071e3',
          hover: '#0077ed',
          light: '#e8f1fb',
        },
        dark: {
          900: '#000000',
          800: '#1c1c1e',
          700: '#2c2c2e',
          600: '#3a3a3c',
          500: '#48484a',
        },
      },
      animation: {
        'fade-up': 'fadeUp 0.4s cubic-bezier(0.22,1,0.36,1) both',
        'slide-down': 'slideDown 0.25s cubic-bezier(0.22,1,0.36,1) both',
        'pulse-dot': 'pulseDot 2s ease-in-out infinite',
        'spin-slow': 'spin 1s linear infinite',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: 0, transform: 'translateY(10px)' },
          to:   { opacity: 1, transform: 'translateY(0)' },
        },
        slideDown: {
          from: { opacity: 0, transform: 'translateY(-6px)' },
          to:   { opacity: 1, transform: 'translateY(0)' },
        },
        pulseDot: {
          '0%,100%': { opacity: 1, transform: 'scale(1)' },
          '50%':     { opacity: 0.5, transform: 'scale(0.85)' },
        },
      },
    },
  },
  plugins: [],
  safelist: [
    'border-white/15',
    'border-white/18',
    'border-white/20',
  ],
}
