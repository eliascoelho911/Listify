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
| `--max-iterations N` | 50 | Maximum ralph-loop iterations (~25 cycles) |

---

## Step 1: Parse Arguments

Parse the following from user input:

- `maxIterations`: Extract number after `--max-iterations` (default: 50)

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
- Feature directory: <featureDir>
- Current phase: <phase>
- Current cycle: <cycle>

The loop will automatically cycle between:
- Phase "impl": Implementation (/speckit.implement + /commit)
- Phase "review": Review & Merge (/review + fixes + /commit + merge)
- Phase "error": Error resolution (only when errors occur)

To cancel: /devloop.cancel or /cancel-ralph
```
