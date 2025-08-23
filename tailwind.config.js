/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Authentic Ryanair brand colors
        primary: {
          50: '#eff8ff',
          100: '#dbeafe', 
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#073590', // Ryanair Navy Blue
          600: '#062b73',
          700: '#052256',
          800: '#041939',
          900: '#03101c',
        },
        secondary: {
          50: '#fffdf0',
          100: '#fffae0',
          200: '#fff4c2', 
          300: '#ffed85',
          400: '#ffe347',
          500: '#ffd700', // Ryanair Yellow
          600: '#e6c200',
          700: '#ccad00',
          800: '#b39900',
          900: '#998400',
        },
        accent: {
          50: '#f5f5f5',
          100: '#e0e0e0',
          200: '#cccccc',
          300: '#b8b8b8',
          400: '#a3a3a3',
          500: '#8f8f8f',
          600: '#7a7a7a',
          700: '#666666',
          800: '#525252',
          900: '#3d3d3d',
        },
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 15px 0 rgba(0, 0, 0, 0.1)',
        'soft-lg': '0 4px 25px 0 rgba(0, 0, 0, 0.15)',
      },
    },
  },
  plugins: [],
}