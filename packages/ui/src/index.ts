export { default as ThemeToggle } from "./components/ThemeToggle";
export { MoonIcon, SunIcon } from "./icons/ThemeIcons";
export { useTheme } from "./hooks/useTheme";
export { resolveThemeMode } from "./hooks/themeUtils";
export type { ThemeMode } from "./hooks/themeUtils";
export { Input, InputGroup } from "./components/tw-ui/input";
export { Textarea } from "./components/tw-ui/textarea";
export { AppButton } from "./components/heroui/AppButton";
export type { AppButtonProps } from "./components/heroui/AppButton";
export { AppInput } from "./components/heroui/AppInput";
export type { AppInputProps } from "./components/heroui/AppInput";
export { AppTextarea } from "./components/heroui/AppTextarea";
export type { AppTextareaProps } from "./components/heroui/AppTextarea";

// Router-agnostic provider (Phase 1 foundation).
export { UiProvider } from "./components/UiProvider";
export type { UiProviderProps } from "./components/UiProvider";

// Canonical WARM theme — single source of truth for both apps.
// Note: `ThemeMode` is intentionally NOT re-exported here; the canonical
// `ThemeMode` ships from `./hooks/themeUtils` (same `"light" | "dark"` union).
export {
  heroColorTokens,
  appTokens,
  THEME_MODES,
  heroColorsFor,
  appCssVarsFor,
  renderAppVarsBlock,
  renderThemeCss,
} from "./theme/tokens";
export type { HeroColorSet, AppTokenName } from "./theme/tokens";
// NOTE: `heroTheme` (the heroui() plugin object) is intentionally NOT re-exported
// from the runtime barrel. It pulls in `@heroui/theme` at value level and is only
// ever consumed at CSS-build time via the Tailwind `@plugin` directive pointing
// at `src/theme/heroTheme.ts` directly. Keeping it out of the barrel keeps the
// library's runtime dependency surface free of `@heroui/theme`.
