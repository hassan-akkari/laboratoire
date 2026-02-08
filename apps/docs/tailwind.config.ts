import type { Config } from "tailwindcss";

export default {
  darkMode: ["class", ".dark"],
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
} satisfies Config;
