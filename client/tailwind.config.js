/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'login-page': 'url(/components/login/images/image.png)'
      }
    },
  },
  plugins: [],
}

