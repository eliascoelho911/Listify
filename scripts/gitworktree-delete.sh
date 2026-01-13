#!/bin/bash
#
# gitworktree-delete.sh
# Script para deletar um worktree e opcionalmente sua branch
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

get_main_worktree_path() {
    git worktree list --porcelain | grep -m1 "^worktree " | sed 's/^worktree //'
}

is_main_worktree() {
    local path="$1"
    local main_path
    main_path=$(get_main_worktree_path)
    [ "$path" = "$main_path" ]
}

list_worktrees() {
    git worktree list --porcelain | awk '
        /^worktree / { path = substr($0, 10) }
        /^HEAD / { head = substr($0, 6) }
        /^branch / {
            branch = substr($0, 8)
            sub(/^refs\/heads\//, "", branch)
            print branch "|" path "|" head
        }
    '
}

# ============================================================================
# HELP
# ============================================================================

show_help() {
    echo "Uso: $0 [branch-ou-path]"
    echo ""
    echo "Remove um git worktree e opcionalmente sua branch."
    echo ""
    echo "Argumentos:"
    echo "  branch-ou-path    Nome da branch ou path do worktree (opcional)"
    echo "                    Se omitido, modo interativo é usado"
    echo ""
    echo "Flags:"
    echo "  -h, --help        Mostrar esta ajuda"
    echo ""
    echo "Exemplos:"
    echo "  $0                           # Modo interativo"
    echo "  $0 feat/nova-feature         # Deletar por nome de branch"
    echo "  $0 /path/to/worktree         # Deletar por path"
    exit 0
}

# ============================================================================
# PARSING DE ARGUMENTOS
# ============================================================================

TARGET=""

while [[ $# -gt 0 ]]; do
    case $1 in
        -h|--help)
            show_help
            ;;
        -*)
            print_error "flag desconhecida: $1"
            exit 1
            ;;
        *)
            if [ -z "$TARGET" ]; then
                TARGET="$1"
            else
                print_error "argumento inesperado: $1"
                exit 1
            fi
            shift
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

CURRENT_WORKTREE=$(git rev-parse --show-toplevel)
MAIN_WORKTREE=$(get_main_worktree_path)

print_info "Worktree atual: $CURRENT_WORKTREE"
print_info "Worktree principal: $MAIN_WORKTREE"

# ============================================================================
# FASE 2: SELECIONAR WORKTREE
# ============================================================================

echo ""
print_step "📋 Fase 2: Selecionando worktree"

TARGET_BRANCH=""
TARGET_PATH=""

if [ -z "$TARGET" ]; then
    # Modo interativo
    mapfile -t worktrees < <(list_worktrees)

    # Filtrar worktree principal
    deletable_worktrees=()
    for wt in "${worktrees[@]}"; do
        path=$(echo "$wt" | cut -d'|' -f2)
        if ! is_main_worktree "$path"; then
            deletable_worktrees+=("$wt")
        fi
    done

    if [ ${#deletable_worktrees[@]} -eq 0 ]; then
        print_info "Nenhum worktree disponível para remoção"
        exit 0
    fi

    echo ""
    echo "📋 Worktrees disponíveis para remoção:"
    i=1
    for wt in "${deletable_worktrees[@]}"; do
        branch=$(echo "$wt" | cut -d'|' -f1)
        path=$(echo "$wt" | cut -d'|' -f2)
        head=$(echo "$wt" | cut -d'|' -f3)
        short_head="${head:0:7}"

        # Verificar status
        if [ -d "$path" ]; then
            uncommitted=$(git -C "$path" status --porcelain 2>/dev/null | wc -l | tr -d ' ')
            if [ "$uncommitted" -gt 0 ]; then
                status="(dirty - $uncommitted mudanças)"
            else
                status="(clean)"
            fi
        else
            status="(diretório inexistente)"
        fi

        echo "  $i. $branch → $path [$short_head] $status"
        ((i++))
    done
    echo ""

    options=()
    for wt in "${deletable_worktrees[@]}"; do
        branch=$(echo "$wt" | cut -d'|' -f1)
        options+=("$branch")
    done

    select_option "Selecione o worktree para remover:" "${options[@]}"
    choice=$?

    if [ $choice -eq 255 ]; then
        print_error "opção inválida"
        exit 1
    fi

    selected="${deletable_worktrees[$choice]}"
    TARGET_BRANCH=$(echo "$selected" | cut -d'|' -f1)
    TARGET_PATH=$(echo "$selected" | cut -d'|' -f2)
else
    # Buscar por argumento
    found=false
    while IFS= read -r wt; do
        branch=$(echo "$wt" | cut -d'|' -f1)
        path=$(echo "$wt" | cut -d'|' -f2)

        # Match por branch exata
        if [ "$branch" = "$TARGET" ]; then
            TARGET_BRANCH="$branch"
            TARGET_PATH="$path"
            found=true
            break
        fi

        # Match por path
        if [ "$path" = "$TARGET" ]; then
            TARGET_BRANCH="$branch"
            TARGET_PATH="$path"
            found=true
            break
        fi

        # Match parcial (sem prefixo)
        if [[ "$branch" == *"/$TARGET" ]]; then
            TARGET_BRANCH="$branch"
            TARGET_PATH="$path"
            found=true
            break
        fi
    done < <(list_worktrees)

    if [ "$found" = false ]; then
        print_error "worktree não encontrado: $TARGET"
        exit 1
    fi
fi

# Verificar se é o worktree principal
if is_main_worktree "$TARGET_PATH"; then
    print_error "não é possível deletar o worktree principal"
    exit 1
fi

print_info "Branch: $TARGET_BRANCH"
print_info "Path: $TARGET_PATH"

# ============================================================================
# FASE 3: VALIDAR ESTADO
# ============================================================================

echo ""
print_step "🔍 Fase 3: Validando estado"

HAS_UNCOMMITTED=false
if [ -d "$TARGET_PATH" ]; then
    uncommitted=$(git -C "$TARGET_PATH" status --porcelain 2>/dev/null | wc -l | tr -d ' ')
    if [ "$uncommitted" -gt 0 ]; then
        HAS_UNCOMMITTED=true
        print_warning "Worktree tem $uncommitted mudanças não commitadas:"
        echo ""
        git -C "$TARGET_PATH" status --short
        echo ""
    fi
fi

IS_CURRENT=false
if [ "$TARGET_PATH" = "$CURRENT_WORKTREE" ]; then
    IS_CURRENT=true
    print_warning "Você está atualmente neste worktree"
    print_info "Você será retornado ao worktree principal após a remoção"
fi

# Mostrar resumo
echo ""
echo -e "${YELLOW}🗑️  Worktree a ser removido:${NC}"
echo "  - Branch: $TARGET_BRANCH"
echo "  - Path: $TARGET_PATH"

if [ -d "$TARGET_PATH" ]; then
    commit_msg=$(git -C "$TARGET_PATH" log -1 --format="%h %s" 2>/dev/null || echo "N/A")
    echo "  - Commit: $commit_msg"
fi

if [ "$HAS_UNCOMMITTED" = true ]; then
    echo -e "  - Estado: ${YELLOW}dirty ($uncommitted mudanças)${NC}"
else
    echo "  - Estado: clean"
fi
echo ""

# Confirmar
if ! confirm "Confirmar remoção do worktree?"; then
    print_info "Operação cancelada"
    exit 0
fi

# ============================================================================
# FASE 4: REMOVER WORKTREE
# ============================================================================

echo ""
print_step "🗑️  Fase 4: Removendo worktree"

# Tentar remoção normal
if git worktree remove "$TARGET_PATH" 2>/dev/null; then
    print_success "Worktree removido: $TARGET_PATH"
else
    # Falhou - provavelmente por mudanças não commitadas
    if [ "$HAS_UNCOMMITTED" = true ]; then
        echo ""
        if confirm "Forçar remoção (PERDE mudanças)?"; then
            if git worktree remove --force "$TARGET_PATH" 2>/dev/null; then
                print_success "Worktree removido (forçado): $TARGET_PATH"
            else
                print_error "falha ao remover worktree"
                exit 1
            fi
        else
            print_info "Operação cancelada"
            exit 0
        fi
    else
        print_error "falha ao remover worktree"
        exit 1
    fi
fi

# Verificar remoção
if [ -d "$TARGET_PATH" ]; then
    print_warning "Diretório ainda existe: $TARGET_PATH"
fi

# ============================================================================
# FASE 5: DELETAR BRANCH
# ============================================================================

echo ""
print_step "🏷️  Fase 5: Branch"

# Verificar se branch ainda existe
if ! git show-ref --verify --quiet "refs/heads/$TARGET_BRANCH" 2>/dev/null; then
    print_info "Branch já foi deletada ou não existe localmente"
else
    echo ""
    select_option "Deseja deletar a branch também?" \
        "Deletar branch local apenas" \
        "Deletar branch local E remota" \
        "Manter branch"
    choice=$?

    case $choice in
        0)
            # Deletar local apenas
            if git branch -d "$TARGET_BRANCH" 2>/dev/null; then
                print_success "Branch local deletada: $TARGET_BRANCH"
            else
                print_warning "Branch não está mergeada. Forçar deleção?"
                if confirm "Forçar deleção da branch local?"; then
                    if git branch -D "$TARGET_BRANCH" 2>/dev/null; then
                        print_success "Branch local deletada (forçada): $TARGET_BRANCH"
                    else
                        print_error "falha ao deletar branch"
                    fi
                else
                    print_info "Branch mantida"
                fi
            fi
            ;;
        1)
            # Deletar local e remota
            git branch -D "$TARGET_BRANCH" 2>/dev/null || true
            print_success "Branch local deletada: $TARGET_BRANCH"

            if git push origin --delete "$TARGET_BRANCH" 2>/dev/null; then
                print_success "Branch remota deletada: $TARGET_BRANCH"
            else
                print_warning "Falha ao deletar branch remota (pode não existir)"
            fi
            ;;
        *)
            print_info "Branch mantida: $TARGET_BRANCH"
            ;;
    esac
fi

# ============================================================================
# FASE 6: NAVEGAÇÃO (se necessário)
# ============================================================================

if [ "$IS_CURRENT" = true ]; then
    echo ""
    print_step "📂 Fase 6: Navegação"
    print_info "Retornando ao worktree principal..."
    echo ""
    echo "Execute: cd \"$MAIN_WORKTREE\""
fi

# ============================================================================
# FASE 7: RELATÓRIO FINAL
# ============================================================================

echo ""
print_step "📋 Relatório Final"
echo ""
echo "  ✅ Worktree removido"
echo "  📂 Path: $TARGET_PATH"
echo "  🏷️  Branch: $TARGET_BRANCH"
echo ""

print_info "Worktrees restantes:"
git worktree list

print_success "Operação concluída!"
