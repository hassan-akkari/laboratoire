import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { renderThemeCss } from "../src/theme/tokens";

/**
 * Variant C regression net: the generated `src/theme/tokens.css` (imported by
 * Storybook's `preview.css` so `var(--app-*)` resolves in stories) is DERIVED
 * from the typed single source via `renderThemeCss()`. This test asserts the
 * committed CSS still contains the exact block `renderThemeCss()` produces, so
 * editing a token value in `tokens.ts` without regenerating `tokens.css` fails
 * CI rather than silently drifting Storybook from the apps.
 */

const here = path.dirname(fileURLToPath(import.meta.url));
const tokensCss = path.resolve(here, "../src/theme/tokens.css");

describe("tokens.css stays in lockstep with renderThemeCss()", () => {
  it("contains the exact derived :root/.light/.dark block", () => {
    const css = readFileSync(tokensCss, "utf8");
    // Normalize CRLF so the check is OS-independent (Windows checkout safe).
    const normalized = css.replace(/\r\n/g, "\n");
    expect(normalized).toContain(renderThemeCss());
  });
});
