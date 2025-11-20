import { heroui } from "@heroui/theme";
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",

    // Include component source packages directly
    "./node_modules/@heroui/switch/dist/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@heroui/radio/dist/**/*.{js,ts,jsx,tsx}",

    // You can add more HeroUI components as you use them
    "./node_modules/@heroui/theme/dist/components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: { extend: {} },
  plugins: [heroui()],
};

export default config;
