/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        accent: '#6366f1',
        dark: {
          700: '#1a1d27',
          800: '#13161f',
          900: '#0f1117',
        },
      },
    },
  },
  plugins: [],
}
