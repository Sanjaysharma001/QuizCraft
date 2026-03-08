/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#F7F3EC',
        ink: '#1A1208',
        amber: '#E8821A',
        'amber-light': '#F5A94E',
        sage: '#4A6741',
        'warm-gray': '#8C7B6B',
        card: '#FFFDF8',
      },
      fontFamily: {
        fraunces: ['Fraunces', 'serif'],
        dm: ['DM Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
