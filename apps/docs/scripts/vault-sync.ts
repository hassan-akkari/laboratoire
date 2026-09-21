/**
 * vault-sync — Obsidian vault → src/content/data/notes.json
 *
 * Runs wherever the vault lives (plain Node ≥ 22.18, no build step — the repo
 * ships only erasable TS syntax, so `node scripts/vault-sync.ts` just works):
 *
 *   pnpm -F docs vault:sync -- --vault "C:\path\to\vault"
 *   VAULT_DIR=/path/to/vault pnpm -F docs vault:sync
 *
 * Publishing is a strict ALLOWLIST: only notes whose frontmatter says
 * `publish: true` (boolean, not the string "true") enter the payload;
 * everything else in the vault stays private. The payload is validated
 * against the same zod schema the site validates at build time, so a sync
 * can never commit JSON the build would accept blindly.
 *
 * Frontmatter contract (see notes.schema.ts for the output side):
 *   publish: true                  — required to publish (allowlist)
 *   title:   string                — defaults to first "# " heading, then filename
 *   slug:    kebab-case string     — defaults to slugified title
 *   stage:   seedling|budding|evergreen — defaults to seedling
 *   tags:    [a, b]                — defaults to []
 *   created: YYYY-MM-DD            — required
 *   updated: YYYY-MM-DD            — defaults to `created`
 *   summary: string ≤ 300 chars    — defaults to the first body paragraph
 *
 * [[Wikilinks]] to published notes become `[label](note:<slug>)` (the site
 * renderer maps `note:` onto the locale-prefixed /notes path); wikilinks to
 * anything unpublished are flattened to their plain-text label so private
 * note titles never ship as dead links.
 *
 * Output is deterministic (notes sorted by slug, no timestamp field) and the
 * file is only rewritten when content actually changed — re-running the sync
 * with an untouched vault produces zero git noise.
 */

import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";
import {
  NOTE_STAGES,
  notesPayloadSchema,
  type Note,
  type NoteStage,
} from "../src/content/notes.schema.ts";

const APP_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DEFAULT_OUT = path.join(APP_ROOT, "src", "content", "data", "notes.json");

/** Vault folders that are never note sources. */
const IGNORED_DIRS = new Set([".obsidian", ".trash", ".git", "templates"]);

type CliOptions = { vaultDir: string; outFile: string; dryRun: boolean };

function parseArgs(argv: string[]): CliOptions {
  let vaultDir = process.env.VAULT_DIR ?? "";
  let outFile = DEFAULT_OUT;
  let dryRun = false;

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--") continue; // pnpm 10 forwards the literal "--" separator
    if (arg === "--vault") vaultDir = argv[++i] ?? "";
    else if (arg === "--out") outFile = path.resolve(argv[++i] ?? "");
    else if (arg === "--dry-run") dryRun = true;
    else {
      console.error(`Unknown argument: ${arg}`);
      process.exit(2);
    }
  }

  if (!vaultDir) {
    console.error(
      "Usage: node scripts/vault-sync.ts --vault <dir> [--out <file>] [--dry-run]\n" +
        "       (or set VAULT_DIR)",
    );
    process.exit(2);
  }

  return { vaultDir: path.resolve(vaultDir), outFile, dryRun };
}

async function collectMarkdownFiles(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    if (entry.name.startsWith(".") || IGNORED_DIRS.has(entry.name.toLowerCase())) {
      continue;
    }
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await collectMarkdownFiles(fullPath)));
    } else if (entry.isFile() && entry.name.toLowerCase().endsWith(".md")) {
      files.push(fullPath);
    }
  }
  return files.sort();
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** YAML unquoted dates arrive as Date objects; quoted ones as strings. */
function toIsoDate(value: unknown): string | null {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10);
  }
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value.trim())) {
    return value.trim();
  }
  return null;
}

function firstHeading(body: string): string | null {
  const match = body.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : null;
}

function excerpt(body: string): string {
  const paragraph = body
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .find((block) => block && !block.startsWith("#") && !block.startsWith("```"));
  if (!paragraph) return "";
  const plain = paragraph
    .replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, "$2")
    .replace(/\[\[([^\]]+)\]\]/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[`*_>]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return plain.length > 280 ? `${plain.slice(0, 277)}…` : plain;
}

type ParsedNote = { note: Note; sourceFile: string; titleKeys: string[] };

function parseNote(
  filePath: string,
  raw: string,
  errors: string[],
): ParsedNote | null {
  const relPath = filePath;
  let parsed: ReturnType<typeof matter>;
  try {
    parsed = matter(raw);
  } catch (error) {
    errors.push(`${relPath}: unreadable frontmatter (${String(error)})`);
    return null;
  }

  const fm = parsed.data as Record<string, unknown>;
  if (fm.publish !== true) return null; // allowlist: anything else stays private

  const body = parsed.content.trim();
  const basename = path.basename(filePath, path.extname(filePath));
  const title =
    (typeof fm.title === "string" && fm.title.trim()) ||
    firstHeading(body) ||
    basename;

  const createdAt = toIsoDate(fm.created);
  if (!createdAt) {
    errors.push(`${relPath}: published note is missing "created: YYYY-MM-DD"`);
    return null;
  }
  const updatedAt = toIsoDate(fm.updated) ?? createdAt;

  const stage = (typeof fm.stage === "string" ? fm.stage : "seedling") as NoteStage;
  if (!NOTE_STAGES.includes(stage)) {
    errors.push(
      `${relPath}: unknown stage "${String(fm.stage)}" (expected ${NOTE_STAGES.join(" | ")})`,
    );
    return null;
  }

  const tags = Array.isArray(fm.tags)
    ? fm.tags.filter((tag): tag is string => typeof tag === "string" && tag !== "")
    : [];

  const slug =
    (typeof fm.slug === "string" && fm.slug.trim()) || slugify(title);
  const summary =
    (typeof fm.summary === "string" && fm.summary.trim()) || excerpt(body);

  if (!body) {
    errors.push(`${relPath}: published note has an empty body`);
    return null;
  }
  if (!summary) {
    errors.push(`${relPath}: could not derive a summary (add "summary:" to the frontmatter)`);
    return null;
  }

  return {
    note: { slug, title, summary, stage, tags, createdAt, updatedAt, body },
    sourceFile: filePath,
    titleKeys: [title.toLowerCase(), basename.toLowerCase()],
  };
}

/**
 * Published targets → note: links; private targets → plain text label.
 * Fenced blocks and inline code spans pass through untouched — a note ABOUT
 * wikilink syntax must be able to show `[[...]]` literally.
 */
function resolveWikilinks(
  body: string,
  slugByKey: Map<string, string>,
  stats: { resolved: number; flattened: number },
): string {
  return body
    .split(/(```[\s\S]*?```|`[^`\n]*`)/)
    .map((segment, index) => {
      if (index % 2 === 1) return segment; // odd segments are the code captures
      return segment.replace(
        /\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g,
        (_match, target: string, label?: string) => {
          const text = (label ?? target).trim();
          const slug = slugByKey.get(target.trim().toLowerCase());
          if (slug) {
            stats.resolved++;
            return `[${text}](note:${slug})`;
          }
          stats.flattened++;
          return text;
        },
      );
    })
    .join("");
}

const { vaultDir, outFile, dryRun } = parseArgs(process.argv.slice(2));

const files = await collectMarkdownFiles(vaultDir);
const errors: string[] = [];
const parsedNotes: ParsedNote[] = [];

for (const file of files) {
  const raw = await readFile(file, "utf8");
  const result = parseNote(file, raw, errors);
  if (result) parsedNotes.push(result);
}

const slugByKey = new Map<string, string>();
for (const { note, titleKeys } of parsedNotes) {
  for (const key of titleKeys) slugByKey.set(key, note.slug);
}

const linkStats = { resolved: 0, flattened: 0 };
const notes = parsedNotes
  .map(({ note }) => ({
    ...note,
    body: resolveWikilinks(note.body, slugByKey, linkStats),
  }))
  .sort((a, b) => a.slug.localeCompare(b.slug));

const payload = notesPayloadSchema.safeParse({ notes });
if (!payload.success) {
  for (const issue of payload.error.issues) {
    const index = typeof issue.path[1] === "number" ? issue.path[1] : null;
    const source = index !== null ? parsedNotes[index]?.sourceFile : undefined;
    errors.push(`${source ?? "payload"}: ${issue.path.join(".")} — ${issue.message}`);
  }
}

if (errors.length > 0) {
  console.error(`vault-sync: ${errors.length} problem(s), nothing written:\n`);
  for (const error of errors) console.error(`  ✗ ${error}`);
  process.exit(1);
}

const json = `${JSON.stringify({ notes }, null, 2)}\n`;
const existing = await readFile(outFile, "utf8").catch(() => null);

console.log(
  `vault-sync: ${files.length} note(s) scanned, ${notes.length} published, ` +
    `${files.length - notes.length} private, ` +
    `${linkStats.resolved} wikilink(s) resolved, ${linkStats.flattened} flattened`,
);

if (existing === json) {
  console.log(`vault-sync: ${outFile} unchanged, not rewritten`);
} else if (dryRun) {
  console.log(`vault-sync: dry run — would write ${outFile}`);
} else {
  await writeFile(outFile, json, "utf8");
  console.log(`vault-sync: wrote ${outFile}`);
}
