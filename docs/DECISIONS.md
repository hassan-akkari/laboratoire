# DECISIONS — laboratoire

> Append-only log of architecturally significant decisions. Newest last. Do not rewrite history; supersede with a new entry.
> Entries before 2026-07-20 are reconstructed from repo evidence during the full audit of that date.

---

## 2026-05 — docs migrates Vite SPA → Next.js 16 App Router
- **Context**: portfolio needed real SEO (SSG, metadata, hreflang); Vite SPA couldn't deliver.
- **Alternatives**: stay SPA + prerender; Astro.
- **Consequences**: SSG with 4 locale routes, `proxy.ts` locale redirect, Redux removed (content statically imported + zod-validated in `content/loader.ts`). Legacy `VITE_*` env mapped to `NEXT_PUBLIC_*` in `next.config.ts` to avoid a Vercel rename.
- **Involves**: `apps/docs`.

## 2026-05-08 — Hybrid admin: Cal.com owns booking infra, custom surface owns leads
- **Context**: needed availability/booking without building a scheduler (followup F12).
- **Decision**: Cal.com Free tier for scheduling; custom admin in `apps/web-next` for lead inbox + site config; webhook (HMAC) bridges the two.
- **Consequences**: `/api/cal/webhook` + `leads` table with `cal_booking_id` dedup; docs embeds Cal via `CalBookButton`.
- **Involves**: `apps/web-next`, `apps/docs`.

## 2026-06 — web-next becomes admin-primary; booking demo parked
- **Context**: the admin/lead product became real; the original booking MVP stayed a framework demo.
- **Decision**: apex `/` redirects to `/admin`; demo moved to `app/(booking-demo)/` route group; `admin.itshassan.it` host-rewrites to `/admin` in `proxy.ts`. In-memory orders + sentinel cookie stay MVP-ONLY, confined to the demo.
- **Consequences**: two auth systems in one app, deliberately separate (`admin_session` iron-session vs `web_next_session` sentinel). Known demo bugs (A1–A3 in `.claude/_followup.md`) parked with it.
- **Involves**: `apps/web-next`.

## 2026-06-08 — web-next deploys as separate Vercel project `admin`; two isolated Neon DBs
- **Context**: admin needed production hosting without touching the docs pipeline.
- **Decision**: git-connected Vercel project, Root Directory = `apps/web-next`; testing-db → Preview, prod-db → Production; OVH CNAME `admin` → Vercel.
- **Alternatives**: subroute of docs (rejected: separate concerns/deploys), CLI deploys (rejected: partial upload breaks monorepo lockfile).
- **Involves**: `apps/web-next`, Vercel, OVH, Neon. (Source: session memory, verified live 2026-06-08.)

## 2026-06 — booking-service shares the Neon DBs via `booking_` table prefix
- **Context**: "Bookable" MVP needed Postgres; a third Neon project was overhead.
- **Decision**: same two Neon DBs as web-next; every booking-service table prefixed `booking_`; migrations only (`db:migrate`), never `db:push` on the shared DB.
- **Consequences**: cheap, but the two apps are coupled at the database blast-radius level; documented in `booking-service/README.md`.
- **Involves**: `apps/booking-service`, `apps/web-next`, Neon.

## 2026-06 — booking-service uses vendored shadcn/ui, not @laboratoire/ui
- **Context**: portfolio case study wanted a different visual identity + runtime 3-theme switcher.
- **Consequences**: deliberate UI-stack fragmentation; do not "unify" without a product reason.
- **Involves**: `apps/booking-service`, `packages/ui`.

## 2026-06 — HeroUI v2→v3 incremental migration via scoped class
- **Decision**: v3 packages under npm aliases (`@heroui-v3/*`); wrappers self-apply `heroui-v3-warm` through `withV3Theme()` so v3 CSS vars never leak into v2 surfaces. Migrate wrapper-by-wrapper (16/22 done as of 2026-07-20).
- **Alternatives**: big-bang migration (rejected: v3 beta, breaking changes).
- **Involves**: `packages/ui`, all UI consumers.

## 2026-07-14 — Digital garden F1: static JSON in-repo, script as the only gate
- **Context**: publish Obsidian notes on the portfolio with strict privacy (public repo!).
- **Decision**: `vault-sync.ts` runs on the machine holding the vault; only `publish: true` notes enter `notes.json`; wikilinks to unpublished notes flatten to plain text; notes are English-only and canonicalize on `/en`.
- **Alternatives**: vault-as-private-repo + Action (later), direct-to-Postgres (that's F3).
- **Consequences**: publishing is manual (edit → sync → commit → push); zod contract (`notes.schema.ts`) shared script↔site; `control-centre` garden panel diffs vault vs notes.json.
- **Involves**: `apps/docs`, `apps/control-centre`, local vault.

## 2026-07-16 — control-centre is local-only, mock-first
- **Decision**: personal dashboard ships with mock connectors (scout, inbox, calendar) but real engines (tested pure logic) and real vault/git integrations; JSON-file persistence, no DB, no deploy target.
- **Consequences**: F2 = swap mocks for live connectors without touching engines. Port 3002 collides with booking-service (unresolved).
- **Involves**: `apps/control-centre`.

## 2026-07-20 — Persistent architectural memory: PROJECT_BRAIN + DECISIONS + AGENTS
- **Context**: full audit found heavy doc drift (CLAUDE.md/README/AGENTS.md described the pre-DB, pre-control-centre repo); new ideas were expensive to place.
- **Decision**: `docs/PROJECT_BRAIN.md` = current snapshot (read first, kept short); `docs/DECISIONS.md` = append-only why-log; `AGENTS.md` = how-to-work rules pointing at both. Session modes STATUS / IDEA / BUILD / IMPROVE / HANDOFF adopted.
- **Consequences**: PROJECT_BRAIN supersedes stale sections of `.claude/CLAUDE.md` and `README.md` until a `bootstrap full` pass rewrites them.
- **Involves**: repo docs.
