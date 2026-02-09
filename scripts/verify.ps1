# ========================================
# SUPER_P0S - Script de Verification Pre-Build
# ========================================

Write-Host "Verification de la configuration du projet..." -ForegroundColor Cyan
Write-Host ""

$hasErrors = $false

# Verifier package.json
Write-Host "[*] Verification package.json..." -ForegroundColor Yellow
if (Test-Path "package.json") {
    $package = Get-Content "package.json" | ConvertFrom-Json
    Write-Host "    [+] Nom: $($package.name)" -ForegroundColor Green
    Write-Host "    [+] Version: $($package.version)" -ForegroundColor Green
    Write-Host "    [+] Main: $($package.main)" -ForegroundColor Green
}
else {
    Write-Host "    [-] package.json manquant!" -ForegroundColor Red
    $hasErrors = $true
}

# Verifier le point d'entree
Write-Host ""
Write-Host "[*] Verification du point d'entree..." -ForegroundColor Yellow
if (Test-Path "src/main.js") {
    Write-Host "    [+] src/main.js trouve" -ForegroundColor Green
}
else {
    Write-Host "    [-] src/main.js manquant!" -ForegroundColor Red
    $hasErrors = $true
}

# Verifier la configuration electron-builder
Write-Host ""
Write-Host "[*] Verification electron-builder..." -ForegroundColor Yellow
if (Test-Path "electron-builder.json") {
    Write-Host "    [+] electron-builder.json trouve" -ForegroundColor Green
}
else {
    Write-Host "    [!] electron-builder.json manquant (optionnel)" -ForegroundColor Yellow
}

# Verifier les icones
Write-Host ""
Write-Host "[*] Verification des icones..." -ForegroundColor Yellow
if (Test-Path "build/icon.ico") {
    Write-Host "    [+] build/icon.ico trouve" -ForegroundColor Green
}
else {
    Write-Host "    [!] build/icon.ico manquant (recommande)" -ForegroundColor Yellow
    Write-Host "       L'application utilisera l'icone par defaut d'Electron" -ForegroundColor Gray
}

# Verifier node_modules
Write-Host ""
Write-Host "[*] Verification des dependances..." -ForegroundColor Yellow
if (Test-Path "node_modules") {
    Write-Host "    [+] node_modules trouve" -ForegroundColor Green
}
else {
    Write-Host "    [!] node_modules manquant - executez 'npm install'" -ForegroundColor Yellow
}

# Resume
Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
if ($hasErrors) {
    Write-Host "[-] Erreurs trouvees - corrigez-les avant de builder" -ForegroundColor Red
    exit 1
}
else {
    Write-Host "[+] Projet pret pour le build!" -ForegroundColor Green
}
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
