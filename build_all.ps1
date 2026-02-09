# Build COMPLETE ULTRA_POS Suite (App + Keygen)

Write-Host "Starting Build Process for ULTRA_POS Suite..." -ForegroundColor Green

# 1. Build Main Application
Write-Host "Building Main Application (ULTRA_POS)..." -ForegroundColor Cyan

# 0. Clean previous builds
if (Test-Path "dist") {
    Write-Host "   Cleaning dist directory..." -ForegroundColor Yellow
    Remove-Item "dist" -Recurse -Force
}

npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Error "Failed to build Main Application (Exit code $LASTEXITCODE)"
    exit 1
}

# 2. Build Keygen Application
Write-Host "Building Keygen Application..." -ForegroundColor Cyan
$keygenDir = "keygen-app"

if (-not (Test-Path $keygenDir)) {
    Write-Error "Keygen directory not found!"
    exit 1
}

Push-Location $keygenDir

if (Test-Path "dist") {
    Write-Host "   Cleaning keygen dist directory..." -ForegroundColor Yellow
    Remove-Item "dist" -Recurse -Force
}

# Install dependencies for keygen (electron, electron-builder)
# We use the root node_modules to save time/space if possible, or install fresh.
# For stability, let's install fresh in keygen folder or just link.
# Simpler: npm install in keygen folder
Write-Host "   Installing Keygen dependencies..."
npm install

Write-Host "   Building Keygen executable..."
npm run build

Pop-Location

# 3. Organize Output
Write-Host "Organizing Output..." -ForegroundColor Cyan
$finalDist = "dist-final"
if (Test-Path $finalDist) { Remove-Item $finalDist -Recurse -Force }
New-Item -ItemType Directory -Path $finalDist | Out-Null

# Copy Main App Check
$mainExe = Get-ChildItem "dist\ULTRA_POS Cashier System*Setup.exe" | Select-Object -First 1
if ($mainExe) {
    Copy-Item $mainExe.FullName -Destination "$finalDist\ULTRA_POS_Setup.exe"
    Write-Host "   [V] Main App Copied" -ForegroundColor Green
}
else {
    # Try a more broad search
    $mainExeAlt = Get-ChildItem "dist\*.exe" | Where-Object { $_.Name -like "*ULTRA_POS*Setup*" } | Select-Object -First 1
    if ($mainExeAlt) {
        Copy-Item $mainExeAlt.FullName -Destination "$finalDist\ULTRA_POS_Setup.exe"
        Write-Host "   [V] Main App Copied (Found via fallback)" -ForegroundColor Green
    }
    else {
        Write-Warning "Main App installer not found in dist/"
    }
}

# Copy Keygen App Check
$keygenExe = Get-ChildItem "keygen-app\dist\ULTRA_POS Keygen*Setup.exe" | Select-Object -First 1
if ($keygenExe) {
    Copy-Item $keygenExe.FullName -Destination "$finalDist\ULTRA_POS_Keygen_Setup.exe"
    Write-Host "   [V] Keygen App Copied" -ForegroundColor Green
}
else {
    # Try a more broad search for keygen too
    $keygenExeAlt = Get-ChildItem "keygen-app\dist\*.exe" | Where-Object { $_.Name -like "*Keygen*Setup*" } | Select-Object -First 1
    if ($keygenExeAlt) {
        Copy-Item $keygenExeAlt.FullName -Destination "$finalDist\ULTRA_POS_Keygen_Setup.exe"
        Write-Host "   [V] Keygen App Copied (Found via fallback)" -ForegroundColor Green
    }
    else {
        Write-Warning "Keygen installer not found in keygen-app/dist/"
    }
}

Write-Host "BUILD COMPLETE!" -ForegroundColor Green
Write-Host "Find your installers in: $PWD\$finalDist" -ForegroundColor White
Start-Process $finalDist
