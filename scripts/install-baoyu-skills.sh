#!/usr/bin/env bash
# Install Baoyu Skills for runtimes that load nested SKILL.md as skills.
# 1) materialize sub-skills: SKILL.example.md -> SKILL.md (in repo, idempotent)
# 2) bun install at workspace root (shared packages baoyu-md/baoyu-chrome-cdp/...)
#
# The fastagent runtime does NOT need this — it reads the root SKILL.md and the
# sub-skills' SKILL.example.md directly. This is for Claude Code and similar
# runtimes that discover per-directory SKILL.md files.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

node scripts/materialize-skills.mjs

if command -v bun &>/dev/null; then
  echo "bun install in $ROOT ..."
  bun install
else
  echo "bun not found — skills needing shared packages resolve from npm via per-skill bun.lock on first run."
  echo "Install bun: brew install oven-sh/bun/bun or npm install -g bun"
fi

echo ""
echo "Baoyu Skills installed at $ROOT"
echo "Restart your agent to pick up the materialized sub-skills."
