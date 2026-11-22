/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cafe: {
          dark: '#18120e',
          wood: '#2b1e16',
          warm: '#443124',
          tan: '#8c6b53',
          cream: '#f4ede4',
          amber: '#e69a4e',
          softGold: '#e8c170',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        handwriting: ['"Caveat"', '"Patrick Hand"', 'cursive'],
        mono: ['"JetBrains Mono"', 'monospace'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
