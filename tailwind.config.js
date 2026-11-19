/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        obsidian: {
          DEFAULT: '#050505',
          dark: '#030303',
          card: '#0E0E0E',
          surface: '#141414',
          border: 'rgba(255, 255, 255, 0.12)',
          muted: '#8A8A8A'
        },
        timuse: {
          gold: '#E5C158',
          'gold-light': '#F4DC8C',
          'gold-dark': '#B89635',
          grey: '#8A8A8A',
          darkgrey: '#1C1C1C'
        },
        luxury: {
          950: '#050505',
          900: '#0E0E0E',
          800: '#141414',
          700: '#1C1C1C',
          gold: '#E5C158',
          'gold-light': '#F4DC8C',
          'gold-dark': '#B89635'
        }
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'Playfair Display', 'serif'],
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
      letterSpacing: {
        widest: '0.15em',
        editorial: '0.08em',
      }
    },
  },
  plugins: [],
}
