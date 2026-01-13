#!/bin/bash
#
# gitworktree.sh
# Script principal para criar ou navegar para git worktrees
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
        else
            print_error "não foi possível detectar a branch principal (main/master)"
            exit 1
        fi
    fi

    echo "$base"
}

sanitize_branch_name() {
    local input="$1"
    echo "$input" | tr '[:upper:]' '[:lower:]' | tr ' ' '-' | sed 's/[^a-z0-9/_-]//g' | sed 's/^-*//' | sed 's/-*$//'
}

get_worktree_path_for_branch() {
    local branch="$1"
    git worktree list --porcelain | awk -v b="refs/heads/$branch" '
        /^worktree / { path = substr($0, 10) }
        /^branch / && $2 == b { print path }
    '
}

list_worktrees() {
    local filter="$1"
    git worktree list --porcelain | awk -v filter="$filter" '
        /^worktree / { path = substr($0, 10) }
        /^branch / {
            branch = substr($0, 8)
            sub(/^refs\/heads\//, "", branch)
            if (filter == "" || index(branch, filter) == 1) {
                print branch "|" path
            }
        }
    '
}

# ============================================================================
# HELP
# ============================================================================

show_help() {
    echo "Uso: $0 [branch-name] [base-branch] [flags]"
    echo ""
    echo "Cria ou navega para um git worktree."
    echo ""
    echo "Argumentos:"
    echo "  branch-name    Nome da branch (opcional, modo interativo se omitido)"
    echo "  base-branch    Branch base para criação (padrão: main/master)"
    echo ""
    echo "Flags:"
    echo "  --no-sync      Não sincronizar com main ao navegar"
    echo "  --rebase       Fazer rebase com main automaticamente"
    echo "  --merge        Fazer merge com main automaticamente"
    echo "  --create       Criar branch se não existir (com navegação)"
    echo "  -h, --help     Mostrar esta ajuda"
    echo ""
    echo "Exemplos:"
    echo "  $0                           # Modo interativo"
    echo "  $0 feat/nova-feature         # Navegar ou criar worktree"
    echo "  $0 fix/bug-123 --no-sync     # Navegar sem sincronizar"
    echo "  $0 feat/teste develop        # Criar a partir de develop"
    exit 0
}

# ============================================================================
# PARSING DE ARGUMENTOS
# ============================================================================

BRANCH_NAME=""
BASE_BRANCH=""
NO_SYNC=false
AUTO_REBASE=false
AUTO_MERGE=false
CREATE_IF_NOT_EXISTS=false

while [[ $# -gt 0 ]]; do
    case $1 in
        --no-sync)
            NO_SYNC=true
            shift
            ;;
        --rebase)
            AUTO_REBASE=true
            shift
            ;;
        --merge)
            AUTO_MERGE=true
            shift
            ;;
        --create)
            CREATE_IF_NOT_EXISTS=true
            shift
            ;;
        -h|--help)
            show_help
            ;;
        -*)
            print_error "flag desconhecida: $1"
            exit 1
            ;;
        *)
            if [ -z "$BRANCH_NAME" ]; then
                BRANCH_NAME="$1"
            elif [ -z "$BASE_BRANCH" ]; then
                BASE_BRANCH="$1"
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

if ! git worktree list --porcelain &>/dev/null; then
    print_error "git worktree não está disponível (requer Git 2.5+)"
    exit 1
fi

DEFAULT_BASE_BRANCH=$(get_base_branch)
if [ -z "$BASE_BRANCH" ]; then
    BASE_BRANCH="$DEFAULT_BASE_BRANCH"
fi

print_info "Branch base: $BASE_BRANCH"

# ============================================================================
# FASE 2: MODO INTERATIVO (se sem argumentos)
# ============================================================================

if [ -z "$BRANCH_NAME" ]; then
    echo ""
    print_step "📋 Worktrees ativos:"

    mapfile -t worktrees < <(list_worktrees "")

    if [ ${#worktrees[@]} -eq 0 ]; then
        print_info "Nenhum worktree encontrado"
    else
        i=1
        for wt in "${worktrees[@]}"; do
            branch=$(echo "$wt" | cut -d'|' -f1)
            path=$(echo "$wt" | cut -d'|' -f2)
            echo "  $i. $branch → $path"
            ((i++))
        done
    fi

    echo "  $i. Criar novo worktree"
    echo ""

    options=()
    for wt in "${worktrees[@]}"; do
        branch=$(echo "$wt" | cut -d'|' -f1)
        options+=("$branch")
    done
    options+=("Criar novo worktree")

    select_option "Selecione uma opção:" "${options[@]}"
    choice=$?

    if [ $choice -eq 255 ]; then
        print_error "opção inválida"
        exit 1
    fi

    if [ $choice -eq $((${#options[@]} - 1)) ]; then
        echo -en "${YELLOW}Digite o nome da branch: ${NC}"
        read -r BRANCH_NAME
        if [ -z "$BRANCH_NAME" ]; then
            print_error "nome da branch não pode ser vazio"
            exit 1
        fi
        BRANCH_NAME=$(sanitize_branch_name "$BRANCH_NAME")
        CREATE_IF_NOT_EXISTS=true
    else
        BRANCH_NAME="${options[$choice]}"
    fi
fi

print_info "Branch: $BRANCH_NAME"

# ============================================================================
# FASE 3: VERIFICAR SE WORKTREE EXISTE
# ============================================================================

echo ""
print_step "🔍 Fase 2: Verificando worktree"

EXISTING_PATH=$(get_worktree_path_for_branch "$BRANCH_NAME")

if [ -n "$EXISTING_PATH" ]; then
    # Worktree existe - navegar
    echo ""
    print_step "📂 Fase 3: Navegando para worktree existente"

    if [ ! -d "$EXISTING_PATH" ]; then
        print_error "worktree path não existe: $EXISTING_PATH"
        exit 1
    fi

    print_success "Navegado para: $EXISTING_PATH"
    print_info "Branch: $BRANCH_NAME"

    # Sync com main
    if [ "$NO_SYNC" = false ]; then
        echo ""

        if [ "$AUTO_REBASE" = true ]; then
            SYNC_CHOICE=0
        elif [ "$AUTO_MERGE" = true ]; then
            SYNC_CHOICE=1
        else
            select_option "Deseja atualizar com origin/$DEFAULT_BASE_BRANCH?" \
                "Sim, fazer rebase (Recomendado)" \
                "Sim, fazer merge" \
                "Não, pular"
            SYNC_CHOICE=$?
        fi

        case $SYNC_CHOICE in
            0)
                print_info "Atualizando com origin/$DEFAULT_BASE_BRANCH..."
                cd "$EXISTING_PATH"
                git fetch origin "$DEFAULT_BASE_BRANCH"
                if git rebase "origin/$DEFAULT_BASE_BRANCH"; then
                    print_success "Rebase com $DEFAULT_BASE_BRANCH concluído"
                else
                    print_warning "Conflitos encontrados no rebase"
                    print_info "Resolva os conflitos e execute: git rebase --continue"
                    print_info "Ou para abortar: git rebase --abort"
                fi
                ;;
            1)
                print_info "Atualizando com origin/$DEFAULT_BASE_BRANCH..."
                cd "$EXISTING_PATH"
                git fetch origin "$DEFAULT_BASE_BRANCH"
                if git merge "origin/$DEFAULT_BASE_BRANCH"; then
                    print_success "Merge com $DEFAULT_BASE_BRANCH concluído"
                else
                    print_warning "Conflitos encontrados no merge"
                    print_info "Resolva os conflitos e execute: git add . && git commit"
                    print_info "Ou para abortar: git merge --abort"
                fi
                ;;
            *)
                print_info "Sync pulado"
                ;;
        esac
    fi

    # Relatório final
    echo ""
    print_step "📋 Relatório Final"
    echo "  📍 Branch: $BRANCH_NAME"
    echo "  📂 Path: $EXISTING_PATH"
    echo ""
    echo "Execute: cd \"$EXISTING_PATH\""

else
    # Worktree não existe - criar
    echo ""
    print_step "📂 Fase 3: Criando novo worktree"

    REPO_ROOT=$(git rev-parse --show-toplevel)
    PARENT_DIR=$(dirname "$REPO_ROOT")

    # Substituir / por - para o path do worktree
    WORKTREE_DIR_NAME=$(echo "$BRANCH_NAME" | tr '/' '-')
    WORKTREE_PATH=$(realpath -m "$PARENT_DIR/.worktrees/$WORKTREE_DIR_NAME")

    if [ -d "$WORKTREE_PATH" ]; then
        print_error "path já existe: $WORKTREE_PATH"
        exit 1
    fi

    # Verificar se branch existe localmente
    if git show-ref --verify --quiet "refs/heads/$BRANCH_NAME" 2>/dev/null; then
        print_info "Branch $BRANCH_NAME já existe localmente"
        git worktree add "$WORKTREE_PATH" "$BRANCH_NAME"
    else
        if [ "$CREATE_IF_NOT_EXISTS" = true ]; then
            print_info "Criando nova branch: $BRANCH_NAME a partir de $BASE_BRANCH"
            git worktree add -b "$BRANCH_NAME" "$WORKTREE_PATH" "$BASE_BRANCH"
        else
            print_error "Branch $BRANCH_NAME não existe. Use --create para criar."
            exit 1
        fi
    fi

    if [ ! -d "$WORKTREE_PATH" ]; then
        print_error "falha ao criar worktree"
        exit 1
    fi

    print_success "Worktree criado: $WORKTREE_PATH"

    # Push para origin
    print_info "Enviando branch para origin..."
    cd "$WORKTREE_PATH"
    if git push -u origin "$BRANCH_NAME" 2>/dev/null; then
        print_success "Branch enviada para origin"
    else
        print_warning "Falha ao fazer push para origin. Execute manualmente: git push -u origin $BRANCH_NAME"
    fi

    # Relatório final
    echo ""
    print_step "📋 Relatório Final"
    echo "  📍 Branch: $BRANCH_NAME"
    echo "  📂 Path: $WORKTREE_PATH"
    echo ""
    echo "Execute: cd \"$WORKTREE_PATH\""
fi

print_success "Worktree pronto!"
