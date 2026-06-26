import { readdirSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { describe, expect, it } from "vitest";

/**
 * Variant C invariant: EVERY HeroUI wrapper file must begin with the
 * `"use client"` directive. This is what makes `@laboratoire/ui` safe to consume
 * from a React Server Components graph (web-next, Phase 5) — without it, a Server
 * Component importing one of these wrappers would fail at build time. Vite
 * consumers (docs, web-react) simply ignore the directive, so it is harmless
 * everywhere else.
 *
 * The test enumerates the wrapper directory so any NEW `App*.tsx` added during
 * the later inventory fan-out is automatically held to the same rule — there is
 * nothing to remember to update.
 */

const here = path.dirname(fileURLToPath(import.meta.url));
const heroDir = path.resolve(here, "../src/components/heroui");

/** Leading `'use client'` / `"use client"` directive (first non-comment stmt). */
const directiveAtTop = /^(?:﻿)?["']use client["'];?/;

const wrapperFiles = readdirSync(heroDir).filter(
  (f) => f.endsWith(".tsx") && !f.endsWith(".stories.tsx"),
);

describe("every HeroUI wrapper carries the \"use client\" directive", () => {
  it("found wrapper files to check", () => {
    // Guard: if globbing breaks, do not silently pass with zero assertions.
    expect(wrapperFiles.length).toBeGreaterThan(0);
  });

  it.each(wrapperFiles)("%s begins with \"use client\"", (file) => {
    const src = readFileSync(path.join(heroDir, file), "utf8");
    expect(directiveAtTop.test(src.trimStart())).toBe(true);
  });
});
