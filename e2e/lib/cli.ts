/**
 * Project selection for playwright.config.ts.
 *
 * Playwright starts every `webServer` entry regardless of `--project`, so the
 * config needs to know which projects the CLI asked for before it decides
 * which servers to declare. This mirrors the semantics of Playwright's own
 * `--project <project-name...>` option (commander variadic):
 *
 *   --project=booking
 *   --project docs --project booking
 *   --project docs booking            (one flag, several values)
 *   --project=docs*                    ('*' and '?' wildcards, case-insensitive)
 *
 * Values are collected until the next `--flag`; `--` ends option parsing.
 * Anything that matches no known project is an error, raised here so no
 * server is started for a run Playwright would reject anyway.
 */

export const PROJECT_NAMES = ["docs", "docs-mobile", "booking", "tooling"] as const;
export type ProjectName = (typeof PROJECT_NAMES)[number];

/** Raw `--project` values as Playwright would see them. */
export function projectArgs(argv: readonly string[]): string[] {
  const values: string[] = [];
  let collecting = false;
  for (const arg of argv) {
    if (arg === "--") break;
    if (arg === "--project") {
      collecting = true;
      continue;
    }
    if (arg.startsWith("--project=")) {
      values.push(arg.slice("--project=".length));
      collecting = true;
      continue;
    }
    if (arg.startsWith("-")) {
      collecting = false;
      continue;
    }
    if (collecting) values.push(arg);
  }
  return values;
}

function wildcardToRegExp(pattern: string): RegExp {
  const escaped = pattern.replace(/[.+^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*").replace(/\?/g, ".");
  return new RegExp(`^${escaped}$`, "i");
}

/**
 * Resolve the CLI selection to concrete project names. An empty selection
 * means "every project". Throws on a value that matches nothing.
 */
export function selectProjects(
  argv: readonly string[],
  known: readonly string[] = PROJECT_NAMES,
): Set<string> {
  const requested = projectArgs(argv);
  if (requested.length === 0) return new Set(known);

  const selected = new Set<string>();
  const unmatched: string[] = [];
  for (const value of requested) {
    const re = wildcardToRegExp(value);
    const hits = known.filter((name) => re.test(name));
    if (hits.length === 0) unmatched.push(value);
    for (const hit of hits) selected.add(hit);
  }
  if (unmatched.length > 0) {
    throw new Error(
      `Project(s) ${unmatched.map((v) => `"${v}"`).join(", ")} not found. Available projects: ${known.join(", ")}.`,
    );
  }
  return selected;
}

export type ServerNeeds = { docs: boolean; booking: boolean };

/** Which servers a selection needs. `tooling` needs none. */
export function serversFor(selected: ReadonlySet<string>): ServerNeeds {
  return {
    docs: selected.has("docs") || selected.has("docs-mobile"),
    booking: selected.has("booking"),
  };
}
