"use client";

/**
 * AppButton — FIRST v3 MIGRATION (reference adapter for the other 21 wrappers).
 *
 * This wrapper now consumes HeroUI **v3** (`@heroui-v3/react`) while the rest of
 * the inventory still consumes v2 (`@heroui/react`). The two majors coexist via
 * pnpm aliases (Strategy A); see `packages/ui/package.json`.
 *
 * THE PATTERN (copy this for every wrapper migration)
 * ---------------------------------------------------
 * v3 is a hard API break. To migrate INCREMENTALLY without editing the 10 docs
 * call sites, `AppButtonProps` is a HAND-WRITTEN anti-corruption interface: it
 * keeps accepting the v2-era prop surface the apps already pass, and this
 * wrapper MAPS that surface onto the v3 API internally. The public contract
 * (`AppButton` + `AppButtonProps`) is preserved byte-for-byte at the call site.
 *
 * v3 Button API deltas handled here:
 *   - `color` + v2 `variant` (solid/bordered/flat/light/faded/ghost) collapse to
 *     a single v3 `variant` (primary/secondary/tertiary/outline/ghost/danger/
 *     danger-soft). See `toV3Variant()`.
 *   - `radius` removed -> baseline Tailwind `rounded-[12px]` (matches v2 sm).
 *   - `isLoading` -> v3 `isPending` + a render-prop spinner.
 *   - `startContent` / `endContent` removed -> rendered as children (icons).
 *   - `classNames` / `disableAnimation` removed -> dropped.
 *   - `disableRipple` REINSTATED as a public prop: v3 Button has no built-in
 *     ripple, so we add the Material-3 `m3-ripple` recipe. Ripple is ON by
 *     default (mirroring v2's `disableRipple={false}` default); pass
 *     `disableRipple` to opt a specific call site out (e.g. quiet link buttons).
 *   - `as="a"` is LOAD-BEARING (docs renders anchors). v3 Button is a
 *     react-aria <button> and its `render` prop may NOT change the element type
 *     to <a>. So `as="a"` branches to a styled <a> built from `buttonVariants()`
 *     — visually identical, full anchor semantics (href/target/rel).
 *   - `as="button"` / unset -> the real v3 `Button`.
 *
 * Styling foundation: the warm-palette v3 CSS variables live in
 * `../../theme/v3/warmThemeV3.css`; we scope every rendered element with
 * `withV3Theme()` so the button is correctly themed even outside a wrapper.
 */

import { type ReactNode, type Ref } from "react";
import {
  Button as HeroV3Button,
  Spinner as HeroV3Spinner,
  buttonVariants,
  type ButtonProps as HeroV3ButtonProps,
} from "@heroui-v3/react";
import { Ripple } from "m3-ripple";
// Side-effect CSS for the ripple (Material-3 recipe — v3 Button ships no ripple).
//
// WHY A BARE SIDE-EFFECT IMPORT IS THE ROBUST CHOICE HERE (tsc + Vite + SSR):
//   1. packages/ui builds with `tsc` (no CSS bundling) and its tsconfig does NOT
//      set `noUncheckedSideEffectImports`, so `tsc` accepts this import and
//      *preserves it verbatim* in the emitted `dist/*.js` — the stylesheet
//      request travels with the compiled wrapper instead of being dropped.
//   2. Vite consumers (docs) resolve `m3-ripple/ripple.css` (exports map ->
//      dist/ripple.css) and inject the stylesheet at bundle time. This holds
//      whether docs consumes the SOURCE (dev/`VITE_UI_SOURCE`) or the built
//      `dist` (prod) because the import string is identical in both.
//   3. docs typechecks this file THROUGH its `@laboratoire/ui` source path
//      alias under `noUncheckedSideEffectImports: true`. That is satisfied by
//      the ambient `declare module "*.css" {}` from `vite/client` (referenced in
//      docs' `src/vite-env.d.ts`), whose wildcard matches `m3-ripple/ripple.css`.
//   4. SSR-safe: a side-effect CSS import is erased on the server by every React
//      SSR bundler (Next/Vite SSR extract CSS to a stylesheet, never execute it),
//      and m3-ripple itself touches no DOM at module scope (see Ripple note),
//      so importing it cannot crash a future web-next server render.
// Alternatives rejected: (a) importing the CSS from the app's index.css couples
// every consumer to remember it (fragile); (b) inlining the CSS as a JS string +
// runtime <style> injection reintroduces the SSR/document hazard we are avoiding.
import "m3-ripple/ripple.css";
import { withV3Theme } from "../../theme/v3/warmThemeV3";

/** v3 visual variants (the only style axis v3 Button exposes). */
export type AppButtonVariant =
  | "primary"
  | "secondary"
  | "tertiary"
  | "outline"
  | "ghost"
  | "danger"
  | "danger-soft";

/** v2-era `variant` strings the docs call sites still pass. */
type V2ButtonVariant =
  | "solid"
  | "bordered"
  | "light"
  | "flat"
  | "faded"
  | "ghost"
  | "shadow"
  | "dot";

/** v2-era `color` strings the docs/stories still pass. */
type V2ButtonColor =
  | "default"
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "danger";

type V3Size = "sm" | "md" | "lg";

/**
 * PUBLIC, PRESERVED prop surface. Superset of every prop the docs (and the
 * packages/ui stories) pass to AppButton today, plus the v3-native escape hatch
 * (`variant` may be a v3 value directly). Internal mapping turns this into v3.
 */
export interface AppButtonProps {
  children?: ReactNode;
  /**
   * Visual style. Accepts BOTH the v2 vocabulary (solid/bordered/flat/...) and
   * the v3 vocabulary (primary/secondary/tertiary/outline/ghost/danger/
   * danger-soft). v2 values are mapped via `toV3Variant()`.
   */
  variant?: V2ButtonVariant | AppButtonVariant;
  /** v2 semantic color — folded into the v3 `variant` (e.g. danger). */
  color?: V2ButtonColor;
  /** v2 `radius` — accepted but mapped to a Tailwind className (no-op axis in v3). */
  radius?: "none" | "sm" | "md" | "lg" | "full";
  size?: V3Size;
  fullWidth?: boolean;
  isIconOnly?: boolean;
  isDisabled?: boolean;
  /** v2 `isLoading` -> v3 `isPending` (render-prop spinner). */
  isLoading?: boolean;
  /** v2 leading/trailing slots -> rendered as children in v3. */
  startContent?: ReactNode;
  endContent?: ReactNode;
  className?: string;
  /**
   * Opt OUT of the Material-3 press/hover ripple. Default `false` (ripple ON),
   * preserving the v2 intent where the ripple was the baseline affordance. Set
   * `disableRipple` on quiet text/link-style buttons where a ripple is noise.
   * Applies to BOTH render paths (the v3 Button AND the `as="a"` anchor) so the
   * two stay visually identical. The ripple is purely client-side (all DOM work
   * runs inside the component's `useEffect`/handlers — never during render), so
   * it is SSR-safe and will not break a future web-next server render.
   */
  disableRipple?: boolean;
  /** Element to render. `"a"` => styled anchor; otherwise the v3 Button. */
  as?: "a" | "button";
  // Anchor props (only meaningful with `as="a"`, but always accepted).
  href?: string;
  target?: string;
  rel?: string;
  // Native button props forwarded to the v3 Button path.
  type?: "button" | "submit" | "reset";
  onClick?: React.MouseEventHandler<HTMLElement>;
  /**
   * v3/react-aria press handler. Preserved because v2 AppButton accepted it
   * (the AppModal story still passes `onPress`). Forwarded to the v3 Button.
   */
  onPress?: HeroV3ButtonProps["onPress"];
  // Common pass-throughs.
  id?: string;
  style?: React.CSSProperties;
  tabIndex?: number;
  title?: string;
  role?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
  "aria-hidden"?: boolean;
  "aria-current"?: React.AriaAttributes["aria-current"];
  ref?: Ref<HTMLButtonElement | HTMLAnchorElement>;
}

/**
 * Map the v2 (`variant` + `color`) pair onto a single v3 `variant`.
 *
 * Rules (from the migration spec):
 *   default (color=primary, variant=solid) -> primary
 *   bordered                               -> secondary
 *   flat / light                           -> tertiary
 *   faded                                  -> secondary
 *   ghost                                  -> ghost
 *   color=danger + flat/light              -> danger-soft
 *   color=danger (solid)                   -> danger
 * A v3 variant passed directly is honored as-is.
 */
export function toV3Variant(
  variant: AppButtonProps["variant"],
  color: AppButtonProps["color"],
): AppButtonVariant {
  // Pass-through: already a v3 variant.
  if (
    variant === "primary" ||
    variant === "secondary" ||
    variant === "tertiary" ||
    variant === "outline" ||
    variant === "danger-soft"
  ) {
    return variant;
  }

  const isSoft = variant === "flat" || variant === "light" || variant === "faded";

  // Danger color folds into danger / danger-soft.
  if (color === "danger") {
    return isSoft ? "danger-soft" : "danger";
  }

  switch (variant) {
    case "bordered":
    case "faded":
      return "secondary";
    case "flat":
    case "light":
      return "tertiary";
    case "ghost":
      return "ghost";
    case "solid":
    case "shadow":
    case "dot":
    case undefined:
    default:
      return "primary";
  }
}

/**
 * v3 dropped the `radius` prop; the equivalent is a Tailwind rounded utility.
 * Map the v2 `radius` vocabulary onto Tailwind classes, defaulting to the v2
 * `radius="sm"` corner (8px) the old wrapper used. This is applied on BOTH the
 * Button and the styled-anchor render paths so they stay pixel-identical.
 */
const RADIUS_CLASS: Record<NonNullable<AppButtonProps["radius"]>, string> = {
  none: "rounded-none",
  sm: "rounded-[8px]",
  md: "rounded-[12px]",
  lg: "rounded-[14px]",
  full: "rounded-full",
};

export function AppButton({
  children,
  variant,
  color,
  radius = "sm",
  size = "md",
  fullWidth,
  isIconOnly,
  isDisabled,
  isLoading,
  startContent,
  endContent,
  className,
  disableRipple = false,
  as,
  href,
  target,
  rel,
  type,
  onClick,
  onPress,
  ref,
  ...rest
}: AppButtonProps) {
  const v3Variant = toV3Variant(variant, color);
  const radiusClass = RADIUS_CLASS[radius];

  // m3-ripple's overlay is `position:absolute; inset:0`, so its host element must
  // be a positioning + clipping context. `buttonVariants()` already yields a
  // relative, overflow-hidden surface, but we pin `relative overflow-hidden`
  // explicitly so the ripple is contained on BOTH paths regardless of variant.
  //
  // `renderRipple(active)` centralizes the gating so every render path stays
  // consistent:
  //   - `disableRipple` (call-site opt-out)  -> no <Ripple> node at all.
  //   - non-interactive (`isDisabled`, or the pending/loading button) -> the
  //     <Ripple> is mounted but `disabled`, so it shows neither hover nor press
  //     feedback. A press affordance on a button you cannot press is misleading,
  //     so we suppress it rather than letting m3-ripple fire on a dead control.
  // m3-ripple is SSR-safe (it touches `document`/`window` ONLY inside
  // `useEffect`/event handlers, never at module or render scope — verified
  // against m3-ripple@1.1.3), so mounting it is safe even in a future web-next
  // server render; the gating above is purely about UX, not about avoiding a
  // crash.
  const renderRipple = (active: boolean) =>
    disableRipple ? null : <Ripple disabled={!active} />;

  // Icons (v2 start/endContent) become children in v3.
  const content: ReactNode = (
    <>
      {startContent}
      {children}
      {endContent}
    </>
  );

  // ---- Anchor branch: `as="a"` -------------------------------------------
  // v3 Button cannot render an <a> via `render`, so emit a styled anchor using
  // the SAME `buttonVariants()` classes the v3 Button uses -> pixel-identical.
  if (as === "a") {
    const anchorClass = buttonVariants({
      variant: v3Variant,
      size,
      fullWidth,
      isIconOnly,
      // `relative overflow-hidden` host the ripple overlay (see note above).
      className: `relative overflow-hidden ${radiusClass} ${className ?? ""}`.trim(),
    });
    return (
      <a
        ref={ref as Ref<HTMLAnchorElement>}
        href={href}
        target={target}
        rel={rel}
        className={withV3Theme(anchorClass)}
        // Anchors have no native disabled; mirror v3 button semantics.
        aria-disabled={isDisabled || undefined}
        onClick={onClick}
        {...rest}
      >
        {content}
        {/* Anchor "disabled" is communicated via aria-disabled; gate the ripple
            on the same condition so a disabled CTA gives no press feedback. */}
        {renderRipple(!isDisabled)}
      </a>
    );
  }

  // ---- Button branch: `as="button"` or unset -----------------------------
  // `relative overflow-hidden` host the ripple overlay (see note above).
  const buttonClass = withV3Theme(
    `relative overflow-hidden ${radiusClass} ${className ?? ""}`.trim(),
  );

  // v3 Button is a react-aria <button>: its DOCUMENTED handler is `onPress`,
  // and `ButtonRoot` actively strips a native DOM `onClick` (`delete
  // props.onClick`). So we MUST route the v2-era `onClick` through `onPress`
  // rather than rely on react-aria's internal onClick->usePress shim (which is
  // not a v3 contract and could vanish on a react-aria bump). If a consumer
  // passes both, fire `onClick` first then `onPress`. The docs CvPage print
  // button and CalBookButton both depend on this path firing.
  const mergedOnPress: HeroV3ButtonProps["onPress"] =
    onClick || onPress
      ? (event) => {
          onClick?.(
            event as unknown as React.MouseEvent<HTMLButtonElement>,
          );
          onPress?.(event);
        }
      : undefined;

  const buttonProps: HeroV3ButtonProps = {
    variant: v3Variant,
    size,
    fullWidth,
    isIconOnly,
    isDisabled,
    isPending: isLoading,
    type,
    onPress: mergedOnPress,
    ref: ref as Ref<HTMLButtonElement>,
    className: buttonClass,
    ...rest,
  };

  // Pending state uses v3's render-prop API to show the spinner.
  if (isLoading) {
    return (
      <HeroV3Button {...buttonProps}>
        {({ isPending }) => (
          <>
            {isPending ? <HeroV3Spinner size="sm" /> : startContent}
            {children}
            {!isPending ? endContent : null}
            {/* No press feedback while the button is pending or disabled. */}
            {renderRipple(!isPending && !isDisabled)}
          </>
        )}
      </HeroV3Button>
    );
  }

  return (
    <HeroV3Button {...buttonProps}>
      {content}
      {/* Ripple only when the button is actually pressable. */}
      {renderRipple(!isDisabled)}
    </HeroV3Button>
  );
}
