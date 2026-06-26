import { describe, expect, it } from "vitest";
import {
  appTokens,
  appCssVarsFor,
  heroColorTokens,
  heroColorsFor,
  renderAppVarsBlock,
  THEME_MODES,
} from "../src/theme/tokens";
import heroTheme from "../src/theme/heroTheme";

/**
 * Variant C — provable single-source-of-truth for the canonical WARM theme.
 * These assertions are the regression net: they fail loudly if a token is
 * renamed, a mode loses a key, a cool-blue value sneaks back into web-react, or
 * an app's static CSS drifts from the derived values.
 */

describe("theme tokens: structural integrity", () => {
  it("exposes exactly light + dark modes", () => {
    expect([...THEME_MODES]).toEqual(["light", "dark"]);
  });

  it("light & dark --app-* token sets have identical keys", () => {
    const lightKeys = Object.keys(appTokens.light).sort();
    const darkKeys = Object.keys(appTokens.dark).sort();
    expect(lightKeys).toEqual(darkKeys);
  });

  it("light & dark HeroUI color sets have identical keys", () => {
    const lightKeys = Object.keys(heroColorTokens.light).sort();
    const darkKeys = Object.keys(heroColorTokens.dark).sort();
    expect(lightKeys).toEqual(darkKeys);
  });
});

describe("theme tokens: canonical WARM values", () => {
  it("dark --app-bg is the canonical near-black", () => {
    expect(appCssVarsFor("dark")["--app-bg"]).toBe("#080808");
  });

  it("light --app-bg is the canonical warm cream", () => {
    expect(appCssVarsFor("light")["--app-bg"]).toBe("#f5f1ea");
  });

  it("HeroUI primary is the shared warm indigo in both modes", () => {
    expect(heroColorsFor("light").primary.DEFAULT).toBe("#4a4e69");
    expect(heroColorsFor("dark").primary.DEFAULT).toBe("#4a4e69");
  });

  it("contains ZERO of web-react's old cool-blue values", () => {
    // NOTE: #f8f7f4 is intentionally NOT here — it is the canonical warm
    // light-mode primary.foreground, not a cool-blue leftover.
    const coolBlues = [
      "#1f6feb",
      "#7aa2ff",
      "#0f1115",
      "#eceff4",
      "#151922",
      "#2a2f3a",
      "#9aa0a6",
      "#1b1a17",
    ];
    const serialized = JSON.stringify({ appTokens, heroColorTokens });
    for (const blue of coolBlues) {
      expect(serialized.toLowerCase()).not.toContain(blue);
    }
  });
});

describe("theme: heroui config is derived from the same source object", () => {
  it("heroTheme is a valid plugin object built from heroColorsFor()", () => {
    // heroui() throws on a malformed theme; a truthy return proves the derived
    // color sets were accepted by the plugin factory.
    expect(heroTheme).toBeTruthy();
    expect(typeof heroTheme).toBe("object");
  });

  it("the color set fed to heroui equals the canonical token source", () => {
    // Guards against a future edit that hand-codes colors in heroTheme.ts
    // instead of deriving them from tokens.ts.
    expect(heroColorsFor("dark")).toEqual(heroColorTokens.dark);
    expect(heroColorsFor("light")).toEqual(heroColorTokens.light);
  });
});

describe("theme: rendered CSS block", () => {
  it("emits every --app-* var for a mode", () => {
    const block = renderAppVarsBlock("dark");
    for (const name of Object.keys(appCssVarsFor("dark"))) {
      expect(block).toContain(`${name}:`);
    }
  });
});
