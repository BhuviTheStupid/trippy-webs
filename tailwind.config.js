// tailwind.config.js
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        floatX: {
          '0%, 100%': { transform: 'translateX(0)' },
          '50%': { transform: 'translateX(20px)' },
        },
        floatY: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        floatXY: {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '50%': { transform: 'translate(20px, -20px)' },
        },
        floatRotate: {
          '0%': { transform: 'rotate(0deg) translateY(0)' },
          '50%': { transform: 'rotate(3deg) translateY(-10px)' },
          '100%': { transform: 'rotate(0deg) translateY(0)' },
        },
      },
      animation: {
        'float-x': 'floatX 5s ease-in-out infinite',
        'float-y': 'floatY 5s ease-in-out infinite',
        'float-xy': 'floatXY 6s ease-in-out infinite',
        'float-rotate': 'floatRotate 6s ease-in-out infinite',
      },
      boxShadow: {
        trippy: '0 0 10px rgba(255,255,255,0.3)',
      },
      textShadow: {
        sm: '1px 1px 2px rgba(0,0,0,0.5)',
        md: '2px 2px 4px rgba(0,0,0,0.4)',
        lg: '3px 3px 6px rgba(0,0,0,0.5)',
      },
      dropShadow: {
        glow: "0 0 8px #22c55e, 0 0 16px #22c55e",
      },
    },
  },
  plugins: [
    require('tailwindcss-textshadow'),
  ],
}
