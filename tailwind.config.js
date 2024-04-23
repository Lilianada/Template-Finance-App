module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, 
  theme: {
    extend: {
      backgroundImage: {
        "custom-pattern": "url('/src/assets/images/Background.jpg')",
      },
      logo: {
        "dark-logo": "url('/src/assets/images/logo.png')",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
};
