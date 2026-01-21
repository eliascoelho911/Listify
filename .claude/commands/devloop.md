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

Invoke `/ralph-loop:ralph-loop` with the following orchestration prompt:

---

# DevLoop - Phase-Aware Iteration

You are in an automated development loop with TWO PHASES per cycle.
Read `.claude/devloop-state.json` to determine current phase and configuration.

## FIRST: Check for Previous Errors

Before proceeding with the current phase, check if `lastError` exists in the state file.

**If `lastError` is NOT null**, handle the error recovery FIRST:

| Error Type | Recovery Action |
|------------|-----------------|
| `test_failure` | 1. Run `npm test` to see current failures<br>2. Analyze and fix the failing tests<br>3. Run `npm test` again to verify fixes<br>4. If fixed: clear `lastError` (set to null), execute `/commit`<br>5. If still failing: increment `retryCount`, update `failedAt`, end session |
| `lint_failure` | 1. Run `npm run lint` to see current issues<br>2. Fix all lint errors and warnings<br>3. Run `npm run lint` again to verify<br>4. If fixed: clear `lastError` (set to null), execute `/commit`<br>5. If still failing: increment `retryCount`, update `failedAt`, end session |
| `merge_conflict` | 1. Say: "Merge conflict detected. Manual resolution required."<br>2. Show instructions: `cd <worktree> && git status`<br>3. Say: "After resolving, run `/devloop` to resume."<br>4. **DO NOT** attempt auto-resolution, end session |
| `push_failure` | 1. Check network/auth: `git remote -v && git fetch origin`<br>2. If accessible: retry push with `git push -u origin <branch>`<br>3. If fixed: clear `lastError` (set to null)<br>4. If still failing: increment `retryCount`, update `failedAt`, end session |

**If `retryCount` >= 3**: Say "Error persisted after 3 retries. Manual intervention required." and end session.

**After successful error recovery**: Continue with the current phase as normal.

---

## IF PHASE = "A" (IMPLEMENT)

1. Read `phasesPerCycle` and `featureDir` from state file
2. Execute `/speckit.implement` - **NOTE**: This processes only ONE task phase per execution (e.g., Setup, Tests, Core, Integration, or Polish)
3. After implementation completes, execute `/commit` to commit the changes
4. Update state file: Set `"phase": "B"`
5. Say: "Phase A complete. Transitioning to Phase B..."

**IMPORTANT**: DO NOT output the completion promise. The loop will restart for Phase B.

## IF PHASE = "B" (REVIEW & MERGE)

1. Execute `/review` comparing vs `origin/main` - review the changes and identify issues
2. Apply ALL items marked as **Critical** or **Must Fix** from the review
3. If any fixes were applied: Execute `/commit` to commit the fixes
4. Run the merge script:
   ```bash
   scripts/gitworktree-complete.sh --continue
   ```
   **If script fails**: Detect the error type (test_failure, lint_failure, merge_conflict, push_failure), write to `lastError` in state file (see Error Handling section), then end session.

5. After merge completes successfully, check if there are **remaining task phases** in `tasks.md`:
   - Read the tasks.md file from `featureDir` in state
   - Count incomplete tasks: lines matching `- [ ]` (with space inside brackets)
   - Count completed tasks: lines matching `- [X]` or `- [x]`
   - **Remember**: Each cycle completes ONE task phase, so remaining `- [ ]` items indicate more phases to process

6. **DECISION POINT**:

   **If ALL task phases are completed** (0 incomplete tasks in tasks.md):
   - Delete the state file: `.claude/devloop-state.json`
   - Output the completion promise:
     ```
     <promise>ALL_TASKS_COMPLETED</promise>
     ```

   **If task phases remain** (incomplete count > 0):
   - Update state file:
     - Set `"phase": "A"`
     - Increment `"cycle"` by 1
     - Set `"lastError": null` (clear any previous errors since we succeeded)
   - Say: "Cycle N complete. X tasks remaining in next phases. Starting new cycle..."
   - **DO NOT** output the completion promise - loop will continue to process next task phase

## Error Handling

When an error occurs, **update the state file** with error info before ending the session:

### On Test Failure (gitworktree-complete.sh exit)
```json
{
  "lastError": {
    "type": "test_failure",
    "message": "npm test failed - see output for details",
    "failedAt": "<current ISO 8601 timestamp>",
    "retryCount": 1
  }
}
```
Then end session. Next iteration will attempt recovery.

### On Lint Failure (gitworktree-complete.sh exit)
```json
{
  "lastError": {
    "type": "lint_failure",
    "message": "npm run lint failed - zero warnings policy violated",
    "failedAt": "<current ISO 8601 timestamp>",
    "retryCount": 1
  }
}
```
Then end session. Next iteration will attempt recovery.

### On Merge Conflict
```json
{
  "lastError": {
    "type": "merge_conflict",
    "message": "Merge conflict in <branch> - manual resolution required",
    "failedAt": "<current ISO 8601 timestamp>",
    "retryCount": 1
  }
}
```
Then end session. **Cannot auto-recover** - requires manual resolution.

### On Push Failure
```json
{
  "lastError": {
    "type": "push_failure",
    "message": "git push failed - check network/permissions",
    "failedAt": "<current ISO 8601 timestamp>",
    "retryCount": 1
  }
}
```
Then end session. Next iteration will retry push.

### On Retry (error already existed)
If `lastError` already exists, **increment** `retryCount` instead of setting to 1:
```json
{
  "lastError": {
    ...existing fields...,
    "retryCount": <previous retryCount + 1>
  }
}
```

### State File Missing
Create fresh state with `phase: "A"`, `cycle: 1`, `lastError: null`

---

Set the completion promise to: `ALL_TASKS_COMPLETED`
Set max iterations to: `<maxIterations>`

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
