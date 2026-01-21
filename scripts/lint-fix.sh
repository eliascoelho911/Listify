#!/bin/bash
# Script para executar Prettier + ESLint com fix e suporte a arquivos específicos
# Uso: ./scripts/lint-fix.sh [arquivos...]
# Se nenhum arquivo for passado, executa em todos os diretórios padrão

set -e

if [ $# -eq 0 ]; then
  # Sem argumentos: executa no projeto inteiro
  npx prettier -w app src tests --log-level=warn
  npx eslint "app/**/*.{js,ts,tsx}" "src/**/*.{js,ts,tsx}" "tests/**/*.{js,ts,tsx}" \
    --report-unused-disable-directives --fix 
  echo "Prettier e ESLint fix concluídos em todo o projeto."
else
  # Com argumentos: filtra apenas arquivos .js, .ts, .tsx para ESLint
  JS_FILES=""
  ALL_FILES=""
  for file in "$@"; do
    ALL_FILES="$ALL_FILES $file"
    if [[ "$file" =~ \.(js|ts|tsx)$ ]]; then
      JS_FILES="$JS_FILES $file"
    fi
  done

  if [ -n "$ALL_FILES" ]; then
    npx prettier -w $ALL_FILES --log-level=warn
  fi

  if [ -n "$JS_FILES" ]; then
    npx eslint $JS_FILES --report-unused-disable-directives --fix
  fi

  echo "Prettier e ESLint fix concluídos nos arquivos especificados."  
fi
