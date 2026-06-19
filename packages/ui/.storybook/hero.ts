/**
 * Storybook's Tailwind plugin entry — UNIFIED onto the canonical warm theme.
 *
 * Previously this file declared its own cool-blue palette, drifting from the
 * apps. It now re-exports the single-source `heroTheme` (derived from
 * `src/theme/tokens.ts`) so Storybook renders with the exact colors the apps
 * use. `@plugin` resolves a filesystem path, so `preview.css` points at this
 * file and this file forwards the shared plugin object as its default export.
 */
export { default } from "../src/theme/heroTheme";
