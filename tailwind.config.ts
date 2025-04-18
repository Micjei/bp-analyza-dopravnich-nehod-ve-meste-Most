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
        "filters-bg": "var(--filters-bg)",
        "filters-text": "var(--filters-text)",
        "filters-border": "var(--filters-border)",
        "header-bg": "var(--header-bg)",
        "header-text": "var(--header-text)",
        "header-border": "var(--header-border)",
        "header-bg-hover": "var(--header-bg-hover)",
        "header-text-hover": "var(--header-text-hover)",
        "footer-bg": "var(--footer-bg)",
        "footer-text": "var(--footer-text)",
        "footer-border": "var(--footer-border)",
        "dropdown-bg": "var(--dropdown-bg)",
        "dropdown-text": "var(--dropdown-text)",
        "dropdown-border": "var(--dropdown-border)",
        "dropdown-bg-hover": "var(--dropdown-bg-hover)",
        "dropdown-text-hover": "var(--dropdown-text-hover)",
        "dropdown-bg-active": "var(--dropdown-bg-active)",
        "plus-button-bg": "var(--plus-button-bg)",
        "plus-button-text": "var(--plus-button-text)",
        "plus-button-bg-hover": "var(--plus-button-bg-hover)",
        "plus-button-text-hover": "var(--plus-button-text-hover)",
      },
    },
  },
  plugins: [require("tailwind-scrollbar-hide")],
} satisfies Config;
