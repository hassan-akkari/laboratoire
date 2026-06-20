# Execution modes — orchestrator v2

> The mode axis is the only new concept in v2. It flips three switches; the
> v1 classify → depth-select → compete → judge spine is identical in both modes.

## Modes

`mode ∈ { interactive, unattended }`. **Default: interactive** (fail-safe).
Resolved in Step 0 from the args. NEVER auto-inferred to unattended.

## The three switches

| Switch | interactive | unattended |
|---|---|---|
| Human gates | ask on ambiguity; confirm before merge | none: any "ask the human" branch becomes ABORT |
| Write ceiling | merge to `main` AFTER explicit human approval | commit-to-branch, STOP — never push, never merge |
| On unresolved failure | surface to human, wait | abort clean + notify |

(Task source is identical in both modes — the operator hands the skill a task.)

## Unresolved-failure triggers (both modes hit these; mode decides the reaction)

1. Classification confidence is low.
2. Depth is ambiguous (simple vs complex) — interactive asks; unattended does NOT
   abort, it cost-safely defaults to Depth-1 + adversarial.
3. ALL variants fail the objective gate (`pnpm check`), OR fewer than 2 variants
   successfully spawn+commit (a 1-variant "competition" is not quality-first).
4. The adversarial pass returns CRITICAL (or errors — fail-closed).
5. The cost backstop is breached (see below).
6. `hub_init` fails / yields no session_id, or base_branch != main after init.

- interactive → ask / surface and wait.
- unattended → ABORT: do not merge, clean up worktrees, write the run-log record
  (`terminal state: aborted — <reason>`), notify. main untouched.

(Trigger 2 is the one exception: ambiguous depth is NOT an abort — it resolves to
Depth-1 + adversarial in unattended.)

## Write ceiling detail

- **interactive:** after eval + adversarial + objective gate, present winner +
  judge rationale, ask "merge variant <X> to main?". Yes → INTERACTIVE MERGE
  sequence (`agenthub-contract.md`). No → treat as abort (clean up).
- **unattended:** after eval + adversarial + objective gate, leave the winning
  branch `hub/{session-id}/agent-{winner}/attempt-1` intact (the agent already
  committed there), run worktree cleanup, STOP. Terminal state =
  `committed-to-branch`. NEVER call the merge sequence.

## Cost backstop (enforceable; NOT a live token meter)

A prose skill running in the main loop cannot reliably meter the live token
consumption of parallel detached worktree agents. So the backstop is structural
and checked at phase boundaries (before SPAWN, after JUDGE, after ADVERSARIAL):

- `RUN_AGENT_CEILING = 12` total dispatched agents per run (covers Depth-2's 9 +
  margin; the orchestrator counts the Agent calls it issues).
- `RUN_WALLCLOCK_MINUTES = 45` per run (note start time via `date`; check elapsed
  at each phase boundary).
- Inherent caps that bound cost without metering: ≤3 variants, Depth ≤2 (≤9
  agents), single attempt (NO retry loops), NO re-spawn on partial failure.

If either ceiling is exceeded → unresolved failure (abort + run-log
`aborted — cost backstop: <which ceiling>` + notify). Approximate token cost is
recorded POST-HOC in the run-log Cost field for audit/tuning — it is not the
enforcement trigger.

## Abort = clean (and VERIFIED)

Abort runs `session_manager.py --cleanup {session}` (removes worktrees only),
retains hub branches for forensic inspection (never merged), leaves `main` and
the working tree untouched. Then VERIFY:

- `git status --porcelain` shows nothing beyond the run-log file, AND
- `git worktree list` shows no remaining `hub/...` worktree.

If verification fails (residue, or a worktree that wouldn't remove — common on
Windows/NTFS file locks, see CLAUDE.md gotcha #9), record terminal state
`aborted-DIRTY` and make the push notification flag that manual cleanup is needed.
No fallback ladder and no best-effort commit in Phase 1.

## Notification policy (both terminal states)

1. **Report file (source of truth):** the run-log record. Always written.
2. **Push (best-effort):** `PushNotification({ message, status: "proactive" })`,
   < 200 chars, one line, no markdown. If "not sent", do nothing; never fails the run.

## Run-log access constraint

The run log is AUDIT-ONLY and append-only. It must NEVER be read back into a
variant/judge/adversarial prompt, and it is NOT a routing input. There is no
cross-run learning in v2.
