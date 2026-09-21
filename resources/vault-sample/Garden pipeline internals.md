---
publish: false
stage: seedling
tags: [meta, infra]
created: 2026-07-12
---

# Garden pipeline internals

Private scratchpad for the vault → site pipeline. This note must NEVER appear
on itshassan.it: `publish` is false, so vault-sync's allowlist skips it, and
any [[wikilink]] pointing here from a published note gets flattened to plain
text.

- Vault lives on the Windows machine; sync runs via `pnpm -F docs vault:sync`.
- Option B target: Postgres (Supabase for the Upwork gap, or reuse the Neon
  instance that already backs the contact form).
- TODO: decide Task Scheduler cadence for the nightly import.
