---
description: Clean up stale/orphaned git worktrees
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

3. **Parse arguments**
   - Check for `--dry-run` flag in $ARGUMENTS
   - If present: SET dry_run = true
   - If not: SET dry_run = false

4. **Detect main branch**
   - Run: `git symbolic-ref refs/remotes/origin/HEAD 2>/dev/null | sed 's@^refs/remotes/origin/@@'`
   - If empty, try: `git branch -l main master | head -n1 | tr -d ' *'`
   - Store as MAIN_BRANCH

### Phase 2: Sync with Remote

1. **Fetch remote updates**
   - Output: "🔄 Sincronizando com remote..."
   - Run: `git fetch --prune origin`
   - This updates refs and removes deleted remote branches

2. **Prune remote-tracking branches**
   - Run: `git remote prune origin`
   - Output: "✅ Remote refs atualizadas"

### Phase 3: Identify Orphaned Worktrees

1. **List all worktrees**
   - Run: `git worktree list --porcelain`
   - Parse to extract: path, branch, HEAD
   - Exclude main worktree (the repo root)
   - Store as WORKTREE_LIST

2. **Identify stale worktrees** (multiple categories):

   **Category 1: Prunable (git's detection)**
   - Run: `git worktree list --porcelain | grep "prunable"`
   - These are worktrees whose directory no longer exists
   - Mark as: STALE_REASON = "directory missing"

   **Category 2: Merged branches**
   - For each worktree branch:
     - Run: `git branch --merged {MAIN_BRANCH} | grep -w {branch_name}`
     - If found: Mark as STALE_REASON = "merged into {MAIN_BRANCH}"

   **Category 3: Deleted remote branches**
   - For each worktree branch:
     - Check if remote exists: `git show-ref --verify --quiet refs/remotes/origin/{branch_name}`
     - If not found: Mark as STALE_REASON = "deleted remotely"

   **Category 4: Gone branches** (local tracking deleted remote)
   - Run: `git branch -vv | grep ': gone]'`
   - Extract branch names
   - Match with worktree branches
   - Mark as: STALE_REASON = "remote tracking gone"

3. **Build stale worktrees list**
   - Combine all categories
   - Remove duplicates
   - For each stale worktree, collect:
     - path
     - branch
     - reason (why it's stale)
     - uncommitted changes count
   - Store as STALE_WORKTREES

### Phase 4: Present Findings

1. **Check if any stale worktrees found**
   - If STALE_WORKTREES is empty:
     - Output: "✅ Nenhum worktree órfão encontrado"
     - Output: "🎉 Todos os worktrees estão limpos!"
     - STOP

2. **Display stale worktrees**
   - Output header:
     ```
     🧹 Worktrees órfãos encontrados: {count}
     ```
   - For each stale worktree:
     ```
     {index}. {branch}
        📂 Path: {path}
        📋 Reason: {reason}
        ⚠️ Status: {clean / X uncommitted changes}
     ```

3. **Dry-run mode**
   - If dry_run == true:
     - Output: "🔍 Modo dry-run: nenhuma ação será tomada"
     - Output: "💡 Execute sem --dry-run para remover estes worktrees"
     - STOP

### Phase 5: Confirm Cleanup

1. **Ask for confirmation**
   - Use AskUserQuestion:
     ```
     Deseja remover estes worktrees órfãos?
     Options:
     - Sim, remover todos ({count} worktrees)
     - Selecionar quais remover
     - Cancelar
     ```

2. **Handle user choice**:

   **If "Sim, remover todos":**
   - SET selected_worktrees = STALE_WORKTREES
   - GO TO Phase 6

   **If "Selecionar quais remover":**
   - Use AskUserQuestion with multiSelect=true
   - Options: each stale worktree as option
   - SET selected_worktrees = user selection
   - GO TO Phase 6

   **If "Cancelar":**
   - Output: "❌ Operação cancelada"
   - STOP

### Phase 6: Remove Selected Worktrees

1. **For each worktree in selected_worktrees**:

   a. **Check for uncommitted changes**
      - Run: `git -C "{worktree_path}" status --porcelain 2>/dev/null`
      - If has changes:
        - Output warning: `⚠️ {branch} tem mudanças não commitadas`
        - Ask: "Forçar remoção (perde mudanças)?" [Sim/Não]
        - If No: SKIP this worktree, continue to next
        - If Yes: USE --force flag

   b. **Remove worktree**
      - Try: `git worktree remove "{worktree_path}"`
      - If fails and force approved: `git worktree remove --force "{worktree_path}"`
      - If fails: Output error, continue to next
      - If success: Output: `✅ Removido: {branch}`

   c. **Track results**
      - Count successes and failures
      - Store failed removals for final report

2. **Prune worktree admin files**
   - Run: `git worktree prune`
   - This cleans up .git/worktrees/ metadata
   - Output: "🧹 Limpeza administrativa concluída"

### Phase 7: Handle Orphaned Branches

1. **List branches of removed worktrees**
   - For each successfully removed worktree:
     - Check if local branch still exists: `git show-ref --verify --quiet refs/heads/{branch}`
     - If exists, add to ORPHANED_BRANCHES list

2. **Ask about branch cleanup**
   - If ORPHANED_BRANCHES is empty: SKIP to Phase 8
   - Output: "🏷️ Branches órfãs encontradas: {count}"
   - List branches
   - Use AskUserQuestion:
     ```
     Deseja deletar estas branches também?
     Options:
     - Sim, deletar todas as branches locais
     - Não, manter branches
     ```

3. **Delete branches if requested**
   - If "Sim":
     - For each branch: `git branch -D {branch}`
     - Output: `✅ Branch deletada: {branch}`
   - If "Não":
     - Output: "ℹ️ Branches mantidas"

### Phase 8: Final Report

1. **Summary statistics**
   - Output:
     ```
     📊 Resumo da limpeza:
     ✅ Worktrees removidos: {success_count}
     ❌ Falhas: {failure_count}
     🏷️ Branches deletadas: {branch_delete_count}
     ```

2. **List failures (if any)**
   - If failure_count > 0:
     - Output: "⚠️ Falhas na remoção:"
     - List each failed worktree with reason

3. **Show remaining worktrees**
   - Output: "📋 Worktrees restantes:"
   - Run: `git worktree list`

4. **Helpful tip**
   - Output: "💡 Dica: Execute regularmente para manter worktrees limpos"

## Key Rules

- **ALWAYS** fetch and prune before detecting orphans
- **ALWAYS** detect multiple categories of orphans:
  - Prunable (missing directory)
  - Merged branches
  - Deleted remote branches
  - Gone tracking branches
- **NEVER** delete main worktree
- **ALWAYS** warn about uncommitted changes
- Support `--dry-run` flag for safe preview
- Allow selective removal (not just all-or-nothing)
- Clean up orphaned branches optionally
- Provide detailed statistics and reasons
- Use emoji prefixes: ✅ ❌ ℹ️ 📋 🧹 ⚠️ 🏷️ 📂 🔍 💡 🎉 📊 🔄
