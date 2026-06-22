"use client";

/**
 * AppNavbar — NATIVE-HTML v3 REBUILD (no HeroUI component backing it).
 *
 * WHY THIS IS DIFFERENT FROM THE OTHER v3 WRAPPERS
 * ------------------------------------------------
 * The v2 wrapper was a set of thin passthroughs over `@heroui/react`'s `Navbar*`
 * compound. HeroUI **v3 removed the Navbar component entirely** (and every
 * subcomponent: Brand / Content / Item / MenuToggle / Menu / MenuItem). There is
 * nothing in `@heroui-v3/react` to delegate to. So — unlike AppButton / AppCard /
 * AppLink, which re-point at a v3 component — this wrapper is rebuilt from PURE
 * native HTML (`<nav>` / `<header>` / `<ul>` / `<li>` / `<button>`) + Tailwind +
 * React state. It imports NOTHING from any HeroUI package.
 *
 * PUBLIC API IS PRESERVED (anti-corruption layer)
 * -----------------------------------------------
 * The barrel (`packages/ui/src/index.ts`) imports every name below, and the
 * Storybook story drives them. We keep the EXACT v2-shaped compound surface:
 *   - Named exports: `AppNavbar`, `AppNavbarBrand`, `AppNavbarContent`,
 *     `AppNavbarItem`, `AppNavbarMenuToggle`, `AppNavbarMenu`,
 *     `AppNavbarMenuItem` + each `*Props` type.
 *   - Static members: `AppNavbar.Brand` / `.Content` / `.Item` / `.MenuToggle` /
 *     `.Menu` / `.MenuItem` (dot-namespace form, used by `DotNamespaceForm`).
 *   - The static attachment uses the EXACT AppCard pattern: `Object.assign` with
 *     an EXPLICIT intersection-type annotation, so `tsc --declaration` keeps the
 *     emitted `.d.ts` portable — every member is a named, exported component, so
 *     no internal path is inlined (guards against TS2742).
 * Every `*Props` is a HAND-WRITTEN interface (not `= SomeHeroProps`); the v3
 * navbar has no HeroUI types to borrow, and hand-written props keep the surface
 * stable across the migration.
 *
 * `children` is OPTIONAL on the root: the v2 `NavbarProps.children` was optional,
 * and the `render`-only Storybook stories (no meta-level `args` default) rely on
 * it being optional to satisfy the `StoryObj` args contract WITHOUT editing the
 * story (a REQUIRED `children` makes `StoryObj<typeof meta>` demand a meta-level
 * `args`, which the render-only stories do not supply -> TS2322).
 *
 * CONTROLLED / UNCONTROLLED STATE MACHINE
 * ---------------------------------------
 * The mobile-menu open state is shared between the root (`AppNavbar`), the
 * `AppNavbarMenuToggle`, and the collapsing `AppNavbarMenu` via a React Context
 * (`NavbarContext`) created in this file (v2 did this internally). The root is a
 * well-behaved controlled/uncontrolled component:
 *   - CONTROLLED: pass `isMenuOpen` + `onMenuOpenChange`. The root never owns the
 *     state; the toggle calls `onMenuOpenChange(next)` and the consumer re-renders
 *     with the new `isMenuOpen`.
 *   - UNCONTROLLED: omit `isMenuOpen`. The root owns an internal `useState`; the
 *     toggle flips it. `onMenuOpenChange` is still notified if supplied.
 * `isMenuOpen` being defined (not `undefined`) is what selects controlled mode.
 *
 * ACCESSIBILITY (synthesized from the competition's a11y-first variant)
 * --------------------------------------------------------------------
 * The root is a `<nav>` landmark with an overridable `aria-label`. The icon-only
 * toggle is a real `<button type="button">` carrying the consumer `aria-label`,
 * an `aria-expanded` reflecting the open state, and `aria-controls={menuId}`
 * linking it to the menu (stable `useId`). Pressing Escape closes an open menu,
 * and body scroll is locked while the mobile menu is open. Active items expose
 * `aria-current="page"`. The decorative icon is `aria-hidden` + `focusable=false`.
 * All overlay/document work runs inside effects, so the component is SSR-safe.
 *
 * STYLING FOUNDATION
 * ------------------
 * The root scopes the warm v3 CSS vars via `withV3Theme()` so `bg-background`,
 * `border-border`, `text-foreground`, `text-accent`, etc. resolve to the warm
 * palette for the whole subtree. There is NO `--separator` token in the warm
 * scope — borders use `border-border`.
 */

import {
  useState,
  useContext,
  useEffect,
  useCallback,
  useId,
  createContext,
  type ReactNode,
} from "react";
import { withV3Theme } from "../../theme/v3/warmThemeV3";

/* -------------------------------------------------------------------------- */
/* Shared open-state context                                                  */
/* -------------------------------------------------------------------------- */

interface NavbarContextValue {
  /** Whether the collapsing mobile menu is currently open. */
  isMenuOpen: boolean;
  /** Set the open state (honoring controlled vs uncontrolled). */
  setOpen: (open: boolean) => void;
  /** Stable id linking the toggle's `aria-controls` to the menu's `id`. */
  menuId: string;
}

const NavbarContext = createContext<NavbarContextValue | null>(null);

/** Read the shared navbar state; safe no-op defaults if used outside a root. */
function useNavbarContext(): NavbarContextValue {
  return (
    useContext(NavbarContext) ?? {
      isMenuOpen: false,
      setOpen: () => {},
      menuId: "",
    }
  );
}

/* -------------------------------------------------------------------------- */
/* Public, hand-written prop types (anti-corruption surface)                  */
/* -------------------------------------------------------------------------- */

/** Container max-width presets mapped to a centered inner `<header>`. */
export type AppNavbarMaxWidth = "sm" | "md" | "lg" | "xl" | "2xl" | "full";

/**
 * Root props. `isMenuOpen`/`onMenuOpenChange` drive the controlled menu.
 * `children` is OPTIONAL (see the file header for the StoryObj reason and the
 * v2 `NavbarProps.children` optionality this matches).
 */
export interface AppNavbarProps {
  children?: ReactNode;
  /** Controlled open state. When defined, the root does not own the state. */
  isMenuOpen?: boolean;
  /** Notified on every toggle; required for controlled usage. */
  onMenuOpenChange?: (open: boolean) => void;
  /** Centered container width of the inner header. Default `lg`. */
  maxWidth?: AppNavbarMaxWidth;
  /** `sticky` pins the nav to the top; `static` (default) leaves it in flow. */
  position?: "static" | "sticky";
  /** Add a bottom hairline border. */
  isBordered?: boolean;
  /** Translucent blurred background instead of a solid one. */
  isBlurred?: boolean;
  /** Accessible name for the `<nav>` landmark. Default "Main navigation". */
  "aria-label"?: string;
  className?: string;
}

/** Brand slot props. */
export interface AppNavbarBrandProps {
  children: ReactNode;
  className?: string;
}

/** Content-group props. `justify` lays out the items horizontally. */
export interface AppNavbarContentProps {
  children: ReactNode;
  justify?: "start" | "center" | "end";
  className?: string;
}

/** Single nav item. `isActive` marks the current page. */
export interface AppNavbarItemProps {
  children: ReactNode;
  isActive?: boolean;
  className?: string;
}

/** Icon-only hamburger/X control that toggles the mobile menu. */
export interface AppNavbarMenuToggleProps {
  "aria-label"?: string;
  className?: string;
  /** Optional extra handler, fired alongside the internal toggle. */
  onPress?: () => void;
  /** Optional extra handler, fired alongside the internal toggle. */
  onClick?: () => void;
}

/** Collapsing mobile menu; renders its children only when the menu is open. */
export interface AppNavbarMenuProps {
  children: ReactNode;
  className?: string;
}

/** Single mobile-menu item. */
export interface AppNavbarMenuItemProps {
  children: ReactNode;
  className?: string;
}

/* -------------------------------------------------------------------------- */
/* Class maps                                                                 */
/* -------------------------------------------------------------------------- */

const MAX_WIDTH_CLASS: Record<AppNavbarMaxWidth, string> = {
  sm: "max-w-[640px]",
  md: "max-w-[768px]",
  lg: "max-w-[1024px]",
  xl: "max-w-[1280px]",
  "2xl": "max-w-[1536px]",
  full: "",
};

const JUSTIFY_CLASS: Record<
  NonNullable<AppNavbarContentProps["justify"]>,
  string
> = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end ml-auto",
};

/** Tiny className joiner (avoids an extra dependency import in this file). */
function cx(...parts: Array<string | false | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

/* -------------------------------------------------------------------------- */
/* Slot components                                                            */
/* -------------------------------------------------------------------------- */

export function AppNavbarBrand({ children, className }: AppNavbarBrandProps) {
  return (
    <div className={cx("flex items-center gap-2 text-foreground", className)}>
      {children}
    </div>
  );
}

export function AppNavbarContent({
  children,
  justify = "start",
  className,
}: AppNavbarContentProps) {
  // Rendered as a <div> (not <ul>): the compound API lets a content group hold
  // arbitrary children (brand, toggle button, items), and <button>/<div> are
  // invalid direct children of <ul> — a <div> avoids invalid markup + future
  // hydration warnings. The mobile <AppNavbarMenu> keeps clean <ul>/<li>.
  return (
    <div className={cx("flex items-center gap-4", JUSTIFY_CLASS[justify], className)}>
      {children}
    </div>
  );
}

export function AppNavbarItem({
  children,
  isActive,
  className,
}: AppNavbarItemProps) {
  return (
    <div
      aria-current={isActive ? "page" : undefined}
      className={cx(
        "flex items-center",
        isActive && "font-medium text-accent",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function AppNavbarMenuToggle({
  "aria-label": ariaLabel,
  className,
  onPress,
  onClick,
}: AppNavbarMenuToggleProps) {
  const { isMenuOpen, setOpen, menuId } = useNavbarContext();
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      aria-expanded={isMenuOpen}
      aria-controls={menuId || undefined}
      className={cx(
        "inline-flex h-10 w-10 items-center justify-center rounded-[8px] text-foreground transition-colors hover:bg-muted/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus)]",
        className,
      )}
      onClick={() => {
        setOpen(!isMenuOpen);
        onPress?.();
        onClick?.();
      }}
    >
      <svg
        aria-hidden="true"
        focusable="false"
        viewBox="0 0 24 24"
        width="22"
        height="22"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {isMenuOpen ? (
          <>
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </>
        ) : (
          <>
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </>
        )}
      </svg>
    </button>
  );
}

export function AppNavbarMenu({ children, className }: AppNavbarMenuProps) {
  const { isMenuOpen, menuId } = useNavbarContext();
  if (!isMenuOpen) return null;
  // Absolutely positioned below the bar (the root <nav> is `relative`) so the
  // open menu drops full-width UNDER the fixed-height header row instead of
  // becoming a squeezed flex item inside it. `top-16` matches the h-16 header;
  // `z-50` keeps it above page content even when the nav is not sticky.
  return (
    <div
      id={menuId || undefined}
      className={cx(
        "absolute left-0 right-0 top-16 z-50 sm:hidden border-t border-border bg-background",
        className,
      )}
    >
      <ul className="flex flex-col gap-2 px-6 py-4">{children}</ul>
    </div>
  );
}

export function AppNavbarMenuItem({
  children,
  className,
}: AppNavbarMenuItemProps) {
  return <li className={cx("flex items-center", className)}>{children}</li>;
}

/* -------------------------------------------------------------------------- */
/* Root                                                                       */
/* -------------------------------------------------------------------------- */

function AppNavbarRoot({
  children,
  isMenuOpen,
  onMenuOpenChange,
  maxWidth = "lg",
  position = "static",
  isBordered,
  isBlurred,
  "aria-label": ariaLabel = "Main navigation",
  className,
}: AppNavbarProps) {
  const isControlled = isMenuOpen !== undefined;
  const [internalOpen, setInternalOpen] = useState(false);
  const open = isControlled ? isMenuOpen : internalOpen;
  const menuId = useId();

  // Single setter shared via context; stable for the effect dependency arrays.
  // Writes internal state only when uncontrolled; always notifies the consumer.
  const setOpen = useCallback(
    (next: boolean) => {
      if (!isControlled) setInternalOpen(next);
      onMenuOpenChange?.(next);
    },
    [isControlled, onMenuOpenChange],
  );

  // Escape closes an open menu (a11y graft). In CONTROLLED mode this calls
  // onMenuOpenChange(false) and relies on the consumer to re-render with the new
  // value — a controlled consumer that ignores onMenuOpenChange makes Escape (and
  // the toggle) inert, which is the defining controlled-component contract.
  // Document work runs in an effect, so this is SSR-safe.
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, setOpen]);

  // Lock body scroll while the mobile menu is open — but ONLY below the `sm`
  // breakpoint where the menu (and toggle) are actually visible, so a controlled
  // consumer holding `isMenuOpen` on desktop never traps scroll behind a hidden
  // menu. Re-syncs on breakpoint change; restores the prior value on cleanup.
  useEffect(() => {
    if (!open) return;
    const mq = window.matchMedia("(max-width: 639px)");
    const previous = document.body.style.overflow;
    const sync = () => {
      document.body.style.overflow = mq.matches ? "hidden" : previous;
    };
    sync();
    mq.addEventListener("change", sync);
    return () => {
      mq.removeEventListener("change", sync);
      document.body.style.overflow = previous;
    };
  }, [open]);

  const navClassName = cx(
    // `relative` makes the nav the positioning context for the absolute mobile
    // <AppNavbarMenu> overlay (see AppNavbarMenu).
    "relative w-full text-foreground",
    position === "sticky" && "sticky top-0 z-40",
    isBordered && "border-b border-border",
    isBlurred ? "bg-background/70 backdrop-blur-lg" : "bg-background",
    withV3Theme(className),
  );

  const headerClassName = cx(
    "flex h-16 items-center justify-between px-6 gap-4",
    MAX_WIDTH_CLASS[maxWidth],
    "mx-auto",
  );

  return (
    <NavbarContext.Provider value={{ isMenuOpen: open, setOpen, menuId }}>
      <nav aria-label={ariaLabel} className={navClassName}>
        <header className={headerClassName}>{children}</header>
      </nav>
    </NavbarContext.Provider>
  );
}

/**
 * Static-property attachment. PRESERVED from the v2 wrapper (and matching
 * AppCard): the EXPLICIT intersection-type annotation (rather than relying on
 * `Object.assign` inference) keeps the emitted `.d.ts` portable — every member
 * is a named, exported component, so `tsc --declaration` never inlines a
 * non-portable internal path (guards against TS2742).
 */
export const AppNavbar: typeof AppNavbarRoot & {
  Brand: typeof AppNavbarBrand;
  Content: typeof AppNavbarContent;
  Item: typeof AppNavbarItem;
  MenuToggle: typeof AppNavbarMenuToggle;
  Menu: typeof AppNavbarMenu;
  MenuItem: typeof AppNavbarMenuItem;
} = Object.assign(AppNavbarRoot, {
  Brand: AppNavbarBrand,
  Content: AppNavbarContent,
  Item: AppNavbarItem,
  MenuToggle: AppNavbarMenuToggle,
  Menu: AppNavbarMenu,
  MenuItem: AppNavbarMenuItem,
});
