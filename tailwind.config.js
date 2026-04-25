/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1B2A4A',
        accent: '#F59E0B',
      },
      fontFamily: {
        playfair: ['Playfair Display', 'serif'],
        inter: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
    fontFamily: {
      playfair: ['Playfair Display', 'serif'],
      inter: ['Inter', 'system-ui', 'sans-serif'],
      sans: ['Inter', 'system-ui', 'sans-serif'],
    }
  },
  plugins: [],
}
