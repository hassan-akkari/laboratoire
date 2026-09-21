import { describe, expect, it } from "vitest";
import { groupByArea, inferArea, parseGitLog } from "./git";

const US = "\u001f";

describe("inferArea", () => {
  it("extracts the conventional scope", () => {
    expect(inferArea("feat(docs): digital garden")).toBe("docs");
    expect(inferArea("fix(web-next): quote rounding")).toBe("web-next");
  });

  it("falls back to the bare type", () => {
    expect(inferArea("chore: bump deps")).toBe("chore");
  });

  it("uses 'repo' for free-form subjects", () => {
    expect(inferArea("updated the cv ita and the jsons")).toBe("repo");
  });
});

describe("parseGitLog", () => {
  it("parses hash, date and subject", () => {
    const raw = [
      `1b47e98${US}2026-07-14${US}feat(docs): digital garden`,
      `d2fdfe3${US}2026-07-12${US}feat(docs): add /favicon.ico root fallback`,
      "",
    ].join("\n");
    const entries = parseGitLog(raw);
    expect(entries).toHaveLength(2);
    expect(entries[0]).toEqual({
      hash: "1b47e98",
      date: "2026-07-14",
      area: "docs",
      subject: "feat(docs): digital garden",
    });
  });

  it("keeps separators that appear inside the subject", () => {
    const raw = `abc1234${US}2026-07-10${US}weird${US}subject`;
    expect(parseGitLog(raw)[0].subject).toBe(`weird${US}subject`);
  });

  it("skips malformed lines", () => {
    expect(parseGitLog("garbage line\n\n")).toEqual([]);
  });
});

describe("groupByArea", () => {
  it("groups and sorts by activity", () => {
    const entries = parseGitLog(
      [
        `a${US}2026-07-14${US}feat(docs): one`,
        `b${US}2026-07-13${US}feat(docs): two`,
        `c${US}2026-07-12${US}chore: deps`,
      ].join("\n"),
    );
    const groups = groupByArea(entries);
    expect([...groups.keys()]).toEqual(["docs", "chore"]);
    expect(groups.get("docs")).toHaveLength(2);
  });
});
