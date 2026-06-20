# agenthub real contract (v2.9.0) — orchestrator v2

> v1's templates called `agenthub:init --name …` and `agenthub:eval --criteria …`.
> Neither flag exists in the installed agenthub 2.9.0. This file is the source of
> truth. Scripts: `~/.claude/plugins/cache/claude-code-skills/agenthub/2.9.0/skills/agenthub/scripts/` (call it <agenthub-scripts>).

## Hard facts (source-verified — respect these)

- `hub_init.py` requires `--task` (NOT `--name`). No `--name` flag exists.
- `--base-branch` defaults to the CURRENT branch (from .git/HEAD). ALWAYS pass
  `--base-branch main`, then ASSERT it in config after init (see INIT).
- Session id = local timestamp `%Y%m%d-%H%M%S`, no collision guard → serialize
  inits; never launch two in the same second.
- `config.yaml` is written as quoted single-line YAML and read with
  `line.split(":", 1)` (key before first colon, rest is the value). Interior
  colons in the task text are SAFE. The real fragilities are embedded double-quotes
  and newlines — avoid those in `--task`; do NOT strip interior colons.
- `result_ranker.py` runs `--eval-cmd` with a HARD 120s timeout per worktree. Do
  NOT route `pnpm check` through it.
- There is NO `--criteria` flag. Weighted task-type criteria (task-taxonomy.md)
  are the LLM-JUDGE RUBRIC text, not a CLI argument.
- Worktrees are created ONLY by spawning agents with `isolation: "worktree"`.
  Branch naming: `hub/{session-id}/agent-{N}/attempt-{M}`.
- `session_manager.py` enforces VALID_TRANSITIONS init→running→evaluating→
  merged|archived. A fresh session is `init`. Do NOT call `--state merged` — it
  is rejected from `init` and the git merge does the real work anyway. Session
  state is cosmetic for our flow; skip it.
- "terminal state" in our run-log (merged / committed-to-branch / aborted /
  aborted-DIRTY) is an ORCHESTRATOR concept, distinct from agenthub session state;
  only the word `merged` coincides.

## INIT

Note the start time for the wall-clock backstop (`date -u +%s`). Then:

    python <agenthub-scripts>/hub_init.py \
      --task "<task text; no embedded double-quotes or newlines>" \
      --agents 3 --base-branch main --format json

Capture `session_id` from the JSON. THEN assert the base branch took:

    grep '^base_branch:' .agenthub/sessions/<session_id>/config.yaml
    # must read `base_branch: main`. If not → ABORT (unresolved failure).

If hub_init errors or yields no session_id → ABORT (unresolved failure).

## SPAWN

Issue all N `Agent(...)` calls in a SINGLE message, each with
`isolation: "worktree"` and its full self-contained variant prompt. Count the
agents dispatched against `RUN_AGENT_CEILING`. After worktrees exist, structurally
disable push in each so a rogue agent physically cannot push:

    git -C <each-worktree-path> remote set-url --push origin DISABLED_no_push

Resolve worktree paths from `git worktree list --porcelain` (match the branch
`hub/{session-id}/agent-{N}/attempt-1`). If fewer than 2 worktrees/branches
materialize → ABORT (unresolved failure: no real competition).

## OBJECTIVE GATE (per variant — BEFORE judging)

For each agent branch, run `pnpm check` NON-INTERACTIVELY in that worktree, with a
finite wall-clock timeout (vitest run mode, not watch):

    cd <worktree-path> && timeout 1200 pnpm check    # 20-min ceiling per variant

- exit 0 → variant qualifies.
- non-zero or TIMEOUT → variant DISQUALIFIED.
- ALL variants disqualified → unresolved failure.

## JUDGE (LLM judge mode — quality-first; no --criteria flag)

For each surviving variant: `git diff main...hub/{session-id}/agent-{N}/attempt-1`.
Rank by this task type's rubric in `references/task-taxonomy.md` (Step 5 weights).
Tie-break: simpler diff (fewer lines). Record winner + per-criterion rationale.

## ADVERSARIAL (fail-closed gate)

Dispatch `engineering-skills:adversarial-reviewer` on the winner diff + the repo
invariants. Require it to justify each finding's severity using this rubric:

  CRITICAL = any of: repo-invariant violation; secret/env exposure; `pnpm check`
  would fail; data loss; auth/session bypass; currency math not via roundCurrency.
  MEDIUM/LOW = everything else.

- CRITICAL finding → blocker → unresolved failure.
- In UNATTENDED, any MEDIUM touching pricing/auth/session/middleware ESCALATES to a
  gate stop (conservative bias; no human to catch a misrating).
- If the reviewer fails, errors, times out, or returns no parseable verdict →
  treat as CRITICAL (FAIL-CLOSED). Never default to pass.
- Non-escalated MEDIUM/LOW → `_followup.md`.

## WRITE CEILING — INTERACTIVE MERGE (only after human approval)

    git checkout main
    git merge --no-ff hub/{session-id}/agent-{winner}/attempt-1 \
      -m "hub: merge agent-{winner} — <task slug>"
    # archive + delete each loser branch:
    git tag hub/archive/{session-id}/agent-{N} hub/{session-id}/agent-{N}/attempt-1
    git branch -D hub/{session-id}/agent-{N}/attempt-1
    python <agenthub-scripts>/session_manager.py --cleanup {session-id}   # worktrees only
    # do NOT call --state merged (rejected from 'init'; cosmetic).

## WRITE CEILING — UNATTENDED STOP (never merges)

    # winner branch hub/{session-id}/agent-{winner}/attempt-1 already holds the commit
    python <agenthub-scripts>/session_manager.py --cleanup {session-id}
    # DO NOT checkout main, merge, or push. terminal state = committed-to-branch.

## CLEANUP ON ABORT (then VERIFY per execution-modes.md)

    python <agenthub-scripts>/session_manager.py --cleanup {session-id}
    git status --porcelain      # expect only the run-log file
    git worktree list           # expect no hub/... worktree
    # residue or stuck worktree → terminal state aborted-DIRTY + notify "manual cleanup".
