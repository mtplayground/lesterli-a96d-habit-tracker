/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#17201b',
          muted: '#4b5b51',
          soft: '#66756c',
        },
        surface: {
          DEFAULT: '#f7faf7',
          raised: '#ffffff',
          muted: '#edf3ee',
        },
        brand: {
          DEFAULT: '#28705c',
          dark: '#174d3e',
          light: '#dcefe7',
        },
        line: '#d7e1da',
      },
      fontFamily: {
        sans: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'sans-serif',
        ],
      },
      boxShadow: {
        soft: '0 24px 70px rgba(23, 32, 27, 0.12)',
      },
    },
  },
  plugins: [],
}
