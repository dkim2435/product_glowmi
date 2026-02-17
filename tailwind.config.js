/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#F4A698',
        secondary: '#C4796A',
        'light-pink': '#FFF0ED',
      },
      maxWidth: {
        app: '500px',
        tablet: '768px',
        desktop: '1100px',
      },
    },
  },
  plugins: [],
}
