const defaultTheme = require('tailwindcss/defaultTheme')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,md}'],
  darkMode: 'class',
  theme: {
    fontSize: {
      xs: ['0.75rem', { lineHeight: '1rem' }],
      sm: ['0.875rem', { lineHeight: '1.5rem' }],
      base: ['1rem', { lineHeight: '2rem' }],
      lg: ['1.125rem', { lineHeight: '1.75rem' }],
      xl: ['1.25rem', { lineHeight: '2rem' }],
      '2xl': ['1.5rem', { lineHeight: '2.5rem' }],
      '3xl': ['2rem', { lineHeight: '2.5rem' }],
      '4xl': ['2.5rem', { lineHeight: '3rem' }],
      '5xl': ['3rem', { lineHeight: '3.5rem' }],
      '6xl': ['3.75rem', { lineHeight: '1' }],
      '7xl': ['4.5rem', { lineHeight: '1' }],
      '8xl': ['6rem', { lineHeight: '1' }],
      '9xl': ['8rem', { lineHeight: '1' }],
    },
    extend: {
      fontFamily: {
        sans: ['DM Sans', ...defaultTheme.fontFamily.sans],
        display: ['DM Sans', ...defaultTheme.fontFamily.sans],
      },
      maxWidth: {
        '8xl': '88rem',
      },
      colors: {
        primary: '#8484f5',
        slate: {
          400: '#e2e8f0',
        },

        snowcat: {
          100: '#E9EAED',
          200: '#C9CBD3',
          300: '#A8ABB9',
          400: '#676D84',
          500: '#262E4F',
          600: '#222947',
          700: '#171C2F',
          800: '#111524',
          900: '#0B0E18',
        },
        cta: {
          50: '#ECECFE',
          100: '#EBEBFE',
          200: '#CECDFD',
          300: '#B0AFFB',
          400: '#7474F9',
          500: '#3938F6',
          600: '#3332DD',
          700: '#222294',
          800: '#1A196F',
          900: '#11114A',
        },
        gray: {
          100: '#f7fafc',
          200: '#edf2f7',
          300: '#e2e8f0',
          400: '#cbd5e0',
          500: '#a0aec0',
          600: '#718096',
          700: '#4a5568',
          800: '#2d3748',
          900: '#1a202c',
        },
      },
      width: {
        '5d6': '83%',
        '2d5': '40%',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
