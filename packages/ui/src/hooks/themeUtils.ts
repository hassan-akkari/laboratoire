export type ThemeMode = "dark" | "light";

export const THEME_KEY = "laboratoire-theme";

export function resolveThemeMode(
  storedTheme: string | null,
  fallbackTheme: ThemeMode = "dark"
): ThemeMode {
  return storedTheme === "dark" || storedTheme === "light"
    ? storedTheme
    : fallbackTheme;
}
