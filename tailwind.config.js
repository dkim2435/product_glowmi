/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#CF8BA9',
        secondary: '#A66A85',
        'light-pink': '#FDF0F5',
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
