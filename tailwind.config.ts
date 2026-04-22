import type { Config } from "tailwindcss";

export default {
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
        "deep-obsidian": "#0B0E14",
        "charcoal-grey": "#1A1D23",
        "electric-cyan": "#00F5FF",
        "amethyst-violet": "#BF40BF",
      },
    },
  },
  plugins: [],
} satisfies Config;
