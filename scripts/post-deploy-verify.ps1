# Post-Deployment Verification Script
# Automated checks after deployment to ensure build success

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

Write-Host "═══════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  ULTRA_POS Post-Deployment Verification" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════" -ForegroundColor Cyan

if ($WhatIf) {
    Write-Host "`n⚠️  Running in DRY RUN mode`n" -ForegroundColor Yellow
}

Write-Host "`n📋 Verifying Build Outputs..." -ForegroundColor White

# ═══════════════════════════════════════════════════════════
# CHECK 1: Dist Folder Exists
# ═══════════════════════════════════════════════════════════

Write-Host "`n[1/5] Checking dist/ folder..." -ForegroundColor White
if (Test-Path "dist") {
    Write-Check "dist/ folder exists" "Success"
}
else {
    Write-Check "dist/ folder not found!" "Error"
    $script:hasErrors = $true
    Write-Host "`n❌ VERIFICATION FAILED - Build did not create dist/" -ForegroundColor Red
    exit 1
}

# ═══════════════════════════════════════════════════════════
# CHECK 2: Executable Files
# ═══════════════════════════════════════════════════════════

Write-Host "`n[2/5] Checking executable files..." -ForegroundColor White
$exeFiles = Get-ChildItem "dist\*.exe" -ErrorAction SilentlyContinue

if ($exeFiles) {
    Write-Check "Found $($exeFiles.Count) executable(s)" "Success"
    
    foreach ($exe in $exeFiles) {
        $sizeMB = [math]::Round($exe.Length / 1MB, 2)
        
        # Check if file size is reasonable (should be >10MB for Electron app)
        if ($sizeMB -gt 10) {
            Write-Check "✓ $($exe.Name) ($sizeMB MB)" "Success"
        }
        elseif ($sizeMB -gt 1) {
            Write-Check "⚠ $($exe.Name) ($sizeMB MB) - seems small" "Warning"
        }
        else {
            Write-Check "✗ $($exe.Name) ($sizeMB MB) - too small!" "Error"
            $script:hasErrors = $true
        }
    }
}
else {
    Write-Check "No executable files found!" "Error"
    $script:hasErrors = $true
}

# ═══════════════════════════════════════════════════════════
# CHECK 3: Expected File Names
# ═══════════════════════════════════════════════════════════

Write-Host "`n[3/5] Checking for expected files..." -ForegroundColor White

$expectedPatterns = @(
    "*Setup*.exe",
    "*Portable*.exe"
)

$foundExpected = 0
foreach ($pattern in $expectedPatterns) {
    $found = Get-ChildItem "dist\$pattern" -ErrorAction SilentlyContinue
    if ($found) {
        Write-Check "Found: $($found.Name)" "Success"
        $foundExpected++
    }
    else {
        Write-Check "Missing: $pattern" "Warning"
    }
}

if ($foundExpected -eq 0) {
    Write-Check "No expected installer types found!" "Error"
    $script:hasErrors = $true
}

# ═══════════════════════════════════════════════════════════
# CHECK 4: Build Logs
# ═══════════════════════════════════════════════════════════

Write-Host "`n[4/5] Checking build logs..." -ForegroundColor White

if (Test-Path "dist\builder-debug.yml") {
    $logContent = Get-Content "dist\builder-debug.yml" -Raw
    
    # Check for common error indicators
    if ($logContent -match "error|failed|exception") {
        Write-Check "Build log contains error indicators - review manually" "Warning"
    }
    else {
        Write-Check "Build log looks clean" "Success"
    }
}
else {
    Write-Check "builder-debug.yml not found (might be normal)" "Info"
}

# ═══════════════════════════════════════════════════════════
# CHECK 5: Manual Test Prompt
# ═══════════════════════════════════════════════════════════

Write-Host "`n[5/5] Manual testing required..." -ForegroundColor White
Write-Check "Automated checks complete - manual testing needed" "Info"

Write-Host "`n  📝 MANUAL TEST CHECKLIST:" -ForegroundColor Yellow
Write-Host "  ─────────────────────────────────────────────" -ForegroundColor Gray
Write-Host "  [ ] Install the Setup.exe on a test machine" -ForegroundColor Gray
Write-Host "  [ ] Application launches without errors" -ForegroundColor Gray
Write-Host "  [ ] Login screen appears" -ForegroundColor Gray
Write-Host "  [ ] Can create a test sale" -ForegroundColor Gray
Write-Host "  [ ] Receipt prints correctly" -ForegroundColor Gray
Write-Host "  [ ] Database is created properly" -ForegroundColor Gray
Write-Host "  [ ] License activation works" -ForegroundColor Gray
Write-Host "  ─────────────────────────────────────────────" -ForegroundColor Gray

# ═══════════════════════════════════════════════════════════
# SUMMARY
# ═══════════════════════════════════════════════════════════

Write-Host "`n═══════════════════════════════════════════════════" -ForegroundColor Cyan

if ($script:hasErrors) {
    Write-Host "`n❌ POST-DEPLOYMENT VERIFICATION FAILED" -ForegroundColor Red
    Write-Host "   Review errors above and consider rollback" -ForegroundColor Red
    exit 1
}
else {
    Write-Host "`n✅ POST-DEPLOYMENT VERIFICATION PASSED" -ForegroundColor Green
    Write-Host "`n   Automated checks successful!" -ForegroundColor Green
    Write-Host "   Proceed with manual testing checklist above" -ForegroundColor White
    
    # List output files
    Write-Host "`n📦 Build Artifacts:" -ForegroundColor White
    Get-ChildItem "dist\*.exe" | ForEach-Object {
        $sizeMB = [math]::Round($_.Length / 1MB, 2)
        Write-Host "   - $($_.Name) ($sizeMB MB)" -ForegroundColor Gray
    }
    
    exit 0
}
