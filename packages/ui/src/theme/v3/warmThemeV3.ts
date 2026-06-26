/**
 * HeroUI v3 WARM THEME — typed companion to `./warmThemeV3.css`.
 *
 * This is the FOUNDATION the incremental v2 -> v3 migration builds on. It is a
 * NEW module (does NOT touch the v2 `../tokens.ts` single-source that the vitest
 * suite pins). The migrated wrappers (AppButton, AppCard — and the 20 to come)
 * consume the constants here; the `.css` sibling defines the actual variable
 * values. Keeping the two in one folder makes the foundation self-contained.
 *
 * USAGE
 * -----
 *   import { HEROUI_V3_THEME_CLASS } from "@laboratoire/ui";
 *   <div className={HEROUI_V3_THEME_CLASS}>{ ...v3 components... }</div>
 *
 * The class scopes the v3 `--accent` / `--surface` / `--foreground` / ... var
 * overrides so they never leak into v2 components during coexistence.
 *
 * The wrappers ALSO apply this class themselves (defensively) so a v3 component
 * is correctly themed even when dropped outside an explicit wrapper element —
 * see `withV3Theme()`.
 */

import { clsx } from "clsx";

/**
 * The theme scope class. Any element carrying this class (and its subtree)
 * resolves the warm-palette v3 CSS variables defined in `./warmThemeV3.css`.
 */
export const HEROUI_V3_THEME_CLASS = "heroui-v3-warm" as const;

/**
 * The exact v2-token -> v3-CSS-variable mapping this foundation implements.
 * Source of truth for documentation + future codegen; the CSS file is hand-kept
 * in lockstep (each value carries its hex + oklch conversion comment there).
 *
 * Extending the foundation for a new wrapper = add the v3 variable it needs
 * here AND in the `.css` file, deriving the value from `../tokens.ts`.
 */
export const V3_TOKEN_MAP = {
  "--background": "appTokens.<mode>.bg",
  "--foreground": "appTokens.<mode>.fg",
  "--surface": "appTokens.<mode>.card",
  "--muted": "appTokens.<mode>.muted",
  "--border": "appTokens.<mode>.border",
  "--accent": "heroColorTokens.<mode>.primary.DEFAULT",
  "--accent-foreground": "heroColorTokens.<mode>.primary.foreground",
  // `--primary` family is an ALIAS to `--accent` (v2 `primary` === the warm
  // indigo accent). Some v3 form controls (TextField/TextArea borders,
  // Radio/Checkbox selected fills) still read `--primary`; aliasing keeps them
  // on warm-brand. Same source token as `--accent`, so it carries no separate
  // tokens.ts mapping.
  "--primary": "heroColorTokens.<mode>.primary.DEFAULT (alias of --accent)",
  "--primary-foreground": "heroColorTokens.<mode>.primary.foreground (alias of --accent-foreground)",
} as const;

export type V3ThemedVar = keyof typeof V3_TOKEN_MAP;

/**
 * Compose a className that guarantees the v3 warm theme scope. Wrappers use
 * this so each migrated component is self-theming: `withV3Theme(props.className)`
 * prepends the theme class while preserving any consumer classes.
 *
 * Idempotent-ish: if the consumer already added the class it is deduped by clsx
 * only insofar as clsx joins truthy values — applying the scope twice is a
 * harmless no-op in CSS, so we keep this simple and always prepend.
 */
export function withV3Theme(className?: string): string {
  return clsx(HEROUI_V3_THEME_CLASS, className);
}
