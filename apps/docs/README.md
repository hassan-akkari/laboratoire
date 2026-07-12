# docs — portfolio (Next.js 16, App Router)

Portfolio/marketing site for Hassan Akkari (`itshassan.it`), migrated from a
Vite + React Router SPA to **Next.js 16 App Router** for real server-side SEO.

## Architecture

- **Locale-prefixed routes** — every page lives under `/{it|en|fr}`:
  `/it`, `/en/cv`, `/fr/audit`, `/it/privacy`. `src/proxy.ts` (Next 16
  middleware) redirects bare paths (`/`, `/cv`, ...) to the visitor's locale:
  cookie `laboratoire-locale` → `Accept-Language` → `it`.
  `LocaleCookieSync` bridges returning SPA visitors (localStorage → cookie).
- **SEO server-side** — per-page `generateMetadata` (title/description per
  locale from `src/data/seoContent.ts` and `src/data/auditContent.ts`),
  canonical + hreflang alternates (`src/seo/`), Open Graph/Twitter cards,
  `sitemap.ts`, `robots.ts`, and localized JSON-LD (`src/seo/JsonLd.tsx`:
  Person + ProfessionalService with the live services catalog).
- **Content build-time, not fetch-time** — the old RTK Query fetch of
  `public/data/portfolio-content*.json` is replaced by static imports in
  `src/content/loader.ts` (zod-validated at build, asset paths normalized to
  root-absolute). Redux is gone.
- **Sections are client components** (framer-motion + HeroUI) composed by
  server pages under `src/app/[locale]/`. Pages in `src/pages/` are the
  client page bodies (audit, cv, privacy).
- **Theme** — dark default, inline pre-paint script in
  `src/app/[locale]/layout.tsx` reads `laboratoire-theme` (same key the
  `@laboratoire/ui` `useTheme` hook writes).
- **Fonts** — `next/font/google` (Outfit + Space Grotesk) exposed as
  `--font-outfit` / `--font-space-grotesk`; no render-blocking CSS `@import`.

## Commands (from repo root)

```bash
pnpm dev:docs      # next dev, port 3000
pnpm build:docs    # builds @laboratoire/ui first (prebuild), then next build
pnpm start:docs    # next start, port 3000
pnpm -F docs lint && pnpm -F docs typecheck && pnpm -F docs test
```

## Env

See `.env.example`: `NEXT_PUBLIC_ADMIN_API_BASE` (admin API on web-next),
`NEXT_PUBLIC_CAL_LINK` (Cal.com event). Both are optional — components fall
back gracefully.
