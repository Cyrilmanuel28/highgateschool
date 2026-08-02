/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#1B2A4A',
          50: '#F0F3FA',
          100: '#DCE3F2',
          200: '#B9C6E4',
          300: '#8FA2CF',
          400: '#5E77AE',
          500: '#3B5386',
          600: '#2A3D68',
          700: '#223255',
          800: '#1B2A4A',
          900: '#121E36',
          950: '#0B1324'
        },
        gold: {
          DEFAULT: '#C8982A',
          50: '#FBF6EA',
          100: '#F5EACB',
          200: '#EBD598',
          300: '#DFBD62',
          400: '#D5AB41',
          500: '#C8982A',
          600: '#A87D20',
          700: '#86621A',
          800: '#6A4E16',
          900: '#4C3810'
        },
        cream: '#F9F8F6',
        slate2: '#4A5568'
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif']
      },
      boxShadow: {
        card: '0 1px 3px rgba(27,42,74,0.08), 0 4px 14px rgba(27,42,74,0.06)',
        cardHover: '0 6px 24px rgba(27,42,74,0.14), 0 2px 8px rgba(27,42,74,0.08)',
        gold: '0 10px 30px -8px rgba(200,152,42,0.55)'
      },
      borderRadius: { xl2: '1.25rem' },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' }
        }
      },
      animation: {
        'fade-up': 'fade-up 0.7s cubic-bezier(0.22,1,0.36,1) both',
        'fade-in': 'fade-in 0.5s ease both',
        'scale-in': 'scale-in 0.25s ease both'
      }
    }
  },
  plugins: []
}
