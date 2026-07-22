#!/usr/bin/env bash
# check-ai-context.sh — verify the AI navigation layer & secret-ignore hygiene.
# Non-destructive. Never prints file contents or secret values. Spends no model tokens.
# Usage:  bash scripts/check-ai-context.sh    Exit: 0 = pass, 1 = fail.
set -euo pipefail
cd "$(git rev-parse --show-toplevel)"
fail=0
ok(){   printf '  [OK]   %s\n' "$1"; }
bad(){  printf '  [FAIL] %s\n' "$1"; fail=$((fail+1)); }
info(){ printf '%s\n' "$1"; }

info "AI context check - $(pwd)"

# 1) Required files
for f in AGENTS.md CONTEXTO.md \
         docs/AI_CONTEXT/00_READ_ME_FIRST.md \
         docs/AI_CONTEXT/13_CHANGE_PROTOCOL.md \
         docs/AI_CONTEXT/12_GRAPHIFY_USAGE.md \
         docs/AI_CONTEXT/10_ROADMAP.md; do
  [ -f "$f" ] && ok "exists: $f" || bad "missing: $f"
done

# 2) Graphify report OR usage instructions
if [ -f graphify-out/GRAPH_REPORT.md ] || [ -f docs/AI_CONTEXT/12_GRAPHIFY_USAGE.md ]; then
  ok "graphify report or usage instructions present"
else bad "no graphify report and no usage instructions"; fi

# 3) Secret-sensitive paths are git-ignored
for p in .env .env.production .mcp.json apps/frontend/test-results/x.png coverage/x playwright-report/x; do
  if git check-ignore -q -- "$p"; then ok "ignored: $p"; else bad "NOT ignored: $p"; fi
done

# 4) .env.example stays tracked
if git check-ignore -q -- .env.example; then bad ".env.example wrongly ignored"; else ok ".env.example tracked (template)"; fi

# 4b) Graphify output tracking policy (only if graphify-out exists)
if [ -d graphify-out ]; then
  [ -f graphify-out/GRAPH_REPORT.md ] && ok "graphify report present" || bad "graphify-out exists but GRAPH_REPORT.md missing"
  if git check-ignore -q -- graphify-out/graph.json; then ok "graph.json ignored"; else bad "graph.json NOT ignored (should be)"; fi
  if git check-ignore -q -- graphify-out/GRAPH_REPORT.md; then bad "GRAPH_REPORT.md ignored (should be trackable)"; else ok "GRAPH_REPORT.md trackable"; fi
fi

# 5) No tracked sensitive files
if git ls-files | grep -iE 'secret|credential|\.pem$|\.key$|\.p12$|\.crt$|\.pfx$' >/dev/null 2>&1; then
  bad "tracked sensitive-looking files exist (git ls-files | grep -iE 'secret|credential|\\.pem')"
else ok "no tracked sensitive-looking files"; fi

# 6) Obvious secret markers in always-read docs (count only, never content)
for d in AGENTS.md CONTEXTO.md docs/AI_CONTEXT/00_READ_ME_FIRST.md; do
  [ -f "$d" ] || continue
  n=$(grep -cE 'AKIA[0-9A-Z]{16}|-----BEGIN [A-Z ]*PRIVATE KEY-----|aws_secret_access_key' "$d" || true)
  if [ "${n:-0}" -gt 0 ]; then bad "possible secret marker in $d (count=$n) - review, do not paste"
  else ok "no obvious secret markers in $d"; fi
done

# 7) Archive not in default read path
if grep -qE 'read .*docs/archive' docs/AI_CONTEXT/00_READ_ME_FIRST.md 2>/dev/null; then
  info "  [warn] verify docs/archive stays reference-only"
else ok "archive not in default read path"; fi

if [ "$fail" -eq 0 ]; then info "RESULT: PASS"; exit 0; else info "RESULT: FAIL ($fail)"; exit 1; fi
