/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif']
      },
      colors: {
        primary: {
          50: '#eef9ff',
          100: '#d5efff',
          200: '#b0e4ff',
          300: '#7bd6ff',
          400: '#35c2ff',
          500: '#00a9ff',
          600: '#0085db',
          700: '#0068b0',
          800: '#055890',
          900: '#0a496f',
          950: '#062d46'
        }
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(255,255,255,0.05), 0 4px 24px -2px rgba(0,0,0,0.5), 0 0 32px -8px rgba(0,169,255,0.6)'
      },
      transitionTimingFunction: {
        'bounce-soft': 'cubic-bezier(.34,1.56,.64,1)'
      }
    }
  },
  plugins: []
};
