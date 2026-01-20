#!/bin/bash
# Hook script para Claude Code
# Executa lint:fix e type-check nos arquivos modificados
#
# Uso:
#   - Como hook de PreToolUse (commit): usa arquivos staged
#   - Como hook de Stop: usa arquivos modificados (staged + unstaged)
#
# O hook recebe JSON via stdin com informações do contexto

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

cd "$PROJECT_DIR"

# Lê input JSON do stdin (se houver)
INPUT=$(cat 2>/dev/null || echo "{}")

# Detecta o tipo de evento do hook (com fallback se jq não estiver disponível)
if command -v jq &> /dev/null; then
  HOOK_EVENT=$(echo "$INPUT" | jq -r '.hook_event_name // empty' 2>/dev/null || echo "")
else
  # Fallback usando grep/sed para extrair hook_event_name do JSON
  HOOK_EVENT=$(echo "$INPUT" | grep -o '"hook_event_name"[[:space:]]*:[[:space:]]*"[^"]*"' | sed 's/.*"hook_event_name"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/' 2>/dev/null || echo "")
fi

# Determina quais arquivos verificar baseado no contexto
if [ "$HOOK_EVENT" = "PreToolUse" ]; then
  # Para commits: usa apenas arquivos staged
  FILES=$(git diff --cached --name-only --diff-filter=ACMR 2>/dev/null | grep -E '\.(js|ts|tsx)$' || true)
else
  # Para Stop ou outros: usa arquivos modificados (staged + unstaged)
  FILES=$(git diff --name-only --diff-filter=ACMR HEAD 2>/dev/null | grep -E '\.(js|ts|tsx)$' || true)

  # Se não houver modificações em relação ao HEAD, tenta com staged
  if [ -z "$FILES" ]; then
    FILES=$(git diff --cached --name-only --diff-filter=ACMR 2>/dev/null | grep -E '\.(js|ts|tsx)$' || true)
  fi
fi

# Se não houver arquivos para verificar, sai com sucesso
if [ -z "$FILES" ]; then
  echo "Nenhum arquivo JS/TS modificado para verificar."
  exit 0
fi

# Converte para array
FILES_ARRAY=($FILES)
FILE_COUNT=${#FILES_ARRAY[@]}

echo "Verificando $FILE_COUNT arquivo(s) modificado(s)..."

# Executa lint:fix nos arquivos
echo "Executando lint:fix..."
npm run lint:fix -- "${FILES_ARRAY[@]}"

# Executa type-check nos arquivos
echo "Executando type-check..."
npm run type-check -- "${FILES_ARRAY[@]}"

echo "Verificação concluída com sucesso!"
