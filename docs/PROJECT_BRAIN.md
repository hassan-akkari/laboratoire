# PROJECT_BRAIN — laboratoire

> Current-state snapshot for any AI/human session. Read this FIRST, then `docs/DECISIONS.md`.
> Last full audit: **2026-07-20** (branch `claude/qol-control-centre-9fsas9`). Verify drift before trusting details.
>
> **Evidence tags** used below: **[V]** verified in repo code · **[M]** remembered from prior sessions (not re-verifiable from repo alone) · **[D]** deduced with good probability · **[?]** not yet verified.

## Vision

Personal monorepo of **composable capabilities**, not a folder collection. Three purposes:
1. **Portfolio / lead generation** — `apps/docs` (itshassan.it) + lead capture in `apps/web-next`.
2. **Product showcases** — `apps/booking-service` ("Bookable"), `apps/web-next` booking demo, `apps/web-react`.
3. **Personal QoL automation** — Obsidian vault → digital garden pipeline, `apps/control-centre`.

## App roles (verified 2026-07-20)

| App | Role | Stack | Deploy | Port |
|---|---|---|---|---|
| `apps/docs` | Public portfolio + digital garden. **Live.** | Next 16 App Router, SSG, 4 locales `en/it/fr/de` (de = Swiss-targeted) | **[V]** Vercel project `laboratoire` → **itshassan.it** (root `vercel.json`) | 3000 |
| `apps/web-next` | **Two surfaces**: (a) production admin/lead management — leads inbox, site-config, arsenale; (b) booking demo **deliberately parked** in `app/(booking-demo)/` (MVP-ONLY, not slated for fixing unless it gets a portfolio role) | Next 16, Drizzle + Neon, iron-session, Cal.com webhook, Resend | **[V]** own `vercel.json` in repo; **[M]** live on Vercel project `admin` → **admin.itshassan.it**, Root Directory = `apps/web-next`, seen working 2026-06-08 | 3001 |
| `apps/booking-service` | "Bookable" — booking-request platform MVP for local services (public catalogue + admin CRUD + 3-theme switcher) | Next 16, Drizzle + Neon (`booking_` table prefix), iron-session, vendored shadcn/ui | **[V]** own `vercel.json` → deployable; **[D→?]** probably live as bookable.itshassan.it (mentioned in handover notes) — **treat as probable, not verified**; confirm in Vercel dashboard | **3002** |
| `apps/control-centre` | Local-only QoL dashboard: job tracker (real, JSON store), scout + inbox triage + calendar (mock connectors, real engines), garden panel (real vault diff), git digest (real) | Next 16, zod + gray-matter only, hand-rolled CSS | **None by design** | **3002** ⚠ collides with booking-service |
| `apps/web-react` | Single-page RTK Query + MSW + HeroUI scaffold demo. Router installed, zero routes. | Vite SPA, React 19 | None | 5173+ |
| `apps/lab` | `@laboratoire/ui` visual playground — all 22 wrappers on the warm theme | Vite SPA | None | 5173+ |

## packages/ui (`@laboratoire/ui`)

- 22 `App*` HeroUI wrapper families + theme tokens + `UiProvider` + `useTheme`/`THEME_KEY`.
- **HeroUI v2 + v3 coexist**: v3 via npm aliases (`@heroui-v3/react|styles` = 3.2.1), scoped under class `heroui-v3-warm` applied per-wrapper by `withV3Theme()`. 16/22 wrappers migrated; NOT: Accordion, Dropdown, Modal, Table, Tabs, Tooltip.
- Consumers: docs, web-next, web-react, lab. NOT control-centre, NOT booking-service (own shadcn set).
- Build `tsc` → `dist/`; Next apps consume via `transpilePackages` + `prebuild`; Vite apps alias dist (`VITE_UI_SOURCE=1` for source mode).
- **Dead code**: 27 `tw-ui/` files unexported and unimported (Catalyst leftovers, incl. known dropdown double-spread + link.tsx TODO).
- Storybook: 20 stories (missing AppInput, AppTextarea). Tests: 10 (4 component, 6 guard/pure).

## Dependency map

```
Obsidian vault (local, PRIVATE) ──vault-sync──▶ docs/notes.json ──build──▶ itshassan.it/{locale}/notes
control-centre ──reads──▶ vault + notes.json (publish diff)
packages/ui ──▶ docs, web-next, web-react, lab
web-next ──▶ Neon (users, leads, site_config — unprefixed)
booking-service ──▶ SAME Neon DBs (booking_* prefix; use db:migrate, NEVER db:push)
Cal.com ──webhook HMAC──▶ web-next /api/cal/webhook ──▶ leads
docs (CalBookButton embed) ──▶ Cal.com (NEXT_PUBLIC_CAL_LINK)
web-next ──▶ Resend (code complete; RESEND_API_KEY not set — graceful no-op)
docs public site ──▶ web-next /api/site-config + /api/leads (Origin-allowlisted)
OVH = registrar/DNS only ──▶ Vercel (3 projects: laboratoire, admin, booking-service)
```

## Capability catalog (the Lego bricks)

| Capability | Where | Maturity | Reusable? |
|---|---|---|---|
| Admin auth (iron-session sealed cookie, bcrypt, ≥32-char secret) | `web-next/lib/adminSession.ts` (+ drifted copy `booking-service/lib/adminSession.ts`) | Production | Pattern yes. **Security-boundary duplication — rule-of-three does NOT apply**: the two copies must be compared, realigned, and test-covered; only then decide whether to share. No new auth package until that comparison is done. |
| Postgres persistence (Drizzle + Neon HTTP, lazy client, migrations) | `web-next/lib/db/*`, `booking-service/lib/db/*` | Production | Pattern proven, per-app schema |
| Lead capture + inbox | `web-next /api/leads` → `leads` table → `/admin` inbox | Production | Extend, don't duplicate |
| Webhook HMAC verify (SHA-256, timing-safe) | `web-next/lib/cal/verifySignature.ts` | Production, tested | Yes — template for any webhook |
| Transactional email (graceful-fail) | `web-next/lib/email.ts` | Code done, **key missing** (followup F15) | Yes |
| Booking funnel + pricing engine | `web-next (booking-demo)` (in-memory, MVP) and `booking-service` (DB-backed) | Demo / MVP | Prefer booking-service as base |
| i18n 4-locale SSG + proxy locale redirect | `docs/src/i18n/*`, `docs/src/proxy.ts` | Production | Pattern yes |
| SEO layer (JSON-LD graph, per-page metadata factory, canonical/hreflang, OG images, RSS, sitemap) | `docs/src/seo/*` | Production | Yes |
| Content pipeline vault→JSON (zod contract both ends, dry-run, deterministic) | `docs/scripts/vault-sync.ts` + `notes.schema.ts` | Production (manual trigger) | Yes — designed multi-target (F3: Postgres) |
| Job tracker / triage / scoring engines | `control-centre/lib/*` (tested pure logic; mock connectors) | Working local | Engines yes; connectors are the F2 work |
| Origin-allowlist CORS for public APIs | `web-next/lib/origin.ts` | Production, tested | Yes |
| UI kit + theming (warm theme, dark default, v2/v3 bridge) | `packages/ui` | Production | Yes |
| CI quality gate | `.github/workflows/ci.yml` → `pnpm check` on every push | Working | — |

## Auth & security boundaries (DO NOT merge without explicit decision)

Three independent session systems, deliberately separate:
1. `admin_session` (web-next) — iron-session sealed, `ADMIN_SESSION_SECRET`, 7d. Proxy checks presence; seal validated in `(authed)/layout.tsx` / route handlers.
2. `web_next_session` (booking demo) — MVP sentinel cookie, explicitly not production auth.
3. booking-service admin session — separate iron-session implementation, own secret.

Other invariants:
- `/api/cal/webhook` protected by HMAC only (`CAL_WEBHOOK_SECRET`), not cookies — intentionally outside proxy matcher.
- `/api/site-config` never returns `notifyEmail`; public APIs Origin-allowlisted (`PUBLIC_ALLOWED_ORIGINS`, `ADMIN_ALLOWED_ORIGINS`).
- Garden privacy: only `publish: true` notes leave the vault. Repo is public — committed JSON is public.
- ⚠ **OPEN**: Neon password + `ADMIN_SESSION_SECRET` leaked in a June 2026 transcript — rotation still pending (Hassan manual step, see `_handover-qol-garden-seo.md` §4).
- **[V]** Secret scan 2026-07-20 (working tree + full git history, pattern-based): no real credentials in the repo. `.env.example` DSNs/secrets are placeholders (`user:password@`, no real Neon `ep-` endpoints); old-commit pattern hits are vendor false positives from a historical accidental `node_modules` commit. The known leak lives in an external transcript, not in git.
- Duplicated security code (`adminSession` in web-next AND booking-service) is a standing risk: **rule-of-three is a default, not a law — it does not apply to auth/session/validation boundaries.** Task: compare, realign, test-cover the two copies; only then decide on sharing (no new package before that).

## Environments

- Env var names (values live in gitignored `.env.local` / Vercel): `DATABASE_URL`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET`, `PUBLIC_ALLOWED_ORIGINS`, `ADMIN_ALLOWED_ORIGINS`, `RESEND_API_KEY`, `RESEND_FROM`, `CAL_WEBHOOK_SECRET`, `PRIVACY_VERSION`, `DEV_NO_DB` (dev escape hatch), `NEXT_PUBLIC_CAL_LINK`, `GOOGLE_SITE_VERIFICATION`, `VAULT_DIR` (control-centre).
- Neon: two projects — testing-db → Preview + local; prod-db → Production. Shared by web-next + booking-service.
- docs still maps legacy `VITE_*` → `NEXT_PUBLIC_*` in `next.config.ts` (transitional).

## Critical flows — never break

1. **Portfolio build**: `prebuild` builds ui → `next build` validates all 4 content JSONs (throws on drift). All 4 locales edited together.
2. **Lead capture**: contact form → `/api/leads`; Cal.com → webhook → `upsertCalLead` (dedup on `cal_booking_id`). DB write is truth; email failure never blocks.
3. **Admin login**: bcrypt vs `users` table → sealed cookie. Keep the Origin check + zod chain on every admin route.
4. **Garden publish**: vault edit → `pnpm -F docs vault:sync -- --vault "<path>"` → commit `notes.json` → push. Manual by design; notes canonicalize on `/en`.
5. **Shared Neon**: migrations only — flow is `db:generate` → review SQL → `db:migrate`. `db:push` on the shared DB can clobber the other app's tables. ⚠ Today this is convention-only (README note); an executable guard-rail is a NOW task below.

## Known debt (top items — full radar in `.claude/_followup.md`)

1. **Secret rotation open** (see above) — highest priority, human step.
2. **Doc drift**: `.claude/CLAUDE.md`, `README.md` stale (pre-DB, pre-control-centre, says CI absent — `ci.yml` exists). This file supersedes them until `bootstrap full` reruns.
3. **Port 3002 collision**: booking-service vs control-centre.
4. **A1/A2/A3** (booking demo): idempotency key regenerated per render (`(booking-demo)/checkout/page.tsx:51`), key replay leaks order data, silent validation redirect. Parked with the demo.
5. **Duplicated adminSession/siteConfig** between web-next and booking-service (drifted copies). Security-boundary code: needs compare + realign + tests (see Auth & security), not a wait-for-third-consumer.
6. 27 dead `tw-ui` files in packages/ui; `fallbackPortfolioContent` (~300 lines) dead in docs.
7. Zero component/E2E tests outside packages/ui (~40 tests, mostly schema/pure-fn).
8. web-react: router unused, own duplicated `useTheme`.

## Roadmap

- **NOW**: merge `claude/qol-control-centre-9fsas9` → main (garden + SEO live); rotate Neon + admin secrets; Google Search Console verify + sitemap submit; vault → private GitHub repo; **executable shared-DB guard-rail** — make accidental `db:push` impossible in web-next + booking-service (e.g. rename the script to an explicit `db:push:danger` behind a confirmation wrapper) and encode the `db:generate → review SQL → db:migrate` flow in the scripts themselves, not just READMEs.
- **NEXT**: SEO perf (55KB v2 theme CSS `@source`, HeroUIProvider drop, client-section reduction — list in `_handover-qol-garden-seo.md`); activate Resend (F15); control-centre F2 live connectors; fix A4 slug validation (one-file); **adminSession convergence** — diff the web-next and booking-service implementations, realign behavior, add tests to both; only afterwards decide whether a shared module is justified.
- **LATER**: F3 garden → Postgres target; F4 vault MCP server; booking-demo fix-or-archive decision; UI stack consolidation (booking-service shadcn vs @laboratoire/ui); HeroUI v3 completion (6 wrappers + docs ThemeToggle).

## Session bootstrap & verify commands

```bash
git status && git log --oneline -5          # real state beats docs
pnpm check                                   # lint + typecheck + test (CI runs same)
pnpm -F @laboratoire/ui build                # before any prod build
pnpm dev / dev:next / dev:booking / dev:centre / dev:react / dev:lab
```

Operating modes for AI sessions (defined by Hassan): `STATUS`, `IDEA: …`, `BUILD: …`, `IMPROVE`, `HANDOFF`. IDEA = analysis only (no code); BUILD = end-to-end vertical slice + gates + update this file if the system changes.
