import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";

/**
 * REAL data, no mock: reads the Obsidian vault from VAULT_DIR (defaults to
 * the repo's sample vault) and diffs its publishable notes against what the
 * docs site currently ships (apps/docs/src/content/data/notes.json). The
 * panel answers one question: "is the public garden in sync with the vault,
 * and what would the next `vault:sync` publish?"
 *
 * The slug derivation mirrors apps/docs/scripts/vault-sync.ts — if the two
 * ever drift, the drift READS as pending sync work here, which is exactly
 * the signal you'd want anyway.
 */

const REPO_ROOT = path.resolve(process.cwd(), "..", "..");
const DEFAULT_VAULT = path.join(REPO_ROOT, "resources", "vault-sample");
const SITE_NOTES_JSON = path.join(
  REPO_ROOT,
  "apps",
  "docs",
  "src",
  "content",
  "data",
  "notes.json",
);

const IGNORED_DIRS = new Set([".obsidian", ".trash", ".git", "templates"]);

export type VaultNote = {
  file: string;
  title: string;
  slug: string;
  publish: boolean;
  stage: string;
};

export type VaultStatus = {
  vaultDir: string;
  isSampleVault: boolean;
  notes: VaultNote[];
  publishedCount: number;
  privateCount: number;
  byStage: Record<string, number>;
  /** publish:true in the vault but not on the site yet. */
  pendingPublish: string[];
  /** on the site but no longer publish:true in the vault. */
  pendingRemoval: string[];
  error?: string;
};

function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
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

export async function readVaultStatus(): Promise<VaultStatus> {
  const vaultDir = process.env.VAULT_DIR
    ? path.resolve(process.env.VAULT_DIR)
    : DEFAULT_VAULT;

  const status: VaultStatus = {
    vaultDir,
    isSampleVault: vaultDir === DEFAULT_VAULT,
    notes: [],
    publishedCount: 0,
    privateCount: 0,
    byStage: {},
    pendingPublish: [],
    pendingRemoval: [],
  };

  let files: string[];
  try {
    files = await collectMarkdownFiles(vaultDir);
  } catch {
    status.error = `Vault not readable at ${vaultDir} — set VAULT_DIR in .env.local`;
    return status;
  }

  for (const file of files) {
    let data: Record<string, unknown>;
    let content: string;
    try {
      ({ data, content } = matter(await readFile(file, "utf8")));
    } catch {
      continue; // unreadable frontmatter → vault-sync's problem, not the panel's
    }
    const basename = path.basename(file, path.extname(file));
    const title =
      (typeof data.title === "string" && data.title.trim()) ||
      content.match(/^#\s+(.+)$/m)?.[1]?.trim() ||
      basename;
    const publish = data.publish === true;
    const stage = typeof data.stage === "string" ? data.stage : "seedling";
    const slug =
      (typeof data.slug === "string" && data.slug.trim()) || slugify(title);

    status.notes.push({ file: basename, title, slug, publish, stage });
    if (publish) {
      status.publishedCount++;
      status.byStage[stage] = (status.byStage[stage] ?? 0) + 1;
    } else {
      status.privateCount++;
    }
  }

  try {
    const site = JSON.parse(await readFile(SITE_NOTES_JSON, "utf8")) as {
      notes?: { slug?: string }[];
    };
    const siteSlugs = new Set(
      (site.notes ?? []).map((note) => note.slug).filter(Boolean),
    );
    const vaultSlugs = new Set(
      status.notes.filter((note) => note.publish).map((note) => note.slug),
    );
    status.pendingPublish = [...vaultSlugs].filter((slug) => !siteSlugs.has(slug));
    status.pendingRemoval = [...siteSlugs].filter(
      (slug): slug is string => slug !== undefined && !vaultSlugs.has(slug),
    );
  } catch {
    status.error = "Could not read the site's notes.json for the drift check";
  }

  return status;
}
