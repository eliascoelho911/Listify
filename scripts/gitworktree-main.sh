#!/bin/bash
#
# gitworktree-main.sh
# Script para navegar para o worktree principal (main/master)
#

set -e

# ============================================================================
# CORES E FORMATAÇÃO
# ============================================================================

RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

print_error() { echo -e "${RED}❌ Erro: $1${NC}" >&2; }
print_success() { echo -e "${GREEN}✅ $1${NC}"; }
print_info() { echo -e "${BLUE}ℹ️  $1${NC}"; }
print_step() { echo -e "${CYAN}$1${NC}"; }

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
        fi
    fi

    echo "$base"
}

get_main_worktree_path() {
    git worktree list --porcelain | grep -m1 "^worktree " | sed 's/^worktree //'
}

get_worktree_path_for_branch() {
    local branch="$1"
    git worktree list --porcelain | awk -v b="refs/heads/$branch" '
        /^worktree / { path = substr($0, 10) }
        /^branch / && $2 == b { print path }
    '
}

# ============================================================================
# HELP
# ============================================================================

show_help() {
    echo "Uso: $0"
    echo ""
    echo "Navega para o worktree da branch principal (main/master)."
    echo ""
    echo "Este script detecta automaticamente se a branch principal é 'main' ou 'master'"
    echo "e navega para o worktree correspondente."
    echo ""
    echo "Flags:"
    echo "  -h, --help   Mostrar esta ajuda"
    exit 0
}

# ============================================================================
# PARSING DE ARGUMENTOS
# ============================================================================

while [[ $# -gt 0 ]]; do
    case $1 in
        -h|--help)
            show_help
            ;;
        *)
            print_error "argumento desconhecido: $1"
            exit 1
            ;;
    esac
done

# ============================================================================
# FASE 1: VALIDAÇÕES
# ============================================================================

echo ""
print_step "🔍 Fase 1: Validações"

if ! git rev-parse --is-inside-work-tree &>/dev/null; then
    print_error "não está em um repositório git"
    exit 1
fi

# ============================================================================
# FASE 2: DETECTAR BRANCH PRINCIPAL
# ============================================================================

echo ""
print_step "🔍 Fase 2: Detectando branch principal"

MAIN_BRANCH=$(get_base_branch)

if [ -z "$MAIN_BRANCH" ]; then
    print_error "branch principal não encontrada (tentou: main, master)"
    exit 1
fi

# Verificar se branch existe
if ! git show-ref --verify --quiet "refs/heads/$MAIN_BRANCH" 2>/dev/null; then
    print_error "branch principal não existe localmente: $MAIN_BRANCH"
    exit 1
fi

print_info "Branch principal: $MAIN_BRANCH"

# ============================================================================
# FASE 3: ENCONTRAR WORKTREE
# ============================================================================

echo ""
print_step "📂 Fase 3: Localizando worktree"

MAIN_WORKTREE=$(get_worktree_path_for_branch "$MAIN_BRANCH")

if [ -z "$MAIN_WORKTREE" ]; then
    # Fallback: usar o primeiro worktree listado (geralmente é o principal)
    MAIN_WORKTREE=$(get_main_worktree_path)
fi

if [ -z "$MAIN_WORKTREE" ]; then
    print_error "não foi possível localizar o worktree principal"
    exit 1
fi

if [ ! -d "$MAIN_WORKTREE" ]; then
    print_error "diretório do worktree não existe: $MAIN_WORKTREE"
    exit 1
fi

print_info "Worktree: $MAIN_WORKTREE"

# ============================================================================
# FASE 4: VERIFICAR SE JÁ ESTÁ NO MAIN
# ============================================================================

CURRENT_WORKTREE=$(git rev-parse --show-toplevel)

if [ "$CURRENT_WORKTREE" = "$MAIN_WORKTREE" ]; then
    print_success "Já está no worktree principal!"
    echo ""
    print_info "Branch: $MAIN_BRANCH"
    print_info "Path: $MAIN_WORKTREE"
    echo ""
    git status --short --branch
    exit 0
fi

# ============================================================================
# FASE 5: RELATÓRIO FINAL
# ============================================================================

echo ""
print_step "📋 Relatório Final"
echo ""
echo "  ✅ Worktree principal: $MAIN_BRANCH"
echo "  📂 Path: $MAIN_WORKTREE"
echo ""

print_info "Status da branch:"
cd "$MAIN_WORKTREE"
git status --short --branch
echo ""

echo "Execute: cd \"$MAIN_WORKTREE\""

print_success "Navegação pronta!"
