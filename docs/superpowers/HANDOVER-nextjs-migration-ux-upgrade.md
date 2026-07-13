# Handover — Next.js migration + UX upgrade (PR #9, merged 2026-07-13)

> Point-in-time snapshot for the next contributor (human or AI). The durable reference is `.claude/CLAUDE.md` (updated in the same PR); this file adds the "why", the infra state outside the repo, and the open follow-ups. Safe to delete once absorbed.

## What shipped (PR #9 → `main` @ `d8747fe`)

`apps/docs` migrated in place from Vite/React-Router SPA to Next.js 16 App Router, SEO-first, then given a UX/motion pass and an adversarial review pass. 9 commits; the portfolio (`itshassan.it`) now serves 12 statically generated pages (3 locales × home, `/audit`, `/cv`, `/privacy`).

## Architecture decisions worth knowing

- **Locale = URL segment** (`/it` `/en` `/fr`). `src/proxy.ts` (Next 16 middleware) 307-redirects bare paths using cookie → `Accept-Language` (q-weights honored) → `it`. The cookie key is the old SPA localStorage key (`laboratoire-locale`, tied via `LOCALE_COOKIE = LOCALE_STORAGE_KEY`); `LocaleCookieSync` migrates returning visitors' stored preference once. `LocaleSwitcher` self-navigates (cookie + `router.push`, preserving query+hash).
- **Content pipeline**: the 3 `portfolio-content.*.json` moved from `public/` to `src/content/data/` and are statically imported + zod-validated in `src/content/loader.ts`. A malformed payload fails `next build` (by design — no silent English fallback under `/it`). Asset paths are normalized to root-absolute at load.
- **SEO surface**: per-page `generateMetadata` via `src/seo/pageMetadata.ts` (canonical + hreflang, x-default → it), `sitemap.ts` (no `lastModified` — on purpose), `robots.ts`, localized JSON-LD in the locale layout (`src/seo/JsonLd.tsx`, offers fed from the live services data), per-locale 1200×630 OG/Twitter cards (`opengraph-image.tsx` + `twitter-image.tsx`, both `force-static`).
- **SSR visibility is load-bearing**: the route template only plays its enter animation on client-side navigations (module-level `hasHydratedOnce` flag); hero + nav entrances are CSS keyframes (`.hero-enter*` in portfolio.css), not framer mount animations. Do NOT reintroduce `initial="hidden"` on above-the-fold framer elements — it serializes `opacity:0` into the prerendered HTML (the original SPA-era bug this PR fixed). Below-fold `whileInView` reveals are covered by a `<noscript>` fallback in the layout.
- **Hydration safety**: use `src/lib/useReducedMotionSafe.ts` (useSyncExternalStore), never framer's `useReducedMotion`, in anything that branches render output. `ThemeToggle` (packages/ui) gates on hydration for the same reason. Theme itself is applied pre-paint by the inline script in `src/app/[locale]/layout.tsx` (key `THEME_KEY` imported from `@laboratoire/ui`).
- **Design tokens**: brand `--app-*` untouched (single-sourced in packages/ui `tokens.ts`). The UX layer added derived tokens in portfolio.css: `--accent-ink` (readable accent for TEXT on dark — raw accent is ~1.8:1 on #080808), `--accent-glow`, `--accent-ring`, plus utilities `.section-eyebrow`, `.card-hover`, `.cta-primary`, `.cta-secondary`.
- **Env compatibility**: `next.config.ts` maps legacy `VITE_ADMIN_API_BASE` / `VITE_CAL_LINK` → `NEXT_PUBLIC_*` at build time. The live Vercel project still uses the VITE_* names (Sensitive, non-renameable) — no dashboard change required. Once NEXT_PUBLIC_* vars exist on Vercel, the fallback block can be deleted.
- **web-next fix that unblocked previews**: `lib/db/client.ts` initializes Drizzle lazily behind a Proxy — `next build` no longer requires `DATABASE_URL` (admin project env is Production-scoped, so every preview build used to die at "Collecting page data").

## Deleted in the cleanup (all recoverable via `git log --diff-filter=D`, commit `612025e`)

- Root session notes (~280 KB: CONTENT_COPY_REPORT, TASKS, HANDOVER, `_followup`, `_spec/_handover/_copy-deck-*`, `_orchestrator-runs/`)
- Superseded CV PDFs (`*-05-2026`, `*-102025`) — old external links to those files now 404 (kept: `CV-ENG-06-2026`, `CV-ITA-06-2026`, `CV-ENG-NET-06-2026`)
- The 6 never-mounted SPA sections (About, Contact+ContactForm, Highlights, Portfolio, Roadmap) + `contactForm.schema` and tests + `githubProfileSchema`
- `mePNG.png` + the 1.8 MB `portrait.png` (hero + JSON-LD use the 67 KB `portrait.webp`). NOTE: the site currently has no contact form — contacts flow via WhatsApp/mail/Cal CTAs. Resurrect ContactForm from git history if a form is ever wanted (it needs a localized `privacyHref`).

## Infra state (outside the repo)

Vercel (team `hassans-projects-9cc8617f`): 3 projects off this monorepo — `laboratoire` (apps/docs → itshassan.it), `admin` (apps/web-next → admin.itshassan.it), `bookable` (apps/booking-service → bookable.itshassan.it). Neon DBs: `laboratoire-prod-db` + `laboratoire-testing-db` (testing is — wrongly — connected to the `laboratoire` project via Storage).

### Open TODOs on the Vercel dashboard (owner: Hassan)

1. Link the new Shared `DATABASE_URL` (Production + Preview entries) to `admin` + `bookable`; verify the Production value matches the DB admin uses today (compare hosts in the Neon console — values are Sensitive).
2. After a green redeploy, delete the per-project `DATABASE_URL` duplicates and the 8 stale branch-scoped vars (`feat/post-launch-tasks`, `feat/admin-phase-3-plan`) on `admin`.
3. Storage → disconnect `laboratoire-testing-db` from the `laboratoire` project (removes 10 injected unused `DATABASE_*` vars).
4. Delete `VITE_UI_SOURCE` from the `laboratoire` project (Vite-era; only web-react uses it locally).
5. `admin` has no `RESEND_API_KEY`/`RESEND_FROM` → lead email notifications cannot send in prod. See `apps/web-next/RESEND_SETUP.md`.

## SEO rollout (in progress)

- Google Search Console domain property for `itshassan.it`: TXT record `google-site-verification=...` added in the OVH DNS zone (apex, type TXT) → Verify → `https://itshassan.it/sitemap.xml` submitted — done.
- Expect Google to progressively index the 12 localized URLs (hreflang + canonical are served in the static HTML).

## Known accepted trade-offs / candidate follow-ups

- Foreign-locale copy ships to the client (~17 KB gz): home sections are client components importing `Record<Locale,…>` getters. Fix pattern exists (CvPage: server page resolves content, passes props). Worth doing if the copy grows.
- Unbranded 404 for dot-containing paths with an invalid first segment (e.g. deleted `/pdf/old.pdf`): they bypass the proxy and Next's default 404 renders (no root layout). `global-not-found.tsx` fixes it but is still experimental in Next 16.1 — revisit when stable.
- Route EXIT animations were dropped (App Router has no AnimatePresence equivalent); enter-only via template on client navigations.
- `apps/web-react` still ships the `404.html` postbuild copy (GitHub-Pages era); docs no longer does.

## Verification recipes

```bash
pnpm check                      # lint + typecheck + test, whole monorepo
pnpm -F docs build              # must stay green WITHOUT any env set
pnpm -F web-next build          # same (lazy DB makes it env-independent)
pnpm start:docs                 # then:
curl -sI localhost:3000/ | grep -i location          # → /it (307)
curl -s localhost:3000/it | grep -c 'hreflang'       # → 4 alternates
curl -s localhost:3000/sitemap.xml | head            # 12 urls + xhtml:link
```

Prod smoke test after any deploy: `/` redirects by language, locale switcher persists across reload, dark/light with no flash, OG card renders on `https://itshassan.it/it/opengraph-image`.
