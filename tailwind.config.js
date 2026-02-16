/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'shake': 'shake 0.5s cubic-bezier(.36,.07,.19,.97) both',
        'flash': 'flash 0.5s ease-out forwards',
        'fade-in': 'fadeIn 1s ease-out forwards',
        'fade-out': 'fadeOut 1s ease-out forwards',
        'pulse-red': 'pulseRed 1.5s infinite',
      },
      keyframes: {
        shake: {
          '10%, 90%': { transform: 'translate3d(-1px, 0, 0)' },
          '20%, 80%': { transform: 'translate3d(2px, 0, 0)' },
          '30%, 50%, 70%': { transform: 'translate3d(-4px, 0, 0)' },
          '40%, 60%': { transform: 'translate3d(4px, 0, 0)' }
        },
        flash: {
          '0%, 100%': { opacity: '0' },
          '50%': { opacity: '1', backgroundColor: 'white' }
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' }
        },
        pulseRed: {
          '0%, 100%': { opacity: '1', boxShadow: '0 0 0 0 rgba(255, 0, 0, 0.7)' },
          '50%': { opacity: '0.5', boxShadow: '0 0 0 10px rgba(255, 0, 0, 0)' },
        }
      }
    },
  },
  plugins: [],
}
