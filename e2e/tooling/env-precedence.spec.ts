import { spawnSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { expect, test } from "@playwright/test";

/**
 * The booking webServer relies on one property of Next's env loader: a variable
 * already present in the process environment is never overridden by
 * `.env.local`. This proves it with `@next/env` (the loader Next uses) against
 * a synthetic `.env.local` — no real credentials, no database.
 */
const ROOT = path.resolve(__dirname, "..", "..");
const SYNTHETIC = "postgres://synthetic:synthetic@127.0.0.1:1/never";

function loadWith(dir: string, preset: string | undefined): string {
  const script = `
    const { loadEnvConfig } = require("@next/env");
    loadEnvConfig(process.argv[1], true, { info() {}, error() {} });
    process.stdout.write(JSON.stringify(process.env.DATABASE_URL === undefined ? null : process.env.DATABASE_URL));
  `;
  const env: Record<string, string> = {};
  for (const [k, v] of Object.entries(process.env)) if (v !== undefined && k !== "DATABASE_URL") env[k] = v;
  if (preset !== undefined) env.DATABASE_URL = preset;
  const run = spawnSync(process.execPath, ["-e", script, dir], { cwd: ROOT, env, encoding: "utf8", timeout: 30_000 });
  expect(run.status, run.stderr).toBe(0);
  return JSON.parse(run.stdout);
}

test.describe("DATABASE_URL precedence for the booking server", () => {
  let dir: string;
  test.beforeAll(() => {
    dir = mkdtempSync(path.join(os.tmpdir(), "e2e-env-"));
    writeFileSync(path.join(dir, ".env.local"), `DATABASE_URL=${SYNTHETIC}\n`);
  });
  test.afterAll(() => rmSync(dir, { recursive: true, force: true }));

  test("control: with nothing preset, .env.local is read", () => {
    expect(loadWith(dir, undefined)).toBe(SYNTHETIC);
  });

  test("with DATABASE_URL='' preset on the process, .env.local cannot override it", () => {
    expect(loadWith(dir, "")).toBe("");
  });
});
