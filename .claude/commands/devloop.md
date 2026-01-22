---
description: Start automated development loop with two-phase iterations (implement + review)
---

## User Input

```text
$ARGUMENTS
```

## Outline

This command orchestrates an automated development workflow with **THREE PHASES** for clean context management:

- **Phase "impl" (Implement)**: `/speckit.implement` → `/commit`
- **Phase "review" (Review)**: `/review` → Apply fixes → `/commit` → `gitworktree-complete.sh --continue` → Check tasks
- **Phase "error" (Error Resolution)**: Exclusive phase when errors occur - resolves errors before continuing

### Arguments

| Argument | Default | Description |
|----------|---------|-------------|
| `--max-impl-cycles N` | 25 | Maximum implementation phases to execute |
| `--max-iterations N` | `maxImplCycles * 3` | Ralph-loop API calls (auto-derived if not specified) |

**Cycle counting rules:**
- Only the **impl phase** counts as a cycle
- Error resolution phases do NOT count as cycles
- Review phase does NOT count as a cycle (it's part of the impl cycle)

---

## Step 1: Parse Arguments

Parse the following from user input:

- `maxImplCycles`: Extract number after `--max-impl-cycles` (default: 25)
- `maxIterations`: Extract number after `--max-iterations` (default: `maxImplCycles * 3`)

**Edge cases:**
- `--max-impl-cycles 0`: No cycle limit, only iteration limit applies
- Only `--max-iterations` specified: Use default `maxImplCycles=25` with explicit `maxIterations`

## Step 2: Validate Prerequisites

Run the following command to check if tasks.md exists:

```bash
.specify/scripts/bash/check-prerequisites.sh --json --require-tasks --include-tasks
```

Parse the JSON output:
- Extract `FEATURE_DIR` (absolute path to feature directory)
- Verify `tasks.md` exists in the feature directory

**If tasks.md does not exist**: Output an error message and STOP. Suggest running `/speckit.tasks` first.

## Step 3: Create or Update State File

Check if `.claude/devloop-state.json` already exists:

**If exists and has `lastError != null`**:
- Keep existing state values (cycle, featureDir, startedAt)
- Set `phase: "error"` (force error resolution)
- Say: "Resuming with error resolution..."

**If exists and `lastError == null`**:
- Keep existing state (resume from current phase)
- Say: "Resuming from phase: <phase>, cycle: <cycle>..."

**If NOT exists**:
Create `.claude/devloop-state.json`:

```json
{
  "phase": "impl",
  "cycle": 1,
  "maxImplCycles": <maxImplCycles>,
  "featureDir": "<FEATURE_DIR>",
  "startedAt": "<ISO 8601 timestamp>",
  "lastError": null
}
```

### State File Schema

| Field | Type | Description |
|-------|------|-------------|
| `phase` | `"impl"` \| `"review"` \| `"error"` | Current phase |
| `cycle` | number | Current cycle count |
| `maxImplCycles` | number | Maximum implementation phases allowed (0 = unlimited) |
| `featureDir` | string | Absolute path to feature directory |
| `startedAt` | string | ISO 8601 timestamp |
| `lastError` | object \| null | Error info from previous iteration |

### lastError Structure (when not null)

```json
{
  "lastError": {
    "type": "test_failure" | "lint_failure" | "merge_conflict" | "push_failure",
    "message": "Description of what failed",
    "failedAt": "<ISO 8601 timestamp>",
    "retryCount": 1
  }
}
```

## Step 4: Start Ralph Loop

Run the following script to start the ralph-loop with the orchestration prompt:

```bash
scripts/start-devloop-loop.sh <maxImplCycles> <maxIterations>
```

This script:
1. Reads the orchestration prompt from `.claude/devloop-orchestration.md`
2. Creates `.claude/ralph-loop.local.md` with proper YAML frontmatter and the prompt content
3. Sets the completion promise to `ALL_TASKS_COMPLETED`
4. Outputs the orchestration prompt between markers for immediate execution

**Note**: The orchestration prompt is stored in `.claude/devloop-orchestration.md` to avoid markdown parsing issues with shell argument passing.

## Step 5: Execute First Iteration (CRITICAL)

**DO NOT** end your response after Step 4. The script outputs the orchestration prompt - you MUST execute it immediately.

1. Read the prompt output between `=== BEGIN ORCHESTRATION PROMPT ===` and `=== EXECUTE THE PROMPT ABOVE ===`
2. Follow the orchestration prompt instructions (Phase Routing, etc.)
3. When the phase completes, the ralph-loop stop hook will handle continuation

**IMPORTANT**: Your response must continue with the orchestration prompt execution. Do not stop here.
