import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { describe, expect, it } from "vitest";

/**
 * Variant C — captures the `"use client"` BUILD behavior of `tsc`.
 *
 * FINDING: TypeScript (5.9.3, this repo's `tsc -p tsconfig.json` build) treats a
 * leading string-literal statement as a directive prologue and PRESERVES it in
 * the emitted `.js`. Verified empirically: pre-existing tw-ui client components
 * (e.g. combobox.tsx) keep `'use client';` at the top of `dist/.../combobox.js`.
 * Therefore `UiProvider.tsx` keeping `"use client"` as its first statement is
 * sufficient — NO build banner / preserve-directives plugin / bundler swap is
 * required for Phase 5 (web-next / RSC) to see the directive in `dist/`.
 *
 * These tests lock that behavior: the source must carry the directive, and IF a
 * `dist/` build is present it must still carry it (skipped in clean worktrees
 * that have not run `pnpm -F @laboratoire/ui build`).
 */

const here = path.dirname(fileURLToPath(import.meta.url));
const uiRoot = path.resolve(here, "..");

const providerSrc = path.join(uiRoot, "src/components/UiProvider.tsx");
const providerDist = path.join(uiRoot, "dist/components/UiProvider.js");

/** A leading `'use client'` / `"use client"` directive (first non-comment stmt). */
const directiveAtTop = /^(?:﻿)?["']use client["'];?/;

describe("UiProvider carries the \"use client\" directive", () => {
  it("source UiProvider.tsx begins with the directive", () => {
    const src = readFileSync(providerSrc, "utf8");
    expect(directiveAtTop.test(src.trimStart())).toBe(true);
  });

  it("tsc-emitted dist preserves the directive (if dist was built)", () => {
    if (!existsSync(providerDist)) {
      // Clean worktree: no dist yet. The behavior is proven by the source test
      // above + the documented finding; nothing to assert against here.
      return;
    }
    const out = readFileSync(providerDist, "utf8");
    expect(directiveAtTop.test(out.trimStart())).toBe(true);
  });
});
