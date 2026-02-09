# ========================================
# SUPER_P0S - Script de Build Production
# ========================================

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  SUPER_P0S - Production Build Script" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# 1. Verification de Node.js
Write-Host "[1/5] Verification des prerequis..." -ForegroundColor Yellow
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "[-] Erreur: Node.js n'est pas installe!" -ForegroundColor Red
    Write-Host "    Veuillez installer Node.js depuis: https://nodejs.org/" -ForegroundColor Red
    exit 1
}

$nodeVersion = node --version
Write-Host "[+] Node.js installe: $nodeVersion" -ForegroundColor Green

# Verification de npm
if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-Host "[-] Erreur: npm n'est pas installe!" -ForegroundColor Red
    exit 1
}

$npmVersion = npm --version
Write-Host "[+] npm installe: v$npmVersion" -ForegroundColor Green

# 2. Nettoyage
Write-Host ""
Write-Host "[2/5] Nettoyage des builds precedents..." -ForegroundColor Yellow
if (Test-Path "dist") {
    Remove-Item -Recurse -Force "dist"
    Write-Host "[+] Dossier dist/ nettoye" -ForegroundColor Green
}

# 3. Installation
Write-Host ""
Write-Host "[3/5] Installation des dependances..." -ForegroundColor Yellow
Write-Host "    Cela peut prendre plusieurs minutes..." -ForegroundColor Gray
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "[-] Erreur lors de l'installation des dependances" -ForegroundColor Red
    exit 1
}
Write-Host "[+] Dependances installees avec succes" -ForegroundColor Green

# 4. Verification config
Write-Host ""
Write-Host "[4/5] Verification de la configuration..." -ForegroundColor Yellow
if (-not (Test-Path "electron-builder.json")) {
    Write-Host "[!] Avertissement: electron-builder.json non trouve" -ForegroundColor Yellow
    Write-Host "    Utilisation de la configuration dans package.json" -ForegroundColor Gray
}
Write-Host "[+] Configuration verifiee" -ForegroundColor Green

# 5. Build
Write-Host ""
Write-Host "[5/5] Build de l'application..." -ForegroundColor Yellow
Write-Host "    Creation des installateurs Windows..." -ForegroundColor Gray
Write-Host "    Ceci peut prendre 5-10 minutes..." -ForegroundColor Gray
Write-Host ""

npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "[-] Erreur lors du build de l'application" -ForegroundColor Red
    exit 1
}

# Resume
Write-Host ""
Write-Host "============================================" -ForegroundColor Green
Write-Host "  [+] BUILD TERMINE AVEC SUCCES!" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Green
Write-Host ""
Write-Host "Fichiers crees dans le dossier 'dist/':" -ForegroundColor Cyan
Write-Host ""

if (Test-Path "dist") {
    Get-ChildItem "dist" -Filter "*.exe" | ForEach-Object {
        $sizeMB = [math]::Round($_.Length / 1MB, 2)
        Write-Host "    -> $($_.Name) ($sizeMB MB)" -ForegroundColor White
    }
}

Write-Host ""
Write-Host "Prochaines etapes:" -ForegroundColor Cyan
Write-Host "   1. Tester l'installateur sur une machine propre" -ForegroundColor White
Write-Host "   2. Verifier que l'application se lance correctement" -ForegroundColor White
Write-Host "   3. Tester les fonctionnalites principales" -ForegroundColor White
Write-Host "   4. Distribuer l'application" -ForegroundColor White
Write-Host ""
