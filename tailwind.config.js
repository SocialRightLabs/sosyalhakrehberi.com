module.exports = {
  content: ['./src/**/*.{html,ts}', './public/**/*.html'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Manrope', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['"Source Serif 4"', 'Georgia', 'serif'],
      },
      boxShadow: {
        soft: '0 20px 60px rgba(15, 23, 42, 0.10)',
      },
      colors: {
        ink: {
          50: '#eef2f7',
          100: '#dde5ee',
          200: '#c7d3e2',
          300: '#9eb3c8',
          400: '#6e87a4',
          500: '#49627f',
          600: '#31455f',
          700: '#233245',
          800: '#172131',
          900: '#0b1220',
        },
        brand: {
          50: '#eefdf9',
          100: '#d7fbf2',
          200: '#b2f4e5',
          300: '#7de9d1',
          400: '#45d9ba',
          500: '#20b897',
          600: '#16947a',
          700: '#147563',
          800: '#115d4f',
          900: '#0d483f',
        },
      },
      backgroundImage: {
        'hero-grid':
          'radial-gradient(circle at 20% 20%, rgba(32,184,151,0.12), transparent 0 18%), radial-gradient(circle at 85% 12%, rgba(14,165,233,0.14), transparent 0 16%), linear-gradient(180deg, rgba(11,18,32,0.88), rgba(11,18,32,0.70))',
      },
    },
  },
};
