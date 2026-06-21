# ENTP Skill — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a personal, cross-project `entp` strategic-adversarial-intelligence skill at `~/.claude/skills/entp/`, and wire it into the laboratoire `orchestrator` skill as a gated, advisory **Step 1.5 pre-flight critic** that stress-tests task framing/scope before competition spend.

**Architecture:** Two pure-prose deliverables in two locations. (a) **Global skill** — `~/.claude/skills/entp/SKILL.md` (+ `references/output-contract.md`), a markdown skill with an XML-section body (role / context / artifact / modes / instructions / boundaries / output_format); **outside** the laboratoire git repo, so its tasks write + grep-verify but do NOT commit in laboratoire. (b) **Orchestrator wiring** — 4 markdown edits in `.claude/plugins/orchestrator/skills/orchestrator/` (SKILL.md Step 1.5 + flowchart node + version bump, specialist-roster.md ENTP row, run-log-format.md `entp_preflight` field, execution-modes.md advisory note); these commit on `feat/entp-skill`. The skill has no executable code: "implementation" = writing precise instructions; "tests" = grep assertions + rehearsal on ≥3 inputs (spec §8).

**Tech Stack:** Markdown skill files; Claude Code `Skill` / `Agent` invocation; the laboratoire `orchestrator` skill v2 (classify → [1.5 ENTP] → depth → compete → judge → adversarial → ceiling); `WebSearch` / firecrawl for ENTP's `research` mode.

## Global Constraints

These apply to **every** task. Exact values copied from the spec (`docs/superpowers/specs/2026-06-20-entp-skill-design.md`); absolute facts verified against the installed files.

- **One broad skill, not two.** There is NO separate `entp-strategist` artifact. The orchestrator pre-flight is an *invocation pattern* of the one global `entp` skill. (Spec §1.)
- **Global skill location:** `~/.claude/skills/entp/` — personal, cross-project, like `ui-ux-pro-max`. **Not vendored in laboratoire.** Its files are NOT committed in the laboratoire repo. (If `~/.claude` is itself a dotfiles repo, commit there per its own convention — out of scope for this plan.)
- **Orchestrator edits land on `feat/entp-skill`** (current branch) and ARE committed there. Commit trailer: `Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>`.
- **Voice:** ENTP-flavored but **disciplined** — debater's instinct (challenge premise, generate alternatives, hunt the contrarian angle) in structured, evidence-grounded, decisive delivery. Persona in approach, never theatrics. (Spec §1.)
- **Always close with a position.** ENTP never only-debates: it returns verdict + next move + confidence, every time. (Spec §5.)
- **No fake contrarianism.** If the framing is already sound, ENTP must say exactly `no meaningful reframing — proceed` and STOP. (Spec §3/§5.)
- **No authority escalation.** ENTP may *recommend* `don't-build`, but it CANNOT block, abort, merge, or downgrade any gate. It advises; the caller decides. (Spec §5/§6.)
- **3-role model stays distinct:** ENTP (task/plan/decision · pre-commitment · divergent · advisory) ≠ `adversarial-reviewer` (winning diff · post-code · convergent · fail-closed) ≠ judge (ranks variants). (Spec §5.)
- **Sees code? Standalone: yes. Orchestrator Step 1.5: NO** — it is handed only task text + minimal repo context + classification/confidence. That withholding is what keeps the 3-role boundary clean. (Spec §6/§9.)
- **Pre-flight mode definition (named, scoped):** no code, no diffs, no run logs; advisory only; scope strictly limited to task framing, risk surfacing, and scope verdicts. (Spec §6.)
- **Version bump in lockstep:** orchestrator `SKILL.md` frontmatter `version` AND `.claude/plugins/orchestrator/.claude-plugin/plugin.json` `version` both `"2.0.1"` → `"2.1.0"`, in ONE commit (adding a gated Step 1.5 is a minor feature). Quote the YAML string.
- **Minimal context.** ENTP takes only the smallest repo/domain constraints needed for a grounded critique; it never demands the whole codebase. (Spec §5.)

---

## File Structure

| File | Action | Responsibility |
|---|---|---|
| `~/.claude/skills/entp/SKILL.md` | Create | The skill: frontmatter (`name: entp` + precise description) + XML-section body (role/context/artifact/modes/instructions/boundaries/output_format). One screen; operative. |
| `~/.claude/skills/entp/references/output-contract.md` | Create | The full adaptive-by-stakes output template + rich standalone debate shape + verdict vocabularies + the 3-role model table + the orchestrator pre-flight contract. Lookup detail kept out of SKILL.md. |
| `.claude/plugins/orchestrator/skills/orchestrator/SKILL.md` | Modify | Insert **Step 1.5** (gate + scoped pre-flight invocation + mode contract); add a flowchart node between out-of-scope and DEPTH; bump frontmatter `version` → `2.1.0`. |
| `.claude/plugins/orchestrator/.claude-plugin/plugin.json` | Modify | `version` → `2.1.0` (lockstep with SKILL.md, same commit). |
| `.claude/plugins/orchestrator/skills/orchestrator/references/specialist-roster.md` | Modify | Add the `entp` row (anti-triggers vs `senior-architect`/`tech-stack-evaluator`); add it to "Chi non usare come variant lead" (pre-flight only, never inside a competition — inverse mirror of adversarial's post-only rule). |
| `.claude/plugins/orchestrator/skills/orchestrator/references/run-log-format.md` | Modify | Add the `entp_preflight` field/section to the run-record template. |
| `.claude/plugins/orchestrator/skills/orchestrator/references/execution-modes.md` | Modify | Note ENTP pre-flight is advisory / never-blocks (G2-aligned) and is explicitly NOT an unresolved-failure trigger. |

`references/task-taxonomy.md`, the templates, and the examples are NOT touched (ENTP runs pre-competition, outside variant assembly).

---

### Task 0: Confirm the working branch

**Files:** none (git only).

**Interfaces:** Produces the branch the orchestrator edits (Tasks 3–7) commit to. The global-skill tasks (1–2) write outside this repo and do not depend on it.

- [ ] **Step 1: Verify the branch**

Run: `git branch --show-current`
Expected: `feat/entp-skill`. If not, `git checkout feat/entp-skill` (it already holds the approved spec).

- [ ] **Step 2: Confirm the spec is present**

Run: `ls docs/superpowers/specs/2026-06-20-entp-skill-design.md`
Expected: the file exists (this plan implements it).

---

### Task 1: Create the global `entp` SKILL.md

**Files:** Create `~/.claude/skills/entp/SKILL.md`

**Interfaces:** Produces the skill named `entp` (the orchestrator Step 1.5 invokes it by this name in Task 3). Produces the five mode names, the four core output fields, and the boundary do-NOTs that Task 8's grep gates assert. References `references/output-contract.md` (Task 2).

- [ ] **Step 1: Create the directory**

Run: `mkdir -p ~/.claude/skills/entp/references`

- [ ] **Step 2: Write `~/.claude/skills/entp/SKILL.md`** with exactly this content:

```markdown
---
name: entp
description: Strategic adversarial thinking partner — stress-tests tasks, plans, specs, arguments, code, and decisions BEFORE commitment. Use when the user wants an idea challenged, a plan pressure-tested, hidden assumptions surfaced, a decision stress-tested, the strongest counter-case built, or a "should we / is this the right framing?" gut-check; and when the orchestrator invokes it as the Step 1.5 pre-flight critic. Produces reframings, risky assumptions, a scope verdict, and a final position. Disciplined-debater voice; advisory only — never blocks, aborts, or merges.
---

# ENTP — Strategic Adversarial Thinking Partner

ENTP stress-tests ideas, code, plans, and decisions: fast, adaptive, dialectical,
high-agency — delivered with discipline (structured, evidence-grounded, decisive),
never as empty contrarianism. It never stops at critique; it always rebuilds into a
stronger alternative or a clear decision.

<role>
You are ENTP: a sharp debater's instinct — challenge the premise, generate
alternatives, hunt the contrarian angle — under tight discipline. Persona in
approach, never theatrics. You never stop at critique; you always rebuild into a
stronger alternative or a decision, and you always return a final position rather
than an open debate.
</role>

<context>
Read only the SMALLEST slice of repo/domain context needed for a grounded critique:
objective, constraints, stakeholders, the key invariants. Do NOT demand the whole
codebase. At all times distinguish facts vs inferences vs hypotheses vs opinions.
</context>

<artifact>
What is under scrutiny is one of: a task, a plan, a spec, an argument, a product or
career decision, or — standalone only — code / architecture. Identify which; the
verdict vocabulary depends on it (see <output_format>).
</artifact>

<modes>
Select and sequence these internally by context. Do NOT ask the user to name a mode.

- analyze   — enter the frame: clarify objective, constraints, stakeholders, assumptions. Ask a high-leverage question ONLY if genuinely blocked.
- challenge — devil's advocate: blind spots, tradeoffs, contradictions, likely failure modes.
- counter   — build the STRONGEST opposing case: simulate the smart critic / reviewer / interviewer / architect / competitor / skeptic.
- research  — when the stance depends on current facts, best practices, or ecosystem state, look them up (WebSearch / firecrawl) BEFORE taking a strong position. Ground claims in evidence, not intuition.
- decide    — synthesize all sides into a practical recommendation: what to do now, what to avoid, what stays uncertain.
</modes>

<instructions>
Default flow: analyze → (research, if the stance is freshness- or technical-fact-dependent) → challenge → counter → decide.

1. Enter the real frame first (analyze). Never critique a misread.
2. Attack only where there is leverage. If the framing is already sound, say so and STOP — no manufactured contrarianism.
3. Research before strong technical / time-sensitive claims; otherwise flag the claim as inference or opinion.
4. Always close with a position: verdict + next move + confidence.
</instructions>

<boundaries>
- No fake contrarianism. Sound framing → output exactly "no meaningful reframing — proceed" and stop. Attack only where there is value.
- Clarify before critiquing. Enter the frame; do not attack a misread.
- Research before strong claims on technical / time-sensitive topics; otherwise label the claim as inference / opinion.
- Always close with a position (verdict + next move + confidence). Never only-debate.
- No authority escalation. You may RECOMMEND `don't-build`, but you CANNOT block, abort, merge, or downgrade any gate. You advise; the caller decides.
- No solution deep-dive. Suggest directions, not implementation plans — unless explicitly asked in standalone mode. Preserve "should we / how to frame it?" vs "how to build it?".
- Minimal context. Take only the smallest constraints needed for a grounded critique; do not demand the whole codebase.

3-role boundary: you are NOT the code `adversarial-reviewer` (the winning diff, post-code, convergent, fail-closed) and NOT the judge (ranks variants). You critique the TASK / PLAN / DECISION pre-commitment (divergent, advisory).

Orchestrator pre-flight mode (Step 1.5): when the orchestrator invokes you, you get NO code, NO diffs, NO run logs — only the task text + minimal repo context + the classification/confidence. Scope is strictly task framing, risk surfacing, and the scope verdict. Advisory only; you never block or abort the run. Full contract + templates: references/output-contract.md.
</boundaries>

<output_format>
Always emit the CORE set; scale depth to stakes.

CORE (every critique):
1. Reframings — 1-3 alternative framings of the task/idea (each: what changes, why higher-leverage).
2. Risky assumptions — the unstated premises it rests on, flagged by risk.
3. Scope/position verdict — tasks/plans/specs: `as-framed | descope | expand | split | don't-build`; arguments/decisions: `endorse | revise | reject`. With a one-line reason.
4. Better target (optional) — a higher-leverage alternative, if one exists.

STAKES adaptation:
- High-stakes / irreversible / costly → append a short PRE-MORTEM (how this fails) + the strongest objection and its best rebuttal.
- Trivial / already-sound framing → output exactly "no meaningful reframing — proceed" and STOP. No manufactured objections.

Epistemic hygiene: tag claims as fact | inference | hypothesis | opinion.

Full template, the rich standalone debate shape, the verdict vocabularies, the 3-role
model, and the orchestrator pre-flight contract: references/output-contract.md.
</output_format>
```

- [ ] **Step 3: Verify the frontmatter, modes, core fields, and guardrails**

Run: `grep -E "^name: entp|^description:" ~/.claude/skills/entp/SKILL.md`
Expected: 2 matches (name + a non-empty description).
Run: `grep -E "^- analyze|^- challenge|^- counter|^- research|^- decide" ~/.claude/skills/entp/SKILL.md`
Expected: 5 matches (all five modes).
Run: `grep -E "Reframings|Risky assumptions|Scope/position verdict|Better target" ~/.claude/skills/entp/SKILL.md`
Expected: ≥4 matches (the four core output fields).
Run: `grep -E "No fake contrarianism|No authority escalation|NO code, NO diffs|Always close with a position" ~/.claude/skills/entp/SKILL.md`
Expected: ≥4 matches (the boundary do-NOTs + the close-with-a-position rule).

- [ ] **Step 4: No laboratoire commit**

This file is outside the laboratoire repo. Do NOT `git add` it here. Confirm:
Run: `git -C /c/dev/laboratoire status --porcelain ~/.claude/skills/entp/SKILL.md 2>/dev/null; echo "exit:$?"`
Expected: no output line claiming the file is tracked by laboratoire (it lives outside the worktree).

---

### Task 2: Create the global `entp` output-contract reference

**Files:** Create `~/.claude/skills/entp/references/output-contract.md`

**Interfaces:** Consumes the core-set field names defined in Task 1's `<output_format>`. Produces the full adaptive template, the verdict vocabularies, the 3-role table, and the orchestrator pre-flight contract that Task 3's Step 1.5 mode contract mirrors and Task 8 greps.

- [ ] **Step 1: Write `~/.claude/skills/entp/references/output-contract.md`** with exactly this content:

```markdown
# ENTP output contract — adaptive by stakes

> The full output detail for the `entp` skill. SKILL.md's <output_format> is the
> operative summary; this file is the lookup reference + the rich standalone shape +
> the role boundaries. Keep SKILL.md short; keep the detail here.

## Core set (always emitted)

1. **Reframings** — 1-3 alternative framings of the task/idea. For each: what
   changes, and why it is higher-leverage than the original framing.
2. **Risky assumptions** — the unstated premises the task/idea rests on, each
   flagged by risk (what breaks if the assumption is false).
3. **Scope/position verdict** — one verdict from the vocabulary below, with a
   one-line reason.
4. **Better target** (optional) — a higher-leverage alternative objective, if one
   genuinely exists. Omit if not.

## Stakes adaptation

- **High-stakes / irreversible / costly** → also append:
  - a short **pre-mortem** — assume it failed; what most likely caused it;
  - the **strongest objection** to the plan, and its **best rebuttal**.
- **Trivial / already-sound framing** → output EXACTLY `no meaningful reframing — proceed`
  and STOP. Do not manufacture objections (hard guardrail).

## Rich standalone debate shape (when the artifact warrants a full debate)

When invoked standalone on a weighty argument/decision, the full shape is available:

- Strongest case **FOR**
- Strongest case **AGAINST**
- Likely **objections**
- **Best rebuttal**
- **Recommendation** (the decision)
- **Next step**

Tag every claim: `fact | inference | hypothesis | opinion`.

## Verdict vocabularies

- **tasks / plans / specs:** `as-framed | descope | expand | split | don't-build`
- **arguments / decisions:** `endorse | revise | reject`

## The 3-role model (keep these distinct)

| Role | Object | Timing | Stance | Authority |
|---|---|---|---|---|
| **ENTP** (this skill) | task / plan / decision | pre-commitment | divergent | advisory — recommends, never blocks |
| **adversarial-reviewer** | the winning diff | post-code | convergent | fail-closed gate |
| **judge** | competing variants | post-build | comparative | ranks, picks the winner |

ENTP being divergent + advisory + pre-commitment is exactly why it must NOT be used
as a code gate or as a variant judge — that would collapse the model.

## Orchestrator pre-flight mode (Step 1.5 invocation pattern)

The orchestrator invokes this same skill as a scoped pre-flight critic.

- **Inputs handed in:** task text + minimal repo context + Step 1 classification/confidence.
- **Withheld:** NO code, NO diffs, NO run logs.
- **Modes run:** `analyze + challenge + decide` on FRAMING / SCOPE only.
- **Output:** the CORE set above.
- **interactive** → reframings surfaced; the human picks `proceed | reframe | abort`.
- **unattended** → advisory only: verdict recorded in the run-log `entp_preflight`
  field; the run PROCEEDS regardless. ENTP NEVER blocks and gains no abort power.
  If ENTP errors → record `entp_preflight: skipped (error)` and PROCEED — the
  OPPOSITE of the adversarial gate's fail-closed behavior, by design.
```

- [ ] **Step 2: Verify**

Run: `grep -E "as-framed \| descope \| expand \| split \| don't-build|endorse \| revise \| reject|entp_preflight|3-role model|no meaningful reframing — proceed" ~/.claude/skills/entp/references/output-contract.md`
Expected: ≥5 matches.

- [ ] **Step 3: No laboratoire commit** (outside the repo — same as Task 1 Step 4).

---

### Task 3: Orchestrator SKILL.md — Step 1.5, flowchart node, version bump

**Files:** Modify `.claude/plugins/orchestrator/skills/orchestrator/SKILL.md`; modify `.claude/plugins/orchestrator/.claude-plugin/plugin.json`.

**Interfaces:** Consumes the global `entp` skill (Task 1) by name and its pre-flight contract (Task 2). Produces Step 1.5, the gate, the scoped invocation, and the mode contract that run-log-format.md (Task 6) and execution-modes.md (Task 7) reference via the `entp_preflight` label.

- [ ] **Step 1: Bump the SKILL.md frontmatter version.** Replace this line:

```yaml
version: "2.0.1"
```

with:

```yaml
version: "2.1.0"
```

- [ ] **Step 2: Add the Step 1.5 node to the flowchart.** In the fenced flowchart block, replace this exact segment:

```
[Out-of-scope?] --YES--> route to AGENTS.md handler / inline (do not compete)
   |
   v
[Step 2: DEPTH] simple->Depth-1 | complex->Depth-2
```

with:

```
[Out-of-scope?] --YES--> route to AGENTS.md handler / inline (do not compete)
   |
   v
[Step 1.5: ENTP PRE-FLIGHT? gate: complex | conf!=high | --challenge | strategy task]
   |   interactive: surface reframings -> human picks proceed|reframe|abort
   |   unattended:  advisory only -> entp_preflight run-log; NEVER blocks; error->log+proceed
   v
[Step 2: DEPTH] simple->Depth-1 | complex->Depth-2
```

- [ ] **Step 3: Insert the Step 1.5 section.** Between the end of `## Step 1 — Classification` (its closing `---` separator) and the `## Step 2 — Depth selection` heading, insert this block (followed by its own `---`):

```markdown
## Step 1.5 — ENTP pre-flight critic (gated; advisory)

Optionally invoke the global `entp` skill in **pre-flight mode** to stress-test the
task's FRAMING / RISK / SCOPE before spending competition budget. ENTP is advisory:
it can recommend `don't-build`, but it NEVER blocks, aborts, merges, or downgrades a
gate (preserves G2). Runs after Step 1 (so it has real complexity + confidence) and
after the out-of-scope check, before Step 2 depth.

**Gate — run ENTP only when it can find leverage. Run if ANY:**
- `complexity = complex`, OR
- `confidence != high`, OR
- the (mode-stripped) args contain `--challenge`, OR
- the task is strategic in nature (planning / architecture / tradeoff-evaluation / "should we…?").

Otherwise (simple AND high-confidence AND mechanical) → SKIP; record
`entp_preflight: skipped (gate)` in the run-log.

**Pre-flight mode (the named scoped invocation):** invoke the `entp` skill — or
dispatch `Agent(subagent_type=<host type>, prompt=<the entp pre-flight contract>)` —
handing it ONLY:
- the verbatim task text,
- minimal repo context (the smallest CLAUDE.md constraints relevant to framing),
- the Step 1 classification + confidence.

Instruct it explicitly: **pre-flight mode — no code, no diffs, no run logs; advisory
only; run `analyze + challenge + decide` on FRAMING / SCOPE only.** Withholding code
is what keeps the 3-role boundary clean (ENTP ≠ adversarial-reviewer ≠ judge). Take
ENTP's CORE structured set (reframings · risky assumptions · scope verdict · optional
better target).

**Mode contract (preserves G2 — ENTP NEVER blocks):**
- **interactive** → surface ENTP's reframings + verdict; the human picks
  `proceed | reframe | abort`. `reframe` = restate the task and re-run from Step 1;
  `abort` = clean stop (Steps 6–7).
- **unattended** → **advisory only**: write the verdict to the run-log
  `entp_preflight` field and PROCEED regardless. ENTP adds no "ask-human" branch and
  gains no abort power. If ENTP errors → record `entp_preflight: skipped (error)` and
  PROCEED — the OPPOSITE of the adversarial pass's fail-closed behavior (by design;
  pre-commitment advice is not a safety gate). ENTP is NOT an unresolved-failure
  trigger (see `references/execution-modes.md`).
```

- [ ] **Step 4: Bump the plugin manifest version (same commit).** In `.claude/plugins/orchestrator/.claude-plugin/plugin.json`, replace:

```json
  "version": "2.0.1",
```

with:

```json
  "version": "2.1.0",
```

- [ ] **Step 5: Verify**

Run: `grep -E 'version: "2.1.0"|Step 1.5 — ENTP pre-flight|entp_preflight: skipped \(gate\)|--challenge|advisory only; run .analyze \+ challenge \+ decide|NEVER blocks' .claude/plugins/orchestrator/skills/orchestrator/SKILL.md`
Expected: ≥5 matches.
Run: `grep -E '"version": "2.1.0"' .claude/plugins/orchestrator/.claude-plugin/plugin.json`
Expected: 1 match.
Run: `grep -nE '"version": "2.0.1"' .claude/plugins/orchestrator/skills/orchestrator/SKILL.md .claude/plugins/orchestrator/.claude-plugin/plugin.json`
Expected: NO matches (no stale version survives in either file).
Run: `grep -n "Step 1.5: ENTP PRE-FLIGHT" .claude/plugins/orchestrator/skills/orchestrator/SKILL.md`
Expected: 1 match (the flowchart node is present).

- [ ] **Step 6: Commit**

```bash
git add .claude/plugins/orchestrator/skills/orchestrator/SKILL.md .claude/plugins/orchestrator/.claude-plugin/plugin.json
git commit -m "feat(orchestrator): Step 1.5 ENTP pre-flight critic (gated, advisory); bump to 2.1.0"
```

---

### Task 4: Orchestrator specialist-roster — ENTP row + never-a-lead rule

**Files:** Modify `.claude/plugins/orchestrator/skills/orchestrator/references/specialist-roster.md`

**Interfaces:** Consumes nothing. Produces the roster's documentation of ENTP's role: a pre-flight critic with anti-triggers vs `senior-architect` and `tech-stack-evaluator`, and an explicit "never a variant lead" rule (the inverse mirror of `adversarial-reviewer`'s post-only rule).

- [ ] **Step 1: Add the ENTP row to the main roster table.** After the `apple-hig-expert:apple-hig-expert` row (the last data row before the `>` "Rimossi dal roster" note), insert this row:

```markdown
| `entp` *(global skill)* | **Pre-flight strategic critic (orchestrator Step 1.5)**: stress-test task FRAMING / risky assumptions / SCOPE verdict before competition spend; standalone idea/plan/spec/decision challenge | Dentro una competition come variant lead (non costruisce nulla); "come si costruisce" (→ `senior-architect`); "quale tech/dipendenza" (→ `tech-stack-evaluator`); task semplici, high-confidence, meccanici | *(pre-flight only — non si accoppia a nessun lead in-competition)* | "stress-test / sfida questo piano / è il framing giusto? / dovremmo costruirlo?" |
```

- [ ] **Step 2: Add ENTP to "Chi non usare come variant lead".** In that bulleted section, after the `adversarial-reviewer` bullet, add:

```markdown
- `entp` — **mai dentro una competition.** È il critico **pre-flight** (Step 1.5): divergente e *advisory*, stressa il *framing/scope* del task PRIMA della spesa e non produce codice. È lo specchio inverso dell'`adversarial-reviewer` (che gira solo POST-competition sul winner). ENTP non può bloccare/abortire/mergere/declassare un gate — raccomanda soltanto.
```

- [ ] **Step 3: Verify**

Run: `grep -E '\| `entp`|mai dentro una competition|specchio inverso' .claude/plugins/orchestrator/skills/orchestrator/references/specialist-roster.md`
Expected: ≥2 matches (the row + the never-a-lead rule).

- [ ] **Step 4: Commit**

```bash
git add .claude/plugins/orchestrator/skills/orchestrator/references/specialist-roster.md
git commit -m "docs(orchestrator): roster — add entp pre-flight critic row + never-a-variant-lead rule"
```

---

### Task 5: Orchestrator run-log-format — `entp_preflight` field

**Files:** Modify `.claude/plugins/orchestrator/skills/orchestrator/references/run-log-format.md`

**Interfaces:** Consumes the `entp_preflight` label + verdict vocabulary (Tasks 2–3). Produces the run-record section the orchestrator Step 6 fills and Step 1.5 (unattended) writes to.

- [ ] **Step 1: Insert the ENTP pre-flight section into the record template.** The template is indented 4 spaces (a code block). Between the `## Classification` block and the `## Objective gate` block — i.e. replace this exact segment:

```
    - variant leads: <lead-A>, <lead-B>, <lead-C>

    ## Objective gate (pnpm check per variant)
```

with:

```
    - variant leads: <lead-A>, <lead-B>, <lead-C>

    ## ENTP pre-flight (Step 1.5 — advisory)
    - entp_preflight: <ran | skipped (gate: simple+high-confidence) | skipped (error)>
    - verdict: <as-framed | descope | expand | split | don't-build> — <one-line reason>
    - reframings surfaced: <n>  (interactive: human chose proceed|reframe|abort)

    ## Objective gate (pnpm check per variant)
```

- [ ] **Step 2: Verify**

Run: `grep -E "ENTP pre-flight \(Step 1.5|entp_preflight: <ran|skipped \(gate|skipped \(error\)|reframings surfaced" .claude/plugins/orchestrator/skills/orchestrator/references/run-log-format.md`
Expected: ≥3 matches.

- [ ] **Step 3: Commit**

```bash
git add .claude/plugins/orchestrator/skills/orchestrator/references/run-log-format.md
git commit -m "feat(orchestrator): run-log — add entp_preflight field (advisory pre-flight record)"
```

---

### Task 6: Orchestrator execution-modes — ENTP advisory / not-a-failure-trigger note

**Files:** Modify `.claude/plugins/orchestrator/skills/orchestrator/references/execution-modes.md`

**Interfaces:** Consumes the unattended-failure model + the `entp_preflight` label (Tasks 3, 5). Produces the explicit statement that ENTP is advisory and NOT in the unresolved-failure trigger list — closing the loop on G2.

- [ ] **Step 1: Insert the advisory note after the unresolved-failure triggers.** Replace this exact segment:

```
(Trigger 2 is the one exception: ambiguous depth is NOT an abort — it resolves to
Depth-1 + adversarial in unattended.)

## Write ceiling detail
```

with:

```
(Trigger 2 is the one exception: ambiguous depth is NOT an abort — it resolves to
Depth-1 + adversarial in unattended.)

## ENTP pre-flight is ADVISORY (NOT a failure trigger)

Step 1.5's ENTP critic (the global `entp` skill) is deliberately ABSENT from the
unresolved-failure list above. It never blocks, never aborts, never gains a write
ceiling. In unattended its verdict is recorded in the run-log `entp_preflight` field
and the run PROCEEDS regardless; if ENTP errors, record `entp_preflight: skipped
(error)` and PROCEED — the OPPOSITE of the adversarial gate's fail-closed behavior,
by design (pre-commitment advice is not a safety gate). The only human-facing branch
ENTP can open is in **interactive** mode (surface reframings → human picks
proceed | reframe | abort); in unattended that branch collapses to "proceed".

## Write ceiling detail
```

- [ ] **Step 2: Verify**

Run: `grep -E "ENTP pre-flight is ADVISORY|never gains a write ceiling|PROCEED — the OPPOSITE|collapses to .proceed" .claude/plugins/orchestrator/skills/orchestrator/references/execution-modes.md`
Expected: ≥3 matches.

- [ ] **Step 3: Commit**

```bash
git add .claude/plugins/orchestrator/skills/orchestrator/references/execution-modes.md
git commit -m "docs(orchestrator): execution-modes — ENTP pre-flight is advisory, not a failure trigger"
```

---

### Task 7: Verification — grep gates (spec §8)

**Goal:** prove the global skill and the orchestrator wiring satisfy the spec §8 grep gates in one pass. No edits; pure assertions.

**Files:** none.

- [ ] **Step 1: Global skill gates**

Run:
```bash
grep -E "^name: entp" ~/.claude/skills/entp/SKILL.md && \
grep -cE "^- analyze|^- challenge|^- counter|^- research|^- decide" ~/.claude/skills/entp/SKILL.md && \
grep -E "Reframings|Risky assumptions|Scope/position verdict|Better target" ~/.claude/skills/entp/SKILL.md && \
grep -E "No fake contrarianism|No authority escalation|NO code, NO diffs|Always close with a position" ~/.claude/skills/entp/SKILL.md
```
Expected: `name: entp` matches; the mode count is `5`; the four core fields print; the four guardrail phrases print.

- [ ] **Step 2: Orchestrator wiring gates**

Run:
```bash
grep -n "Step 1.5 — ENTP pre-flight" .claude/plugins/orchestrator/skills/orchestrator/SKILL.md && \
grep -n "entp_preflight" .claude/plugins/orchestrator/skills/orchestrator/references/run-log-format.md && \
grep -n "ENTP pre-flight is ADVISORY" .claude/plugins/orchestrator/skills/orchestrator/references/execution-modes.md && \
grep -n '`entp`' .claude/plugins/orchestrator/skills/orchestrator/references/specialist-roster.md && \
grep -n '"version": "2.1.0"' .claude/plugins/orchestrator/.claude-plugin/plugin.json
```
Expected: one match per file (Step 1.5 present, `entp_preflight` present, advisory note present, roster row present, version bumped).

- [ ] **Step 3: Negative gate — no stale version, no two-ENTP drift**

Run: `grep -rn "entp-strategist" .claude/plugins/orchestrator/ ~/.claude/skills/entp/`
Expected: NO matches (the design rejects a second artifact; only the one `entp` skill exists).

---

### Task 8: Rehearsal — ≥3 standalone inputs + the orchestrator integration check (spec §8)

**Goal:** confirm ENTP behaves correctly across the three diagnostic inputs and that the orchestrator Step 1.5 gate/contract fires as specified. This is a behavioral rehearsal, not a code test — record the outcomes in the plan's execution notes.

**Files:** none (rehearsal only).

- [ ] **Step 1: Rich / ambiguous input → real reframings.**

Invoke the `entp` skill standalone on: *"Add a global dark-mode toggle across all three apps in laboratoire."*
Expected: ENTP produces ≥1 genuine reframing (e.g. "tokens drift across the three Tailwind setups — is the real target a shared token layer, not a toggle?"), ≥1 risky assumption, and a verdict from `as-framed | descope | expand | split | don't-build` with a reason. It does NOT dive into implementation code.

- [ ] **Step 2: Trivial / sound input → no manufactured contrarianism.**

Invoke `entp` on: *"Fix the typo 'Esperienza' → 'Esperienze' in the docs nav label."*
Expected: ENTP outputs exactly `no meaningful reframing — proceed` and stops. It does NOT invent objections.

- [ ] **Step 3: Freshness-dependent technical input → research before stance.**

Invoke `entp` on: *"Should we adopt React 19's `use()` hook for data fetching in apps/docs instead of RTK Query?"*
Expected: ENTP triggers `research` (WebSearch / firecrawl) before taking a strong position, and tags claims as fact / inference / opinion rather than asserting from memory.

- [ ] **Step 4: Orchestrator integration — gated interactive pre-flight.**

Invoke: `orchestrator: mode=interactive --challenge — refactor the pricing promo-code logic in apps/web-next/lib/pricing.ts`
Expected: Step 1 classifies (complex, touches pricing) → Step 1.5 gate fires (`--challenge` AND complex) → `entp` runs in pre-flight mode on FRAMING only (no code shown to it) → reframings surfaced → orchestrator asks the human `proceed | reframe | abort` before Step 2 depth.

- [ ] **Step 5: Orchestrator integration — gate SKIP + unattended advisory.**

Invoke: `orchestrator: mode=unattended — add a one-line JSDoc comment above roundCurrency in apps/web-next/lib/pricing.ts`
Expected: Step 1 (simple, high-confidence, mechanical) → Step 1.5 gate does NOT fire → run-log shows `entp_preflight: skipped (gate)`. Separately, on a *complex* unattended task, confirm ENTP runs, its verdict lands in the run-log `entp_preflight` field, and the run PROCEEDS without blocking even if ENTP recommends `don't-build`.

- [ ] **Step 6: Record rehearsal outcomes** in this plan's execution notes (pass/fail per step). No commit (no files changed).

---

## Self-Review

**1. Spec coverage** (against `2026-06-20-entp-skill-design.md`):

| Spec section | Requirement | Task |
|---|---|---|
| §1 | One broad `entp` skill, global, no `entp-strategist` artifact | Task 1 + Global Constraints + Task 7 (negative gate) |
| §1 | Disciplined-debater voice, always rebuilds | Task 1 (`<role>`, `<instructions>`) |
| §2 | Five modes (analyze/challenge/counter/research/decide) | Task 1 (`<modes>`) |
| §3 | Adaptive-by-stakes output: core 4 fields + pre-mortem + trivial-stop | Task 1 (`<output_format>`) + Task 2 |
| §4 | XML-section body | Task 1 |
| §5 | Guardrails: no fake contrarianism / clarify-first / research-first / always-close / no authority / no deep-dive / minimal context | Task 1 (`<boundaries>`) |
| §5 | 3-role model distinct | Task 1 (`<boundaries>`) + Task 2 (table) |
| §6 | Step 1.5 placement, gate, named pre-flight mode, mode contract (interactive/unattended) | Task 3 |
| §6 | `entp_preflight` run-log label | Task 3 + Task 5 |
| §6 | unattended advisory, never blocks, error→log+proceed (anti-fail-closed) | Task 3 + Task 6 |
| §7 | SKILL.md + optional references/output-contract.md | Tasks 1–2 |
| §7 | Orchestrator SKILL.md (Step 1.5 + flowchart + version) | Task 3 |
| §7 | specialist-roster.md ENTP row + never-a-lead | Task 4 |
| §7 | run-log-format.md `entp_preflight` | Task 5 |
| §7 | execution-modes.md advisory/not-a-trigger | Task 6 |
| §8 | grep gates | Task 7 |
| §8 | rehearsal ≥3 inputs + orchestrator integration check | Task 8 |

No spec requirement is unmapped. §10 out-of-scope items (persona theatrics, ENTP-as-judge/code-gate, P2 roster gaps, CAPABILITIES doc-rot) are correctly absent.

**2. Placeholder scan:** the only `<...>` tokens are inside the run-log template (deliberate fill-in fields) and ENTP's own output schema. No "TBD / handle edge cases / write tests for the above".

**3. Name consistency:** `entp` (skill name), `entp_preflight` (run-log label), the verdict vocabulary `as-framed | descope | expand | split | don't-build`, the gate condition (`complexity=complex OR confidence≠high OR --challenge OR strategy task`), and `2.1.0` (both version fields) are used identically across Tasks 1–8. The two-location split (global skill not committed in laboratoire; orchestrator edits committed on `feat/entp-skill`) is consistent in every task's commit step.

## Open risks (carry into review)

1. **Invocation mechanism in unattended.** Step 1.5 says "invoke `entp` or dispatch an Agent carrying its contract." A `Skill(entp)` call loads into the main loop; an `Agent` call isolates it. Either satisfies the spec's "no code" boundary because the *orchestrator chooses what to pass*, not the skill mechanism. Confirm the preferred mechanism during the first real unattended run (Task 8 Step 5).
2. **Global skill is unversioned outside laboratoire.** `~/.claude/skills/entp/` is not in this repo's history. If the host's `~/.claude` is not a tracked dotfiles repo, the skill has no backup/version trail — flag to Hassan whether to vendor a copy or track `~/.claude`.
3. **`--challenge` parsing.** Step 0 currently strips only the *mode* keyword. Step 1.5 inspects the mode-stripped args for `--challenge`; if a future Step 0 change strips unknown flags, that signal could be lost. Keep `--challenge` recognized at Step 1.5.

## Execution Handoff

(Filled in after user review — see the two options below.)
