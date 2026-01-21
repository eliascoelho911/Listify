---
description: Start automated development loop with two-phase iterations (implement + review)
---

## User Input

```text
$ARGUMENTS
```

## Outline

This command orchestrates an automated development workflow with **TWO-PHASE iterations** for clean context management:

- **Phase A (Implement)**: `/speckit.implement` → `/commit`
- **Phase B (Review)**: `/review` → Apply fixes → `/commit` → `gitworktree-complete.sh --continue` → Check tasks

### Arguments

| Argument | Default | Description |
|----------|---------|-------------|
| `--max-iterations N` | 50 | Maximum ralph-loop iterations (~25 cycles) |
| `--phases N` | 1 | Task phases per implement cycle (passed to speckit.implement) |

---

## Step 1: Parse Arguments

Parse the following from user input:

- `maxIterations`: Extract number after `--max-iterations` (default: 50)
- `phasesPerCycle`: Extract number after `--phases` (default: 1)

## Step 2: Validate Prerequisites

Run the following command to check if tasks.md exists:

```bash
.specify/scripts/bash/check-prerequisites.sh --json --require-tasks --include-tasks
```

Parse the JSON output:
- Extract `FEATURE_DIR` (absolute path to feature directory)
- Verify `tasks.md` exists in the feature directory

**If tasks.md does not exist**: Output an error message and STOP. Suggest running `/speckit.tasks` first.

## Step 3: Create State File

Create `.claude/devloop-state.json` with the following structure:

```json
{
  "phase": "A",
  "cycle": 1,
  "phasesPerCycle": <phasesPerCycle>,
  "featureDir": "<FEATURE_DIR>",
  "startedAt": "<ISO 8601 timestamp>",
  "lastError": null
}
```

### State File Schema

| Field | Type | Description |
|-------|------|-------------|
| `phase` | `"A"` \| `"B"` | Current phase |
| `cycle` | number | Current cycle count |
| `phasesPerCycle` | number | Task phases per implement cycle |
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
scripts/start-devloop-loop.sh <maxIterations>
```

This script:
1. Reads the orchestration prompt from `.claude/devloop-orchestration.md`
2. Creates `.claude/ralph-loop.local.md` with proper YAML frontmatter and the prompt content
3. Sets the completion promise to `ALL_TASKS_COMPLETED`

**Note**: The orchestration prompt is stored in `.claude/devloop-orchestration.md` to avoid markdown parsing issues with shell argument passing.

## Step 5: Confirm Loop Started

Output a confirmation message:

```
DevLoop started with:
- Max iterations: <maxIterations>
- Phases per cycle: <phasesPerCycle>
- Feature directory: <featureDir>

The loop will automatically cycle between:
- Phase A: Implementation (/speckit.implement + /commit)
- Phase B: Review & Merge (/review + fixes + /commit + merge)

To cancel: /devloop.cancel or /cancel-ralph
```
