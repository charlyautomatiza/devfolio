// 
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'dark-primary': '#151E21',
        'dark-secondary': '#121212',
        'dark-primary-8': 'rgba(21, 30, 33, 0.08)',
      },
    },
  },
  plugins: [],
}
