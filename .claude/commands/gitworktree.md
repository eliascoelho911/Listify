---
description: Create or switch to git worktree intelligently
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
   - If fails: ERROR with message "❌ Erro: não está em um repositório git"

2. **Verify git worktree support**
   - Run: `git worktree list --porcelain`
   - If fails: ERROR with message "❌ Erro: git worktree não está disponível (requer Git 2.5+)"

3. **Detect main branch**
   - Run: `git symbolic-ref refs/remotes/origin/HEAD 2>/dev/null | sed 's@^refs/remotes/origin/@@'`
   - If empty, try: `git branch -l main master | head -n1 | tr -d ' *'`
   - Store as DEFAULT_BASE_BRANCH

### Phase 2: Parse Arguments

1. **Parse $ARGUMENTS**:
   - If empty: SET interactive_mode = true, GO TO Phase 3
   - If not empty: Parse as "[branch-name] [base-branch?] [flags?]"
   - Extract branch_name (first arg, ignoring flags starting with --)
   - Extract base_branch (second arg if not a flag, default to DEFAULT_BASE_BRANCH)
   - Extract flags:
     - `--no-sync`: Skip sync prompt
     - `--rebase`: Auto rebase with main (no prompt)
     - `--merge`: Auto merge with main (no prompt)

2. **Validate branch_name**:
   - Must not be empty in non-interactive mode
   - Sanitize: lowercase, spaces→hyphens, remove special chars except / and -
   - Pattern: `^[a-z0-9/_-]+$`

### Phase 3: Interactive Mode (if no arguments)

1. **List existing worktrees**
   - Run: `git worktree list --porcelain`
   - Parse output to extract pairs (path, branch)
   - Format as numbered list:
     ```
     📋 Worktrees ativos:
     1. main → /path/to/main
     2. fix/bug-123 → /path/to/fix/bug-123
     3. chore/update-deps → /path/to/chore/update-deps
     [N+1]. Criar novo worktree
     ```

2. **Ask user for selection**
   - Use AskUserQuestion with options from list
   - If user selects existing worktree: SET branch_name, GO TO Phase 4 (navigate only)
   - If user selects "Create new": Ask for branch name, GO TO Phase 4 (create)

### Phase 4: Check if Worktree Exists

1. **List all worktrees and branches**
   - Run: `git worktree list --porcelain`
   - Parse output line by line:
     ```
     worktree /path/to/worktree
     HEAD abc123
     branch refs/heads/branch-name
     ```
   - For each worktree, extract:
     - worktree_path from line starting with "worktree"
     - branch_ref from line starting with "branch"
     - Extract branch name from refs/heads/ prefix

2. **Search for exact branch match**
   - Loop through worktrees
   - If branch matches branch_name:
     - SET existing_worktree_path = worktree_path
     - GO TO Phase 5 (Navigate)
   - If no match found:
     - GO TO Phase 6 (Create)

### Phase 5: Navigate to Existing Worktree

1. **Validate path exists**
   - Check if existing_worktree_path exists and is accessible
   - If not: ERROR "❌ Erro: worktree path não existe: {path}"

2. **Navigate to worktree (CD AUTOMÁTICO)**
   - Execute: `cd "{existing_worktree_path}"`
   - This changes the working directory for all subsequent commands
   - Output: `✅ Navegado para: {existing_worktree_path}`
   - Output: `📍 Branch: {branch_name}`

3. **Sync with main (Phase 5.1)**
   - GO TO Phase 5.1 for sync options

### Phase 5.1: Sync with Main

1. **Check flags first**:
   - If `--no-sync` flag: SKIP sync, GO TO Phase 7
   - If `--rebase` flag: GO TO step 3 (auto rebase)
   - If `--merge` flag: GO TO step 4 (auto merge)

2. **Ask user about sync** (default behavior):
   - Use AskUserQuestion:
     - Question: "Deseja atualizar com origin/{DEFAULT_BASE_BRANCH}?"
     - Options:
       - "Sim, fazer rebase" (Recommended)
       - "Sim, fazer merge"
       - "Não, pular"

3. **If rebase selected/flagged:**
   - Output: `⬇️ Atualizando com origin/{DEFAULT_BASE_BRANCH}...`
   - Run: `git fetch origin {DEFAULT_BASE_BRANCH}`
   - Run: `git rebase origin/{DEFAULT_BASE_BRANCH}`
   - If conflicts:
     - Output: `⚠️ Conflitos encontrados no rebase`
     - Output: `ℹ️ Resolva os conflitos e execute: git rebase --continue`
     - Output: `ℹ️ Ou para abortar: git rebase --abort`
   - If success:
     - Output: `✅ Rebase com {DEFAULT_BASE_BRANCH} concluído`

4. **If merge selected/flagged:**
   - Output: `⬇️ Atualizando com origin/{DEFAULT_BASE_BRANCH}...`
   - Run: `git fetch origin {DEFAULT_BASE_BRANCH}`
   - Run: `git merge origin/{DEFAULT_BASE_BRANCH}`
   - If conflicts:
     - Output: `⚠️ Conflitos encontrados no merge`
     - Output: `ℹ️ Resolva os conflitos e execute: git add . && git commit`
     - Output: `ℹ️ Ou para abortar: git merge --abort`
   - If success:
     - Output: `✅ Merge com {DEFAULT_BASE_BRANCH} concluído`

5. **If skip selected:**
   - Output: `ℹ️ Sync pulado`

6. **Continue to Phase 7** (do not continue to Phase 6)

### Phase 6: Create New Worktree

1. **Determine worktree path**
   - Get current repo root: `git rev-parse --show-toplevel`
   - Get parent dir: `dirname $(git rev-parse --show-toplevel)`
   - Construct path: `{parent_dir}/{branch_name}`
   - Convert to absolute path with `realpath -m`

2. **Validate path doesn't exist**
   - Check if path already exists
   - If exists: ERROR "❌ Erro: path já existe: {path}"

3. **Check if branch exists locally**
   - Run: `git show-ref --verify --quiet refs/heads/{branch_name}`
   - If exists:
     - Output: `ℹ️ Branch {branch_name} já existe localmente`
     - Create worktree without -b flag: `git worktree add "{worktree_path}" {branch_name}`
   - If doesn't exist:
     - Output: `ℹ️ Creating new branch: {branch_name} from {base_branch}`
     - Create worktree with -b flag: `git worktree add -b {branch_name} "{worktree_path}" {base_branch}`

4. **Verify worktree creation**
   - Check if worktree_path exists
   - If not: ERROR "❌ Erro: falha ao criar worktree"

5. **Navigate to new worktree (CD AUTOMÁTICO)**
   - Execute: `cd "{worktree_path}"`
   - This changes the working directory for all subsequent commands
   - Output: `✅ Worktree criado e navegado: {worktree_path}`

6. **Push branch to remote automatically**
   - Output: `🚀 Pushing branch to origin...`
   - Run: `git push -u origin {branch_name}`
   - If push fails:
     - Output warning: `⚠️ Aviso: falha ao fazer push para origin. Execute manualmente: git push -u origin {branch_name}`
     - Continue (don't fail)

### Phase 7: Final Report

1. **Show worktree info**
   - Output: `📍 Branch: {branch_name}`
   - Output: `📂 Path: {worktree_path}`

2. **Show current status**
   - Run from worktree: `git status --short --branch`
   - Output formatted status

## Key Rules

- **ALWAYS** use absolute paths for worktree operations
- **ALWAYS** sanitize branch names before use
- **ALWAYS** execute `cd` automatically (don't just output the command)
- **ALWAYS** ask about sync with main when navigating (unless --no-sync flag)
- **NEVER** delete or modify existing worktrees
- Default worktree location: `../{branch-name}` (parallel to current repo)
- Auto-push to remote after creating new worktree
- Provide clear error messages in Portuguese
- Use emoji prefixes for output: ✅ ❌ ℹ️ 📋 🚀 📍 📂 ⚠️ ⬇️
- Handle both existing and new branches gracefully
- Support flags: `--no-sync`, `--rebase`, `--merge`
