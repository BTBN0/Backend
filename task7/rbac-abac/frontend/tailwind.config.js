/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"DM Serif Display"', 'serif'],
        mono:    ['"JetBrains Mono"', 'monospace'],
        sans:    ['"DM Sans"', 'sans-serif'],
      },
      colors: {
        ink:   '#0c0c10',
        shell: '#111116',
        plate: '#16161d',
        rim:   '#222230',
        mist:  '#3a3a52',
        ghost: '#5e5e80',
        smoke: '#9898b8',
        snow:  '#e8e8f5',
        // accents
        volt:  '#c8ff00',
        neon:  '#00ffe0',
        flame: '#ff4f2b',
        iris:  '#7b6cff',
        gold:  '#f5c430',
        moss:  '#3ddc97',
      },
      animation: {
        'fade-up':   'fadeUp .45s ease both',
        'fade-in':   'fadeIn .3s ease both',
        'slide-in':  'slideIn .35s ease both',
        'pulse-slow':'pulse 3s ease-in-out infinite',
        'spin-slow': 'spin 8s linear infinite',
      },
      keyframes: {
        fadeUp:  { from: { opacity: 0, transform: 'translateY(14px)' }, to: { opacity: 1, transform: 'none' } },
        fadeIn:  { from: { opacity: 0 }, to: { opacity: 1 } },
        slideIn: { from: { transform: 'translateX(-100%)' }, to: { transform: 'none' } },
      },
    },
  },
  plugins: [],
}
