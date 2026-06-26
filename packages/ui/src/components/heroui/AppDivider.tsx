"use client";

/**
 * AppDivider — v3 MIGRATION (simple single-element archetype, like AppButton).
 *
 * Now consumes HeroUI **v3** (`@heroui-v3/react`) alongside the still-v2 rest of
 * the inventory (coexistence via pnpm aliases — see `packages/ui/package.json`).
 * In v3 the component is renamed `Divider` -> `Separator`; the wrapper hides that
 * rename and keeps exporting `AppDivider` + `AppDividerProps` byte-for-byte.
 *
 * THE PATTERN (same anti-corruption interface as AppButton/AppCard)
 * -----------------------------------------------------------------
 * `AppDividerProps` is a HAND-WRITTEN interface (NOT `= SeparatorProps`) so the
 * v2-era call-site surface keeps compiling; this wrapper maps that surface onto
 * the v3 `Separator` API internally. The barrel imports `AppDivider` +
 * `AppDividerProps` by name — those exact exports are preserved.
 *
 * v3 Separator API deltas handled here:
 *   - Renamed `Divider` -> `Separator` (no compound members).
 *   - `orientation` survives unchanged ('horizontal' default | 'vertical').
 *   - `variant` MEANING CHANGED: v2 `variant` was a color/intent axis; v3
 *     `variant` is a CONTRAST scale ('default' | 'secondary' | 'tertiary'). We
 *     accept ONLY the v3 contrast vocabulary on `variant` (v2 color intents have
 *     no equivalent and are dropped — see below).
 *   - REMOVED v2 props with no v3 equivalent are dropped from the surface:
 *     `color`, `radius`, `size`, `classNames`, `fullWidth`. They were never
 *     load-bearing for a structural rule (the docs pass at most `orientation` +
 *     `className`), so dropping them is safe.
 *   - `className` survives; pass-throughs (id, role, aria-*, style) are accepted
 *     and forwarded to the v3 `Separator`.
 *
 * Styling foundation: warm v3 CSS vars in `../../theme/v3/warmThemeV3.css`; the
 * rendered root scopes itself with `withV3Theme()` so the separator is themed
 * correctly even when dropped outside an explicit wrapper element. There is no
 * warm token specific to the separator line — it reads `--border` / `--muted`
 * via the v3 `@heroui-v3/styles` `.separator` defaults, which is what we want.
 */

import {
  Separator as HeroV3Separator,
  type SeparatorProps as HeroV3SeparatorProps,
} from "@heroui-v3/react";
import { withV3Theme } from "../../theme/v3/warmThemeV3";

/** v3 contrast scale (the separator's only style axis in v3). */
export type AppDividerVariant = "default" | "secondary" | "tertiary";

/**
 * PUBLIC, PRESERVED prop surface. Superset of what the docs/stories pass today
 * (`orientation`, `className`) plus the v3 `variant` contrast axis and the
 * common DOM pass-throughs. v2-only props (color/radius/size/classNames/
 * fullWidth) are intentionally absent — they have no v3 equivalent.
 */
export interface AppDividerProps {
  /** Line direction. Default 'horizontal' (v3 + v2 agree). */
  orientation?: "horizontal" | "vertical";
  /**
   * v3 CONTRAST scale (NOT a color). 'default' | 'secondary' | 'tertiary'.
   * NB: this is a different meaning from v2's `variant` color/intent axis.
   */
  variant?: AppDividerVariant;
  className?: string;
  // Common pass-throughs forwarded to the v3 Separator.
  id?: string;
  style?: React.CSSProperties;
  role?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-orientation"?: React.AriaAttributes["aria-orientation"];
  "aria-hidden"?: boolean;
}

export function AppDivider({
  orientation,
  variant,
  className,
  ...rest
}: AppDividerProps) {
  const separatorProps = rest as Omit<
    HeroV3SeparatorProps,
    "orientation" | "variant" | "className"
  >;
  return (
    <HeroV3Separator
      orientation={orientation}
      variant={variant}
      className={withV3Theme(className)}
      {...separatorProps}
    />
  );
}
