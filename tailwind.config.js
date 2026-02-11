/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#ff6b9d',
        secondary: '#c44569',
        'light-pink': '#fff0f5',
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
