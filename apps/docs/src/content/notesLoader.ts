import "server-only";

import notesJson from "./data/notes.json";
import {
  computeBacklinks,
  computeRelated,
  computeTagCounts,
} from "./notesGraph";
import { notesPayloadSchema, type Note } from "./notes.schema";

/**
 * Twin of loader.ts, for the digital garden: data/notes.json (written by
 * scripts/vault-sync.ts from the Obsidian vault) is statically imported and
 * zod-validated when the /notes pages prerender. A malformed payload THROWS
 * and fails `next build` — the same loud build-time gate the portfolio
 * content uses, instead of silently rendering a broken garden.
 *
 * Notes are single-language (English) by decision: /{locale}/notes serves the
 * same content under every locale, only the surrounding UI is translated.
 */

let cache: Note[] | null = null;

export function getNotes(): Note[] {
  if (cache) return cache;

  const parsed = notesPayloadSchema.safeParse(notesJson);
  if (!parsed.success) {
    throw new Error(
      "[docs] data/notes.json failed schema validation (re-run `pnpm -F docs vault:sync`):\n" +
        JSON.stringify(parsed.error.issues, null, 2),
    );
  }

  // Freshly tended first; slug tiebreak keeps the order deterministic.
  cache = [...parsed.data.notes].sort(
    (a, b) =>
      b.updatedAt.localeCompare(a.updatedAt) || a.slug.localeCompare(b.slug),
  );
  return cache;
}

export function getNote(slug: string): Note | undefined {
  return getNotes().find((note) => note.slug === slug);
}

/** Notes that wikilink to this slug — the garden's reverse edges. */
export function getBacklinks(slug: string): Note[] {
  return computeBacklinks(getNotes(), slug);
}

/** Shared-tag neighbours (backlinks excluded — the sections render together). */
export function getRelatedNotes(note: Note, limit = 3): Note[] {
  return computeRelated(getNotes(), note, limit);
}

/** Distinct tags with usage counts for the index filter bar. */
export function getTagCounts(): { tag: string; count: number }[] {
  return computeTagCounts(getNotes());
}
