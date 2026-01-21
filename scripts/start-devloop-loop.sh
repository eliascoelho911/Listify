#!/bin/bash
set -euo pipefail

# DevLoop Ralph Loop Starter
# Creates ralph-loop state file directly to bypass argument parsing issues
# with complex markdown prompts

MAX_ITERATIONS="${1:-50}"

# Verify orchestration prompt exists
if [[ ! -f ".claude/devloop-orchestration.md" ]]; then
    echo "Error: .claude/devloop-orchestration.md not found"
    echo "Please run /devloop to create the orchestration prompt first"
    exit 1
fi

# Read the orchestration prompt from file
PROMPT=$(cat .claude/devloop-orchestration.md)

# Create ralph-loop state file directly
cat > .claude/ralph-loop.local.md <<EOF
---
active: true
iteration: 1
max_iterations: $MAX_ITERATIONS
completion_promise: "ALL_TASKS_COMPLETED"
started_at: "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
---

$PROMPT

---

Set the completion promise to: \`ALL_TASKS_COMPLETED\`
Set max iterations to: \`$MAX_ITERATIONS\`
EOF

echo "DevLoop Ralph Loop activated!"
echo ""
echo "Iteration: 1"
echo "Max iterations: $MAX_ITERATIONS"
echo "Completion promise: ALL_TASKS_COMPLETED"
echo ""
echo "Orchestration prompt loaded from .claude/devloop-orchestration.md"
