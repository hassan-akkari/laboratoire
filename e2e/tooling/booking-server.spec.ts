import { spawn } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import http from "node:http";
import type { AddressInfo } from "node:net";
import os from "node:os";
import path from "node:path";
import { expect, test } from "@playwright/test";
import { bookingServer, docsServer } from "../lib/servers";

const ROOT = path.resolve(__dirname, "..", "..");
const PLAYWRIGHT_CLI = path.join(ROOT, "node_modules", "@playwright", "test", "cli.js");

/**
 * Nested Playwright runs get their own output dir so they never wipe the
 * outer run's test-results/. Asynchronous on purpose: the decoy HTTP server
 * lives in this process, so a blocking `spawnSync` would stop it from
 * answering Playwright's readiness probe and the port would look free.
 */
function nestedRun(
  args: string[],
  extraEnv: Record<string, string> = {},
  timeoutMs = 90_000,
): Promise<{ status: number | null; output: string }> {
  const out = mkdtempSync(path.join(os.tmpdir(), "e2e-nested-"));
  return new Promise((resolve) => {
    const child = spawn(process.execPath, [PLAYWRIGHT_CLI, "test", ...args, `--output=${out}`], {
      cwd: ROOT,
      env: {
        ...process.env,
        CI: "",
        PLAYWRIGHT_HTML_OPEN: "never",
        PLAYWRIGHT_HTML_OUTPUT_DIR: path.join(out, "html"),
        ...extraEnv,
      },
      stdio: ["ignore", "pipe", "pipe"],
    });
    let output = "";
    child.stdout.on("data", (c) => (output += c));
    child.stderr.on("data", (c) => (output += c));
    const timer = setTimeout(() => child.kill(), timeoutMs);
    child.on("close", (status) => {
      clearTimeout(timer);
      rmSync(out, { recursive: true, force: true });
      resolve({ status, output });
    });
  });
}

test.describe("booking server isolation", () => {
  test("the spawned server always gets DATABASE_URL='' and is never reused", () => {
    const server = bookingServer(3902);
    expect(server.env).toEqual({ DATABASE_URL: "" });
    expect(server.reuseExistingServer).toBe(false);
    expect(server.command).toContain("--port 3902");
    expect(server.url).toBe("http://localhost:3902");
    // The portfolio server follows the same rule.
    expect(docsServer(3900).reuseExistingServer).toBe(false);
  });

  test("a busy booking port fails the run before any spec, without touching the foreign process", async () => {
    // A throwaway local HTTP server stands in for "someone else's" process.
    // No database, no Next, no network beyond localhost.
    const decoy = http.createServer((_req, res) => {
      res.writeHead(200, { "content-type": "text/plain" });
      res.end("decoy");
    });
    // Dual-stack (no host): Playwright probes `localhost`, which resolves to ::1
    // first on modern Node, so an IPv4-only decoy would look free.
    await new Promise<void>((resolve) => decoy.listen(0, resolve));
    const port = (decoy.address() as AddressInfo).port;

    try {
      const { status, output } = await nestedRun(["--project=booking", "--reporter=line", "--workers=1"], {
        E2E_BOOKING_PORT: String(port),
      });

      expect(status, output).not.toBe(0);
      expect(output).toMatch(new RegExp(`http://localhost:${port} is already used`));
      // No spec executed: Playwright's line reporter prints "N passed" / "N failed" only after running tests.
      expect(output).not.toMatch(/\d+ (passed|failed|flaky)/);

      // The decoy is still alive and still ours.
      const body = await new Promise<string>((resolve, reject) => {
        http
          .get(`http://127.0.0.1:${port}/`, (res) => {
            let data = "";
            res.on("data", (c) => (data += c));
            res.on("end", () => resolve(data));
          })
          .on("error", reject);
      });
      expect(body).toBe("decoy");
    } finally {
      await new Promise<void>((resolve) => decoy.close(() => resolve()));
    }
  });

  test("an unknown --project fails before any server is declared", async () => {
    const { status, output } = await nestedRun(["--project=bookings", "--list"]);
    expect(status, output).not.toBe(0);
    expect(output).toMatch(/Project\(s\) "bookings" not found\. Available projects: docs, docs-mobile, booking, tooling\./);
  });
});
