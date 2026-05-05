/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#172033',
        brand: '#2563eb',
      },
      boxShadow: {
        soft: '0 12px 30px rgba(20, 32, 51, 0.08)',
      },
    },
  },
  plugins: [],
};
