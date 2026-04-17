import { heroui } from "@heroui/theme";
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@heroui/switch/dist/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@heroui/radio/dist/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@heroui/theme/dist/components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      keyframes: {
        blob: {
          "0%": { transform: "translate(0px, 0px) scale(1)" },
          "25%": { transform: "translate(20px, -40px) scale(1.05)" },
          "50%": { transform: "translate(-15px, 30px) scale(0.95)" },
          "75%": { transform: "translate(25px, 10px) scale(1.03)" },
          "100%": { transform: "translate(0px, 0px) scale(1)" },
        },
        "blob-reverse": {
          "0%": { transform: "translate(0px, 0px) scale(1)" },
          "25%": { transform: "translate(-20px, 35px) scale(0.95)" },
          "50%": { transform: "translate(15px, -25px) scale(1.05)" },
          "75%": { transform: "translate(-10px, -15px) scale(0.98)" },
          "100%": { transform: "translate(0px, 0px) scale(1)" },
        },
      },
      animation: {
        blob: "blob 14s ease-in-out infinite",
        "blob-reverse": "blob-reverse 18s ease-in-out infinite",
      },
    },
  },
  plugins: [heroui()],
};

export default config;
