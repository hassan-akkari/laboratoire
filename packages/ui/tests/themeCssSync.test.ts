import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { appCssVarsFor } from "../src/theme/tokens";

/**
 * Variant C regression net: the apps inline their `--app-*` declarations
 * statically (Tailwind v4 needs them at CSS-parse time), so they can drift from
 * the typed single source in `tokens.ts`. These tests assert byte-equivalence
 * of the derived values against the values actually present in each app's
 * `index.css`, in BOTH light and dark mode.
 */

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, "../../..");

const appCss = {
  docs: path.join(repoRoot, "apps/docs/src/index.css"),
  webReact: path.join(repoRoot, "apps/web-react/src/index.css"),
};

function read(file: string): string {
  return readFileSync(file, "utf8");
}

/** Returns true if `css` contains a declaration `name: value;` (whitespace-tolerant). */
function hasDecl(css: string, name: string, value: string): boolean {
  const escaped = `${name}\\s*:\\s*${value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*;`;
  return new RegExp(escaped).test(css);
}

describe.each(Object.entries(appCss))(
  "%s index.css mirrors the derived warm tokens",
  (_app, file) => {
    it("file exists", () => {
      expect(existsSync(file)).toBe(true);
    });

    it("declares every dark --app-* value from the single source", () => {
      const css = read(file);
      for (const [name, value] of Object.entries(appCssVarsFor("dark"))) {
        expect(hasDecl(css, name, value), `${name}: ${value}`).toBe(true);
      }
    });

    it("declares every light --app-* value from the single source", () => {
      const css = read(file);
      for (const [name, value] of Object.entries(appCssVarsFor("light"))) {
        expect(hasDecl(css, name, value), `${name}: ${value}`).toBe(true);
      }
    });

    it("loads the shared heroTheme plugin (no local hero.ts)", () => {
      const css = read(file);
      expect(css).toContain("packages/ui/src/theme/heroTheme.ts");
      expect(css).not.toContain('@plugin "./hero.ts"');
    });
  }
);

describe("local per-app hero.ts files are deleted", () => {
  it("apps/docs/src/hero.ts no longer exists", () => {
    expect(existsSync(path.join(repoRoot, "apps/docs/src/hero.ts"))).toBe(false);
  });

  it("apps/web-react/src/hero.ts no longer exists", () => {
    expect(existsSync(path.join(repoRoot, "apps/web-react/src/hero.ts"))).toBe(
      false
    );
  });
});
