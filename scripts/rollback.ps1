# Quick Rollback Script
# Restores previous version from backup

param(
    [switch]$List,
    [string]$BackupPath,
    [switch]$Force
)

$ErrorActionPreference = "Stop"

function Write-Info {
    param($Message, $Color = "White")
    Write-Host "  $Message" -ForegroundColor $Color
}

Write-Host "`n═══════════════════════════════════════════════════" -ForegroundColor Red
Write-Host "  ULTRA_POS ROLLBACK UTILITY" -ForegroundColor Red
Write-Host "═══════════════════════════════════════════════════" -ForegroundColor Red

# ═══════════════════════════════════════════════════════════
# LIST MODE: Show available backups
# ═══════════════════════════════════════════════════════════

if ($List) {
    Write-Host "`n📂 Available Backups:" -ForegroundColor Cyan
    
    if (Test-Path "backup") {
        $backups = Get-ChildItem "backup" -Directory | Sort-Object Name -Descending
        
        if ($backups) {
            foreach ($backup in $backups) {
                $files = Get-ChildItem $backup.FullName -File -ErrorAction SilentlyContinue
                $count = 0
                if ($files) { $count = $files.Count }
                
                $size = 0
                try {
                    $stats = $backup | Get-ChildItem -File -Recurse | Measure-Object -Sum Length
                    if ($stats.Sum) { $size = $stats.Sum }
                }
                catch {}
                
                $sizeMB = [math]::Round($size / 1MB, 2)
                $name = $backup.Name
                Write-Info "$name ($count files, $sizeMB MB)" "Gray"
            }
            
            Write-Host "`n💡 To restore a backup, run:" -ForegroundColor Yellow
            Write-Host "   .\scripts\rollback.ps1 -BackupPath 'backup\[folder-name]'" -ForegroundColor Gray
        }
        else {
            Write-Info "No backups found!" "Yellow"
        }
    }
    else {
        Write-Info "Backup directory does not exist" "Yellow"
        Write-Info "Create backups before deployment to enable rollback" "Gray"
    }
    
    exit 0
}

# ═══════════════════════════════════════════════════════════
# ROLLBACK MODE: Restore from backup
# ═══════════════════════════════════════════════════════════

if (-not $BackupPath) {
    Write-Host "`n ❌ Error: No backup path specified" -ForegroundColor Red
    Write-Host "`n📋 Usage:" -ForegroundColor White
    Write-Host "   List backups:    .\scripts\rollback.ps1 -List" -ForegroundColor Gray
    Write-Host "   Restore backup:  .\scripts\rollback.ps1 -BackupPath 'backup\v2.0.0-20260209-123456'" -ForegroundColor Gray
    exit 1
}

if (-not (Test-Path $BackupPath)) {
    Write-Host "`n❌ Error: Backup path not found: $BackupPath" -ForegroundColor Red
    Write-Host "`nRun with -List to see available backups" -ForegroundColor Yellow
    exit 1
}

Write-Host "`n⚠️  WARNING: ROLLBACK OPERATION" -ForegroundColor Yellow
Write-Host "`nThis will:" -ForegroundColor White
Write-Host "  - Delete current dist/ folder" -ForegroundColor Gray
Write-Host "  - Restore files from: $BackupPath" -ForegroundColor Gray
Write-Host "  - Optionally restore user data" -ForegroundColor Gray

if (-not $Force) {
    $confirm = Read-Host "`n❓ Continue with rollback? (yes/no)"
    if ($confirm -ne "yes") {
        Write-Host "`n⛔ Rollback cancelled" -ForegroundColor Yellow
        exit 0
    }
}

Write-Host "`n🔄 Starting rollback process..." -ForegroundColor Cyan

# Step 1: Backup current state (just in case)
$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$emergencyBackup = "backup\emergency-$timestamp"

if (Test-Path "dist") {
    Write-Info "Creating emergency backup of current dist/..." "Cyan"
    New-Item -ItemType Directory -Path $emergencyBackup -Force | Out-Null
    Copy-Item "dist\*" -Destination $emergencyBackup -Recurse -Force
    Write-Info "✓ Emergency backup created at: $emergencyBackup" "Green"
}

# Step 2: Remove current dist
if (Test-Path "dist") {
    Write-Info "Removing current dist/ folder..." "Cyan"
    Remove-Item "dist" -Recurse -Force
    Write-Info "✓ Current dist/ removed" "Green"
}

# Step 3: Restore dist from backup
Write-Info "Restoring dist/ from backup..." "Cyan"
New-Item -ItemType Directory -Path "dist" -Force | Out-Null

$backupFiles = Get-ChildItem $BackupPath -File "*.exe" -ErrorAction SilentlyContinue
if ($backupFiles) {
    Copy-Item "$BackupPath\*.exe" -Destination "dist\" -Force
    Write-Info "✓ Restored $($backupFiles.Count) executable(s)" "Green"
}
else {
    Write-Info "⚠ No executables found in backup" "Yellow"
}

# Step 4: Ask about user data restoration
if (Test-Path "$BackupPath\appdata") {
    $restoreData = Read-Host "`n❓ Also restore user data (database, license)? (y/n)"
    
    if ($restoreData -eq 'y' -or $restoreData -eq 'Y') {
        $appData = "$env:APPDATA\ULTRA_POS Cashier System"
        
        if (Test-Path $appData) {
            # Backup current user data
            $userDataBackup = "$emergencyBackup\appdata"
            New-Item -ItemType Directory -Path $userDataBackup -Force | Out-Null
            Copy-Item "$appData\*" -Destination $userDataBackup -Force -ErrorAction SilentlyContinue
            Write-Info "✓ Current user data backed up" "Green"
        }
        
        # Restore user data
        Copy-Item "$BackupPath\appdata\*" -Destination $appData -Force -ErrorAction SilentlyContinue
        Write-Info "✓ User data restored" "Green"
    }
}

# ═══════════════════════════════════════════════════════════
# SUMMARY
# ═══════════════════════════════════════════════════════════

Write-Host "`n═══════════════════════════════════════════════════" -ForegroundColor Green
Write-Host "`n✅ ROLLBACK COMPLETE!" -ForegroundColor Green

Write-Host "`n📊 Summary:" -ForegroundColor White
Write-Host "  Restored from:    $BackupPath" -ForegroundColor Gray
Write-Host "  Emergency backup: $emergencyBackup" -ForegroundColor Gray

Write-Host "`n📋 Next Steps:" -ForegroundColor White
Write-Host "  1. Test the restored version" -ForegroundColor Gray
Write-Host "  2. Verify functionality works" -ForegroundColor Gray
Write-Host "  3. Investigation: Why did deployment fail?" -ForegroundColor Gray
Write-Host "  4. Fix issues before redeploying" -ForegroundColor Gray

Write-Host ""
exit 0
