---
description: Remove git worktree and optionally delete branch
handoffs:
  - label: "Voltar para main"
    agent: gitworktree.main
    send: false
---

## User Input

```text
$ARGUMENTS
```

You **MUST** consider the user input before proceeding (if not empty).

## Outline

### Phase 1: Validation

1. **Verify git repository exists**
   - Run: `git rev-parse --is-inside-work-tree`
   - If fails: ERROR "❌ Erro: não está em um repositório git"

2. **Verify git worktree support**
   - Run: `git worktree list --porcelain`
   - If fails: ERROR "❌ Erro: git worktree não está disponível (requer Git 2.5+)"

3. **Get current worktree path**
   - Run: `git rev-parse --show-toplevel`
   - Store as CURRENT_WORKTREE

### Phase 2: Parse Arguments and Select Worktree

1. **Parse $ARGUMENTS**:
   - If empty: SET interactive_mode = true
   - If not empty: Parse as "[worktree-path-or-branch]"
   - Extract target (first arg)

2. **List all worktrees**
   - Run: `git worktree list --porcelain`
   - Parse to extract: path, branch, HEAD, dirty state
   - Example format:
     ```
     worktree /path/to/worktree
     HEAD abc123
     branch refs/heads/branch-name
     detached (if detached)
     ```

3. **Filter main worktree**
   - Identify main worktree (the one containing .git directory, not .git file)
   - Run in each worktree: `test -d .git && echo "main" || echo "linked"`
   - EXCLUDE main worktree from deletion list
   - If user tries to delete main: ERROR "❌ Erro: não é possível deletar o worktree principal"

4. **Search for target worktree**:

   **If interactive_mode (no arguments):**
   - Format worktrees as numbered list (excluding main):
     ```
     📋 Worktrees disponíveis para remoção:
     1. fix/bug-123 → /path/to/fix/bug-123 [abc123] (clean)
     2. chore/update → /path/to/chore/update [def456] (dirty - 2 uncommitted)
     3. docs/api → /path/to/docs/api [ghi789] (clean)
     ```
   - Use AskUserQuestion to select worktree
   - SET target_worktree_path, target_branch

   **If target provided:**
   - Try to match target against:
     1. Exact branch name
     2. Branch name without prefix (e.g., "bug-123" matches "fix/bug-123")
     3. Worktree path
   - If no match: ERROR "❌ Erro: worktree não encontrado: {target}"
   - If match: SET target_worktree_path, target_branch

### Phase 3: Validate Worktree State

1. **Check for uncommitted changes**
   - Run in target worktree: `git -C "{target_worktree_path}" status --porcelain`
   - If output not empty (has changes):
     - Count lines: `git -C "{target_worktree_path}" status --porcelain | wc -l`
     - Output warning: `⚠️ Aviso: worktree tem {count} mudanças não commitadas`
     - Show changes: `git -C "{target_worktree_path}" status --short`

2. **Check if it's the current worktree**
   - If target_worktree_path == CURRENT_WORKTREE:
     - Output warning: `⚠️ Aviso: você está atualmente neste worktree`
     - Output info: `ℹ️ Você será retornado ao worktree principal após a remoção`

3. **Confirm deletion**
   - Show summary:
     ```
     🗑️ Worktree a ser removido:
     - Branch: {target_branch}
     - Path: {target_worktree_path}
     - Commit: {HEAD_sha} {commit_message}
     - Estado: {clean/dirty}
     ```
   - Use AskUserQuestion to confirm:
     - Options: ["Sim, remover worktree", "Cancelar"]
   - If cancel: OUTPUT "❌ Operação cancelada" and STOP

### Phase 4: Remove Worktree

1. **Remove worktree**
   - Try normal remove: `git worktree remove "{target_worktree_path}"`
   - If fails (e.g., uncommitted changes):
     - Ask user if wants force remove:
       - Use AskUserQuestion: ["Forçar remoção (PERDE MUDANÇAS)", "Cancelar"]
     - If force confirmed:
       - Run: `git worktree remove --force "{target_worktree_path}"`
     - If cancel: OUTPUT "❌ Operação cancelada" and STOP

2. **Verify removal**
   - Check if path still exists: `test -d "{target_worktree_path}"`
   - If still exists: ERROR "❌ Erro: falha ao remover worktree"
   - Success: OUTPUT "✅ Worktree removido: {target_worktree_path}"

### Phase 5: Handle Branch Deletion

1. **Check if branch exists**
   - Run: `git show-ref --verify --quiet refs/heads/{target_branch}`
   - If doesn't exist: SKIP to Phase 6

2. **Ask about branch deletion**
   - Use AskUserQuestion:
     ```
     Deseja deletar a branch também?
     - Deletar branch local apenas
     - Deletar branch local E remota
     - Manter branch
     ```

3. **Delete branch if requested**:

   **If "local apenas":**
   - Run: `git branch -d {target_branch}`
   - If fails (unmerged): Ask if force delete: `git branch -D {target_branch}`
   - Output: "✅ Branch local deletada: {target_branch}"

   **If "local E remota":**
   - Delete local: `git branch -D {target_branch}`
   - Delete remote: `git push origin --delete {target_branch}`
   - Output: "✅ Branch local e remota deletadas: {target_branch}"

   **If "manter":**
   - Output: "ℹ️ Branch mantida: {target_branch}"

### Phase 6: Navigate Away (if needed)

1. **Check if we need to navigate**
   - If original CURRENT_WORKTREE == target_worktree_path:
     - Detect main branch: `git symbolic-ref refs/remotes/origin/HEAD 2>/dev/null | sed 's@^refs/remotes/origin/@@'`
     - Get main worktree path from `git worktree list`
     - Output: `ℹ️ Retornando ao worktree principal...`
     - Output: `cd "{main_worktree_path}"`

### Phase 7: Final Report

1. **Summary**
   - Output: "📋 Resumo da operação:"
   - Output: "  ✅ Worktree removido"
   - Output: "  📂 Path: {target_worktree_path}"
   - Output: "  🏷️ Branch: {target_branch} ({status})"
   - Status: "deletada" or "mantida"

2. **List remaining worktrees**
   - Run: `git worktree list`
   - Output formatted list

## Key Rules

- **NEVER** delete the main worktree (containing .git directory)
- **ALWAYS** confirm before destructive operations
- **ALWAYS** warn about uncommitted changes
- **ALWAYS** use absolute paths
- Handle current worktree navigation automatically
- Provide options for force delete when needed
- Allow granular control over branch deletion (local, remote, both, none)
- Use emoji prefixes: ✅ ❌ ℹ️ 📋 🗑️ ⚠️ 🏷️ 📂
