/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Modern dark palette from uploaded image
        black: {
          DEFAULT: '#0B0909',
          light: '#1a1818',
        },
        ebony: {
          DEFAULT: '#44444C',
          light: '#5a5a62',
        },
        gray: {
          DEFAULT: '#8C8C8C',
          light: '#a8a8a8',
        },
        pewter: {
          DEFAULT: '#D6D6D6',
          light: '#e8e8e8',
        },
      },
      fontFamily: {
        display: ['Inter', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      }
    },
  },
  plugins: [],
}
