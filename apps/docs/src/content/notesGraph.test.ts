import { describe, expect, it } from "vitest";

import {
  computeBacklinks,
  computeRelated,
  computeTagCounts,
} from "./notesGraph";
import type { Note } from "./notes.schema";

function makeNote(overrides: Partial<Note> & Pick<Note, "slug">): Note {
  return {
    title: overrides.slug,
    summary: "s",
    stage: "seedling",
    tags: [],
    createdAt: "2026-07-01",
    updatedAt: "2026-07-01",
    body: "body",
    ...overrides,
  };
}

const neon = makeNote({
  slug: "neon",
  tags: ["postgres", "drizzle"],
  body: "See [never throw](note:module-load) for the sequel.",
});
const moduleLoad = makeNote({
  slug: "module-load",
  tags: ["nextjs", "patterns"],
  updatedAt: "2026-07-10",
  body: "Came from [the neon story](note:neon).",
});
const proxy = makeNote({
  slug: "proxy",
  tags: ["nextjs"],
  updatedAt: "2026-07-05",
  body: "No links here.",
});
const vault = makeNote({
  slug: "vault",
  tags: ["meta"],
  body: "Mentions [neon](note:neon) too.",
});

const NOTES = [neon, moduleLoad, proxy, vault];

describe("computeBacklinks", () => {
  it("finds every note linking to the slug", () => {
    expect(computeBacklinks(NOTES, "neon").map((n) => n.slug)).toEqual([
      "module-load",
      "vault",
    ]);
  });

  it("never returns the note itself and ignores plain-text mentions", () => {
    // "neon" appears as prose in its own body via the marker of module-load only.
    expect(computeBacklinks(NOTES, "module-load").map((n) => n.slug)).toEqual([
      "neon",
    ]);
    expect(computeBacklinks(NOTES, "proxy")).toEqual([]);
  });
});

describe("computeRelated", () => {
  it("ranks by shared tags and excludes self", () => {
    expect(computeRelated(NOTES, moduleLoad).map((n) => n.slug)).toEqual([
      "proxy",
    ]);
  });

  it("excludes notes already present as backlinks", () => {
    // vault links to neon, so even with a shared tag it must not repeat.
    const tagged = NOTES.map((n) =>
      n.slug === "vault" ? { ...n, tags: ["postgres"] } : n,
    );
    const related = computeRelated(tagged, neon).map((n) => n.slug);
    expect(related).not.toContain("vault");
    expect(related).not.toContain("module-load"); // backlink too
  });

  it("respects the limit", () => {
    const many = [
      neon,
      ...["a", "b", "c", "d"].map((slug) =>
        makeNote({ slug, tags: ["postgres"] }),
      ),
    ];
    expect(computeRelated(many, neon, 3)).toHaveLength(3);
  });
});

describe("computeTagCounts", () => {
  it("counts usage, most-used first, alphabetical tiebreak", () => {
    expect(computeTagCounts(NOTES)).toEqual([
      { tag: "nextjs", count: 2 },
      { tag: "drizzle", count: 1 },
      { tag: "meta", count: 1 },
      { tag: "patterns", count: 1 },
      { tag: "postgres", count: 1 },
    ]);
  });
});
