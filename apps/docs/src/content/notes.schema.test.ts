import { describe, expect, it } from "vitest";
import { notesPayloadSchema } from "./notes.schema";

const validNote = {
  slug: "til-postgres-websearch",
  title: "TIL: Postgres websearch_to_tsquery",
  summary: "Google-like search syntax straight from Postgres.",
  stage: "budding",
  tags: ["postgres", "search"],
  createdAt: "2026-07-01",
  updatedAt: "2026-07-10",
  body: "Postgres ships a parser for it.",
};

describe("notesPayloadSchema", () => {
  it("accepts a valid payload", () => {
    const result = notesPayloadSchema.safeParse({ notes: [validNote] });
    expect(result.success).toBe(true);
  });

  it("accepts an empty garden", () => {
    const result = notesPayloadSchema.safeParse({ notes: [] });
    expect(result.success).toBe(true);
  });

  it("rejects an unknown stage", () => {
    const result = notesPayloadSchema.safeParse({
      notes: [{ ...validNote, stage: "wilted" }],
    });
    expect(result.success).toBe(false);
  });

  it("rejects a non-kebab-case slug", () => {
    const result = notesPayloadSchema.safeParse({
      notes: [{ ...validNote, slug: "TIL Postgres!" }],
    });
    expect(result.success).toBe(false);
  });

  it("rejects duplicate slugs", () => {
    const result = notesPayloadSchema.safeParse({
      notes: [validNote, { ...validNote, title: "Other title" }],
    });
    expect(result.success).toBe(false);
  });

  it("rejects a non-ISO date", () => {
    const result = notesPayloadSchema.safeParse({
      notes: [{ ...validNote, updatedAt: "10/07/2026" }],
    });
    expect(result.success).toBe(false);
  });
});
