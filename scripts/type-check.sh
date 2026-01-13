#!/bin/bash
# Script para executar TypeScript type-check com suporte a arquivos específicos
# Uso: ./scripts/type-check.sh [arquivos...]
#
# NOTA: O TypeScript requer contexto do projeto completo para verificação de tipos.
# Quando arquivos específicos são passados, usamos --incremental para otimizar,
# mas ainda verificamos o projeto inteiro para garantir consistência de tipos.

set -e

if [ $# -eq 0 ]; then
  # Sem argumentos: verificação completa
  npx tsc --noEmit --pretty false
else
  # Com argumentos: ainda executa verificação completa (necessário para tipos)
  # mas apenas reporta erros dos arquivos especificados

  # Filtra apenas arquivos .ts e .tsx
  TS_FILES=""
  for file in "$@"; do
    if [[ "$file" =~ \.(ts|tsx)$ ]]; then
      TS_FILES="$TS_FILES $file"
    fi
  done

  if [ -n "$TS_FILES" ]; then
    # Executa tsc completo mas filtra saída para os arquivos especificados
    # Cria pattern para grep a partir dos arquivos
    PATTERN=$(echo "$TS_FILES" | tr ' ' '\n' | grep -v '^$' | sed 's/\//\\\//g' | paste -sd'|' -)

    if [ -n "$PATTERN" ]; then
      # Executa tsc e filtra apenas erros dos arquivos especificados
      # Se não houver erros nos arquivos especificados, retorna sucesso
      npx tsc --noEmit --pretty false 2>&1 | grep -E "^($PATTERN)" || true

      # Verifica se há erros reais nos arquivos especificados
      ERRORS=$(npx tsc --noEmit --pretty false 2>&1 | grep -E "^($PATTERN)" | head -1 || true)
      if [ -n "$ERRORS" ]; then
        npx tsc --noEmit --pretty false 2>&1 | grep -E "^($PATTERN)"
        exit 1
      fi
    fi
  fi
fi
