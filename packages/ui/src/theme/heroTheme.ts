import { heroui } from "@heroui/theme";
import { heroColorsFor } from "./tokens";

/**
 * Canonical HeroUI Tailwind plugin, DERIVED from the typed `heroColorTokens`
 * single source (see `./tokens.ts`). This is the value both apps load via the
 * Tailwind v4 `@plugin` directive in their `index.css`, replacing their old
 * per-app `hero.ts` files.
 *
 * NOTE: `@plugin` resolves a filesystem path, not the `@laboratoire/ui` package
 * export. Apps therefore point `@plugin` at this source file directly (e.g.
 * `@plugin "../../../packages/ui/src/theme/heroTheme.ts"`). Keeping the default
 * export as the plugin object is what Tailwind requires.
 *
 * The explicit `ReturnType<typeof heroui>` annotation is required: under the
 * lib's `declaration: true` build, inferring the plugin's return type makes the
 * emitted `.d.ts` reference a non-portable internal tailwindcss path (TS2742)
 * and breaks `tsc`. Naming it via the imported `heroui` symbol keeps the
 * declaration portable.
 */
const heroTheme: ReturnType<typeof heroui> = heroui({
  themes: {
    light: {
      colors: heroColorsFor("light"),
    },
    dark: {
      colors: heroColorsFor("dark"),
    },
  },
});

export default heroTheme;
