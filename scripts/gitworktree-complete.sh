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

CONTINUE=false

while [[ $# -gt 0 ]]; do
    case $1 in
        --continue)
            CONTINUE=true
            shift
            ;;
        -h|--help)
            echo "Uso: $0 [--continue]"
            echo ""
            echo "Opções:"
            echo "  --continue  Mantém worktree e branch após conclusão sem perguntar"
            echo ""
            echo "Sem parâmetros: push + merge direto + pergunta sobre limpeza"
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

# 1.2 Detecta branch principal
BASE_BRANCH=$(get_base_branch)
print_info "Branch principal: $BASE_BRANCH"

# 1.3 Obtém branch atual
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

# 1.4 Obtém caminhos das worktrees
CURRENT_WORKTREE_PATH=$(git rev-parse --show-toplevel)
MAIN_WORKTREE_PATH=$(get_main_worktree_path)
print_info "Worktree atual: $CURRENT_WORKTREE_PATH"
print_info "Worktree principal: $MAIN_WORKTREE_PATH"

# 1.5 Verifica commits à frente
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
# FASE 5: MERGE DIRETO
# ============================================================================

echo ""
print_step "🔀 Fase 5: Merge direto"

# 5.1 Atualiza branch principal
print_info "Atualizando $BASE_BRANCH..."
if ! git -C "$MAIN_WORKTREE_PATH" checkout "$BASE_BRANCH" 2>/dev/null; then
    print_error "falha ao fazer checkout de $BASE_BRANCH"
    exit 1
fi

if ! git -C "$MAIN_WORKTREE_PATH" pull origin "$BASE_BRANCH"; then
    print_error "falha ao atualizar $BASE_BRANCH"
    exit 1
fi

# 5.2 Merge
print_info "Mergeando $CURRENT_BRANCH em $BASE_BRANCH..."
if ! git -C "$MAIN_WORKTREE_PATH" merge "$CURRENT_BRANCH" --no-ff -m "merge: $CURRENT_BRANCH"; then
    print_error "conflitos no merge. Resolva manualmente em $MAIN_WORKTREE_PATH"
    exit 1
fi

# 5.3 Push
print_info "Enviando $BASE_BRANCH para origin..."
if ! git -C "$MAIN_WORKTREE_PATH" push origin "$BASE_BRANCH"; then
    print_error "falha no push para $BASE_BRANCH"
    exit 1
fi

print_success "Branch mergeada diretamente em $BASE_BRANCH"

# 5.4 Limpeza
WORKTREE_STATUS="mantido"
if [ "$CONTINUE" = false ]; then
    echo ""
    if confirm "Deseja deletar o worktree e a branch?"; then
        print_info "Removendo worktree e branch..."

        # Remove branch remota
        git push origin --delete "$CURRENT_BRANCH" 2>/dev/null || true

        # Remove worktree
        if ! git -C "$MAIN_WORKTREE_PATH" worktree remove "$CURRENT_WORKTREE_PATH" 2>/dev/null; then
            git -C "$MAIN_WORKTREE_PATH" worktree remove "$CURRENT_WORKTREE_PATH" --force 2>/dev/null || true
        fi

        # Remove branch local
        git -C "$MAIN_WORKTREE_PATH" branch -d "$CURRENT_BRANCH" 2>/dev/null || \
        git -C "$MAIN_WORKTREE_PATH" branch -D "$CURRENT_BRANCH" 2>/dev/null || true

        WORKTREE_STATUS="removido"
        print_success "Worktree e branch removidos"
    else
        print_info "Worktree mantido: $CURRENT_WORKTREE_PATH"
    fi
else
    print_info "Flag --continue: mantendo worktree e branch"
fi

# ============================================================================
# FASE 6: RELATÓRIO FINAL
# ============================================================================

echo ""
print_step "📋 Relatório Final"
echo ""
echo "  ✅ Push realizado"
echo "  ✅ Merge direto em $BASE_BRANCH"

if [ "$WORKTREE_STATUS" = "mantido" ]; then
    echo "  📂 Worktree mantido: $CURRENT_WORKTREE_PATH"
    echo "  🌿 Branch atual: $CURRENT_BRANCH"
else
    echo "  🗑️  Worktree removido"
    echo "  📍 Navegue para: cd $MAIN_WORKTREE_PATH"
fi

echo ""
print_success "Workflow concluído!"
