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
        industrial: {
          50: "#f7f8f8",
          100: "#edeef1",
          200: "#d8dbdf",
          300: "#b5bac3",
          400: "#8c94a1",
          500: "#6e7786",
          600: "#59616e",
          700: "#494f5a",
          800: "#3f444c",
          900: "#383c42",
          950: "#1a1c20",
        },
        accent: {
          50: "#fff7ed",
          100: "#ffedd5",
          200: "#fed7aa",
          300: "#fdba74",
          400: "#fb923c",
          500: "#f97316",
          600: "#ea580c",
          700: "#c2410c",
          800: "#9a3412",
          900: "#7c2d12",
        },
        steel: {
          50: "#f4f6f7",
          100: "#e3e7ea",
          200: "#c9d1d7",
          300: "#a4b1bb",
          400: "#778a97",
          500: "#5c6f7d",
          600: "#4f5d6a",
          700: "#444f59",
          800: "#3d454c",
          900: "#363c42",
          950: "#21262b",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Inter", "system-ui", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
        "slide-up": "slideUp 0.5s ease-out",
        "scale-in": "scaleIn 0.3s ease-out",
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
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
