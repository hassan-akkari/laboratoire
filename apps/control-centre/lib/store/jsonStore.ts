import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { z } from "zod";

/**
 * Tiny JSON-file persistence layer — the control centre is local-only, so a
 * validated file in data/ (gitignored) beats a database. First read seeds
 * data/<name>.json from seed/<name>.seed.json. Every read AND write goes
 * through the zod schema: a hand-edited file fails loudly, and code can never
 * persist a payload it couldn't read back.
 *
 * This is deliberately the same "swap the destination, keep the contract"
 * shape as the docs garden pipeline: moving a store to SQLite/Postgres later
 * means reimplementing these two functions, nothing above them.
 */

const DATA_DIR = path.join(process.cwd(), "data");
const SEED_DIR = path.join(process.cwd(), "seed");

export async function readStore<Schema extends z.ZodType>(
  name: string,
  schema: Schema,
): Promise<z.infer<Schema>> {
  const file = path.join(DATA_DIR, `${name}.json`);
  let raw: string;
  try {
    raw = await readFile(file, "utf8");
  } catch {
    raw = await readFile(path.join(SEED_DIR, `${name}.seed.json`), "utf8");
    await mkdir(DATA_DIR, { recursive: true });
    await writeFile(file, raw, "utf8");
  }

  const parsed = schema.safeParse(JSON.parse(raw));
  if (!parsed.success) {
    throw new Error(
      `[control-centre] data/${name}.json failed validation (delete it to re-seed):\n` +
        JSON.stringify(parsed.error.issues, null, 2),
    );
  }
  return parsed.data;
}

export async function writeStore<Schema extends z.ZodType>(
  name: string,
  schema: Schema,
  value: z.infer<Schema>,
): Promise<void> {
  const parsed = schema.safeParse(value);
  if (!parsed.success) {
    throw new Error(
      `[control-centre] refusing to write invalid ${name} payload:\n` +
        JSON.stringify(parsed.error.issues, null, 2),
    );
  }
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(
    path.join(DATA_DIR, `${name}.json`),
    `${JSON.stringify(parsed.data, null, 2)}\n`,
    "utf8",
  );
}
