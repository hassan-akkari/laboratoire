import type { Note } from "./notes.schema";

/**
 * Pure graph helpers over the notes payload — deliberately free of the
 * `server-only` import (and of getNotes()) so they stay unit-testable in
 * plain vitest. notesLoader.ts wraps them with the cached payload.
 *
 * Backlinks ride on the vault-sync wikilink compilation: cross-note links
 * arrive in the body as `](note:<slug>)`, so "who links here" is a plain
 * string scan — no extra field in notes.json, no schema change.
 */

const linkMarker = (slug: string) => `](note:${slug})`;

/** Notes whose body wikilinks to `slug` (the reverse of the link). */
export function computeBacklinks(notes: Note[], slug: string): Note[] {
  const marker = linkMarker(slug);
  return notes.filter((note) => note.slug !== slug && note.body.includes(marker));
}

/**
 * Shared-tag neighbours, excluding the note itself and anything already in
 * its backlinks (the two sections render together — no duplicates). Most
 * shared tags first; fresher `updatedAt` breaks ties, slug keeps it stable.
 */
export function computeRelated(notes: Note[], note: Note, limit = 3): Note[] {
  const exclude = new Set(
    computeBacklinks(notes, note.slug).map((n) => n.slug),
  );
  exclude.add(note.slug);
  const tags = new Set(note.tags);

  return notes
    .filter((candidate) => !exclude.has(candidate.slug))
    .map((candidate) => ({
      candidate,
      shared: candidate.tags.filter((tag) => tags.has(tag)).length,
    }))
    .filter(({ shared }) => shared > 0)
    .sort(
      (a, b) =>
        b.shared - a.shared ||
        b.candidate.updatedAt.localeCompare(a.candidate.updatedAt) ||
        a.candidate.slug.localeCompare(b.candidate.slug),
    )
    .slice(0, limit)
    .map(({ candidate }) => candidate);
}

/** Distinct tags with usage counts, most used first (alphabetical tiebreak). */
export function computeTagCounts(
  notes: Note[],
): { tag: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const note of notes) {
    for (const tag of note.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}
