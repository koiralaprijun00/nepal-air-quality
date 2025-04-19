/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class', // Enable dark mode using class-based approach
  theme: {
    extend: {
      colors: {
        // Add a more sophisticated palette
        primary: {
          50: '#e6f1ff',
          100: '#cce3ff',
          200: '#99c7ff',
          300: '#66aaff',
          400: '#338eff',
          500: '#0072ff', // Primary blue
          600: '#005bcb',
          700: '#004498',
          800: '#002e64',
          900: '#001731',
        },
        accent: {
          // Green tones for "good" air quality
          light: '#d0f0c0',
          DEFAULT: '#4ade80',
          dark: '#22c55e',
        },
        warning: {
          light: '#fff3cd',
          DEFAULT: '#ffca28',
          dark: '#f59e0b',
        },
        danger: {
          light: '#ffccbc',
          DEFAULT: '#ef4444',
          dark: '#b91c1c',
        },
        // For dark mode or card backgrounds
        surface: {
          light: '#ffffff',
          DEFAULT: '#f8fafc',
          dark: '#020617',
        },
      },
    },
  },
  plugins: [],
}
