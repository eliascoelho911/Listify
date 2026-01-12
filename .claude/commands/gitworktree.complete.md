---
description: Complete worktree workflow (push, PR/merge, cleanup)
handoffs:
  - label: "Deletar worktree"
    agent: gitworktree.delete
    send: false
  - label: "Voltar para main"
    agent: gitworktree.main
    send: false
---

## User Input

```text
$ARGUMENTS
```

You **MUST** consider the user input before proceeding (if not empty).

**Parâmetros:**
- Vazio → Fluxo padrão (push + PR)
- `--direct` ou `--no-pr` → Merge direto na main sem PR

## Outline

### Phase 1: Validation

1. **Verify git repository exists**
   - Run: `git rev-parse --is-inside-work-tree`
   - If fails: ERROR "❌ Erro: não está em um repositório git"

2. **Verify gh CLI (for PR flow only)**
   - Run: `which gh`
   - If fails and NOT --direct: ERROR "❌ Erro: gh CLI não instalado"
   - Run: `gh auth status`
   - If fails and NOT --direct: ERROR "❌ Erro: gh CLI não autenticado"

3. **Detect main branch**
   - Run: `git symbolic-ref refs/remotes/origin/HEAD 2>/dev/null | sed 's@^refs/remotes/origin/@@'`
   - If empty, fallback: Check `main` then `master`
   - Store as BASE_BRANCH

4. **Get current branch**
   - Run: `git branch --show-current`
   - Store as CURRENT_BRANCH
   - If CURRENT_BRANCH == BASE_BRANCH: ERROR "❌ Erro: você está na branch principal, não há nada para completar"

5. **Get current worktree info**
   - Run: `git rev-parse --show-toplevel`
   - Store as CURRENT_WORKTREE_PATH
   - Run: `git worktree list --porcelain` to get main worktree path
   - Store as MAIN_WORKTREE_PATH

6. **Check for commits ahead**
   - Run: `git log {BASE_BRANCH}..HEAD --oneline | wc -l`
   - If count == 0: ERROR "❌ Erro: nenhum commit novo em relação a {BASE_BRANCH}"

### Phase 2: Check Uncommitted Changes

1. **Check for uncommitted changes**
   - Run: `git status --porcelain`
   - If output not empty:
     - Output: "⚠️ Aviso: há mudanças não commitadas"
     - Show: `git status --short`
     - Use AskUserQuestion:
       - Options: ["Commitar agora (/commit)", "Continuar sem commitar", "Cancelar"]
     - If "Commitar agora": Execute `/commit`, then continue
     - If "Continuar sem commitar": Continue (changes won't be included)
     - If "Cancelar": STOP

### Phase 3: Run Tests & Lint

1. **Run tests**
   - Output: "🧪 Executando testes..."
   - Run: `npm test`
   - If fails:
     - ERROR "❌ Erro: testes falharam"
     - Show test output
     - STOP

2. **Run lint**
   - Output: "🔍 Executando lint..."
   - Run: `npm run lint`
   - If fails:
     - ERROR "❌ Erro: lint falhou (política de zero warnings)"
     - Show lint output
     - STOP

3. **Success**
   - Output: "✅ Testes e lint passaram"

### Phase 4: Push to Remote

1. **Check remote tracking**
   - Run: `git rev-parse --abbrev-ref --symbolic-full-name @{u} 2>/dev/null`
   - If fails (no tracking): SET needs_upstream = true

2. **Push changes**
   - Output: "🚀 Enviando para origin..."
   - If needs_upstream:
     - Run: `git push -u origin {CURRENT_BRANCH}`
   - Else:
     - Run: `git push`
   - If fails: ERROR "❌ Erro: falha no push" and show output

3. **Success**
   - Output: "✅ Push realizado com sucesso"

### Phase 5A: Create PR (default flow, no --direct)

**Only execute if $ARGUMENTS does NOT contain `--direct` or `--no-pr`**

1. **Analyze commits for PR title**
   - Run: `git log {BASE_BRANCH}..HEAD --oneline | wc -l`
   - Store as COMMIT_COUNT

   **If COMMIT_COUNT == 1:**
   - Use commit message as PR title: `git log -1 --format="%s"`

   **If COMMIT_COUNT > 1:**
   - Get commit messages: `git log {BASE_BRANCH}..HEAD --format="%s"`
   - Analyze types (feat, fix, chore, etc.)
   - Use most frequent type + synthesize description
   - Format: `tipo(escopo): descrição sintetizada`

2. **Get modified files for checklist**
   - Run: `git diff --name-only {BASE_BRANCH}...HEAD`
   - Store file list for conditional checklist

3. **Generate PR description**
   - Create summary section (2-3 bullets):
     ```markdown
     ## Resumo
     - [O que foi mudado]
     - [Por que foi mudado]
     ```

   - Create checklist section:
     ```markdown
     ## Checklist
     - [x] ✅ Testes passando (npm test)
     - [x] ✅ Linting passando (npm run lint)
     ```

   - Add conditional items based on modified files:
     - If `src/design-system/`: `- [ ] ✅ Tokens do Design System utilizados`
     - If `*.stories.tsx`: `- [ ] ✅ Stories do Storybook validadas`
     - If `*.ts` or `*.tsx`: `- [ ] ✅ Tipagem TypeScript estrita`
     - If `src/presentation/`: `- [ ] ✅ Chaves i18n adicionadas`
     - If `src/domain/` or `src/infra/`: `- [ ] ✅ Clean Architecture respeitada`

   - Add footer:
     ```markdown

     🤖 Gerado com [Claude Code](https://claude.com/claude-code)
     ```

4. **Create PR**
   - Output: "📝 Criando Pull Request..."
   - Run:
     ```bash
     gh pr create --title "<título>" --body "$(cat <<'EOF'
     <descrição-completa>
     EOF
     )"
     ```

5. **Get PR URL**
   - Run: `gh pr view --json url -q .url`
   - Output: "✅ Pull Request criado!"
   - Output: "🔗 URL: {PR_URL}"

6. **Cleanup prompt**
   - Use AskUserQuestion:
     ```
     Deseja deletar o worktree agora?
     - Sim, deletar worktree e branch
     - Não, manter worktree
     ```
   - If "Sim": Call `/gitworktree:delete {CURRENT_BRANCH}`
   - If "Não": Output "ℹ️ Worktree mantido: {CURRENT_WORKTREE_PATH}"

### Phase 5B: Direct Merge (--direct or --no-pr flow)

**Only execute if $ARGUMENTS contains `--direct` or `--no-pr`**

1. **Navigate to main worktree**
   - Output: "🔄 Navegando para worktree principal..."
   - Output: `cd "{MAIN_WORKTREE_PATH}"`
   - Execute commands from MAIN_WORKTREE_PATH context

2. **Update main branch**
   - Output: "⬇️ Atualizando {BASE_BRANCH}..."
   - Run from main worktree: `git -C "{MAIN_WORKTREE_PATH}" checkout {BASE_BRANCH}`
   - Run: `git -C "{MAIN_WORKTREE_PATH}" pull origin {BASE_BRANCH}`
   - If fails: ERROR "❌ Erro: falha ao atualizar {BASE_BRANCH}"

3. **Merge branch**
   - Output: "🔀 Mergeando {CURRENT_BRANCH} em {BASE_BRANCH}..."
   - Run: `git -C "{MAIN_WORKTREE_PATH}" merge {CURRENT_BRANCH} --no-ff -m "merge: {CURRENT_BRANCH}"`
   - If fails (conflicts):
     - ERROR "❌ Erro: conflitos no merge"
     - Show conflicts
     - STOP

4. **Push main**
   - Output: "🚀 Enviando {BASE_BRANCH} para origin..."
   - Run: `git -C "{MAIN_WORKTREE_PATH}" push origin {BASE_BRANCH}`
   - If fails: ERROR "❌ Erro: falha no push para {BASE_BRANCH}"

5. **Success**
   - Output: "✅ Branch mergeada diretamente na {BASE_BRANCH}"

6. **Automatic cleanup**
   - Output: "🗑️ Limpando worktree e branch..."

   - Delete remote branch:
     - Run: `git push origin --delete {CURRENT_BRANCH}`
     - If fails: Output warning, continue

   - Delete local branch:
     - Run: `git -C "{MAIN_WORKTREE_PATH}" branch -d {CURRENT_BRANCH}`
     - If fails (unmerged): Run `git -C "{MAIN_WORKTREE_PATH}" branch -D {CURRENT_BRANCH}`

   - Remove worktree:
     - Run: `git -C "{MAIN_WORKTREE_PATH}" worktree remove "{CURRENT_WORKTREE_PATH}"`
     - If fails: Run with --force

   - Output: "✅ Worktree e branch removidos"

### Phase 6: Final Report

1. **Summary**
   - Output: "📋 Resumo:"
   - Output: "  ✅ Push realizado"

   **If PR flow:**
   - Output: "  ✅ PR criado: {PR_URL}"
   - Output: "  📂 Worktree: {mantido/removido}"

   **If Direct flow:**
   - Output: "  ✅ Merge direto em {BASE_BRANCH}"
   - Output: "  🗑️ Worktree removido"
   - Output: "  📍 Você está em: {MAIN_WORKTREE_PATH}"

## Key Rules

- **ALWAYS** run tests and lint before push (política de zero warnings)
- **ALWAYS** use absolute paths for worktree operations
- **NEVER** merge diretamente se testes ou lint falharem
- **DEFAULT** flow creates PR; `--direct` skips PR
- **AUTOMATIC** cleanup on direct merge (no confirmation)
- **OPTIONAL** cleanup on PR flow (asks user)
- Handle uncommitted changes gracefully
- Provide clear error messages in Portuguese
- Use emoji prefixes: ✅ ❌ ℹ️ 📋 🚀 🔀 🔗 ⬇️ 🧪 🔍 📝 🗑️ ⚠️
