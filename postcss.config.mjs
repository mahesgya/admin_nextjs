const config = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./index.html"],
  theme: {
    extend: {
      animation: {
        'gradient-x': 'gradient-x 6s ease infinite',
      },
      keyframes: {
        'gradient-x': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
      fontFamily: {
        sans: ['Roboto', 'sans-serif'], 
        custom: ['MyCustomFont', 'sans-serif'], 
        quick:['Quicksand'],
        inter:['Inter'],
        work: ['Work Sans', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
      },
    }
  },
  plugins: ["@tailwindcss/postcss"],
};

export default config;
