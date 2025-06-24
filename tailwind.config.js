/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    'node_modules/flowbite-react/lib/esm/**/*.js'
  ],
  theme: {
    extend: {},
  },
  daisyui: {
    themes: [
      "business",
      "corporate",
      "cupcake",
      "dark",
      "dracula",
      "light",
      "retro",
      "wireframe"
    ],
  },
  plugins: [require('@tailwindcss/typography'), ('flowbite/plugin'), require("daisyui")],
}