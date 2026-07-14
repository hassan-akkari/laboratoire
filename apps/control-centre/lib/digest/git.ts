import { execFile } from "node:child_process";
import path from "node:path";
import { promisify } from "node:util";

/**
 * The zero-effort logbook: `git log --since` over this repo IS the weekly
 * review, nobody has to write it. Parsing and grouping are pure functions
 * (tested); only the git invocation touches the world.
 */

const execFileAsync = promisify(execFile);
const REPO_ROOT = path.resolve(process.cwd(), "..", "..");

export type CommitEntry = {
  hash: string;
  date: string;
  area: string;
  subject: string;
};

/** feat(docs): x → docs · chore: y → chore · anything else → repo */
export function inferArea(subject: string): string {
  const conventional = subject.match(/^[a-z]+\(([^)]+)\)\s*:/i);
  if (conventional) return conventional[1].toLowerCase();
  const bareType = subject.match(/^([a-z]+)\s*:/i);
  if (bareType) return bareType[1].toLowerCase();
  return "repo";
}

export function parseGitLog(raw: string): CommitEntry[] {
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .flatMap((line) => {
      const [hash, date, ...subjectParts] = line.split("\u001f");
      const subject = subjectParts.join("\u001f");
      if (!hash || !date || !subject) return [];
      return [{ hash, date, area: inferArea(subject), subject }];
    });
}

export function groupByArea(entries: CommitEntry[]): Map<string, CommitEntry[]> {
  const groups = new Map<string, CommitEntry[]>();
  for (const entry of entries) {
    const group = groups.get(entry.area) ?? [];
    group.push(entry);
    groups.set(entry.area, group);
  }
  return new Map(
    [...groups.entries()].sort((a, b) => b[1].length - a[1].length),
  );
}

export async function readWeeklyLog(): Promise<CommitEntry[]> {
  const { stdout } = await execFileAsync(
    "git",
    [
      "log",
      "--since=7 days ago",
      "--date=short",
      // %x1f (unit separator) never appears in commit subjects.
      "--pretty=%h%x1f%ad%x1f%s",
    ],
    { cwd: REPO_ROOT, maxBuffer: 1024 * 1024 },
  );
  return parseGitLog(stdout);
}
