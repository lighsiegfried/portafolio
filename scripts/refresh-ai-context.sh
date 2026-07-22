#!/usr/bin/env bash
# refresh-ai-context.sh — refresh the AI navigation layer.
# Non-destructive: never deletes files, never touches data/volumes, never prints secrets.
# Runs Graphify TOKEN-FREE (AST only, no LLM/API key). Spends NO model tokens.
# Usage:  bash scripts/refresh-ai-context.sh [--no-graphify]
set -euo pipefail
cd "$(git rev-parse --show-toplevel)"
today="$(date +%Y-%m-%d)"
skip_graphify=0; [ "${1:-}" = "--no-graphify" ] && skip_graphify=1
echo "Refreshing AI context ($today)"

# 1) Stamp 'Last updated' in 00_READ_ME_FIRST.md (timestamp only)
f='docs/AI_CONTEXT/00_READ_ME_FIRST.md'
if [ -f "$f" ] && grep -qE 'Last updated: [0-9]{4}-[0-9]{2}-[0-9]{2}' "$f"; then
  tmp="$(mktemp)"; sed -E "s/Last updated: [0-9]{4}-[0-9]{2}-[0-9]{2}/Last updated: ${today}/" "$f" > "$tmp" && mv "$tmp" "$f"
  echo "  stamped $f -> $today"
fi

# 2) Lightweight secret/path scan (paths only, never values)
echo "Secret/path hygiene:"
if git ls-files | grep -iE 'secret|credential|\.pem$|\.key$|\.p12$|\.crt$|\.pfx$' ; then
  echo "  [WARN] tracked sensitive-looking paths above - review (names only)"
else echo "  no tracked sensitive-looking paths"; fi
for p in .env .mcp.json; do git check-ignore -q -- "$p" || echo "  [WARN] $p is NOT git-ignored"; done

# 3) Graphify (TOKEN-FREE) — resolve uv tool bin, then update + cluster without LLM
if [ "$skip_graphify" -eq 1 ]; then
  echo "Graphify: skipped (--no-graphify)"
else
  if command -v uv >/dev/null 2>&1; then PATH="$PATH:$(uv tool dir --bin 2>/dev/null || true)"; fi
  if command -v graphify >/dev/null 2>&1; then
    echo "Graphify: rebuilding graph (token-free, no LLM)..."
    graphify update . --no-cluster >/dev/null 2>&1 && echo "  update . --no-cluster: ok"
    graphify cluster-only . --no-label >/dev/null 2>&1 && echo "  cluster-only . --no-label: ok (GRAPH_REPORT.md/graph.json/graph.html)"
    # Sanity: graph.json must not reference secret/heavy paths
    if grep -qiE '"[^"]*(\.env|\.mcp\.json|node_modules|/dist/|\.terraform|secret|credential)' graphify-out/graph.json 2>/dev/null; then
      echo "  [WARN] graph.json references a sensitive/heavy path - inspect graphify-out/graph.json"
    else echo "  graph.json clean (no secret/heavy paths)"; fi
  else
    echo "  graphify not installed - 'uv tool install graphifyy' (see docs/AI_CONTEXT/12_GRAPHIFY_USAGE.md)"
  fi
fi

# 4) Run the checker
echo "Validating context layer..."
bash "$(dirname "$0")/check-ai-context.sh"
