import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'franklin': ['Franklin Gothic Demi', 'system-ui', 'sans-serif'],
        'inter': ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Основные цвета согласно ТЗ
        primary: {
          DEFAULT: "#0184F4", // Основной синий
          hover: "#0174E4",
        },
        secondary: {
          DEFAULT: "#0283F7", // Вторичный синий
        },
        dark: {
          DEFAULT: "#121353", // Темно-синий
        },
        text: {
          primary: "#1F2937", // Темный текст
          secondary: "#6B7280", // Серый текст
        },
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      backgroundImage: {
        "gradient-primary": "linear-gradient(135deg, #0184F4 0%, #8B5CF6 100%)",
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
  ],
};

export default config;
