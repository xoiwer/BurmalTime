/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: { DEFAULT: '#09090D', 2: '#111118' },
        card: '#191923',
        accent: '#A855F7',
        pink: '#EC4899',
        muted: '#9292A3',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Manrope', 'Inter', 'sans-serif'],
        accent: ['"Space Grotesk"', 'Manrope', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 10px 40px -12px rgba(168,85,247,.6)',
        card: '0 20px 50px -20px rgba(0,0,0,.8)',
      },
    },
  },
  plugins: [],
};
