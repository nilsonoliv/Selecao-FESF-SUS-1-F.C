/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        fesf: {
          primary: '#005b96',
          secondary: '#b3cde0',
          warning: '#f4b41a',
          danger: '#d32f2f',
          success: '#388e3c'
        }
      }
    },
  },
  plugins: [],
}