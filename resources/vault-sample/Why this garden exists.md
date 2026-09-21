---
publish: true
stage: seedling
tags: [meta, writing]
created: 2026-07-13
summary: Working notes, published while they grow. What this section is and why it exists.
---

# Why this garden exists

This is not a blog. A blog implies finished essays, an editorial calendar, and the quiet guilt of not maintaining either. This is a **digital garden**: working notes from my [Obsidian](https://obsidian.md) vault that happen to have `publish: true` in their frontmatter.

Every note carries a growth stage:

- 🌱 **seedling** — a fresh capture, possibly wrong;
- 🌿 **budding** — revisited at least once, starting to hold shape;
- 🌲 **evergreen** — stable enough that I'd point a colleague at it.

The mechanism is deliberately boring: a Node script reads the vault, keeps only the notes explicitly marked for publishing, resolves the `[[wikilinks]]` between them, and writes a single JSON file that this site validates with [zod](https://zod.dev) at build time. If a note is malformed, the build fails — loudly, before anything ships.

Full-text search will arrive when the garden grows roots in Postgres — see [[TIL: Postgres websearch_to_tsquery]] for where that's headed.
