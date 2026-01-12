---
description: Create or switch to test/ worktree
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
   - SET branch_prefix = "test/"

2. **If description IS provided:**

   a. **Sanitize description**
      - Input: $ARGUMENTS (e.g., "Shopping Cart Integration Tests")
      - Steps:
        1. Convert to lowercase
        2. Replace spaces with hyphens
        3. Remove special characters except hyphens
        4. Remove leading/trailing hyphens
      - Example: "Shopping Cart Integration Tests" → "shopping-cart-integration-tests"
      - SET sanitized_description

   b. **Generate branch name**
      - Combine: branch_name = "{branch_prefix}{sanitized_description}"
      - Example: "test/shopping-cart-integration-tests"

   c. **Call unified gitworktree command**
      - Execute as if user ran: `/gitworktree {branch_name}`
      - This will handle:
        - Check if worktree exists (navigate)
        - Or create new worktree + push
      - Output result
      - STOP

3. **If description is NOT provided (interactive mode):**

   a. **List existing test/ worktrees**
      - Run: `git worktree list --porcelain`
      - Parse to find worktrees with branches starting with "test/"
      - Store as TEST_WORKTREES

   b. **Present options to user**
      - If TEST_WORKTREES is not empty:
        - Format as numbered list:
          ```
          📋 Worktrees test/ existentes:
          1. test/shopping-cart-tests → /path/to/test/shopping-cart-tests
          2. test/integration-suite → /path/to/test/integration-suite
          [{count+1}]. Criar novo worktree test/
          ```
        - Use AskUserQuestion to select
        - If user selects existing: Extract branch_name, GO TO step 3c
        - If user selects "Create new": GO TO step 3d

      - If TEST_WORKTREES is empty:
        - Output: "ℹ️ Nenhum worktree test/ encontrado"
        - GO TO step 3d

   c. **Navigate to selected worktree**
      - Call unified command with selected branch: `/gitworktree {branch_name}`
      - STOP

   d. **Ask for new description**
      - Use AskUserQuestion:
        ```
        Digite a descrição dos testes:
        (Será convertido para: test/[sua-descricao])
        ```
      - Get user input
      - GO BACK TO Phase 2, step 2a (sanitize and create)

### Phase 3: Final Output

1. **Success message**
   - Output: "✅ Worktree test/ pronto"
   - Output: "📍 Branch: {branch_name}"
   - Output: "📂 Path: {worktree_path}"

## Key Rules

- **PREFIX**: Always use "test/" prefix for test branches
- **SANITIZATION**: Convert to lowercase, spaces→hyphens, remove special chars
- **OPTIONAL DESCRIPTION**: Support both `/gitworktree:test [description]` and `/gitworktree:test` (interactive)
- **REUSE**: Call unified `/gitworktree` command, don't duplicate logic
- **LISTING**: Only show worktrees with "test/" prefix when interactive
- Use emoji prefixes: ✅ ❌ ℹ️ 📋 📍 📂
