module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'custom-gradient-start': '#FF8C00',
        'custom-gradient-end': '#FFA500',
      },
      zIndex: {
        '5': '5',
        '6': '6',
      },
      transitionDuration: {
        '1100': '1100ms',
        '900': '900ms',
      },
      transitionDelay: {
        '400': '400ms',
        '600': '600ms',
        '700': '700ms',
        '800': '800ms',
      },
    },
  },
  plugins: [],
}
