#!/bin/bash
#
# gitworktree-branch.sh
# Script para criar ou navegar para worktrees com prefixos de tipo (feat, fix, chore, etc.)
# Substitui os comandos individuais gitworktree.feat, gitworktree.fix, etc.
#

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

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
# FUNÇÕES HELPERS
# ============================================================================

sanitize_description() {
    local input="$1"
    echo "$input" | tr '[:upper:]' '[:lower:]' | tr ' ' '-' | sed 's/[^a-z0-9-]//g' | sed 's/^-*//' | sed 's/-*$//'
}

list_worktrees_by_prefix() {
    local prefix="$1"
    git worktree list --porcelain | awk -v prefix="$prefix" '
        /^worktree / { path = substr($0, 10) }
        /^branch / {
            branch = substr($0, 8)
            sub(/^refs\/heads\//, "", branch)
            if (index(branch, prefix) == 1) {
                print branch "|" path
            }
        }
    '
}

# ============================================================================
# TIPOS DE BRANCH SUPORTADOS
# ============================================================================

declare -A BRANCH_TYPES
BRANCH_TYPES["feat"]="Feature - Nova funcionalidade"
BRANCH_TYPES["fix"]="Fix - Correção de bug"
BRANCH_TYPES["chore"]="Chore - Tarefa de manutenção"
BRANCH_TYPES["refactor"]="Refactor - Refatoração de código"
BRANCH_TYPES["docs"]="Docs - Documentação"
BRANCH_TYPES["test"]="Test - Testes"
BRANCH_TYPES["style"]="Style - Formatação/estilo"
BRANCH_TYPES["perf"]="Perf - Performance"

declare -A TYPE_PROMPTS
TYPE_PROMPTS["feat"]="Digite a descrição da feature:"
TYPE_PROMPTS["fix"]="Digite a descrição do bug fix:"
TYPE_PROMPTS["chore"]="Digite a descrição da tarefa de manutenção:"
TYPE_PROMPTS["refactor"]="Digite a descrição do refactoring:"
TYPE_PROMPTS["docs"]="Digite a descrição da documentação:"
TYPE_PROMPTS["test"]="Digite a descrição dos testes:"
TYPE_PROMPTS["style"]="Digite a descrição das mudanças de estilo:"
TYPE_PROMPTS["perf"]="Digite a descrição da otimização:"

# ============================================================================
# HELP
# ============================================================================

show_help() {
    echo "Uso: $0 [tipo] [descrição] [flags]"
    echo ""
    echo "Cria ou navega para um worktree com prefixo de tipo gitflow."
    echo ""
    echo "Tipos disponíveis:"
    for type in "${!BRANCH_TYPES[@]}"; do
        echo "  $type - ${BRANCH_TYPES[$type]}"
    done | sort
    echo ""
    echo "Argumentos:"
    echo "  tipo         Tipo da branch (feat, fix, chore, etc.)"
    echo "  descrição    Descrição que será convertida em nome de branch"
    echo ""
    echo "Flags:"
    echo "  --create     Criar branch se não existir"
    echo "  --no-sync    Não sincronizar com main ao navegar"
    echo "  -h, --help   Mostrar esta ajuda"
    echo ""
    echo "Exemplos:"
    echo "  $0                              # Modo totalmente interativo"
    echo "  $0 feat                         # Selecionar/criar worktree feat/"
    echo "  $0 feat \"Nova Feature\"          # Criar feat/nova-feature"
    echo "  $0 fix \"Bug Login\" --create     # Criar fix/bug-login (forçar criação)"
    exit 0
}

# ============================================================================
# PARSING DE ARGUMENTOS
# ============================================================================

BRANCH_TYPE=""
DESCRIPTION=""
CREATE_FLAG=""
NO_SYNC_FLAG=""

while [[ $# -gt 0 ]]; do
    case $1 in
        --create)
            CREATE_FLAG="--create"
            shift
            ;;
        --no-sync)
            NO_SYNC_FLAG="--no-sync"
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
            if [ -z "$BRANCH_TYPE" ]; then
                BRANCH_TYPE="$1"
            elif [ -z "$DESCRIPTION" ]; then
                DESCRIPTION="$1"
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

if ! git rev-parse --is-inside-work-tree &>/dev/null; then
    print_error "não está em um repositório git"
    exit 1
fi

# ============================================================================
# FASE 2: SELECIONAR TIPO (se não fornecido)
# ============================================================================

if [ -z "$BRANCH_TYPE" ]; then
    echo ""
    print_step "🏷️  Selecione o tipo de branch:"
    echo ""

    type_options=()
    type_keys=()
    for type in $(echo "${!BRANCH_TYPES[@]}" | tr ' ' '\n' | sort); do
        type_options+=("${BRANCH_TYPES[$type]}")
        type_keys+=("$type")
    done

    select_option "Qual o tipo de trabalho?" "${type_options[@]}"
    choice=$?

    if [ $choice -eq 255 ]; then
        print_error "opção inválida"
        exit 1
    fi

    BRANCH_TYPE="${type_keys[$choice]}"
fi

# Validar tipo
if [ -z "${BRANCH_TYPES[$BRANCH_TYPE]}" ]; then
    print_error "tipo de branch inválido: $BRANCH_TYPE"
    echo "Tipos válidos: ${!BRANCH_TYPES[*]}"
    exit 1
fi

BRANCH_PREFIX="${BRANCH_TYPE}/"
print_info "Tipo selecionado: ${BRANCH_TYPES[$BRANCH_TYPE]}"

# ============================================================================
# FASE 3: SELECIONAR OU CRIAR WORKTREE
# ============================================================================

if [ -z "$DESCRIPTION" ]; then
    echo ""
    print_step "📋 Worktrees $BRANCH_PREFIX existentes:"

    mapfile -t worktrees < <(list_worktrees_by_prefix "$BRANCH_PREFIX")

    if [ ${#worktrees[@]} -eq 0 ]; then
        print_info "Nenhum worktree $BRANCH_PREFIX encontrado"

        echo ""
        echo -en "${YELLOW}${TYPE_PROMPTS[$BRANCH_TYPE]} ${NC}"
        read -r DESCRIPTION

        if [ -z "$DESCRIPTION" ]; then
            print_error "descrição não pode ser vazia"
            exit 1
        fi

        CREATE_FLAG="--create"
    else
        i=1
        for wt in "${worktrees[@]}"; do
            branch=$(echo "$wt" | cut -d'|' -f1)
            path=$(echo "$wt" | cut -d'|' -f2)
            echo "  $i. $branch → $path"
            ((i++))
        done
        echo "  $i. Criar novo worktree $BRANCH_PREFIX"
        echo ""

        options=()
        for wt in "${worktrees[@]}"; do
            branch=$(echo "$wt" | cut -d'|' -f1)
            options+=("$branch")
        done
        options+=("Criar novo")

        select_option "Selecione uma opção:" "${options[@]}"
        choice=$?

        if [ $choice -eq 255 ]; then
            print_error "opção inválida"
            exit 1
        fi

        if [ $choice -eq $((${#options[@]} - 1)) ]; then
            echo ""
            echo -en "${YELLOW}${TYPE_PROMPTS[$BRANCH_TYPE]} ${NC}"
            read -r DESCRIPTION

            if [ -z "$DESCRIPTION" ]; then
                print_error "descrição não pode ser vazia"
                exit 1
            fi

            CREATE_FLAG="--create"
        else
            BRANCH_NAME="${options[$choice]}"
        fi
    fi
fi

# ============================================================================
# FASE 4: GERAR NOME DA BRANCH (se necessário)
# ============================================================================

if [ -z "$BRANCH_NAME" ]; then
    SANITIZED=$(sanitize_description "$DESCRIPTION")
    BRANCH_NAME="${BRANCH_PREFIX}${SANITIZED}"
fi

print_info "Branch: $BRANCH_NAME"

# ============================================================================
# FASE 5: CHAMAR SCRIPT PRINCIPAL
# ============================================================================

echo ""

# shellcheck disable=SC2086
exec "$SCRIPT_DIR/gitworktree.sh" "$BRANCH_NAME" $CREATE_FLAG $NO_SYNC_FLAG
