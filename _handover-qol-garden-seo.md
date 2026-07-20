# Handover — QoL garden + SEO (2026-07-19/20)

> For the next session on ANY machine. Read this + `docs/qol/control-centre-roadmap.md` first.
> Branch: `claude/qol-control-centre-9fsas9` — **pushed to origin**, NOT merged to main yet.

## New-PC bootstrap

```bash
git clone https://github.com/hassan-akkari/laboratoire.git && cd laboratoire
git checkout claude/qol-control-centre-9fsas9
corepack enable && corepack prepare pnpm@10.0.0 --activate
pnpm -w install --frozen-lockfile
pnpm -F @laboratoire/ui build     # required before prod builds
pnpm dev                          # docs on :3000
```

Machine-specific bits that do NOT travel with the repo:
- **Obsidian vault** (`C:\Users\Hassan\Documents\Obsidian\my control center`) is a LOCAL git repo with **no remote**. On another PC it does not exist → `pnpm -F docs vault:sync` cannot run and `apps/control-centre` /garden falls back to `resources/vault-sample`. Fix forever: `gh repo create hassan-vault --private --source . --push` from the vault dir (Hassan's step 5 in `_qol-final-steps.html`), then clone it on the new PC.
- `apps/control-centre/.env.local` (gitignored): `VAULT_DIR=<vault path on that machine>`.
- The committed `apps/docs/src/content/data/notes.json` IS the garden content — the site builds fine without the vault; you only need the vault to publish NEW notes.
- Global `~/.claude/CLAUDE.md` on the old PC points sessions at the vault; replicate on the new PC if the vault gets cloned.

## State (end of this session)

| Thing | State |
| --- | --- |
| Branch | 9 commits ahead of main, pushed. Key: `cb728d0` real notes, `0ec47cc` garden mechanics, `eefc89d` doc drift, `c1d067a` SEO hardening |
| Garden | 8 real notes live on branch: nav link, home teaser, backlinks, related, filter chips, RSS `/feed.xml`, per-note OG+twitter cards |
| SEO | Audit done (19-agent workflow, 6 dimensions). Critical/high implemented except perf + visible-copy items (below). Titles keyword-first; note pages canonicalize onto /en; PDFs noindexed; FAQPage+BlogPosting+Breadcrumb JSON-LD; manifest; GSC env slot |
| control-centre | Local dashboard on :3002 (`pnpm dev:centre`); garden module reads real vault when `VAULT_DIR` set |
| Gates | `pnpm check` + docs build green at every commit; prod smoke-tested twice |

## Hassan's manual steps (see `_qol-final-steps.html`, committed on the branch)

1. ~~push branch~~ DONE this session.
2. PR + merge to main → Vercel auto-deploys itshassan.it.
3. Verify live: nav Notes, home teaser, /en/notes filters, note detail backlinks, /feed.xml, OG card on share.
4. **Rotate Neon password** (leaked in a June transcript — STILL OPEN): Neon console → Roles → reset → update Vercel `bookable` env `DATABASE_URL` → redeploy. Also rotate `ADMIN_SESSION_SECRET` (also leaked).
5. **Google Search Console**: verify `itshassan.it` (DNS TXT on OVH is cleanest, or set `GOOGLE_SITE_VERIFICATION` in Vercel env — the layout renders the meta tag automatically) → submit `https://itshassan.it/sitemap.xml` → request indexing of home + /en/notes. This is THE lever for "uscire subito" on the brand query.
6. Vault → private GitHub repo (unblocks cross-PC garden publishing).

## SEO TODO — next session (from the audit, not yet implemented)

Priority order:

1. **perf-1 (HIGH, M)** `apps/docs/src/index.css:76-78` — Tailwind `@source` scans ALL of `@heroui/theme/dist` → ~55KB gzip render-blocking CSS. Narrow to the components actually used (navbar shell, switch). Measure before/after.
2. **perf-3 (HIGH, M)** `apps/docs/src/app/providers.tsx` — HeroUI v2 `HeroUIProvider` wraps everything; ThemeToggle still imports v2 Switch. Migrate ThemeToggle to v3/plain button, drop the provider. Ties into the HeroUI v3 migration effort (see memory/branch `feat`).
3. **perf-2 (HIGH, L)** all 11 home sections are `"use client"` → ~328KB gzip first-load JS on a static landing. Convert to server components with small client leaves. Big; do after 1+2.
4. **content-2 (HIGH, S — needs Hassan's copy approval)** hero H1/badge lacks "sviluppatore/Roma" in every locale — inject role+city into badge or subtitle (`data/heroContent.ts`), don't wreck the voice.
5. **content-3 (HIGH, S)** /cv meta description is widget-copy ("print-ready layout…"); `labels.cv.subtitle` is ALSO the visible page subtitle — add a separate SEO string per locale instead of editing it.
6. **sd-4/sd-5 (MED)** `seo/JsonLd.tsx`: add WebSite node (`name` drives the SERP site-name for brand query) + stable `@id`s (`#person`, `#service`, locale-invariant `url: SITE_URL`) so Google reconciles 1 entity, not 4.
7. **tech-3 (MED)** layout metadata has no default `title`/`description` template → 404s render untitled. Add `title: { default, template }`.
8. **tech-6 (LOW)** emit `de-CH` hreflang alongside `de` (Swiss targeting, og:locale is already de_CH).
9. **tech-7 (LOW)** stale "(it | en | fr)" comments in proxy.ts:9, pageMetadata.ts:21, not-found.tsx:5 — say "every locale in LOCALES".
10. Ideas parked: llms.txt; Bookable → portfolio backlink (footer "built by" on bookable.itshassan.it); BreadcrumbList on audit/cv/privacy.

Full audit output: workflow journal (old PC) + the passthrough list is reproduced in `_orchestrator-runs/` context; findings above are self-contained enough to act on.

## Gotchas learned (also in the garden notes themselves)

- pnpm 10 forwards the literal `--` to scripts → vault-sync's parseArgs skips it (`vault-sync.ts:63`).
- Fresh checkout: run `pnpm -w install` before `vault:sync` (gray-matter lives in root hoisted node_modules).
- `alternates` in Next metadata REPLACES across layout/page — RSS autodiscovery lives inside `buildPageMetadata`, not the layout.
- Note pages: `canonicalLocale: "en"` collapses the 4 locale URLs; sitemap lists only /en notes. Do NOT re-add per-locale note entries.
- i18n invariant: messages.ts + nav labels change in ALL 4 locales together; DE is Swiss (ss, Sie, no ß).
- Vault contract: only `publish: true` notes ship; publishing flow = edit vault → `pnpm -F docs vault:sync -- --vault "<path>"` → commit notes.json → push.

## Roadmap position

F1 (garden) — DONE pending Hassan's merge. Next phases: F2 job-tracker live connectors (control-centre), F3 Supabase sync target, F4 vault MCP server. `docs/qol/control-centre-roadmap.md` is the operating doc.
