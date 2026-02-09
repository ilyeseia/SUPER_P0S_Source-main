# ========================================
# SUPER_P0S - Script de Build Developpement
# ========================================

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  SUPER_P0S - Development Build (Rapide)" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# 1. Verification
Write-Host "[1/4] Verification Node.js..." -ForegroundColor Yellow
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "[-] Node.js non installe!" -ForegroundColor Red
    exit 1
}
Write-Host "[+] OK" -ForegroundColor Green

# 2. Nettoyage
Write-Host ""
Write-Host "[2/4] Nettoyage..." -ForegroundColor Yellow
if (Test-Path "dist") {
    Remove-Item -Recurse -Force "dist"
}
Write-Host "[+] OK" -ForegroundColor Green

# 3. Installation
Write-Host ""
Write-Host "[3/4] Installation des dependances..." -ForegroundColor Yellow
npm install --quiet
Write-Host "[+] OK" -ForegroundColor Green

# 4. Build rapide
Write-Host ""
Write-Host "[4/4] Build rapide (64-bit uniquement)..." -ForegroundColor Yellow
Write-Host "    Mode developpement - sans signature" -ForegroundColor Gray
Write-Host ""

npm run build:win64

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "[+] Build de developpement termine!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Fichiers dans dist/:" -ForegroundColor Cyan
    if (Test-Path "dist") {
        Get-ChildItem "dist" -Filter "*.exe" | ForEach-Object {
            $sizeMB = [math]::Round($_.Length / 1MB, 2)
            Write-Host "    -> $($_.Name) ($sizeMB MB)" -ForegroundColor White
        }
    }
    Write-Host ""
}
else {
    Write-Host ""
    Write-Host "[-] Erreur lors du build" -ForegroundColor Red
    exit 1
}
