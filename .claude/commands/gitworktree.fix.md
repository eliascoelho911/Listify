---
description: Create or switch to fix/ worktree
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

### Phase 2: Parse and Process Description

1. **Check if description provided**
   - Parse $ARGUMENTS to check if empty
   - SET branch_prefix = "fix/"

2. **If description IS provided:**

   a. **Sanitize description**
      - Input: $ARGUMENTS (e.g., "Authentication Timeout Bug!")
      - Steps:
        1. Convert to lowercase
        2. Replace spaces with hyphens
        3. Remove special characters except hyphens
        4. Remove leading/trailing hyphens
      - Example: "Authentication Timeout Bug!" → "authentication-timeout-bug"
      - SET sanitized_description

   b. **Generate branch name**
      - Combine: branch_name = "{branch_prefix}{sanitized_description}"
      - Example: "fix/authentication-timeout-bug"

   c. **Call unified gitworktree command**
      - Execute as if user ran: `/gitworktree {branch_name}`
      - This will handle:
        - Check if worktree exists (navigate)
        - Or create new worktree + push
      - Output result
      - STOP

3. **If description is NOT provided (interactive mode):**

   a. **List existing fix/ worktrees**
      - Run: `git worktree list --porcelain`
      - Parse to find worktrees with branches starting with "fix/"
      - Store as FIX_WORKTREES

   b. **Present options to user**
      - If FIX_WORKTREES is not empty:
        - Format as numbered list:
          ```
          📋 Worktrees fix/ existentes:
          1. fix/authentication-timeout → /path/to/fix/authentication-timeout
          2. fix/login-bug → /path/to/fix/login-bug
          3. fix/cart-sync → /path/to/fix/cart-sync
          [{count+1}]. Criar novo worktree fix/
          ```
        - Use AskUserQuestion to select
        - If user selects existing: Extract branch_name, GO TO step 3c
        - If user selects "Create new": GO TO step 3d

      - If FIX_WORKTREES is empty:
        - Output: "ℹ️ Nenhum worktree fix/ encontrado"
        - GO TO step 3d

   c. **Navigate to selected worktree**
      - Call unified command with selected branch: `/gitworktree {branch_name}`
      - STOP

   d. **Ask for new description**
      - Use AskUserQuestion:
        ```
        Digite a descrição do bug fix:
        (Será convertido para: fix/[sua-descricao])
        ```
      - Get user input
      - GO BACK TO Phase 2, step 2a (sanitize and create)

### Phase 3: Final Output

1. **Success message**
   - Output: "✅ Worktree fix/ pronto"
   - Output: "📍 Branch: {branch_name}"
   - Output: "📂 Path: {worktree_path}"

## Key Rules

- **PREFIX**: Always use "fix/" prefix for bug fix branches
- **SANITIZATION**: Convert to lowercase, spaces→hyphens, remove special chars
- **OPTIONAL DESCRIPTION**: Support both `/gitworktree:fix [description]` and `/gitworktree:fix` (interactive)
- **REUSE**: Call unified `/gitworktree` command, don't duplicate logic
- **LISTING**: Only show worktrees with "fix/" prefix when interactive
- Use emoji prefixes: ✅ ❌ ℹ️ 📋 📍 📂
