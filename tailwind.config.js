/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        festive: {
          darkred: '#7F1D1D',
          crimson: '#991B1B',
          ruby: '#B91C1C',
          maroon: '#4C0519',
          gold: '#F59E0B',
          lightgold: '#FBBF24',
          amber: '#D97706',
          cream: '#FFFDF7',
          ivory: '#FEF3C7',
          sand: '#FDE68A',
          night: '#0F090A',
          carddark: '#1C1014'
        }
      },
      fontFamily: {
        bengali: ['"Hind Siliguri"', 'system-ui', 'sans-serif'],
        serif: ['"Cinzel"', 'Georgia', 'serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif']
      },
      animation: {
        'glow-pulse': 'glow 3s ease-in-out infinite alternate',
        'float-slow': 'float 4s ease-in-out infinite alternate',
        'flicker': 'flicker 1.5s ease-in-out infinite alternate',
        'ripple': 'ripple 3s linear infinite',
        'wave': 'wave 6s ease-in-out infinite alternate'
      },
      keyframes: {
        glow: {
          '0%': { filter: 'drop-shadow(0 0 10px rgba(245, 158, 11, 0.4))' },
          '100%': { filter: 'drop-shadow(0 0 28px rgba(245, 158, 11, 0.9))' }
        },
        float: {
          '0%': { transform: 'translateY(0px)' },
          '100%': { transform: 'translateY(-12px)' }
        },
        flicker: {
          '0%, 100%': { opacity: '0.9', transform: 'scale(1)' },
          '50%': { opacity: '0.65', transform: 'scale(0.96)' }
        },
        wave: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-25px)' }
        }
      }
    },
  },
  plugins: [],
}
