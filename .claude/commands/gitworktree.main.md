---
description: Switch to main/master worktree
---

## User Input

```text
$ARGUMENTS
```

Arguments are ignored for this command.

## Outline

### Phase 1: Validation

1. **Verify git repository exists**
   - Run: `git rev-parse --is-inside-work-tree`
   - If fails: ERROR "❌ Erro: não está em um repositório git"

### Phase 2: Detect Main Branch

1. **Find main branch name**
   - Try to get default branch from remote:
     ```bash
     git symbolic-ref refs/remotes/origin/HEAD 2>/dev/null | sed 's@^refs/remotes/origin/@@'
     ```
   - If empty, try local branches:
     ```bash
     git branch -l main master | head -n1 | tr -d ' *'
     ```
   - If still empty: Try "main" first, then "master"
   - SET main_branch_name

2. **Verify branch exists**
   - Run: `git show-ref --verify --quiet refs/heads/{main_branch_name}`
   - If not found: ERROR "❌ Erro: branch principal não encontrada (tentou: main, master)"

### Phase 3: Navigate to Main

1. **Find main worktree**
   - Run: `git worktree list --porcelain`
   - Parse to find worktree with branch = main_branch_name
   - Extract worktree_path

2. **Handle main worktree location**:

   **If main worktree is the repo root (typical case):**
   - The main worktree is usually the original clone location
   - It has a .git directory (not .git file)
   - SET main_worktree_path

   **If main is a separate worktree:**
   - Some workflows create main as a separate worktree too
   - Use the path found in worktree list
   - SET main_worktree_path

3. **Navigate to main worktree**
   - Output: `ℹ️ Switching to main worktree: {main_branch_name}`
   - Call unified command: `/gitworktree {main_branch_name}`
   - This handles:
     - Navigation if worktree exists
     - Or creation if somehow main worktree doesn't exist (rare)

### Phase 4: Final Output

1. **Success message**
   - Output: "✅ Worktree principal: {main_branch_name}"
   - Output: "📂 Path: {main_worktree_path}"

2. **Show git status**
   - Run: `git status --short --branch`
   - Output formatted status

## Key Rules

- **AUTO-DETECT**: Automatically detect main vs master
- **FALLBACK**: Try multiple methods to find main branch
- **SIMPLICITY**: No arguments needed, just switch to main
- **REUSE**: Call unified `/gitworktree` command for consistency
- **TYPICAL CASE**: Main worktree is usually the original repo root
- Use emoji prefixes: ✅ ❌ ℹ️ 📂
