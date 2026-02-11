import { describe, expect, it } from "vitest";
import { resolveThemeMode } from "../src/hooks/themeUtils";

describe("resolveThemeMode", () => {
  it("returns a stored valid theme", () => {
    expect(resolveThemeMode("light", "dark")).toBe("light");
    expect(resolveThemeMode("dark", "light")).toBe("dark");
  });

  it("falls back when stored value is invalid or missing", () => {
    expect(resolveThemeMode(null, "dark")).toBe("dark");
    expect(resolveThemeMode("sepia", "light")).toBe("light");
  });
});
