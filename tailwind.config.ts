import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        lightBlue: "#C6E7FF",
        lightGreen: "#D1FFD7",
        lightRed: "#FFD1D1",
        nepalBlue: "#0056A2",
        nepalRed: "#D32F2F",
        nepalGreen: "#388E3C",
        lightGray: "#F6F6F6"
      },
      animation: {
        fadeIn: 'fadeIn 0.5s ease-in-out',
        scaleIn: 'scaleIn 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
    screens: {
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      'custom-xl': '1450px',
      '2xl': '1536px',
      '3xl': '1920px',
      '4xl': '2560px',
    },
  },
  darkMode: 'class', // Use 'class' for manual control
  plugins: [],
};

export default config;