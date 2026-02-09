Write-Host "--- BUILDING ULTRA_POS v2.0.3 (AES Activation) ---" -ForegroundColor Cyan

# Kill processes
Stop-Process -Name "electron" -Force -ErrorAction SilentlyContinue
Stop-Process -Name "ULTRA_POS Cashier System" -Force -ErrorAction SilentlyContinue

# Clean
if (Test-Path "dist") { Remove-Item "dist" -Recurse -Force -ErrorAction Continue }
if (Test-Path "dist-v2.0.3") { Remove-Item "dist-v2.0.3" -Recurse -Force -ErrorAction Continue }
New-Item -ItemType Directory -Force -Path "dist-v2.0.3" | Out-Null

# Build Main
Write-Host "Building Main App..."
npm run build
if ($LASTEXITCODE -ne 0) { Write-Error "Main App Failed"; exit 1 }

# Build Keygen
Write-Host "Building Keygen..."
cd keygen-app
if (Test-Path "dist") { Remove-Item "dist" -Recurse -Force -ErrorAction SilentlyContinue }
npm run build
if ($LASTEXITCODE -ne 0) { Write-Error "Keygen Failed"; exit 1 }
cd ..

# Organize
$mainExe = Get-ChildItem "dist\*.exe" | Where-Object { $_.Name -like "*Setup*.exe" } | Select-Object -First 1
$keygenExe = Get-ChildItem "keygen-app\dist\*.exe" | Where-Object { $_.Name -like "*Setup*.exe" } | Select-Object -First 1

if ($mainExe) {
    Copy-Item $mainExe.FullName -Destination "dist-v2.0.3\ULTRA_POS_v2.0.3_Setup.exe"
    Write-Host "Main App: dist-v2.0.3\ULTRA_POS_v2.0.3_Setup.exe" -ForegroundColor Green
}
if ($keygenExe) {
    Copy-Item $keygenExe.FullName -Destination "dist-v2.0.3\ULTRA_POS_Keygen_v2.0.3_Setup.exe"
    Write-Host "Keygen: dist-v2.0.3\ULTRA_POS_Keygen_v2.0.3_Setup.exe" -ForegroundColor Green
}
