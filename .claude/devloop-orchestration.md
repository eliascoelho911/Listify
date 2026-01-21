# DevLoop - Phase-Aware Iteration

You are in an automated development loop with THREE PHASES.
Read `.claude/devloop-state.json` to determine current phase and configuration.

## Phase Routing

Based on the state file, route to the appropriate phase:

| Condition | Route To |
|-----------|----------|
| `lastError != null` | **Phase "error"** - Error resolution takes priority |
| `phase == "impl"` AND `lastError == null` | **Phase "impl"** - Implementation |
| `phase == "review"` | **Phase "review"** - Review & Merge |
| `phase == "error"` | **Phase "error"** - Error resolution |

**IMPORTANT**: If `lastError != null`, ALWAYS route to "error" phase regardless of what `phase` field says.

---

## IF PHASE = "error" (ERROR RESOLUTION)

This phase is **exclusive** for resolving errors. It only executes when `lastError != null`.

1. Read `lastError` from state file
2. Check `retryCount`:
   - **If `retryCount >= 3`**: Say "Error persisted after 3 retries. Manual intervention required." and end session

3. Execute recovery based on `lastError.type`:

| Error Type | Recovery Action |
|------------|-----------------|
| `test_failure` | 1. Run `npm test` to see current failures<br>2. Analyze and fix the failing tests<br>3. Run `npm test` again to verify fixes |
| `lint_failure` | 1. Run `npm run lint` to see current issues<br>2. Fix all lint errors and warnings<br>3. Run `npm run lint` again to verify |
| `merge_conflict` | 1. Say: "Merge conflict detected. Manual resolution required."<br>2. Show instructions: `cd <worktree> && git status`<br>3. Say: "After resolving, run `/devloop` to resume."<br>4. **DO NOT** attempt auto-resolution, end session |
| `push_failure` | 1. Check network/auth: `git remote -v && git fetch origin`<br>2. If accessible: retry push with `git push -u origin <branch>` |

4. **If recovery succeeded**:
   - Execute `/commit` to commit the fixes
   - Update state file:
     - Set `lastError: null`
     - Set `phase: "review"` (transition to review phase)
   - Say: "Error resolved. Transitioning to review phase..."

5. **If recovery failed**:
   - Increment `retryCount` in `lastError`
   - Update `failedAt` timestamp
   - End session (next iteration will retry)

---

## IF PHASE = "impl" (IMPLEMENT)

**GUARD**: This phase should only execute when `lastError == null`. If you're here with an error, update state to `phase: "error"` and end session.

1. Read `featureDir` from state file
2. Execute `/speckit.implement` - **NOTE**: This processes only ONE task phase per execution (e.g., Setup, Tests, Core, Integration, or Polish)
3. After implementation completes, execute `/commit` to commit the changes
4. Update state file: Set `"phase": "review"`
5. Say: "Implementation complete. Transitioning to review phase..."

**IMPORTANT**: DO NOT output the completion promise. The loop will restart for review phase.

---

## IF PHASE = "review" (REVIEW & MERGE)

1. Execute `/review` comparing vs `origin/main` - review the changes and identify issues
2. Apply ALL items marked as **Critical** or **Must Fix** from the review
3. If any fixes were applied: Execute `/commit` to commit the fixes
4. Run the merge script:
   ```bash
   scripts/gitworktree-complete.sh --continue
   ```

   **If script fails**:
   - Detect the error type (test_failure, lint_failure, merge_conflict, push_failure)
   - Write error to `lastError` in state file (see Error Handling section)
   - Set `phase: "error"` (next iteration handles error)
   - End session

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
     - Set `"phase": "impl"`
     - Increment `"cycle"` by 1
     - Set `"lastError": null` (clear any previous errors since we succeeded)
   - Say: "Cycle N complete. X tasks remaining in next phases. Starting new cycle..."
   - **DO NOT** output the completion promise - loop will continue to process next task phase

---

## Error Handling

When an error occurs during review phase, **update the state file** with error info before ending the session:

### On Test Failure (gitworktree-complete.sh exit)
```json
{
  "phase": "error",
  "lastError": {
    "type": "test_failure",
    "message": "npm test failed - see output for details",
    "failedAt": "<current ISO 8601 timestamp>",
    "retryCount": 1
  }
}
```
Then end session. Next iteration will execute error phase.

### On Lint Failure (gitworktree-complete.sh exit)
```json
{
  "phase": "error",
  "lastError": {
    "type": "lint_failure",
    "message": "npm run lint failed - zero warnings policy violated",
    "failedAt": "<current ISO 8601 timestamp>",
    "retryCount": 1
  }
}
```
Then end session. Next iteration will execute error phase.

### On Merge Conflict
```json
{
  "phase": "error",
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
  "phase": "error",
  "lastError": {
    "type": "push_failure",
    "message": "git push failed - check network/permissions",
    "failedAt": "<current ISO 8601 timestamp>",
    "retryCount": 1
  }
}
```
Then end session. Next iteration will execute error phase.

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
Create fresh state with `phase: "impl"`, `cycle: 1`, `lastError: null`
