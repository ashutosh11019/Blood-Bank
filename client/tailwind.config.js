/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': "#C70039",
        'green': "#1B9C85",
        'red': "#FE0000",
        'blue': ""
      }
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  },
}