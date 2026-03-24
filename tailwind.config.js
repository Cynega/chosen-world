/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        chosen: {
          gold: '#D4A017',
          amber: '#C77B3A',
          dark: '#0D1117',
          navy: '#141B2D',
          slate: '#1E2A3A',
          cream: '#F5EDD6',
          muted: '#8B9BB4',
        }
      },
      fontFamily: {
        serif: ['Georgia', 'Cambria', 'Times New Roman', 'serif'],
      }
    },
  },
  plugins: [],
}
