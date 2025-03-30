/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./app/**/*.{js,ts,jsx,tsx}", 
      "./components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        fontFamily: {
          quick: ['var(--font-quicksand)', 'sans-serif'], 
        },
      },
    },
    plugins: [],
  };
  