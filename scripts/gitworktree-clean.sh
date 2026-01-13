#!/bin/bash
#
# gitworktree-clean.sh
# Script para limpar worktrees órfãos/stale
#

set -e

# ============================================================================
# CORES E FORMATAÇÃO
# ============================================================================

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

print_error() { echo -e "${RED}❌ Erro: $1${NC}" >&2; }
print_success() { echo -e "${GREEN}✅ $1${NC}"; }
print_info() { echo -e "${BLUE}ℹ️  $1${NC}"; }
print_warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }
print_step() { echo -e "${CYAN}$1${NC}"; }

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
        fi
    fi

    echo "$base"
}

get_main_worktree_path() {
    git worktree list --porcelain | grep -m1 "^worktree " | sed 's/^worktree //'
}

# ============================================================================
# HELP
# ============================================================================

show_help() {
    echo "Uso: $0 [flags]"
    echo ""
    echo "Limpa worktrees órfãos ou stale."
    echo ""
    echo "Flags:"
    echo "  --dry-run    Apenas mostrar o que seria removido"
    echo "  -h, --help   Mostrar esta ajuda"
    echo ""
    echo "Categorias de worktrees órfãos detectados:"
    echo "  - Diretório não existe mais"
    echo "  - Branch já foi mergeada na main"
    echo "  - Branch remota foi deletada"
    echo "  - Tracking remoto marcado como 'gone'"
    exit 0
}

# ============================================================================
# PARSING DE ARGUMENTOS
# ============================================================================

DRY_RUN=false

while [[ $# -gt 0 ]]; do
    case $1 in
        --dry-run)
            DRY_RUN=true
            shift
            ;;
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

if ! git worktree list --porcelain &>/dev/null; then
    print_error "git worktree não está disponível (requer Git 2.5+)"
    exit 1
fi

MAIN_BRANCH=$(get_base_branch)
MAIN_WORKTREE=$(get_main_worktree_path)

print_info "Branch principal: $MAIN_BRANCH"
print_info "Worktree principal: $MAIN_WORKTREE"

# ============================================================================
# FASE 2: SINCRONIZAR COM REMOTE
# ============================================================================

echo ""
print_step "🔄 Fase 2: Sincronizando com remote"

print_info "Atualizando refs..."
git fetch --prune origin 2>/dev/null || true
git remote prune origin 2>/dev/null || true
print_success "Remote refs atualizadas"

# ============================================================================
# FASE 3: IDENTIFICAR WORKTREES ÓRFÃOS
# ============================================================================

echo ""
print_step "🔍 Fase 3: Identificando worktrees órfãos"

declare -A STALE_WORKTREES
declare -A STALE_REASONS

# Listar todos worktrees (exceto o principal)
while IFS= read -r line; do
    if [[ "$line" =~ ^worktree\ (.+)$ ]]; then
        current_path="${BASH_REMATCH[1]}"
    elif [[ "$line" =~ ^branch\ refs/heads/(.+)$ ]]; then
        current_branch="${BASH_REMATCH[1]}"

        # Pular worktree principal
        if [ "$current_path" = "$MAIN_WORKTREE" ]; then
            continue
        fi

        # Categoria 1: Diretório não existe
        if [ ! -d "$current_path" ]; then
            STALE_WORKTREES["$current_path"]="$current_branch"
            STALE_REASONS["$current_path"]="diretório não existe"
            continue
        fi

        # Categoria 2: Branch já mergeada
        if [ -n "$MAIN_BRANCH" ]; then
            if git branch --merged "$MAIN_BRANCH" 2>/dev/null | grep -qw "$current_branch"; then
                STALE_WORKTREES["$current_path"]="$current_branch"
                STALE_REASONS["$current_path"]="mergeada em $MAIN_BRANCH"
                continue
            fi
        fi

        # Categoria 3: Branch remota deletada
        if ! git show-ref --verify --quiet "refs/remotes/origin/$current_branch" 2>/dev/null; then
            # Verificar se a branch tem upstream configurado
            if git config "branch.$current_branch.remote" &>/dev/null; then
                STALE_WORKTREES["$current_path"]="$current_branch"
                STALE_REASONS["$current_path"]="branch remota deletada"
                continue
            fi
        fi
    fi
done < <(git worktree list --porcelain)

# Categoria 4: Branches com tracking 'gone'
while IFS= read -r gone_line; do
    gone_branch=$(echo "$gone_line" | awk '{print $1}')

    for path in "${!STALE_WORKTREES[@]}"; do
        if [ "${STALE_WORKTREES[$path]}" = "$gone_branch" ] && [ -z "${STALE_REASONS[$path]}" ]; then
            STALE_REASONS["$path"]="remote tracking gone"
        fi
    done
done < <(git branch -vv 2>/dev/null | grep ': gone]' || true)

# ============================================================================
# FASE 4: APRESENTAR RESULTADOS
# ============================================================================

echo ""
print_step "📋 Fase 4: Resultados"

if [ ${#STALE_WORKTREES[@]} -eq 0 ]; then
    print_success "Nenhum worktree órfão encontrado"
    echo ""
    print_success "🎉 Todos os worktrees estão limpos!"
    exit 0
fi

echo ""
echo -e "${YELLOW}🧹 Worktrees órfãos encontrados: ${#STALE_WORKTREES[@]}${NC}"
echo ""

i=1
for path in "${!STALE_WORKTREES[@]}"; do
    branch="${STALE_WORKTREES[$path]}"
    reason="${STALE_REASONS[$path]}"

    echo "  $i. $branch"
    echo "     📂 Path: $path"
    echo "     📋 Motivo: $reason"

    # Verificar mudanças não commitadas
    if [ -d "$path" ]; then
        uncommitted=$(git -C "$path" status --porcelain 2>/dev/null | wc -l | tr -d ' ')
        if [ "$uncommitted" -gt 0 ]; then
            echo -e "     ${YELLOW}⚠️  Status: $uncommitted mudanças não commitadas${NC}"
        else
            echo "     ✅ Status: limpo"
        fi
    fi

    echo ""
    ((i++))
done

# Dry run mode
if [ "$DRY_RUN" = true ]; then
    print_info "🔍 Modo dry-run: nenhuma ação será tomada"
    echo ""
    print_info "💡 Execute sem --dry-run para remover estes worktrees"
    exit 0
fi

# ============================================================================
# FASE 5: CONFIRMAR LIMPEZA
# ============================================================================

echo ""
select_option "Deseja remover estes worktrees órfãos?" \
    "Sim, remover todos (${#STALE_WORKTREES[@]} worktrees)" \
    "Cancelar"
choice=$?

if [ $choice -ne 0 ]; then
    print_info "Operação cancelada"
    exit 0
fi

# ============================================================================
# FASE 6: REMOVER WORKTREES
# ============================================================================

echo ""
print_step "🗑️  Fase 5: Removendo worktrees"

SUCCESS_COUNT=0
FAILURE_COUNT=0
DELETED_BRANCHES=()

for path in "${!STALE_WORKTREES[@]}"; do
    branch="${STALE_WORKTREES[$path]}"

    echo ""
    print_info "Removendo: $branch"

    # Verificar mudanças não commitadas
    if [ -d "$path" ]; then
        uncommitted=$(git -C "$path" status --porcelain 2>/dev/null | wc -l | tr -d ' ')
        if [ "$uncommitted" -gt 0 ]; then
            print_warning "$branch tem $uncommitted mudanças não commitadas"
            if ! confirm "Forçar remoção (PERDE mudanças)?"; then
                print_info "Pulando $branch"
                ((FAILURE_COUNT++))
                continue
            fi
            FORCE_FLAG="--force"
        else
            FORCE_FLAG=""
        fi
    else
        FORCE_FLAG=""
    fi

    # Remover worktree
    # shellcheck disable=SC2086
    if git worktree remove "$path" $FORCE_FLAG 2>/dev/null; then
        print_success "Removido: $branch"
        ((SUCCESS_COUNT++))
        DELETED_BRANCHES+=("$branch")
    else
        # Tentar com force se falhou
        if git worktree remove "$path" --force 2>/dev/null; then
            print_success "Removido (forçado): $branch"
            ((SUCCESS_COUNT++))
            DELETED_BRANCHES+=("$branch")
        else
            print_error "Falha ao remover: $branch"
            ((FAILURE_COUNT++))
        fi
    fi
done

# Prune
print_info "Limpando metadados..."
git worktree prune
print_success "Limpeza administrativa concluída"

# ============================================================================
# FASE 7: LIMPAR BRANCHES ÓRFÃS (opcional)
# ============================================================================

if [ ${#DELETED_BRANCHES[@]} -gt 0 ]; then
    echo ""
    print_step "🏷️  Fase 6: Branches órfãs"

    ORPHANED_BRANCHES=()
    for branch in "${DELETED_BRANCHES[@]}"; do
        if git show-ref --verify --quiet "refs/heads/$branch" 2>/dev/null; then
            ORPHANED_BRANCHES+=("$branch")
        fi
    done

    if [ ${#ORPHANED_BRANCHES[@]} -gt 0 ]; then
        echo ""
        echo "Branches locais órfãs encontradas:"
        for branch in "${ORPHANED_BRANCHES[@]}"; do
            echo "  - $branch"
        done
        echo ""

        if confirm "Deseja deletar estas branches também?"; then
            BRANCH_DELETE_COUNT=0
            for branch in "${ORPHANED_BRANCHES[@]}"; do
                if git branch -D "$branch" 2>/dev/null; then
                    print_success "Branch deletada: $branch"
                    ((BRANCH_DELETE_COUNT++))
                else
                    print_warning "Falha ao deletar branch: $branch"
                fi
            done
        else
            print_info "Branches mantidas"
            BRANCH_DELETE_COUNT=0
        fi
    fi
fi

# ============================================================================
# FASE 8: RELATÓRIO FINAL
# ============================================================================

echo ""
print_step "📊 Relatório Final"
echo ""
echo "  ✅ Worktrees removidos: $SUCCESS_COUNT"
echo "  ❌ Falhas: $FAILURE_COUNT"
echo "  🏷️  Branches deletadas: ${BRANCH_DELETE_COUNT:-0}"
echo ""

# Listar worktrees restantes
print_info "Worktrees restantes:"
git worktree list
echo ""

print_success "💡 Dica: Execute regularmente para manter worktrees limpos"
