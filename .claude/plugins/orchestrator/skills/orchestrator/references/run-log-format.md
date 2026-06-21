# Run-log format — orchestrator v2

> Every run (success OR abort) writes exactly ONE file. Append-only at the
> DIRECTORY level: never reopen a prior run's file (avoids merge conflicts under
> parallel/headless runs). AUDIT-ONLY: never read a run-log back into any agent
> prompt; it is not a routing input (no cross-run learning in v2).

## Location & naming

- Directory: `_orchestrator-runs/` at repo ROOT. COMMITTED (not gitignored).
- Filename: `<YYYY-MM-DD>-<slug>.md`.
- Slug rule: lowercase task; keep `[a-z0-9]`; collapse other runs to `-`; trim
  leading/trailing `-`; cap 50 chars. "Fix /api/checkout 500 on invalid promoCode"
  → `fix-api-checkout-500-on-invalid-promocode`.
- On date+slug collision, append `-2`, `-3`, … (never overwrite).

## Record template (fill every field)

    # Orchestrator run — <slug>

    > Run <YYYY-MM-DD HH:MM> · mode: <interactive|unattended> · base: main · terminal state: <merged|committed-to-branch|aborted|aborted-DIRTY>

    ## Task
    <verbatim task text>

    ## Classification
    - stack / domain / action / complexity: <…> (confidence: <high|med|low>)
    - depth: <1|2>
    - variant leads: <lead-A>, <lead-B>, <lead-C>

    ## ENTP pre-flight (Step 1.5 — advisory)
    - entp_preflight: <ran | skipped (gate: simple+high-confidence) | skipped (error)>
    - verdict: <as-framed | descope | expand | split | don't-build> — <one-line reason>
    - reframings surfaced: <n>  (interactive: human chose proceed|reframe|abort)

    ## Objective gate (pnpm check per variant)
    | variant | pnpm check | note |
    |---|---|---|
    | A | pass/fail/timeout | … |
    | B | pass/fail/timeout | … |
    | C | pass/fail/timeout | … |

    ## Judge
    - winner: <A|B|C>
    - rationale: <per-criterion summary>

    ## Adversarial verdict
    <pass | CRITICAL blocker: … | escalated MEDIUM: … | reviewer-error→fail-closed>

    ## Cost (post-hoc audit; NOT the backstop trigger)
    - agents dispatched: <n> / 12 · wall-clock: <m> min / 45 · output tokens (approx): <…>

    ## Terminal state
    <merged @ <sha> | committed-to-branch hub/<session>/agent-<X>/attempt-1 | aborted — <reason> | aborted-DIRTY — <reason> + manual cleanup>
