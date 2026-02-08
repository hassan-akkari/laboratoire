import { useEffect, useState } from "react";

export type ThemeMode = "dark" | "light";

const THEME_KEY = "laboratoire-theme";

function resolveInitialTheme(defaultTheme: ThemeMode) {
  if (typeof window === "undefined") {
    return defaultTheme;
  }

  const stored = localStorage.getItem(THEME_KEY);
  if (stored === "dark" || stored === "light") {
    return stored;
  }

  return defaultTheme;
}

export function useTheme(defaultTheme: ThemeMode = "dark") {
  const [theme, setTheme] = useState<ThemeMode>(() =>
    resolveInitialTheme(defaultTheme),
  );

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    root.classList.toggle("light", theme === "light");
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return { theme, toggleTheme };
}
