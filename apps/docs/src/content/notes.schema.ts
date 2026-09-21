import { z } from "zod";

/**
 * The vault → site contract, in ONE place. Both ends validate against it:
 * scripts/vault-sync.ts before writing data/notes.json (sync fails instead of
 * committing a malformed payload), and notesLoader.ts when the /notes pages
 * prerender (a hand-edited payload fails `next build`, same policy as
 * portfolio content). Do NOT add `server-only` here — the sync script runs in
 * plain Node, outside Next.
 */

export const NOTE_STAGES = ["seedling", "budding", "evergreen"] as const;
export type NoteStage = (typeof NOTE_STAGES)[number];

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const noteSchema = z.object({
  slug: z.string().regex(SLUG, "slug must be kebab-case"),
  title: z.string().min(1),
  /** Plain-text excerpt shown on the index and used as meta description. */
  summary: z.string().min(1).max(300),
  stage: z.enum(NOTE_STAGES),
  tags: z.array(z.string().min(1)).max(8),
  createdAt: z.string().regex(ISO_DATE, "createdAt must be YYYY-MM-DD"),
  updatedAt: z.string().regex(ISO_DATE, "updatedAt must be YYYY-MM-DD"),
  /**
   * Markdown body. Vault [[wikilinks]] arrive already resolved: published
   * targets become `[label](note:<slug>)` (the renderer swaps `note:` for the
   * locale-prefixed /notes path), unpublished targets are flattened to plain
   * text so private note titles never leak as dead links.
   */
  body: z.string().min(1),
});

export const notesPayloadSchema = z
  .object({
    notes: z.array(noteSchema),
  })
  .superRefine((payload, ctx) => {
    const seen = new Set<string>();
    for (const note of payload.notes) {
      if (seen.has(note.slug)) {
        ctx.addIssue({
          code: "custom",
          path: ["notes"],
          message: `duplicate note slug: "${note.slug}"`,
        });
      }
      seen.add(note.slug);
    }
  });

export type Note = z.infer<typeof noteSchema>;
export type NotesPayload = z.infer<typeof notesPayloadSchema>;
