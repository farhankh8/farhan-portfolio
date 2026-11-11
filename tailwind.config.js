/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './index.html',
    './app.js',
  ],
  theme: {
    extend: {
      colors: {
        // Keep these in sync with the CSS custom properties in style.css.
        dark: '#0a0a0f',
        surface: {
          900: '#111118',
          800: '#161620',
          700: '#1d1d29',
          600: '#252d42'
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace']
      },
      animation: {
        'ping-slow': 'ping 3s cubic-bezier(0, 0, 0.2, 1) infinite',
      }
    },
  },
  plugins: [],
}
