# Pre-Deployment Verification Script
# Implements the 4 Verification Categories from deployment-procedures
# [OK] Code Quality | [OK] Build | [OK] Environment | [OK] Safety

param(
    [switch]$WhatIf
)

$ErrorActionPreference = "Stop"
$script:hasErrors = $false

function Write-Check {
    param($Message, $Type = "Info")
    $colors = @{
        "Success" = "Green"
        "Error"   = "Red"
        "Warning" = "Yellow"
        "Info"    = "Cyan"
    }
    Write-Host "  [$Type] $Message" -ForegroundColor $colors[$Type]
}

function Test-Requirement {
    param($Name, $TestBlock)
    Write-Host "`n[*] Checking: $Name" -ForegroundColor White
    try {
        & $TestBlock
    }
    catch {
        Write-Check "Failed: $_" "Error"
        $script:hasErrors = $true
    }
}

Write-Host "===================================================" -ForegroundColor Cyan
Write-Host "  ULTRA_POS Pre-Deployment Verification" -ForegroundColor Cyan
Write-Host "===================================================" -ForegroundColor Cyan

if ($WhatIf) {
    Write-Host "`n[!] Running in DRY RUN mode - no changes will be made`n" -ForegroundColor Yellow
}

# =================================================================
# CATEGORY 1: CODE QUALITY
# =================================================================

Write-Host "`n=== CATEGORY 1: CODE QUALITY ===" -ForegroundColor Cyan

Test-Requirement "Git Status Clean" {
    $gitStatus = git status --porcelain 2>$null
    if ($gitStatus) {
        Write-Check "Uncommitted changes detected!" "Warning"
        Write-Check "Consider committing changes before deployment" "Warning"
    }
    else {
        Write-Check "Working directory clean" "Success"
    }
}

Test-Requirement "Package.json Exists" {
    if (Test-Path "package.json") {
        $package = Get-Content "package.json" | ConvertFrom-Json
        $ver = $package.version
        Write-Check "Found package.json (v$ver)" "Success"
    }
    else {
        Write-Check "package.json not found!" "Error"
        $script:hasErrors = $true
    }
}

# =================================================================
# CATEGORY 2: BUILD PREREQUISITES
# =================================================================

Write-Host "`n=== CATEGORY 2: BUILD PREREQUISITES ===" -ForegroundColor Cyan

Test-Requirement "Node.js Version" {
    $nodeVersion = node --version 2>$null
    if ($nodeVersion) {
        $versionStr = $nodeVersion -replace 'v', ''
        $versionNum = [version]$versionStr
        if ($versionNum.Major -ge 16) {
            Write-Check "Node.js $nodeVersion" "Success"
        }
        else {
            Write-Check "Node.js version too old: $nodeVersion (need v16+)" "Error"
            $script:hasErrors = $true
        }
    }
    else {
        Write-Check "Node.js not found!" "Error"
        $script:hasErrors = $true
    }
}

Test-Requirement "npm Available" {
    $npmVersion = npm --version 2>$null
    if ($npmVersion) {
        Write-Check "npm v$npmVersion" "Success"
    }
    else {
        Write-Check "npm not found!" "Error"
        $script:hasErrors = $true
    }
}

Test-Requirement "Dependencies Installed" {
    if (Test-Path "node_modules") {
        $moduleCount = (Get-ChildItem "node_modules" -Directory).Count
        Write-Check "node_modules exists - $moduleCount packages" "Success"
    }
    else {
        Write-Check "node_modules not found! Run 'npm install'" "Error"
        $script:hasErrors = $true
    }
}

Test-Requirement "Electron Builder Available" {
    $ebPath = "node_modules/.bin/electron-builder.cmd"
    if (Test-Path $ebPath) {
        Write-Check "electron-builder installed" "Success"
    }
    else {
        Write-Check "electron-builder not found! Check devDependencies" "Error"
        $script:hasErrors = $true
    }
}

# =================================================================
# CATEGORY 3: ENVIRONMENT
# =================================================================

Write-Host "`n=== CATEGORY 3: ENVIRONMENT ===" -ForegroundColor Cyan

Test-Requirement "Build Configuration" {
    if (Test-Path "electron-builder.json") {
        Write-Check "electron-builder.json found" "Success"
    }
    else {
        Write-Check "electron-builder.json not found (using package.json config)" "Warning"
    }
}

Test-Requirement "Icon File" {
    if (Test-Path "build/icon.ico") {
        $iconSize = (Get-Item "build/icon.ico").Length
        $iconSizeKB = [math]::Round($iconSize / 1KB, 2)
        Write-Check "Icon file exists ($iconSizeKB KB)" "Success"
    }
    else {
        Write-Check "build/icon.ico not found (default icon will be used)" "Warning"
    }
}

Test-Requirement "Disk Space" {
    $drive = Get-PSDrive -Name C
    $freeGB = [math]::Round($drive.Free / 1GB, 2)
    if ($freeGB -gt 2) {
        Write-Check "Free disk space: $freeGB GB" "Success"
    }
    else {
        Write-Check "Low disk space: $freeGB GB (need 2+ GB)" "Warning"
    }
}

# =================================================================
# CATEGORY 4: SAFETY
# =================================================================

Write-Host "`n=== CATEGORY 4: SAFETY ===" -ForegroundColor Cyan

Test-Requirement "Backup Reminder" {
    Write-Check "[!] Have you backed up the current version?" "Warning"
    Write-Check "Recommended: Copy current dist/ to backup/" "Info"
    
    if (Test-Path "dist") {
        $distFiles = Get-ChildItem "dist/*.exe" 2>$null
        if ($distFiles) {
            $count = $distFiles.Count
            Write-Check "Current dist/ contains $count executable(s)" "Info"
        }
    }
}

Test-Requirement "Version Check" {
    if (Test-Path "package.json") {
        $package = Get-Content "package.json" | ConvertFrom-Json
        $version = $package.version
        Write-Check "Deploying version: v$version" "Info"
        Write-Check "Is this version number correct? Verify before continuing" "Warning"
    }
}

# =================================================================
# SUMMARY
# =================================================================

Write-Host "`n===================================================" -ForegroundColor Cyan

if ($script:hasErrors) {
    Write-Host "`n[X] PRE-DEPLOYMENT CHECK FAILED" -ForegroundColor Red
    Write-Host "   Fix the errors above before deploying" -ForegroundColor Red
    exit 1
}
else {
    Write-Host "`n[OK] PRE-DEPLOYMENT CHECK PASSED" -ForegroundColor Green
    Write-Host "`n[*] Next Steps:" -ForegroundColor White
    Write-Host "   1. Create backup: Copy dist/ to backup/" -ForegroundColor Gray
    Write-Host "   2. Run deployment: .\scripts\deploy.ps1" -ForegroundColor Gray
    Write-Host "   3. Or build manually: npm run build" -ForegroundColor Gray
    exit 0
}
