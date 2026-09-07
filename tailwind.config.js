/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#0B1F3A',
          50: '#F0F4FA',
          100: '#DCE5F2',
          200: '#B5C7E0',
          300: '#8BA6CC',
          400: '#5A81B2',
          500: '#2A5D99',
          600: '#1D4E89',
          700: '#174A8B',
          800: '#102F5A',
          900: '#0B1F3A',
          950: '#061224'
        },
        royal: {
          DEFAULT: '#174A8B',
          hover: '#123C73',
          light: '#2563EB',
          50: '#EFF6FF',
          100: '#DBEAFE',
          600: '#174A8B',
          700: '#123C73',
          800: '#0F2F59',
          900: '#0A203E'
        },
        gold: {
          DEFAULT: '#C9A227',
          50: '#FCF9EE',
          100: '#F7F0D5',
          200: '#EDE0A8',
          300: '#E0CC76',
          400: '#D5B749',
          500: '#C9A227',
          600: '#A8841B',
          700: '#826514',
          800: '#614B0E',
          900: '#423309'
        },
        charcoal: {
          DEFAULT: '#1F2937',
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827'
        },
        surface: '#F5F7FA',
        cream: '#F5F7FA',
        slate2: '#4B5563'
      },
      fontFamily: {
        serif: ['"Playfair Display"', '"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif']
      },
      boxShadow: {
        subtle: '0 1px 2px 0 rgba(11, 31, 58, 0.05)',
        card: '0 1px 3px rgba(11,31,58,0.06), 0 6px 16px -2px rgba(11,31,58,0.04)',
        cardHover: '0 12px 28px -4px rgba(11,31,58,0.12), 0 4px 12px -2px rgba(11,31,58,0.06)',
        dropdown: '0 10px 30px -5px rgba(11, 31, 58, 0.15), 0 0 0 1px rgba(11, 31, 58, 0.05)',
        gold: '0 4px 12px -2px rgba(201, 162, 39, 0.20)',
        royal: '0 4px 14px 0 rgba(23, 74, 139, 0.35)'
      },
      borderRadius: {
        xl2: '1rem',
        xl3: '1.25rem'
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.97)' },
          '100%': { opacity: '1', transform: 'scale(1)' }
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' }
        },
        'spin-reverse': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(-360deg)' }
        }
      },
      animation: {
        'fade-up': 'fade-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) both',
        'fade-in': 'fade-in 0.35s ease-out both',
        'scale-in': 'scale-in 0.25s ease both',
        shimmer: 'shimmer 1.8s ease-in-out infinite',
        'spin-reverse': 'spin-reverse 1.2s linear infinite'
      }
    }
  },
  plugins: []
}
