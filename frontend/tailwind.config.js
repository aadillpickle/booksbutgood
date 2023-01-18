/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
	  "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      backgroundImage: {
        'books-art': "url('/src/assets/books-bg.jpg')",
      }
    },
  },
  plugins: [
      require('@tailwindcss/typography'),
],
}
