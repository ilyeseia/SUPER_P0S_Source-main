Write-Host "--- FORCING ULTRA_POS RELEASE BUILD (v2.0.2) ---" -ForegroundColor Cyan

# 1. Kill potentially locking processes
Write-Host "Killing Electron processes..."
Stop-Process -Name "electron" -Force -ErrorAction SilentlyContinue
Stop-Process -Name "ULTRA_POS Cashier System" -Force -ErrorAction SilentlyContinue

# 2. Aggressive Clean
Write-Host "Cleaning dist..."
if (Test-Path "dist") {
    Remove-Item "dist" -Recurse -Force -ErrorAction Continue
}
if (Test-Path "dist-final") {
    Remove-Item "dist-final" -Recurse -Force -ErrorAction Continue
}
New-Item -ItemType Directory -Force -Path "dist-final" | Out-Null

# 3. Build Main App
Write-Host "Building Main App (v2.0.2)..."
npm run build
if ($LASTEXITCODE -ne 0) { Write-Error "Main App Build Failed"; exit 1 }

# 4. Build Keygen
Write-Host "Building Keygen..."
cd keygen-app
# Clean keygen dist too
if (Test-Path "dist") { Remove-Item "dist" -Recurse -Force -ErrorAction SilentlyContinue }
npm run build
if ($LASTEXITCODE -ne 0) { Write-Error "Keygen Build Failed"; exit 1 }
cd ..

# 5. Organize Output
Write-Host "Organizing Artifacts..."
$mainExe = Get-ChildItem "dist\*.exe" | Where-Object { $_.Name -like "*Setup*.exe" } | Select-Object -First 1
$keygenExe = Get-ChildItem "keygen-app\dist\*.exe" | Where-Object { $_.Name -like "*Setup*.exe" } | Select-Object -First 1

if ($mainExe) {
    Copy-Item $mainExe.FullName -Destination "dist-final\ULTRA_POS_v2.0.2_Setup.exe"
    Write-Host "Main App: dist-final\ULTRA_POS_v2.0.2_Setup.exe" -ForegroundColor Green
} else {
    Write-Error "Could not find Main App installer!"
}

if ($keygenExe) {
    Copy-Item $keygenExe.FullName -Destination "dist-final\ULTRA_POS_Keygen_v2.0.2_Setup.exe"
    Write-Host "Keygen App: dist-final\ULTRA_POS_Keygen_v2.0.2_Setup.exe" -ForegroundColor Green
} else {
    Write-Error "Could not find Keygen installer!"
}

Write-Host "Build Complete!" -ForegroundColor Cyan
