# ULTRA_POS Guided Deployment Script
# Implements the 5-Phase Deployment Process:
# 1. PREPARE → 2. BACKUP → 3. DEPLOY → 4. VERIFY → 5. CONFIRM/ROLLBACK

param(
    [switch]$DryRun,
    [switch]$SkipBackup,
    [switch]$SkipVerification
)

$ErrorActionPreference = "Stop"

function Write-Phase {
    param($Number, $Name, $Color = "Cyan")
    Write-Host "`n" ("═" * 60) -ForegroundColor $Color
    Write-Host "  PHASE ${Number}: $Name" -ForegroundColor $Color
    Write-Host ("═" * 60) -ForegroundColor $Color
}

function Write-Step {
    param($Message, $Type = "Info")
    $colors = @{
        "Success" = "Green"
        "Error"   = "Red"
        "Warning" = "Yellow"
        "Info"    = "White"
    }
    $icons = @{
        "Success" = "✅"
        "Error"   = "❌"
        "Warning" = "⚠️ "
        "Info"    = "📋"
    }
    Write-Host "  $($icons[$Type]) $Message" -ForegroundColor $colors[$Type]
}

function Confirm-Action {
    param($Prompt)
    $response = Read-Host "  ❓ $Prompt (y/n)"
    return $response -eq 'y' -or $response -eq 'Y'
}

Write-Host "`n" ("═" * 60) -ForegroundColor Magenta
Write-Host "          ULTRA_POS DEPLOYMENT SYSTEM" -ForegroundColor Magenta
Write-Host ("═" * 60) -ForegroundColor Magenta

if ($DryRun) {
    Write-Host "`n⚠️  DRY RUN MODE - No changes will be made`n" -ForegroundColor Yellow
}

# ═══════════════════════════════════════════════════════════
# PHASE 1: PREPARE
# ═══════════════════════════════════════════════════════════

Write-Phase 1 "PREPARE" "Cyan"
Write-Step "Verifying prerequisites and code quality" "Info"

if (Test-Path "scripts\pre-deploy-check.ps1") {
    Write-Step "Running pre-deployment checks..." "Info"
    
    if (-not $DryRun) {
        & ".\scripts\pre-deploy-check.ps1"
        if ($LASTEXITCODE -ne 0) {
            Write-Step "Pre-deployment checks failed! Fix errors before continuing." "Error"
            exit 1
        }
    }
    else {
        Write-Step "[DRY RUN] Would run pre-deployment checks" "Warning"
    }
}
else {
    Write-Step "Pre-deployment check script not found - proceeding with caution" "Warning"
    if (-not (Confirm-Action "Continue without pre-deployment checks?")) {
        Write-Step "Deployment cancelled" "Warning"
        exit 0
    }
}

# Read current version
$package = Get-Content "package.json" | ConvertFrom-Json
$version = $package.version
Write-Step "Current version: v$version" "Success"

if (-not $DryRun) {
    if (-not (Confirm-Action "Deploy version v$version?")) {
        Write-Step "Deployment cancelled by user" "Warning"
        exit 0
    }
}

# ═══════════════════════════════════════════════════════════
# PHASE 2: BACKUP
# ═══════════════════════════════════════════════════════════

Write-Phase 2 "BACKUP" "Yellow"
Write-Step "Creating backup of current state" "Info"

if (-not $SkipBackup) {
    $timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
    $backupDir = "backup\v$version-$timestamp"
    
    if (-not $DryRun) {
        if (Test-Path "dist") {
            New-Item -ItemType Directory -Path $backupDir -Force | Out-Null
            
            # Backup existing dist folder
            $distFiles = Get-ChildItem "dist\*.exe" -ErrorAction SilentlyContinue
            if ($distFiles) {
                Copy-Item "dist\*.exe" -Destination $backupDir -Force
                Write-Step "Backed up $($distFiles.Count) file(s) to $backupDir" "Success"
            }
            else {
                Write-Step "No existing executables to backup" "Info"
            }
            
            # Also backup user data if exists
            $appData = "$env:APPDATA\ULTRA_POS Cashier System"
            if (Test-Path $appData) {
                $dataBackup = "$backupDir\appdata"
                New-Item -ItemType Directory -Path $dataBackup -Force | Out-Null
                Copy-Item "$appData\*.db" -Destination $dataBackup -ErrorAction SilentlyContinue
                Copy-Item "$appData\*.json" -Destination $dataBackup -ErrorAction SilentlyContinue
                Write-Step "Backed up user data" "Success"
            }
        }
        else {
            Write-Step "No dist/ folder to backup (first build)" "Info"
        }
    }
    else {
        Write-Step "[DRY RUN] Would create backup at: $backupDir" "Warning"
    }
}
else {
    Write-Step "⚠️  BACKUP SKIPPED - Rollback may not be possible!" "Warning"
}

# ═══════════════════════════════════════════════════════════
# PHASE 3: DEPLOY
# ═══════════════════════════════════════════════════════════

Write-Phase 3 "DEPLOY" "Magenta"
Write-Step "Executing build process" "Info"

if (-not $DryRun) {
    Write-Step "Starting npm run build..." "Info"
    Write-Host ""  # Extra space for build output
    
    # Run the build
    npm run build
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host ""
        Write-Step "Build failed! (Exit code: $LASTEXITCODE)" "Error"
        Write-Step "Check build logs above for details" "Warning"
        
        if (Confirm-Action "Attempt rollback?") {
            Write-Step "Run: .\scripts\rollback.ps1" "Info"
        }
        exit 1
    }
    
    Write-Host ""
    Write-Step "Build completed successfully!" "Success"
}
else {
    Write-Step "[DRY RUN] Would execute: npm run build" "Warning"
}

# ═══════════════════════════════════════════════════════════
# PHASE 4: VERIFY
# ═══════════════════════════════════════════════════════════

Write-Phase 4 "VERIFY" "Cyan"
Write-Step "Verifying deployment output" "Info"

if (-not $SkipVerification) {
    if (Test-Path "scripts\post-deploy-verify.ps1") {
        if (-not $DryRun) {
            & ".\scripts\post-deploy-verify.ps1"
            $verifySuccess = $LASTEXITCODE -eq 0
        }
        else {
            Write-Step "[DRY RUN] Would run post-deployment verification" "Warning"
            $verifySuccess = $true
        }
    }
    else {
        Write-Step "Post-deploy verification script not found" "Warning"
        Write-Step "Performing basic checks..." "Info"
        
        if (-not $DryRun) {
            if (Test-Path "dist") {
                $exeFiles = Get-ChildItem "dist\*.exe"
                if ($exeFiles) {
                    Write-Step "Found $($exeFiles.Count) executable(s) in dist/" "Success"
                    foreach ($exe in $exeFiles) {
                        $sizeKB = [math]::Round($exe.Length / 1KB, 2)
                        Write-Step "  - $($exe.Name) ($sizeKB KB)" "Info"
                    }
                    $verifySuccess = $true
                }
                else {
                    Write-Step "No executables found in dist/!" "Error"
                    $verifySuccess = $false
                }
            }
            else {
                Write-Step "dist/ folder not found!" "Error"
                $verifySuccess = $false
            }
        }
        else {
            $verifySuccess = $true
        }
    }
}
else {
    Write-Step "⚠️  VERIFICATION SKIPPED" "Warning"
    $verifySuccess = $true
}

# ═══════════════════════════════════════════════════════════
# PHASE 5: CONFIRM or ROLLBACK
# ═══════════════════════════════════════════════════════════

Write-Phase 5 "CONFIRM or ROLLBACK" "Green"

if (-not $DryRun) {
    if ($verifySuccess) {
        Write-Step "Deployment verification passed ✓" "Success"
        Write-Host ""
        Write-Step "Next Steps:" "Info"
        Write-Step "  1. Test the installer: dist\ULTRA_POS-*-Setup.exe" "Info"
        Write-Step "  2. Verify all key features work" "Info"
        Write-Step "  3. If issues found, run: .\scripts\rollback.ps1" "Info"
        Write-Host ""
        
        Write-Host "  📊 DEPLOYMENT SUMMARY" -ForegroundColor White
        Write-Host "  ─────────────────────────────────────" -ForegroundColor Gray
        Write-Host "  Version:  v$version" -ForegroundColor Gray
        Write-Host "  Date:     $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" -ForegroundColor Gray
        Write-Host "  Output:   dist/" -ForegroundColor Gray
        if (-not $SkipBackup) {
            Write-Host "  Backup:   backup/v$version-$timestamp" -ForegroundColor Gray
        }
        Write-Host "  ─────────────────────────────────────" -ForegroundColor Gray
        Write-Host ""
        
        Write-Step "✅ DEPLOYMENT SUCCESSFUL!" "Success"
        exit 0
    }
    else {
        Write-Step "Deployment verification failed!" "Error"
        Write-Host ""
        
        if (Confirm-Action "Attempt rollback now?") {
            if (Test-Path "scripts\rollback.ps1") {
                & ".\scripts\rollback.ps1"
            }
            else {
                Write-Step "Rollback script not found" "Error"
                Write-Step "Manual rollback required - restore from backup/" "Warning"
            }
        }
        exit 1
    }
}
else {
    Write-Step "[DRY RUN] Deployment simulation complete" "Success"
    Write-Step "No changes were made to the system" "Info"
    exit 0
}
