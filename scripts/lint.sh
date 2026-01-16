#!/bin/bash
# Script para executar ESLint com suporte a arquivos específicos
# Uso: ./scripts/lint.sh [arquivos...]
# Se nenhum arquivo for passado, executa em todos os diretórios padrão

set -e

if [ $# -eq 0 ]; then
  # Sem argumentos: executa no projeto inteiro
  npx eslint "app/**/*.{js,ts,tsx}" "src/**/*.{js,ts,tsx}" "tests/**/*.{js,ts,tsx}" \
    --report-unused-disable-directives 
else
  # Com argumentos: filtra apenas arquivos .js, .ts, .tsx
  FILES=""
  for file in "$@"; do
    if [[ "$file" =~ \.(js|ts|tsx)$ ]]; then
      FILES="$FILES $file"
    fi
  done

  if [ -n "$FILES" ]; then
    npx eslint $FILES --report-unused-disable-directives
  fi
fi
