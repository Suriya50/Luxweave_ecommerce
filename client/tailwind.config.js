/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#fbf6e3',
          100: '#f5e5b8',
          200: '#efd48a',
          300: '#e8c35c',
          400: '#e2b22e',
          500: '#d4a017',
          600: '#b8860b',
          700: '#9c6e08',
          800: '#7f5606',
          900: '#634004',
        },
        primary: '#000000',
        secondary: '#ffffff',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'serif'],
      },
      boxShadow: {
        'luxury': '0 4px 20px rgba(0,0,0,0.08)',
        'luxury-hover': '0 8px 40px rgba(0,0,0,0.12)',
      },
    },
  },
  plugins: [],
}