import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "legend-bg": "var(--legend-bg)",
        "legend-text": "var(--legend-text)",
        "legend-border": "var(--legend-border)",
      },
    },
  },
  plugins: [require("tailwind-scrollbar-hide")],
} satisfies Config;
