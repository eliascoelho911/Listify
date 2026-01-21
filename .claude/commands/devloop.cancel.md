---
description: Cancel active DevLoop and clean up state files
---

## Outline

This command cancels any active DevLoop session and cleans up all associated state files.

---

## Step 1: Cancel Ralph Loop

First, invoke the ralph-loop cancel command to stop the active loop:

```
/ralph-loop:cancel-ralph
```

## Step 2: Clean Up State Files

Remove the following files if they exist:

1. **DevLoop state file**: `.claude/devloop-state.json`
2. **Ralph loop local state**: `.claude/ralph-loop.local.md`

For each file:
- Check if the file exists
- If it exists, delete it
- Report whether it was deleted or did not exist

## Step 3: Report Status

Output a summary:

```
DevLoop cancelled.

Cleanup:
- .claude/devloop-state.json: [deleted/not found]
- .claude/ralph-loop.local.md: [deleted/not found]

Note: Git worktree and branch were NOT affected.
To also clean up the worktree, run:
  scripts/gitworktree-complete.sh

Or manually remove with:
  git worktree remove <path>
```
