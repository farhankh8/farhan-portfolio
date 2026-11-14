/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './index.html',
    './404.html',
    './privacy.html',
    './app.js',
  ],
  theme: {
    // Spacing follows the design system's fixed scale so no utility can
    // introduce an off scale value: 2, 4, 8, 12, 16, 24, 32, 40, 48, 64, 80, 96.
    extend: {
      spacing: {
        25: '2px',
        50: '4px',
        75: '8px',
        100: '12px',
        200: '16px',
        300: '24px',
        400: '32px',
        500: '40px',
        600: '48px',
        700: '64px',
        800: '80px',
        900: '96px',
      },
      colors: {
        // One neutral ramp, tinted cool. Surfaces stay neutral so content
        // carries the colour.
        page: '#0c0e13',
        surface: {
          DEFAULT: '#12151c',
          raised: '#171b23',
          active: '#1e232d',
        },
        ink: {
          DEFAULT: '#eef1f6',
          soft: '#a8b0bf',
          dim: '#7c8698',
        },
        hairline: 'rgba(238,241,246,0.10)',
        // Single accent, taken from the ledger world.
        accent: {
          DEFAULT: '#d9a441',
          soft: '#f0c274',
          deep: '#a9762a',
        },
        positive: '#5bb98b',
        negative: '#e06c6c',
      },
      fontFamily: {
        sans: ['Geist', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        mono: ['"Geist Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      fontSize: {
        xs: ['12px', { lineHeight: '16px' }],
        sm: ['14px', { lineHeight: '20px' }],
        base: ['16px', { lineHeight: '24px' }],
        lg: ['18px', { lineHeight: '28px' }],
        xl: ['20px', { lineHeight: '28px' }],
        '2xl': ['24px', { lineHeight: '32px' }],
        '3xl': ['30px', { lineHeight: '36px' }],
        '4xl': ['36px', { lineHeight: '40px' }],
        '5xl': ['48px', { lineHeight: '48px' }],
        '6xl': ['60px', { lineHeight: '60px' }],
        '7xl': ['72px', { lineHeight: '72px' }],
        '8xl': ['96px', { lineHeight: '96px' }],
      },
      borderRadius: {
        xs: '4px',
        sm: '6px',
        DEFAULT: '8px',
        md: '8px',
        lg: '12px',
        xl: '16px',
        '2xl': '20px',
      },
      maxWidth: {
        prose: '68rem',
        measure: '42rem',
      },
    },
  },
  plugins: [],
};
