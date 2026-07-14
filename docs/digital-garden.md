# Digital garden — vault → site pipeline

> Decision record + operating manual for the `/notes` section of itshassan.it.
> Status: **Phase F1 (static)** shipped. Written 2026-07-14.

## What this is

Notes from the private Obsidian vault, published on the portfolio as a digital
garden. One pipeline: the vault is the source of truth, a sync script is the
only gate, the site renders whatever passed the gate.

```
Obsidian vault ──(vault-sync, publish: true only)──> notes.json ──(git push)──> Vercel build ──> /{locale}/notes
```

## Decisions taken (F1)

| Decision | Choice | Why | Revisit when |
| --- | --- | --- | --- |
| Sync mechanism | Script inside this monorepo (`apps/docs/scripts/vault-sync.ts`), run on the machine that has the vault | Zero new infrastructure; the zod contract is shared between script and site (`notes.schema.ts` validates on both ends) | The vault becomes a git repo of its own (then a cross-repo Action can run the same script) |
| Note language | English only; `/{locale}/notes` serves the same content, UI chrome is translated (`languageNote` tells non-EN visitors) | Audience is international recruiters/devs; per-locale notes would kill the publishing habit | Never, realistically |
| Content home | Static JSON committed in-repo (option A) | See the mechanism working before adding a database | Phase F3: same script, destination becomes Postgres (Supabase for the Upwork skill gap — or the Neon instance that already backs the contact form) |
| Wikilinks | Published target → `[label](note:<slug>)`, bound to the reader's locale at render; unpublished target → flattened to plain text | Private note titles must never ship as dead links | — |
| Privacy model | Strict allowlist: only `publish: true` (boolean) enters the payload | A public repo means committed JSON is as public as the site; default must be private | — |

## Frontmatter contract

```yaml
---
publish: true            # required — anything else stays private
title: "Optional"        # default: first '# ' heading, then filename
slug: optional-kebab     # default: slugified title
stage: seedling          # seedling | budding | evergreen (default seedling)
tags: [react, til]      # default []
created: 2026-07-13     # required, YYYY-MM-DD
updated: 2026-07-14     # default = created
summary: "Optional"      # default: first body paragraph, ≤ 300 chars
---
```

## Operating manual

```bash
# Publish: mark notes publish: true in the vault, then
pnpm -F docs vault:sync -- --vault "C:\path\to\vault"   # or VAULT_DIR env
git add apps/docs/src/content/data/notes.json && git commit && git push
# Vercel deploys; notes appear at /{locale}/notes

# Dry run / sanity check
pnpm -F docs vault:sync -- --vault "..." --dry-run
```

The script is idempotent (deterministic output, skips the write when nothing
changed) and fails loudly listing every offending file — it never writes a
payload the site's build would then reject.

A sample vault for testing lives in `resources/vault-sample/` (3 published
notes + 1 private proving the allowlist); the current `notes.json` was
generated from it.

## Roadmap pointers (from the July 2026 control-centre plan)

- **F3 — Postgres**: same sync script, `upsert` instead of file write;
  unlocks `websearch_to_tsquery` full-text search, read counters, backlink
  graph as a query.
- **F4 — MCP server on the vault**: the same source exposed to AI tools.
- Nightly import + git-diary, weekly digest, etc. live in the broader QoL
  plan, not in this doc.
