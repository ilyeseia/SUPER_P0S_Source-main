$ErrorActionPreference = "Stop"

Write-Host "--- BUILDING ULTRA_POS v2.0.4 (Unlocked) ---" -ForegroundColor Cyan

# 1. Clean Previous Builds
Write-Host "Cleaning previous builds..."
if (Test-Path "dist") { Remove-Item "dist" -Recurse -Force }
if (Test-Path "dist-v2.0.4") { Remove-Item "dist-v2.0.4" -Recurse -Force }

# 2. Build Main App
Write-Host "Building Main App..."
npm run build:win

# 3. Organize Output
Write-Host "Organizing Output..."
New-Item -ItemType Directory -Force -Path "dist-v2.0.4" | Out-Null

$setupFile = Get-ChildItem "dist\ULTRA_POS Cashier System*Setup*.exe" | Select-Object -First 1
if ($setupFile) {
    Copy-Item $setupFile.FullName "dist-v2.0.4\ULTRA_POS_v2.0.4_Unlocked_Setup.exe"
    Write-Host "Main App Copied: dist-v2.0.4\ULTRA_POS_v2.0.4_Unlocked_Setup.exe" -ForegroundColor Green
}
else {
    Write-Error "Main App Setup file not found!"
}

Write-Host "--- BUILD COMPLETE v2.0.4 ---" -ForegroundColor Cyan
Write-Host "Artifacts are in: dist-v2.0.4"
