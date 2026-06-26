/**
 * Canonical WARM theme — the ONE source of truth for the monorepo.
 *
 * Both the HeroUI plugin config (see `./heroTheme.ts`) and the CSS `--app-*`
 * custom properties (see `appCssVarsFor` / `renderThemeCss`) are DERIVED from
 * the objects in this file. Renaming a token here is type-checked everywhere it
 * is consumed, and the vitest suite in `packages/ui/tests` asserts that the
 * apps' static CSS stays in lockstep with these values.
 *
 * Dark is the default; light is supported.
 */

export type ThemeMode = "light" | "dark";

export interface HeroColorSet {
  background: string;
  foreground: string;
  primary: { DEFAULT: string; foreground: string };
  secondary: string;
}

/**
 * HeroUI semantic colors per theme. The shape mirrors what `heroui()` expects
 * under `themes[mode].colors`. Kept as a `const` so the literal hex values are
 * part of the type and provable in tests.
 */
export const heroColorTokens = {
  light: {
    background: "#f5f1ea",
    foreground: "#1b1814",
    primary: {
      DEFAULT: "#4a4e69",
      foreground: "#f8f7f4",
    },
    secondary: "#0f172a",
  },
  dark: {
    background: "#080808",
    foreground: "#decbc6",
    primary: {
      DEFAULT: "#4a4e69",
      foreground: "#decbc6",
    },
    secondary: "#decbc6",
  },
} as const satisfies Record<ThemeMode, HeroColorSet>;

/**
 * Shared application-level CSS custom properties. These are the `--app-*`
 * tokens consumed by both apps' stylesheets. The union key type means a typo or
 * a forgotten token in one mode is a compile error, and the keys of `light` and
 * `dark` are guaranteed identical by the `Record<AppTokenName, string>` shape.
 */
export type AppTokenName =
  | "bg"
  | "fg"
  | "muted"
  | "card"
  | "border"
  | "accent"
  | "accent-soft";

export const appTokens = {
  light: {
    bg: "#f5f1ea",
    fg: "#1b1814",
    muted: "#75695f",
    card: "#fbf8f3",
    border: "#e8dfd2",
    accent: "#3d4368",
    "accent-soft": "rgba(61, 67, 104, 0.18)",
  },
  dark: {
    bg: "#080808",
    fg: "#decbc6",
    muted: "#9a8f8c",
    card: "#151515",
    border: "#262626",
    accent: "#4a4e69",
    "accent-soft": "rgba(74, 78, 105, 0.24)",
  },
} as const satisfies Record<ThemeMode, Record<AppTokenName, string>>;

export const THEME_MODES = ["light", "dark"] as const;

/** The HeroUI semantic color set for a given mode. */
export function heroColorsFor(mode: ThemeMode): HeroColorSet {
  return heroColorTokens[mode];
}

/** The `--app-*` custom properties for a given mode, keyed by CSS var name. */
export function appCssVarsFor(mode: ThemeMode): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [name, value] of Object.entries(appTokens[mode])) {
    out[`--app-${name}`] = value;
  }
  return out;
}

/**
 * Emit the `--app-*` declarations for a mode as CSS text (no selector wrapper),
 * one declaration per line, indented for readability. Used by `renderThemeCss`
 * and by the regression tests that diff this against the apps' stylesheets.
 */
export function renderAppVarsBlock(mode: ThemeMode, indent = "    "): string {
  return Object.entries(appCssVarsFor(mode))
    .map(([name, value]) => `${indent}${name}: ${value};`)
    .join("\n");
}

/**
 * Render the full shared `:root` / `.light` / `.dark` token blocks as CSS text.
 * Apps may inline an equivalent block in their `index.css` (Tailwind v4 needs
 * the declarations statically); the test suite asserts byte-equivalence of the
 * derived values so the two never drift.
 */
export function renderThemeCss(): string {
  const root = renderAppVarsBlock("dark");
  const light = renderAppVarsBlock("light");
  const dark = renderAppVarsBlock("dark");
  return [
    ":root {",
    "    color-scheme: dark;",
    root,
    "}",
    "",
    ':root[data-theme="light"],',
    ".light {",
    "    color-scheme: light;",
    light,
    "}",
    "",
    ':root[data-theme="dark"],',
    ".dark {",
    "    color-scheme: dark;",
    dark,
    "}",
  ].join("\n");
}
