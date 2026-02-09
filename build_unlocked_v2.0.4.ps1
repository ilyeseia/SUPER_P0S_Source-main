Write-Host "--- BUILDING ULTRA_POS v2.0.4 UNLOCKED ---" -ForegroundColor Cyan

# 1. Kill potentially locking processes
Write-Host "Killing Electron processes..."
Stop-Process -Name "electron" -Force -ErrorAction SilentlyContinue
Stop-Process -Name "ULTRA_POS Cashier System" -Force -ErrorAction SilentlyContinue

# 2. Aggressive Clean
Write-Host "Cleaning dist..."
if (Test-Path "dist") {
    Remove-Item "dist" -Recurse -Force -ErrorAction Continue
}
if (Test-Path "dist-unlocked") {
    Remove-Item "dist-unlocked" -Recurse -Force -ErrorAction Continue
}
New-Item -ItemType Directory -Force -Path "dist-unlocked" | Out-Null

# 3. Build Main App
Write-Host "Building Main App (Unlocked v2.0.4)..."
npm run build
if ($LASTEXITCODE -ne 0) { Write-Error "Main App Build Failed"; exit 1 }

# 4. Organize Output
Write-Host "Organizing Artifact..."
$mainExe = Get-ChildItem "dist\*.exe" | Where-Object { $_.Name -like "*Setup*.exe" } | Select-Object -First 1

if ($mainExe) {
    Copy-Item $mainExe.FullName -Destination "dist-unlocked\ULTRA_POS_v2.0.4_Unlocked_Setup.exe"
    Write-Host "Success! Installer: dist-unlocked\ULTRA_POS_v2.0.4_Unlocked_Setup.exe" -ForegroundColor Green
}
else {
    Write-Error "Could not find Main App installer in dist folder!"
}

Write-Host "Unlocked Build Complete!" -ForegroundColor Cyan
