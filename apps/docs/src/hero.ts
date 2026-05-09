import { heroui } from "@heroui/theme";

export default heroui({
  themes: {
    light: {
      colors: {
        background: "#f5f1ea",
        foreground: "#1b1814",
        primary: {
          DEFAULT: "#4a4e69",
          foreground: "#f8f7f4",
        },
        secondary: "#0f172a",
      },
    },
    dark: {
      colors: {
        background: "#080808",
        foreground: "#decbc6",
        primary: {
          DEFAULT: "#4a4e69",
          foreground: "#decbc6",
        },
        secondary: "#decbc6",
      },
    },
  },
});
