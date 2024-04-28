/** @type {import('tailwindcss').Config} */
// eslint-disable-next-line
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    fontFamily: {
      sans: 'Roboto Mono, monospace',
    },

    extend: {
      height: {
        screen: '100dvh',
      },
    },
  },
  plugins: [],
};
// sans as global variables for make font-family to all applications but you  can use any name as you like and it will work as class name
// if you need add custom colors or global colors to use in your application you need to write your own custom colors in extend object because if you write without extend object all colors will be deleted form tailwind css
