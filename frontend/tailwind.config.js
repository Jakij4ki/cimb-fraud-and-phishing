/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0A2540',
          light: '#1a3a5c',
          dark: '#061828'
        },
        secondary: {
          DEFAULT: '#1B6EF3',
          light: '#4d91f5',
          dark: '#1558d6'
        },
        success: '#10B981',
        warning: '#F59E0B',
        danger: '#EF4444',
        surface: '#FFFFFF',
        background: '#F8FAFC',
        border: '#E2E8F0',
        muted: '#64748B',
        'dark-text': '#0F172A'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif']
      },
      animation: {
        'scan-pulse': 'scan-pulse 1.5s ease-in-out infinite',
        'risk-fill': 'risk-fill 1s ease-out forwards',
        'fade-in': 'fade-in 0.3s ease-out',
        'slide-up': 'slide-up 0.3s ease-out'
      },
      keyframes: {
        'scan-pulse': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '.5', transform: 'scale(1.05)' },
        },
        'risk-fill': {
          '0%': { strokeDasharray: '0, 100' },
          '100%': { strokeDasharray: 'var(--stroke-dasharray)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
