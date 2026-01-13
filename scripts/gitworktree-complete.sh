#!/bin/bash
#
# gitworktree-complete.sh
# Workflow completo de conclusão de trabalho em worktrees
# Replica o comportamento do skill /gitworktree.complete do Claude Code
#

set -e

# ============================================================================
# CORES E FORMATAÇÃO
# ============================================================================

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_error() {
    echo -e "${RED}❌ Erro: $1${NC}" >&2
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_step() {
    echo -e "${BLUE}$1${NC}"
}

# ============================================================================
# FUNÇÕES DE INTERAÇÃO
# ============================================================================

confirm() {
    local prompt="$1"
    local response
    echo -en "${YELLOW}$prompt [s/n]: ${NC}"
    read -r response
    case "$response" in
        [sS]|[yY]|[sS][iI][mM]|[yY][eE][sS]) return 0 ;;
        *) return 1 ;;
    esac
}

select_option() {
    local prompt="$1"
    shift
    local options=("$@")
    local i=1

    echo -e "${YELLOW}$prompt${NC}"
    for opt in "${options[@]}"; do
        echo "  $i) $opt"
        ((i++))
    done

    local choice
    echo -en "Escolha [1-${#options[@]}]: "
    read -r choice

    if [[ "$choice" =~ ^[0-9]+$ ]] && [ "$choice" -ge 1 ] && [ "$choice" -le "${#options[@]}" ]; then
        return $((choice - 1))
    else
        return 255
    fi
}

# ============================================================================
# FUNÇÕES GIT HELPERS
# ============================================================================

get_base_branch() {
    local base
    base=$(git symbolic-ref refs/remotes/origin/HEAD 2>/dev/null | sed 's@^refs/remotes/origin/@@')

    if [ -z "$base" ]; then
        if git show-ref --verify --quiet refs/heads/main 2>/dev/null; then
            base="main"
        elif git show-ref --verify --quiet refs/heads/master 2>/dev/null; then
            base="master"
        else
            print_error "não foi possível detectar a branch principal (main/master)"
            exit 1
        fi
    fi

    echo "$base"
}

get_main_worktree_path() {
    git worktree list --porcelain | grep -m1 "^worktree " | sed 's/^worktree //'
}

# ============================================================================
# PARSING DE ARGUMENTOS
# ============================================================================

NO_PR=false
CONTINUE=false

while [[ $# -gt 0 ]]; do
    case $1 in
        --no-pr)
            NO_PR=true
            shift
            ;;
        --continue)
            CONTINUE=true
            shift
            ;;
        -h|--help)
            echo "Uso: $0 [--no-pr] [--continue]"
            echo ""
            echo "Opções:"
            echo "  --no-pr     Merge direto na main sem criar PR"
            echo "  --continue  Mantém worktree e branch após conclusão"
            echo ""
            echo "Sem parâmetros: push + PR + pergunta sobre limpeza"
            exit 0
            ;;
        *)
            print_error "parâmetro desconhecido: $1"
            exit 1
            ;;
    esac
done

# ============================================================================
# FASE 1: VALIDAÇÕES
# ============================================================================

echo ""
print_step "🔍 Fase 1: Validações"

# 1.1 Verifica repositório git
if ! git rev-parse --is-inside-work-tree &>/dev/null; then
    print_error "não está em um repositório git"
    exit 1
fi

# 1.2 Verifica gh CLI (apenas se não for --no-pr)
if [ "$NO_PR" = false ]; then
    if ! command -v gh &>/dev/null; then
        print_error "gh CLI não instalado (necessário para criar PR)"
        exit 1
    fi

    if ! gh auth status &>/dev/null; then
        print_error "gh CLI não autenticado. Execute: gh auth login"
        exit 1
    fi
fi

# 1.3 Detecta branch principal
BASE_BRANCH=$(get_base_branch)
print_info "Branch principal: $BASE_BRANCH"

# 1.4 Obtém branch atual
CURRENT_BRANCH=$(git branch --show-current)
if [ -z "$CURRENT_BRANCH" ]; then
    print_error "não está em uma branch (detached HEAD?)"
    exit 1
fi

if [ "$CURRENT_BRANCH" = "$BASE_BRANCH" ]; then
    print_error "você está na branch principal ($BASE_BRANCH), não há nada para completar"
    exit 1
fi
print_info "Branch atual: $CURRENT_BRANCH"

# 1.5 Obtém caminhos das worktrees
CURRENT_WORKTREE_PATH=$(git rev-parse --show-toplevel)
MAIN_WORKTREE_PATH=$(get_main_worktree_path)
print_info "Worktree atual: $CURRENT_WORKTREE_PATH"
print_info "Worktree principal: $MAIN_WORKTREE_PATH"

# 1.6 Verifica commits à frente
COMMIT_COUNT=$(git log "$BASE_BRANCH"..HEAD --oneline 2>/dev/null | wc -l | tr -d ' ')
if [ "$COMMIT_COUNT" -eq 0 ]; then
    print_error "nenhum commit novo em relação a $BASE_BRANCH"
    exit 1
fi
print_info "Commits à frente: $COMMIT_COUNT"

print_success "Validações concluídas"

# ============================================================================
# FASE 2: MUDANÇAS NÃO COMMITADAS
# ============================================================================

echo ""
print_step "📝 Fase 2: Verificando mudanças não commitadas"

UNCOMMITTED=$(git status --porcelain)
if [ -n "$UNCOMMITTED" ]; then
    print_warning "Há mudanças não commitadas:"
    echo ""
    git status --short
    echo ""

    select_option "O que deseja fazer?" "Continuar sem commitar" "Cancelar"
    choice=$?

    case $choice in
        0)
            print_info "Continuando sem commitar (mudanças não serão incluídas)"
            ;;
        1|255)
            print_info "Operação cancelada"
            exit 0
            ;;
    esac
else
    print_success "Nenhuma mudança não commitada"
fi

# ============================================================================
# FASE 3: TESTES E LINT
# ============================================================================

echo ""
print_step "🧪 Fase 3: Executando testes e lint"

print_info "Executando testes..."
if ! npm test; then
    print_error "testes falharam"
    exit 1
fi
print_success "Testes passaram"

print_info "Executando lint..."
if ! npm run lint; then
    print_error "lint falhou (política de zero warnings)"
    exit 1
fi
print_success "Lint passou"

print_success "Testes e lint passaram"

# ============================================================================
# FASE 4: PUSH
# ============================================================================

echo ""
print_step "🚀 Fase 4: Push para origin"

NEEDS_UPSTREAM=false
if ! git rev-parse --abbrev-ref --symbolic-full-name @{u} &>/dev/null; then
    NEEDS_UPSTREAM=true
fi

print_info "Enviando para origin..."
if [ "$NEEDS_UPSTREAM" = true ]; then
    if ! git push -u origin "$CURRENT_BRANCH"; then
        print_error "falha no push"
        exit 1
    fi
else
    if ! git push; then
        print_error "falha no push"
        exit 1
    fi
fi

print_success "Push realizado com sucesso"

# ============================================================================
# FASE 5: PR OU MERGE DIRETO
# ============================================================================

if [ "$NO_PR" = false ]; then
    # ========================================================================
    # FASE 5A: CRIAR PR
    # ========================================================================

    echo ""
    print_step "📝 Fase 5: Criando Pull Request"

    # 5A.1 Gerar título da PR
    if [ "$COMMIT_COUNT" -eq 1 ]; then
        PR_TITLE=$(git log -1 --format="%s")
    else
        # Analisa tipos de commits
        COMMITS=$(git log "$BASE_BRANCH"..HEAD --format="%s")

        # Conta tipos
        FEAT_COUNT=$(echo "$COMMITS" | grep -c "^feat" || true)
        FIX_COUNT=$(echo "$COMMITS" | grep -c "^fix" || true)
        REFACTOR_COUNT=$(echo "$COMMITS" | grep -c "^refactor" || true)
        CHORE_COUNT=$(echo "$COMMITS" | grep -c "^chore" || true)

        # Determina tipo predominante
        MAX_COUNT=$FEAT_COUNT
        TYPE="feat"

        if [ "$FIX_COUNT" -gt "$MAX_COUNT" ]; then
            MAX_COUNT=$FIX_COUNT
            TYPE="fix"
        fi
        if [ "$REFACTOR_COUNT" -gt "$MAX_COUNT" ]; then
            MAX_COUNT=$REFACTOR_COUNT
            TYPE="refactor"
        fi
        if [ "$CHORE_COUNT" -gt "$MAX_COUNT" ]; then
            TYPE="chore"
        fi

        # Extrai escopo da branch
        SCOPE=""
        if [[ "$CURRENT_BRANCH" =~ ^[a-z]+/(.+)$ ]]; then
            SCOPE="${BASH_REMATCH[1]}"
        fi

        if [ -n "$SCOPE" ]; then
            PR_TITLE="$TYPE($SCOPE): múltiplas alterações ($COMMIT_COUNT commits)"
        else
            PR_TITLE="$TYPE: múltiplas alterações ($COMMIT_COUNT commits)"
        fi
    fi

    print_info "Título da PR: $PR_TITLE"

    # 5A.2 Listar arquivos modificados
    MODIFIED_FILES=$(git diff --name-only "$BASE_BRANCH"...HEAD)

    # 5A.3 Gerar checklist condicional
    CHECKLIST="- [x] ✅ Testes passando (npm test)
- [x] ✅ Linting passando (npm run lint)"

    if echo "$MODIFIED_FILES" | grep -q "src/design-system/"; then
        CHECKLIST="$CHECKLIST
- [ ] ✅ Tokens do Design System utilizados"
    fi

    if echo "$MODIFIED_FILES" | grep -q "\.stories\.tsx"; then
        CHECKLIST="$CHECKLIST
- [ ] ✅ Stories do Storybook validadas"
    fi

    if echo "$MODIFIED_FILES" | grep -qE "\.(ts|tsx)$"; then
        CHECKLIST="$CHECKLIST
- [ ] ✅ Tipagem TypeScript estrita"
    fi

    if echo "$MODIFIED_FILES" | grep -q "src/presentation/"; then
        CHECKLIST="$CHECKLIST
- [ ] ✅ Chaves i18n adicionadas"
    fi

    if echo "$MODIFIED_FILES" | grep -qE "src/(domain|infra)/"; then
        CHECKLIST="$CHECKLIST
- [ ] ✅ Clean Architecture respeitada"
    fi

    # 5A.4 Gerar descrição
    PR_BODY="## Resumo
- Implementação da branch \`$CURRENT_BRANCH\`
- Total de $COMMIT_COUNT commit(s)

## Checklist
$CHECKLIST

🤖 Gerado com [Claude Code](https://claude.com/claude-code)"

    # 5A.5 Criar PR
    print_info "Criando PR..."
    if ! PR_URL=$(gh pr create --title "$PR_TITLE" --body "$PR_BODY" 2>&1); then
        # Verifica se já existe PR
        if echo "$PR_URL" | grep -q "already exists"; then
            print_warning "PR já existe para esta branch"
            PR_URL=$(gh pr view --json url -q .url 2>/dev/null || echo "")
        else
            print_error "falha ao criar PR: $PR_URL"
            exit 1
        fi
    fi

    if [ -z "$PR_URL" ]; then
        PR_URL=$(gh pr view --json url -q .url 2>/dev/null || echo "URL não disponível")
    fi

    print_success "Pull Request criado!"
    echo -e "${GREEN}🔗 URL: $PR_URL${NC}"

    # 5A.6 Limpeza (se não --continue)
    WORKTREE_STATUS="mantido"
    if [ "$CONTINUE" = false ]; then
        echo ""
        if confirm "Deseja deletar o worktree e a branch?"; then
            print_info "Removendo worktree e branch..."

            # Remove worktree
            if ! git -C "$MAIN_WORKTREE_PATH" worktree remove "$CURRENT_WORKTREE_PATH" 2>/dev/null; then
                git -C "$MAIN_WORKTREE_PATH" worktree remove "$CURRENT_WORKTREE_PATH" --force 2>/dev/null || true
            fi

            # Remove branch local
            git -C "$MAIN_WORKTREE_PATH" branch -d "$CURRENT_BRANCH" 2>/dev/null || \
            git -C "$MAIN_WORKTREE_PATH" branch -D "$CURRENT_BRANCH" 2>/dev/null || true

            WORKTREE_STATUS="removido"
            print_success "Worktree e branch removidos"

            echo ""
            print_info "Navegue para o worktree principal:"
            echo "  cd $MAIN_WORKTREE_PATH"
        else
            print_info "Worktree mantido: $CURRENT_WORKTREE_PATH"
        fi
    else
        print_info "Flag --continue: mantendo worktree e branch"
    fi

else
    # ========================================================================
    # FASE 5B: MERGE DIRETO
    # ========================================================================

    echo ""
    print_step "🔀 Fase 5: Merge direto (--no-pr)"

    # 5B.1 Atualiza branch principal
    print_info "Atualizando $BASE_BRANCH..."
    if ! git -C "$MAIN_WORKTREE_PATH" checkout "$BASE_BRANCH" 2>/dev/null; then
        print_error "falha ao fazer checkout de $BASE_BRANCH"
        exit 1
    fi

    if ! git -C "$MAIN_WORKTREE_PATH" pull origin "$BASE_BRANCH"; then
        print_error "falha ao atualizar $BASE_BRANCH"
        exit 1
    fi

    # 5B.2 Merge
    print_info "Mergeando $CURRENT_BRANCH em $BASE_BRANCH..."
    if ! git -C "$MAIN_WORKTREE_PATH" merge "$CURRENT_BRANCH" --no-ff -m "merge: $CURRENT_BRANCH"; then
        print_error "conflitos no merge. Resolva manualmente em $MAIN_WORKTREE_PATH"
        exit 1
    fi

    # 5B.3 Push
    print_info "Enviando $BASE_BRANCH para origin..."
    if ! git -C "$MAIN_WORKTREE_PATH" push origin "$BASE_BRANCH"; then
        print_error "falha no push para $BASE_BRANCH"
        exit 1
    fi

    print_success "Branch mergeada diretamente em $BASE_BRANCH"

    # 5B.4 Limpeza (se não --continue)
    WORKTREE_STATUS="removido"
    if [ "$CONTINUE" = false ]; then
        print_info "Limpando worktree e branch..."

        # Remove branch remota
        git push origin --delete "$CURRENT_BRANCH" 2>/dev/null || true

        # Remove branch local
        git -C "$MAIN_WORKTREE_PATH" branch -d "$CURRENT_BRANCH" 2>/dev/null || \
        git -C "$MAIN_WORKTREE_PATH" branch -D "$CURRENT_BRANCH" 2>/dev/null || true

        # Remove worktree
        if ! git -C "$MAIN_WORKTREE_PATH" worktree remove "$CURRENT_WORKTREE_PATH" 2>/dev/null; then
            git -C "$MAIN_WORKTREE_PATH" worktree remove "$CURRENT_WORKTREE_PATH" --force 2>/dev/null || true
        fi

        print_success "Worktree e branch removidos"
    else
        WORKTREE_STATUS="mantido"
        print_info "Flag --continue: mantendo worktree e branch"
    fi
fi

# ============================================================================
# FASE 6: RELATÓRIO FINAL
# ============================================================================

echo ""
print_step "📋 Relatório Final"
echo ""
echo "  ✅ Push realizado"

if [ "$NO_PR" = false ]; then
    echo "  ✅ PR criado: $PR_URL"
    echo "  📂 Worktree: $WORKTREE_STATUS"
else
    echo "  ✅ Merge direto em $BASE_BRANCH"
    echo "  🗑️  Worktree: $WORKTREE_STATUS"
fi

if [ "$CONTINUE" = true ] || [ "$WORKTREE_STATUS" = "mantido" ]; then
    echo "  📍 Você está em: $CURRENT_WORKTREE_PATH"
else
    echo "  📍 Navegue para: cd $MAIN_WORKTREE_PATH"
fi

echo ""
print_success "Workflow concluído!"
