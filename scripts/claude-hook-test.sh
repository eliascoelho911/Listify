#!/bin/bash
# Runs typecheck and tests related to modified files before allowing stop
#
# Exit codes:
#   0 - Success, approve stop
#   2 - Blocking - stderr sent to Claude, blocks stop

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

cd "$PROJECT_DIR"

# Get modified TS/TSX/JS/JSX files
MODIFIED_FILES=$(git diff --name-only --diff-filter=ACMR HEAD 2>/dev/null | grep -E '\.(ts|tsx|js|jsx)$' || true)

# If no modified files from HEAD, try staged files only
if [ -z "$MODIFIED_FILES" ]; then
  MODIFIED_FILES=$(git diff --cached --name-only --diff-filter=ACMR 2>/dev/null | grep -E '\.(ts|tsx|js|jsx)$' || true)
fi

if [ -z "$MODIFIED_FILES" ]; then
  # No modified code files, allow stop
  echo '{"decision": "approve"}'
  exit 0
fi

# Convert to array for counting
MODIFIED_ARRAY=($MODIFIED_FILES)
FILE_COUNT=${#MODIFIED_ARRAY[@]}

echo "Validating $FILE_COUNT modified file(s) before stop..."

# --- TYPECHECK ---
echo "Running TypeScript check..."
TSC_OUTPUT=$(npx tsc --noEmit 2>&1)
TSC_EXIT=$?

if [ $TSC_EXIT -ne 0 ]; then
  # Filter tsc output to show only errors in modified files
  MODIFIED_ERRORS=""
  while IFS= read -r file; do
    FILE_ERRORS=$(echo "$TSC_OUTPUT" | grep -F "$file" || true)
    if [ -n "$FILE_ERRORS" ]; then
      MODIFIED_ERRORS="$MODIFIED_ERRORS$FILE_ERRORS"$'\n'
    fi
  done <<< "$MODIFIED_FILES"

  if [ -n "$MODIFIED_ERRORS" ]; then
    echo "TypeScript errors in modified files:" >&2
    echo "$MODIFIED_ERRORS" >&2
    echo '{"decision": "block", "reason": "TypeScript errors in modified files. Fix before completing."}' >&2
    exit 2
  fi
fi

# --- TESTS ---
echo "Running tests for modified files..."
TEST_FILES=$(echo "$MODIFIED_FILES" | tr '\n' ' ')
TEST_OUTPUT=$(npx jest --findRelatedTests $TEST_FILES --passWithNoTests 2>&1)
TEST_EXIT=$?

if [ $TEST_EXIT -ne 0 ]; then
  echo "Tests failed for modified files:" >&2
  echo "$TEST_OUTPUT" >&2
  echo '{"decision": "block", "reason": "Tests failed for modified files. Fix before completing."}' >&2
  exit 2
fi

echo "All validations passed."
echo '{"decision": "approve"}'
exit 0
