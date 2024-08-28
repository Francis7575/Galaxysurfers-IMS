/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        '930': '930px',
        '500': '500px'
      },
      fontFamily: {
        'manrope': ['Manrope', 'sans-serif']
      },
      colors: {
        'lightblue': '#F1F0FF',
        'second-lightblue': '#E7F8FC',
        'third-lightblue': '#E6E9EC',
        'fourth-lightblue': '#D2F0F8',
        'fifth-lightblue': 'rgba(229, 255, 230, 0.50)',
        'blue': '#367AFF',
        'second-blue': '#3B86FF',
        'red': '#D73C3C',
        'gray': '#6C757D',
        'lightgray': '#CED4DA',
        'second-lightgray': '#D0D0D0',
        'third-lightgray': '#B1B1B1',
        'grayish-gray': '#5C6F88',
        'dark-color': '#212529',
        'form-line': 'rgba(116, 123, 149, 0.25)',
        'svg-color': '#2E3A59',
        'gray': '#ccc',
        'file': '#f9f9f9',
        'active-lightblue': '#E5FFE6',
        'blue-500': 'rgba(59, 130, 246, 0.5)',
        'fourth-lightgray': 'rgba(0, 0, 0, 0.20)'
      },
      boxShadow: {
        'selection-box': '0px 10px 20px 1px rgba(0, 0, 0, 0.25)'
      }
    },
  },
  plugins: [],
}