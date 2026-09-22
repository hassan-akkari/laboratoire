import { expect, test } from "@playwright/test";
import { PROJECT_NAMES, projectArgs, selectProjects, serversFor } from "../lib/cli";

const ALL = [...PROJECT_NAMES];

test.describe("--project selection (mirrors Playwright's CLI)", () => {
  test("no filter selects every project and both servers", () => {
    const selected = selectProjects(["e2e/docs/footer.spec.ts"]);
    expect([...selected].sort()).toEqual([...ALL].sort());
    expect(serversFor(selected)).toEqual({ docs: true, booking: true });
  });

  test("--project=booking selects booking only, docs server not needed", () => {
    const selected = selectProjects(["--project=booking"]);
    expect([...selected]).toEqual(["booking"]);
    expect(serversFor(selected)).toEqual({ docs: false, booking: true });
  });

  test("--project docs --project booking (repeated flag)", () => {
    const selected = selectProjects(["--project", "docs", "--project", "booking"]);
    expect([...selected].sort()).toEqual(["booking", "docs"]);
    expect(serversFor(selected)).toEqual({ docs: true, booking: true });
  });

  test("--project docs booking (one flag, several values)", () => {
    expect(projectArgs(["--project", "docs", "booking"])).toEqual(["docs", "booking"]);
    const selected = selectProjects(["--project", "docs", "booking"]);
    expect([...selected].sort()).toEqual(["booking", "docs"]);
  });

  test("--project=docs* expands the wildcard to docs and docs-mobile, booking server not needed", () => {
    const selected = selectProjects(["--project=docs*"]);
    expect([...selected].sort()).toEqual(["docs", "docs-mobile"]);
    expect(serversFor(selected)).toEqual({ docs: true, booking: false });
  });

  test("wildcards are case-insensitive and '?' matches one character", () => {
    expect([...selectProjects(["--project=DOCS"])]).toEqual(["docs"]);
    expect([...selectProjects(["--project=book?ng"])]).toEqual(["booking"]);
  });

  test("value collection stops at the next flag and at --", () => {
    expect(projectArgs(["--project", "docs", "--grep", "footer", "booking"])).toEqual(["docs"]);
    expect(projectArgs(["--project", "docs", "--", "booking"])).toEqual(["docs"]);
    expect(projectArgs(["--project=docs", "--reporter=list"])).toEqual(["docs"]);
  });

  test("tooling alone needs no server", () => {
    expect(serversFor(selectProjects(["--project=tooling"]))).toEqual({ docs: false, booking: false });
  });

  test("an unknown project fails with the available names listed (no server would start)", () => {
    expect(() => selectProjects(["--project=bookings"])).toThrow(
      /Project\(s\) "bookings" not found\. Available projects: docs, docs-mobile, booking, tooling\./,
    );
    expect(() => selectProjects(["--project", "docs", "nope*"])).toThrow(/"nope\*" not found/);
  });
});
