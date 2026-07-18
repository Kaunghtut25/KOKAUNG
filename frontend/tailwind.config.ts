import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        deepblue: {
          DEFAULT: "#0A1628",
          light: "#1B2A4A",
          dark: "#060F1E",
        },
        gold: {
          DEFAULT: "#D4AF37",
          light: "#F5A623",
          dark: "#B8960F",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Playfair Display", "serif"],
      },
      animation: {
        fadeIn: "fadeIn 0.8s ease-in-out forwards",
        slideUp: "slideUp 0.8s ease-out forwards",
        glow: "glow 2s ease-in-out infinite alternate",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        glow: {
          "0%": {
            boxShadow: "0 0 5px rgba(212, 175, 55, 0.3), 0 0 20px rgba(212, 175, 55, 0.1)",
          },
          "100%": {
            boxShadow: "0 0 10px rgba(212, 175, 55, 0.6), 0 0 40px rgba(212, 175, 55, 0.2)",
          },
        },
      },
    },
  },
  safelist: [
    'grid-cols-1', 'grid-cols-2', 'grid-cols-3', 'grid-cols-4', 'grid-cols-5',
    'md:grid-cols-1', 'md:grid-cols-2', 'md:grid-cols-3', 'md:grid-cols-4',
    'lg:grid-cols-2', 'lg:grid-cols-3', 'lg:grid-cols-4', 'lg:grid-cols-5',
    'sm:grid-cols-1', 'sm:grid-cols-2', 'sm:grid-cols-3', 'sm:grid-cols-4',
  ],
  plugins: [],
};

export default config;
