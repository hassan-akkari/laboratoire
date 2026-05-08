# Follow-up — observations collected outside this PR's scope

> Created during `chore: deploy topology cleanup` (branch `chore/deploy-topology-cleanup`). Smells noted but **not** fixed here, per the brief's "no scope creep" rule. Each entry has enough evidence and a suggested next step.

## Open decision points (asked back to the human)

| ID | Topic | Status |
|---|---|---|
| **D1** | Fate of `apps/web-next` (WIP / smoke-test / abandoned) | Awaiting answer |
| **D2** | OVH topology — what runs there, service type, deploy mechanism | Awaiting answer |
| **D3** | Values for the `<DATE>` and `<ISSUE>` placeholders in the new MVP guard comments | Awaiting answer |

P2 (`apps/web-next` build-only path) is blocked on D1.

---

## Doc / repo cleanup pairs left dangling

These are direct consequences of work in this PR. Resolve in a small follow-up so the codebase stays coherent.

### F1 — `README.md` still references the deleted GH Pages workflow

- **Where**: `README.md:81-86` ("Deploy GitHub Pages" section, mentions `deploy-user-site.yml`, `GH_PAGES_TOKEN`, target external repo).
- **Why not fixed here**: brief's P0.3 limits doc-sync to `.claude/CAPABILITIES.md` and `.claude/CLAUDE.md`.
- **Suggested fix**: replace the section with a Vercel + (TBD) OVH paragraph in a follow-up commit. Tiny diff.

### F2 — `apps/web-react/vite.config.ts:28` still maps the dead `@laboratoire/ui` alias

- **Where**: `apps/web-react/vite.config.ts:8-29`. The build-time alias resolves `@laboratoire/ui` to either `packages/ui/src` or `packages/ui/dist/index.js`, **mirroring the tsconfig path mapping that this PR removed.**
- **Why not fixed here**: brief's P1.1 was scoped to the tsconfig alias only. Removing the vite alias touches more (init logic + the explicit `existsSync` error message at `apps/web-react/vite.config.ts:17-21`).
- **Risk if left**: if a future contributor blindly imports `@laboratoire/ui` in `apps/web-react/src`, Vite will resolve it but TypeScript will complain — exactly the inconsistency we just removed on the TS side.
- **Suggested fix**: remove the alias block from `apps/web-react/vite.config.ts` and stop importing `@vitejs/plugin-react`'s tailwind/source-mode helpers that web-react no longer needs. Possibly retire web-react's UI-source toggle entirely, since it never consumed the package.

### F3 — `_bootstrap-report.md` is a frozen snapshot mentioning the removed workflow

- **Where**: `.claude/_bootstrap-report.md:11` lists `deploy-user-site.yml` among inspected configs.
- **Why not fixed**: it's an analysis trail / point-in-time artifact. Updating it would falsify history.
- **Suggested approach**: leave as-is. If / when the next bootstrap pass runs, it will produce a fresh snapshot.

---

## Latent smells noticed but out of scope

### F4 — `apps/web-react` has no `tailwind.config.ts`

- **Where**: `apps/web-react/` (compare to `apps/docs/tailwind.config.ts`).
- **Behavior**: Tailwind v4's postcss plugin still runs, but content scanning is implicit and may miss class usage. Already noted in `CLAUDE.md` Gotcha #3 (originally Gotcha #3 pre-cleanup).
- **Suggested fix**: either add an explicit config file mirroring `apps/docs/tailwind.config.ts`, or drop Tailwind from web-react if not actively used. Decide as part of the broader web-react audit.

### F5 — Three Tailwind setups with drifting design tokens

- **Where**: `apps/docs/src/index.css:14-49`, `apps/web-react/src/index.css:14-33`, `apps/web-next/app/globals.css`.
- **Behavior**: dark/light token values diverge across apps. Already noted in `CLAUDE.md` Gotchas (now #3).
- **Suggested fix**: consolidate canonical tokens in `packages/ui` (CSS variables exposed via a `theme.css` exported from the package) and have each app import them. Bigger refactor; needs design alignment.

### F6 — Free-form commit-message convention, no linter

- **Where**: history mixes `feat:`/`fix:`/`chore:` with one-word commits like `gg`, `sb`, `last updates`.
- **Behavior**: no enforcement. Already documented in `CLAUDE.md` Conventions.
- **Suggested fix**: add `commitlint` + `husky` if semantic versioning becomes a goal. Otherwise leave it.

### F7 — `pnpm` 11.0.8 is available; lockfile pinned to 10.0.0

- **Where**: install output during P0.1 surfaced an upgrade banner. `package.json#packageManager` and `.node-version` still target 10.x.
- **Suggested fix**: planned bump in a separate PR — coordinate with all devs on the team since `packageManager` is enforced.

### F8 — No pre-commit hooks (lint/typecheck/test)

- **Where**: no `.husky/`, no `lint-staged` config.
- **Behavior**: `pnpm check` only runs in CI (or when a human remembers locally).
- **Suggested fix**: small `husky` + `lint-staged` setup that runs `eslint --fix` and `tsc --noEmit` on changed files. Won't catch tests but covers most regressions.

### F9 — Zero React-component tests

- **Where**: every test under `apps/*` and `packages/ui` is a Zod-schema or pure-function test. No `@testing-library/react`, no Playwright.
- **Suggested fix**: introduce RTL for the `apps/web-next/app/checkout/` flow first (where the real risk lives — payment + idempotency). Pair with the booking-engine-author agent in `AGENTS.md`.

### F10 — Two SPA `index.html → 404.html` copy variants (legacy from GH Pages)

- **Where**: `apps/docs/package.json:8` (inline) and `apps/web-react/package.json:9-10` (postbuild hook).
- **Behavior**: vestigial — Vercel handles SPA routing natively. Harmless but pointless.
- **Suggested fix**: remove both copy steps once it's confirmed nothing relies on `404.html` for SPA fallback in the new topology. Trivial diff.

---

---

## 2026-05 audit pass — open items

> Surfaced by the parallel `apps/docs` / `apps/web-react` / `apps/web-next` / `packages/ui` / cross-cutting audit run on `chore/audit-cleanup-2026-05`. Fixed in the same branch: turbo `globalEnv`, ESLint typed lint for `packages/ui`, `framer-motion` peerDep, `/api/checkout` middleware matcher, SiteHeader `<button>`-in-`<ul>`, ContactForm `submitted` state.

### Critical — deferred to a follow-up PR (require larger refactors)

#### A1 — `apps/web-next` checkout idempotency key is regenerated on every render

- **Where**: `apps/web-next/app/checkout/page.tsx:50` (`const idempotencyKey = randomUUID()` inside the Server Component body).
- **Why it matters**: the contract that `idempotencyKey` is supposed to enforce ("same key → same order") only holds within the lifespan of a single rendered HTML page. Back-button + resubmit, or any cookie/middleware redirect that re-renders the page, produces a brand new key — so duplicate submissions create duplicate orders.
- **Suggested fix**: generate the key client-side (in a small `'use client'` form wrapper using `useRef` or `sessionStorage` keyed by `slug+date+email`), or issue it once server-side into the cookie/session and reuse it on resubmission. Pair with binding the key to the session (see A2).
- **Why deferred**: requires introducing a `'use client'` boundary for the form, which is the same surgery as A2 and A3 and should be done in one coordinated change.

#### A2 — Idempotency key in writable hidden field allows order retrieval by replay

- **Where**: `apps/web-next/app/checkout/page.tsx:87` + `apps/web-next/lib/orders.ts:86-93`.
- **Why it matters**: the key is a UUID inside a tampering-friendly hidden input. Submitting somebody else's UUID returns their full `OrderRecord` (name, email, paymentMethod). Within the MVP this is information disclosure, not just MVP-shaped weakness.
- **Suggested fix**: bind the key to the session cookie at creation time and verify the binding on lookup; or move the key into a server-set, HttpOnly cookie. Couple with A1.

#### A3 — Server Action validation failure silently redirects to `/cart`

- **Where**: `apps/web-next/app/checkout/page.tsx:66-68`.
- **Why it matters**: zod failures (tampered payloads, missing fields slipping past `required`) bounce users to cart with no message. There's no way to distinguish "validation failed" from "user changed their mind".
- **Suggested fix**: convert `submitOrder` to return a discriminated union (`{ ok: true; orderId } | { ok: false; fieldErrors }`) and consume it via `useActionState` in a `'use client'` form component. Render errors inline.
- **Why deferred**: same `'use client'` surgery as A1/A2 — bundle them.

### High priority debt

#### A4 — `apps/web-next` slug validation gap → unhandled server exceptions

- **Where**: `apps/web-next/lib/bookingSchemas.ts` (no slug-existence refinement), thrown inside `apps/web-next/lib/pricing.ts`'s `quoteBooking`.
- **Why it matters**: a crafted URL like `/cart?slug=fake&...` produces an unhandled server-side exception in the Server Component body of `cart/page.tsx:50` and `checkout/page.tsx:48`. Next.js renders the generic error page.
- **Suggested fix**: add `.refine(slug => VALID_SLUGS.includes(slug), "Unknown experience")` in `bookingSchemas.ts`; surface as `notFound()` from the page. One-file change.

#### A5 — `packages/ui/src/components/tw-ui/link.tsx` TODO unresolved

- **Where**: `packages/ui/src/components/tw-ui/link.tsx:1-7` (Catalyst boilerplate TODO; renders raw `<a>`). Consumed transitively by `button.tsx`, `dropdown.tsx`, `navbar.tsx`, `sidebar.tsx`, `pagination.tsx`, `table.tsx`.
- **Why it matters**: every `href`-based component in `packages/ui` triggers a full page reload in the React Router 7 SPAs (`apps/docs`, `apps/web-react`) and bypasses Next's `<Link>` prefetch in `apps/web-next`. A real DIP leak that no audit found before because none of those `tw-ui` components are exported by `index.ts` yet — see A6.
- **Suggested fix**: inject the link component via React context (`LinkContext` defaulting to native `<a>`); each app provides its own router-aware `Link` at the root. Document in the package README and bump `CLAUDE.md` Conventions when shipped.

#### A6 — 26+ `tw-ui` components compiled into `dist/` but never exported

- **Where**: `packages/ui/src/index.ts` exports only `Input`, `InputGroup`, `Textarea` from `tw-ui/`. The other 26 are part of `rootDir` so `tsc` emits them, but consumers can't import them.
- **Why it matters**: the intent is ambiguous. Either the components are private (Catalyst-style copy-paste) — in which case they shouldn't be in `src/` shipped to consumers — or the exports are simply missing.
- **Suggested fix**: decide the model. If private, move to `internal/` outside `src/` and stop emitting. If public, add `export * from "./components/tw-ui/<name>"` lines and add a story per component.

#### A7 — `packages/ui/src/components/tw-ui/dropdown.tsx:139` double-spread bug

- **Where**: `<div {...props} data-slot="label" className={...} {...props} />` — `{...props}` appears twice.
- **Why it matters**: trailing spread silently overwrites `data-slot` if any consumer passes `data-slot` via `props`, and double-applies all other attributes.
- **Suggested fix**: remove the trailing `{...props}`. One-line.

#### A8 — `apps/docs/src/App.tsx` god component

- **Where**: locale state + localStorage effect + 2 RTK Query calls + fallback merge + `AnimatePresence` orchestration + inline route tree, all in 145 lines.
- **Suggested fix**: extract `useLocale()` (locale + persistence) and `usePortfolioData(locale)` (queries + fallback merge). Inline routes can stay until the route count grows.

#### A9 — `apps/docs/src/state/api.ts` mixes local JSON and GitHub origins in one RTK service

- **Where**: `apps/docs/src/state/api.ts:25-29` — `baseUrl: import.meta.env.BASE_URL` + a GitHub absolute URL endpoint.
- **Why it matters**: any future middleware (auth headers, retries) added to `contentApi` will leak into GitHub requests. Different services with different origins need different `createApi` instances.
- **Suggested fix**: split into `contentApi` and `githubApi`, each with their own `baseQuery`.

#### A10 — `apps/docs` heading hierarchy broken (multiple `<h1>` per page)

- **Where**: `apps/docs/src/components/sections/AboutSection.tsx:179`, `ContactSection.tsx:77`, `PortfolioSection.tsx:45` — all use `<h1 className="sub-title">`. The page already has an `<h1>` in `SiteHeader.tsx:107`.
- **Why it matters**: multiple `<h1>` confuse screen-reader landmark navigation. WCAG 2.1.
- **Suggested fix**: change the three section headings to `<h2>`. Likely needs a CSS pass on `.sub-title` since it currently styles whatever element wears it.

#### A11 — `apps/docs` no route-change focus management

- **Where**: `apps/docs/src/App.tsx` (routing shell). Navigating from `/` to `/cv` (and back) keeps focus on the activating link until `AnimatePresence` removes the source DOM node — at which point focus is lost.
- **Suggested fix**: a small `useEffect` on `location.pathname` that moves focus to the page's main heading or `<main>`.

#### A12 — `apps/web-next/tsconfig.json` and `packages/ui/tsconfig.json` missing strict-mode parity flags

- **Where**: both tsconfigs have only `strict: true`. Missing `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`, `noUncheckedSideEffectImports`, `erasableSyntaxOnly` — flags `CLAUDE.md` Conventions mandates "everywhere".
- **Suggested fix**: add the five flags. Likely zero-noise on `packages/ui`; may surface unused imports/parameters in `apps/web-next` worth fixing.

### Medium / hygiene

#### A13 — `@vercel/analytics` shipped in `apps/web-react` and `apps/web-next` (both target OVH, not Vercel)

- **Where**: `apps/web-react/package.json:19` + `apps/web-react/src/main.tsx:5`; `apps/web-next/package.json:15` + `apps/web-next/app/layout.tsx:4`.
- **Why it matters**: until D1/D2 are resolved, both apps make a per-page-load outbound call to a Vercel collector that returns 404 on OVH. Wasted bytes + misleading telemetry posture.
- **Suggested fix**: gate behind `import.meta.env.VITE_VERCEL_ENV` (or the Next equivalent), or remove until the deploy decision lands.

#### A14 — MSW worker leaks into `apps/web-react/dist/`

- **Where**: `apps/web-react/public/mockServiceWorker.js` is copied into `dist/` by Vite's static-asset handling. The startup guard in `main.tsx:20` blocks it from registering in prod, but the file still ships.
- **Suggested fix**: remove from `dist/` post-build (extend the existing `postbuild` hook or replace it; see A18 — they overlap).

#### A15 — French i18n diacritics stripped throughout `apps/docs/src/i18n/messages.ts`

- **Where**: `messages.ts:108`, `:201`, `:294` and surrounding French strings — `Francais`, `A propos`, `Ecrivez-moi`, `Telecharger`, `Reserver`, `Resume professionnel`, `Experience`, `Informations supplementaires`.
- **Why it matters**: visibly unprofessional for French-speaking visitors. Ç/É/À carry semantic meaning.
- **Suggested fix**: restore diacritics in all three locale dictionaries (the EN/IT dictionaries also display the locale label "Francais" for switching to French — fix everywhere).

#### A16 — `apps/docs/public/data/portfolio-content.fr.json:21` `resumePath` points to the English CV PDF

- **Where**: `"resumePath": "pdf/CV-ENG-102025.pdf"` in the FR JSON. No `pdf/CV-FRA-*.pdf` exists.
- **Suggested fix**: either ship a French CV, or document the intentional fallback with an inline comment + a `_followup.md` link; remove the FR-specific override in `App.tsx:45-63` if the fallback is the desired behavior.

#### A17 — `apps/docs/src/components/sections/contactForm.schema.ts` error messages hardcoded English

- **Where**: zod schema messages always render in English regardless of locale.
- **Suggested fix**: add `formErrorNameShort` / `formErrorEmail` / `formErrorMessageShort` keys to `Messages["contact"]` and pass them into a schema factory.

#### A18 — `apps/docs` and `apps/web-react` `index.html → 404.html` postbuild copy

- **Where**: `apps/docs/package.json:8` (inline) and `apps/web-react/package.json:9-10` (postbuild hook).
- **Why it matters**: vestigial GitHub Pages SPA fallback. Vercel doesn't need it. OVH (when wired) will or won't depending on the chosen server. Leaving it in is harmless but adds noise.
- **Suggested fix**: bundle removal with A14 (MSW worker cleanup) for `web-react`. Standalone removal for `docs`. Confirm OVH topology first (D2). **Already filed as F10 — kept here as a reminder, will collapse into a single removal commit when the path is clear.**

#### A19 — `apps/web-react` orphan code: `THEME_KEY` duplicated, `@vercel/analytics`, `useAppDispatch`/`useAppSelector` exported but unused, `favicon` MIME mismatch (`type="image/svg+xml" href="/favicon.png"` while the file on disk is `favicon.svg`)

- **Where**: `apps/web-react/src/main.tsx:10-17` + `src/hooks/useTheme.ts:5,7-18` (THEME_KEY duplication); `apps/web-react/index.html:5` (favicon mismatch); `apps/web-react/src/store/hooks.ts:4-5` (typed wrappers with no consumers).
- **Suggested fix**: small cleanup PR. Export `THEME_KEY` + `resolveInitialTheme` from `useTheme.ts` and consume from `main.tsx`. Fix favicon to `favicon.svg`. Decide on the typed-hook wrappers (keep + add `no-restricted-imports` rule, or remove).

#### A20 — `packages/ui/src/components/ThemeToggle.tsx` is the only default export in the public API

- **Where**: `ThemeToggle.tsx:5` uses `export default function`. `src/index.ts:1` re-exports it as named — masking the inconsistency.
- **Suggested fix**: convert to a named export at source. One-file rename + index update.

#### A21 — `apps/docs/tailwind.config.ts:4` uses Tailwind v3 `darkMode: ["class", ".dark"]` (dead config in v4)

- **Where**: file is loaded via `@config "../tailwind.config.ts"` in `index.css:2`, but Tailwind v4 ignores the `darkMode` key — the dark variant is correctly declared via `@custom-variant` in the CSS.
- **Suggested fix**: remove the dead key. Audit the rest of `tailwind.config.ts` for other v3-only options that became dead in v4.

#### A22 — `apps/docs` has 8 independent `useReducedMotion()` calls

- **Where**: 8 components each call `Boolean(useReducedMotion())` independently. The `Boolean(...)` wrapper is also redundant (the hook returns `boolean | null`, and `Boolean(null) === false`).
- **Suggested fix**: small `useMotion()` hook in `src/hooks/`, or pass `reduceMotion` from `App.tsx` via context. Drop the `Boolean(...)` wrapper.

### Documentation drift

#### A23 — `CLAUDE.md` Gotcha #2 cites a path alias that no longer exists in the tsconfig

- **Where**: Gotcha #2 says the dead `@laboratoire/ui` alias is in `apps/web-react/tsconfig.app.json:11-13`. The tsconfig was already cleaned; the alias survives only in `apps/web-react/vite.config.ts:28` (the Vite resolver, also unused at runtime — see F2).
- **Suggested fix**: update Gotcha #2 to point at `vite.config.ts` and merge with F2 in the next bootstrap pass.

#### A24 — `commit 1c968a3` (`feat: add @vercel/analytics across all apps`) added technical debt not tracked here

- **Why it matters**: reinforces the need to update `_followup.md` whenever a commit ships something that creates incoherence with the documented topology — see A13.
- **Suggested fix**: process note. Adopt "if this commit makes a `_followup.md` entry obsolete OR creates a new pending question, edit `_followup.md` in the same PR" as a soft rule.

#### A25 — `apps/docs/src/components/sections/ServicesSection.tsx` is dead code

- **Where**: zero imports across `apps/docs/src`. Hardcoded English strings, `<i>` used as icon container.
- **Suggested fix**: delete. If it's intended to be revived, add a `_followup.md` note and remove from the tree (`noUnusedLocals` is currently enforced at the file level only, not module-graph level).

#### A26 — `apps/docs/src/components/layout/SiteHeader.tsx:81-90` `FaBars` icon missing `aria-hidden`

- **Where**: open-menu button. The close button (FaTimes) was given `aria-hidden="true"` when its `<li>` wrapper was added in this audit pass; the open button still lacks it.
- **Suggested fix**: add `aria-hidden="true"` for parity. Trivial.


