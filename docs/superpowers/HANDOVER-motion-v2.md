# Handover — motion-v2: navbar rebuild + interaction layer (2026-07-13)

> Resume point for the design/motion workstream on `dev/motion-v2`. Read this
> first in a fresh session. Durable reference stays `.claude/CLAUDE.md`; the
> previous migration handover is `HANDOVER-nextjs-migration-ux-upgrade.md`
> (committed on branch `claude/nextjs-migration-ux-upgrade-w9qcwk`, NOT merged).

## The arc

Hassan wants the portfolio to feel senior/interactive ("lo scroll è statico, i
siti degli altri sono più fighi"). Diagnosis: one motion vocabulary (fade-up
`whileInView`, once) repeated 9×, nothing continuous, hand-rolled mobile menu
visibly broken. Plan approved: rebuild the nav properly on a real component,
then a Tier-1 motion layer, then (NOT DONE YET) Process scrollytelling.

## Git state — READ THIS BEFORE MERGING ANYTHING

- Work lives on **`dev/motion-v2`** (origin): `b0a38d6` (PR #9 merge,
  **rewritten sha**) → `5315c48` (navbar+motion) → `f40375b` "gg" (Hassan,
  next-env.d.ts dev artifact) → `7135c46` (editorial menu + burger morph).
- **The branch root does NOT match `origin/main`** (`d8747fe`): Hassan
  force-pushed from a clone whose history was rewritten (same content,
  different shas, at least back to the PR #9 merge). Before opening a PR to
  `main`, check the merge-base; if GitHub shows a bloated diff, recreate the
  branch from `origin/main` and cherry-pick `5315c48` + `7135c46` (skip "gg" —
  see gotchas).
- `claude/nextjs-migration-ux-upgrade-w9qcwk` carries only the previous
  handover doc (`f1fca84`), unmerged.

## What shipped (2 commits, verified via Playwright screenshots + pnpm check + docs build)

### Navbar (the user-visible fix)

- `packages/ui` `AppNavbar` (the **native-HTML v3 wrapper** — HeroUI v3 has no
  Navbar; do NOT regress to v2 Navbar) gained `collapseBreakpoint: sm|md|lg`
  (menu visibility class + scroll-lock media query) and a **burger→X morphing
  toggle**: three bars animated with INLINE styles — deliberate, because docs'
  Tailwind does not content-scan packages/ui, so `data-[...]:` variant classes
  would silently emit nothing. The global reduced-motion kill switch
  (`transition-duration: 0ms !important`) still beats inline styles.
- `SiteHeader` rebuilt on the AppNavbar compound: `itshassan.it` wordmark,
  desktop link rail (ghost-width trick kept: `.nav-link__ghost`), actions
  cluster (WhatsApp icon / ThemeToggle / LocaleSwitcher ≥lg / audit CTA ≥md),
  `useHideOnScroll` (hide on down-scroll past 160px, show on up-flick,
  disabled while menu open — lint note: derive the disabled value at return,
  `setState` in the effect body trips `react-hooks/set-state-in-effect`).
- Mobile menu = dropdown panel aligned with the pill: editorial rows (Space
  Grotesk ~22px, `01…06` counters via `data-index` + CSS `attr()`, hairline
  separators), staggered entrance (`--i` var), page dim via `::before`
  `position:fixed; z-index:-1`, body scroll-lock + Escape from the wrapper.
  **Locale switcher is finally reachable on mobile** (old CSS `display:none`d
  it <780px).
- `AuditPage` topbar on the same shell (brand + back-link ≥640px + toggles).
- **Root cause of Hassan's screenshot bugs** (ghost "CV" at viewport edge +
  horizontal scrollbar): the old `#sidemenu` was `position:fixed` inside a
  `<nav>` whose `.hero-enter` animation has `fill: both` — the residual
  transform made the nav the containing block. `.site-nav` therefore sets
  `animation-fill-mode: backwards`; **do not remove it**, the menu backdrop's
  `fixed` positioning depends on the nav having no lingering transform.

### Motion layer (Tier 1)

- Hero scroll depth (`HeroSection`): `contentY 0→-44` + opacity fade,
  `portraitY 0→48`, `haloY 0→56` — all neutral at progress 0 (SSR rule), all
  behind `useReducedMotionSafe`.
- `CardSpotlight` (mounted in locale layout): ONE delegated pointermove writes
  `--spot-x/--spot-y` on the hovered `.card-hover`; glow is
  `.card-hover::after` behind `(hover:hover) and (pointer:fine)`.
- `MagneticWrap` around hero + final-CTA primary buttons (spring, ±7px cap,
  mouse-only, plain div under reduced motion).
- `StatValue` count-up on the hero proof stats: SSR/prerender shows the FINAL
  value; ghost span locks width; `sr-only` span carries the stable value.
- **Fix:** card hover lift moved `transform` → `translate` property — framer
  leaves inline `transform: none` after reveals, which had silently killed the
  old translateY lift on every motion card.

### CSS layout

Legacy `nav`/`nav ul`/off-canvas/`#header` blocks are DELETED from
`portfolio.css`; everything new lives in the `site-nav` + spotlight + stat
layers appended at the end of the file. `.nav-link` (ghost) and
`.nav-theme-toggle`/`.locale-switcher` survive.

## Environment gotchas (this container)

- Node 24 required (`.node-version`), container ships 22 → `nvm install 24`
  and re-source nvm in every Bash call.
- The Next prod process is named `next-server`, NOT "next start" — pkill
  accordingly, and don't let a stale server serve a rebuilt `.next` (chunk
  hashes change → phantom 500s on CSS chunks).
- Playwright: `playwright-core` npm + `executablePath: "/opt/pw-browsers/chromium"`.
  `html { scroll-behavior: smooth }` breaks hover tests — wait ~1.5s after any
  programmatic scroll before `hover()`.
- `curl | grep hreflang` returns 0: Next serializes `hrefLang` camelCase.
  Grep case-insensitively; all 4 alternates are still emitted.
- `next-env.d.ts` ping-pongs between `./.next/types` (build) and
  `./.next/dev/types` (dev) — don't commit the flip (Hassan's "gg" commit is
  exactly this; harmless but noisy).
- `AppButton` (v3) only accepts `as="a" | "button"` — internal links use
  `as="a"` + `localePath(...)` (repo-wide pattern), never `as={Link}`.

## Open / next steps (in priority order)

1. **Process scrollytelling** — pinned/sticky section, steps activate on
   scroll, SVG line draws. The single biggest remaining "senior" upgrade;
   Hassan is primed for it.
2. **Menu exit animation** — the wrapper unmounts `AppNavbarMenu` when closed
   (no AnimatePresence equivalent), so close is instant. Options: keep mounted
   + data-state attr + CSS exit, or add a small delayed-unmount state machine
   in the wrapper. Hassan was told this is the next candidate.
3. Tier 2 ideas (agreed, not started): tech-stack marquee, per-section
   background hue shift, subtle 3D tilt on case-study cards, word-reveal
   headings.
4. Merge strategy for `dev/motion-v2` → `main` (see Git state above).
5. Minor: at 768–1023px the audit CTA shows in BOTH the pill and the menu
   footer; decide if that redundancy bothers anyone.

## Verify recipes

```bash
pnpm check                          # lint + typecheck + test (all green @ 7135c46)
pnpm -F @laboratoire/ui build       # required after ANY packages/ui edit
pnpm -F docs build                  # 16 static pages, no env needed
# visual: playwright-core against `next start`, screenshots at 375/768/1440,
# menu open/closed, dark + light (set localStorage laboratoire-theme=light),
# assert document.scrollingElement.scrollWidth === clientWidth (overflow guard)
```
