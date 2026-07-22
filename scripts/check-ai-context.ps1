# check-ai-context.ps1 — verify the AI navigation layer & secret-ignore hygiene.
# Non-destructive. Never prints file contents or secret values. Spends no model tokens.
# Usage:  pwsh scripts/check-ai-context.ps1   (or Windows PowerShell)
# Exit:   0 = all good, 1 = one or more checks failed.

$ErrorActionPreference = 'Stop'
$repo = (git rev-parse --show-toplevel)
Set-Location $repo
$fail = 0
function Ok($m){ Write-Host "  [OK]   $m" -ForegroundColor Green }
function Bad($m){ Write-Host "  [FAIL] $m" -ForegroundColor Red; $script:fail++ }
function Info($m){ Write-Host $m -ForegroundColor Cyan }

Info "AI context check - $repo"

# 1) Required files exist
$required = @(
  'AGENTS.md','CONTEXTO.md',
  'docs/AI_CONTEXT/00_READ_ME_FIRST.md',
  'docs/AI_CONTEXT/13_CHANGE_PROTOCOL.md',
  'docs/AI_CONTEXT/12_GRAPHIFY_USAGE.md',
  'docs/AI_CONTEXT/10_ROADMAP.md'
)
foreach($f in $required){ if(Test-Path $f){ Ok "exists: $f" } else { Bad "missing: $f" } }

# 2) Graphify report OR usage instructions present
if((Test-Path 'graphify-out/GRAPH_REPORT.md') -or (Test-Path 'docs/AI_CONTEXT/12_GRAPHIFY_USAGE.md')){
  Ok "graphify report or usage instructions present"
} else { Bad "no graphify report and no usage instructions" }

# 3) Secret-sensitive paths are git-ignored
$mustIgnore = @('.env','.env.production','.mcp.json','apps/frontend/test-results/x.png','coverage/x','playwright-report/x')
foreach($p in $mustIgnore){
  git check-ignore -q -- $p 2>$null
  if($LASTEXITCODE -eq 0){ Ok "ignored: $p" } else { Bad "NOT ignored: $p" }
}

# 4) .env.example must remain tracked (template, not a secret)
git check-ignore -q -- '.env.example' 2>$null
if($LASTEXITCODE -ne 0){ Ok ".env.example is tracked (template)" } else { Bad ".env.example wrongly ignored" }

# 4b) Graphify output tracking policy (only if graphify-out exists)
if(Test-Path 'graphify-out'){
  if(Test-Path 'graphify-out/GRAPH_REPORT.md'){ Ok "graphify report present" } else { Bad "graphify-out exists but GRAPH_REPORT.md missing" }
  git check-ignore -q -- 'graphify-out/graph.json' 2>$null
  if($LASTEXITCODE -eq 0){ Ok "graph.json ignored" } else { Bad "graph.json NOT ignored (should be)" }
  git check-ignore -q -- 'graphify-out/GRAPH_REPORT.md' 2>$null
  if($LASTEXITCODE -ne 0){ Ok "GRAPH_REPORT.md trackable" } else { Bad "GRAPH_REPORT.md ignored (should be trackable)" }
}

# 5) No tracked sensitive files
$bad = git ls-files | Select-String -Pattern 'secret|credential|\.pem$|\.key$|\.p12$|\.crt$|\.pfx$' -CaseSensitive:$false
if($bad){ Bad "tracked sensitive-looking files: $($bad.Count) (run: git ls-files | grep -iE 'secret|credential|\.pem')" }
else { Ok "no tracked sensitive-looking files" }

# 6) Obvious secret markers in always-read docs (report COUNT only, never content)
foreach($doc in @('AGENTS.md','CONTEXTO.md','docs/AI_CONTEXT/00_READ_ME_FIRST.md')){
  if(Test-Path $doc){
    $hits = (Select-String -Path $doc -Pattern 'AKIA[0-9A-Z]{16}|-----BEGIN [A-Z ]*PRIVATE KEY-----|aws_secret_access_key' -AllMatches -ErrorAction SilentlyContinue)
    if($hits){ Bad "possible secret marker in $doc (count=$($hits.Count)) - review, do not paste" }
    else { Ok "no obvious secret markers in $doc" }
  }
}

# 7) Archive not in the default read path (00 must not require reading docs/archive)
$readme = Get-Content 'docs/AI_CONTEXT/00_READ_ME_FIRST.md' -Raw -ErrorAction SilentlyContinue
if($readme -and ($readme -notmatch 'read .*docs/archive')){ Ok "archive not in default read path" }
else { Info "  [warn] verify docs/archive stays reference-only" }

if($fail -eq 0){ Info "RESULT: PASS"; exit 0 } else { Info "RESULT: FAIL ($fail)"; exit 1 }
