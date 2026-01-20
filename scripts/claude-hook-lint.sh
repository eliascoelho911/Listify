#!/bin/bash
# Runs lint only on modified files, blocks only if errors are in those files
#
# Exit codes:
#   0 - Success, continue normally
#   2 - Blocking - stderr sent to Claude, blocks the operation

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

cd "$PROJECT_DIR"

# Get modified files from git (staged + unstaged)
MODIFIED_FILES=$(git diff --name-only --diff-filter=ACMR HEAD 2>/dev/null | grep -E '\.(ts|tsx|js|jsx)$' || true)

# If no modified files from HEAD, try staged files only
if [ -z "$MODIFIED_FILES" ]; then
  MODIFIED_FILES=$(git diff --cached --name-only --diff-filter=ACMR 2>/dev/null | grep -E '\.(ts|tsx|js|jsx)$' || true)
fi

if [ -z "$MODIFIED_FILES" ]; then
  # No modified TS/JS files, nothing to lint
  exit 0
fi

# Convert to array for counting
MODIFIED_ARRAY=($MODIFIED_FILES)
FILE_COUNT=${#MODIFIED_ARRAY[@]}

echo "Linting $FILE_COUNT modified file(s)..."

# Run ESLint only on modified files
LINT_OUTPUT=$(npx eslint $MODIFIED_FILES 2>&1)
LINT_EXIT=$?

if [ $LINT_EXIT -ne 0 ]; then
  echo "Lint errors in modified files:" >&2
  echo "$LINT_OUTPUT" >&2
  exit 2
fi

echo "Lint check passed."
exit 0
