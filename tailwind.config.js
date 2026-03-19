/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#8B7EC8',
        secondary: '#6C5FA7',
        accent: '#E8A0BF',
        'light-pink': '#F5F0FF',
        'light-bg': '#F5F0FF',
      },
      maxWidth: {
        app: '500px',
        tablet: '768px',
        content: '900px',
        desktop: '1100px',
      },
    },
  },
  plugins: [],
}
