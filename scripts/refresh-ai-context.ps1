# refresh-ai-context.ps1 — refresh the AI navigation layer.
# Non-destructive: never deletes files, never touches data/volumes, never prints secrets.
# Runs Graphify TOKEN-FREE (AST only, no LLM/API key). Spends NO model tokens.
# Usage:  pwsh scripts/refresh-ai-context.ps1 [-NoGraphify]
param([switch]$NoGraphify)
$ErrorActionPreference = 'Stop'
Set-Location (git rev-parse --show-toplevel)
$today = Get-Date -Format 'yyyy-MM-dd'
Write-Host "Refreshing AI context ($today)" -ForegroundColor Cyan

# 1) Stamp 'Last updated' in 00_READ_ME_FIRST.md (timestamp only)
$f = 'docs/AI_CONTEXT/00_READ_ME_FIRST.md'
if(Test-Path $f){
  $c = Get-Content $f -Raw
  $c2 = [regex]::Replace($c, 'Last updated: \d{4}-\d{2}-\d{2}', "Last updated: $today")
  if($c2 -ne $c){ Set-Content -Path $f -Value $c2 -Encoding utf8 -NoNewline; Write-Host "  stamped $f -> $today" }
}

# 2) Lightweight secret/path scan (paths only, never values)
Write-Host "Secret/path hygiene:" -ForegroundColor Cyan
$leaks = git ls-files | Select-String -Pattern 'secret|credential|\.pem$|\.key$|\.p12$|\.crt$|\.pfx$' -CaseSensitive:$false
if($leaks){ Write-Host "  [WARN] tracked sensitive-looking paths (names only):" -ForegroundColor Yellow; $leaks | ForEach-Object { Write-Host "    $($_.Line)" } }
else { Write-Host "  no tracked sensitive-looking paths" -ForegroundColor Green }
foreach($p in @('.env','.mcp.json')){ git check-ignore -q -- $p 2>$null; if($LASTEXITCODE -ne 0){ Write-Host "  [WARN] $p is NOT git-ignored" -ForegroundColor Yellow } }

# 3) Graphify (TOKEN-FREE) — resolve uv tool bin, then update + cluster without LLM
if($NoGraphify){ Write-Host "Graphify: skipped (-NoGraphify)" }
else {
  if(Get-Command uv -ErrorAction SilentlyContinue){ $bin = (uv tool dir --bin 2>$null); if($bin){ $env:PATH += ";$bin" } }
  if(Get-Command graphify -ErrorAction SilentlyContinue){
    Write-Host "Graphify: rebuilding graph (token-free, no LLM)..." -ForegroundColor Cyan
    graphify update . --no-cluster | Out-Null; Write-Host "  update . --no-cluster: ok"
    graphify cluster-only . --no-label | Out-Null; Write-Host "  cluster-only . --no-label: ok (GRAPH_REPORT.md/graph.json/graph.html)"
    if(Test-Path graphify-out/graph.json){
      $hit = Select-String -Path graphify-out/graph.json -Pattern '"[^"]*(\.env|\.mcp\.json|node_modules|/dist/|\.terraform|secret|credential)' -List -ErrorAction SilentlyContinue
      if($hit){ Write-Host "  [WARN] graph.json references a sensitive/heavy path - inspect it" -ForegroundColor Yellow }
      else { Write-Host "  graph.json clean (no secret/heavy paths)" -ForegroundColor Green }
    }
  } else { Write-Host "  graphify not installed - 'uv tool install graphifyy' (see docs/AI_CONTEXT/12_GRAPHIFY_USAGE.md)" -ForegroundColor Yellow }
}

# 4) Run the checker
Write-Host "Validating context layer..." -ForegroundColor Cyan
& "$PSScriptRoot/check-ai-context.ps1"
