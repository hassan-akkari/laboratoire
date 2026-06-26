// Isomorphic design-variant constants — safe to import from BOTH server and
// client components. Deliberately free of `next/headers` / `server-only` so the
// client StyleSwitcher can pull the enum + labels without dragging server-only
// code into the browser bundle. The server-only reader (`getStyle`) lives in
// `lib/style.ts`, which re-exports everything here so server callers can keep a
// single `@/lib/style` import.

export type StyleVariant = "editorial" | "warm" | "bold";

/** Cookie name holding the active design variant. */
export const STYLE_COOKIE = "bs_style";

/** Default design when no (valid) cookie is present. */
export const DEFAULT_STYLE: StyleVariant = "bold";

/** All variants, in display order (drives the switcher's pill order). */
export const STYLE_VARIANTS: readonly StyleVariant[] = [
  "editorial",
  "warm",
  "bold",
] as const;

/** Human labels for each variant (used by the switcher). */
export const STYLE_LABELS: Record<StyleVariant, string> = {
  editorial: "Editorial",
  warm: "Warm",
  bold: "Bold",
};

/** Narrow an arbitrary string to a StyleVariant, or null if it isn't one. */
export function parseStyle(value: string | undefined): StyleVariant | null {
  return value && (STYLE_VARIANTS as readonly string[]).includes(value)
    ? (value as StyleVariant)
    : null;
}
