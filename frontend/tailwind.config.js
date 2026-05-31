/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        moneta: {
          navy: '#0D1B4B',
          'navy-light': '#162660',
          'navy-dark': '#091236',
          orange: '#F26522',
          'orange-light': '#F47D40',
          'orange-dark': '#D4531A',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif']
      }
    }
  },
  plugins: []
};
