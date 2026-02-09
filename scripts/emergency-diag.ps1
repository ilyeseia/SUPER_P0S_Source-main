# Emergency Diagnostic Script
# Quick system health check when issues arise

param(
    [switch]$WhatIf,
    [switch]$Full
)

$ErrorActionPreference = "Continue"  # Don't stop on errors - we're diagnosing!

function Write-Section {
    param($Title)
    Write-Host "`n" ("═" * 60) -ForegroundColor Cyan
    Write-Host "  $Title" -ForegroundColor Cyan
    Write-Host ("═" * 60) -ForegroundColor Cyan
}

function Write-Finding {
    param($Message, $Status = "Info")
    $colors = @{
        "OK"      = "Green"
        "Warning" = "Yellow"
        "Error"   = "Red"
        "Info"    = "White"
    }
    $icons = @{
        "OK"      = "✅"
        "Warning" = "⚠️ "
        "Error"   = "❌"
        "Info"    = "ℹ️ "
    }
    Write-Host "  $($icons[$Status]) $Message" -ForegroundColor $colors[$Status]
}

Write-Host "`n" ("═" * 60) -ForegroundColor Red
Write-Host "  ULTRA_POS EMERGENCY DIAGNOSTICS" -ForegroundColor Red
Write-Host ("═" * 60) -ForegroundColor Red
Write-Host "`n  Timestamp: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" -ForegroundColor Gray

if ($WhatIf) {
    Write-Host "  Mode: DRY RUN`n" -ForegroundColor Yellow
}

$diagnosticReport = @()

# ═══════════════════════════════════════════════════════════
# 1. SYSTEM RESOURCES
# ═══════════════════════════════════════════════════════════

Write-Section "SYSTEM RESOURCES"

try {
    # Disk Space
    $drive = Get-PSDrive -Name C
    $freeGB = [math]::Round($drive.Free / 1GB, 2)
    $usedGB = [math]::Round($drive.Used / 1GB, 2)
    $totalGB = [math]::Round(($drive.Free + $drive.Used) / 1GB, 2)
    
    if ($freeGB -lt 1) {
        Write-Finding "Disk Space: $freeGB GB free (CRITICAL!)" "Error"
        $diagnosticReport += "CRITICAL: Low disk space ($freeGB GB)"
    }
    elseif ($freeGB -lt 5) {
        Write-Finding "Disk Space: $freeGB GB free (Low)" "Warning"
        $diagnosticReport += "WARNING: Low disk space ($freeGB GB)"
    }
    else {
        Write-Finding "Disk Space: $freeGB GB / $totalGB GB free" "OK"
    }
    
    # Memory
    $os = Get-CimInstance Win32_OperatingSystem
    $totalRAM = [math]::Round($os.TotalVisibleMemorySize / 1MB, 2)
    $freeRAM = [math]::Round($os.FreePhysicalMemory / 1MB, 2)
    $usedRAM = $totalRAM - $freeRAM
    
    if ($freeRAM -lt 0.5) {
        Write-Finding "Memory: $usedRAM GB / $totalRAM GB used (High!)" "Warning"
        $diagnosticReport += "WARNING: High memory usage"
    }
    else {
        Write-Finding "Memory: $usedRAM GB / $totalRAM GB used" "OK"
    }
}
catch {
    Write-Finding "Could not check system resources: $_" "Error"
}

# ═══════════════════════════════════════════════════════════
# 2. APPLICATION FILES
# ═══════════════════════════════════════════════════════════

Write-Section "APPLICATION FILES"

# Check dist folder
if (Test-Path "dist") {
    $exeCount = (Get-ChildItem "dist\*.exe" -ErrorAction SilentlyContinue).Count
    if ($exeCount -gt 0) {
        Write-Finding "dist/ folder: $exeCount executable(s)" "OK"
    }
    else {
        Write-Finding "dist/ folder: No executables found" "Warning"
        $diagnosticReport += "WARNING: No exe files in dist/"
    }
}
else {
    Write-Finding "dist/ folder: Not found" "Error"
    $diagnosticReport += "ERROR: dist/ folder missing"
}

# Check source files
$criticalFiles = @(
    "package.json",
    "src\main.js",
    "electron-builder.json"
)

foreach ($file in $criticalFiles) {
    if (Test-Path $file) {
        Write-Finding "$file exists" "OK"
    }
    else {
        Write-Finding "$file MISSING!" "Error"
        $diagnosticReport += "ERROR: Missing $file"
    }
}

# Check node_modules
if (Test-Path "node_modules") {
    $moduleCount = (Get-ChildItem "node_modules" -Directory -ErrorAction SilentlyContinue).Count
    Write-Finding "node_modules: $moduleCount packages" "OK"
}
else {
    Write-Finding "node_modules: Not found (run npm install)" "Error"
    $diagnosticReport += "ERROR: node_modules missing"
}

# ═══════════════════════════════════════════════════════════
# 3. USER DATA
# ═══════════════════════════════════════════════════════════

Write-Section "USER DATA"

$appData = "$env:APPDATA\ULTRA_POS Cashier System"
if (Test-Path $appData) {
    Write-Finding "AppData folder exists" "OK"
    
    # Check database
    $dbPath = "$appData\database.db"
    if (Test-Path $dbPath) {
        $dbSize = [math]::Round((Get-Item $dbPath).Length / 1KB, 2)
        Write-Finding "Database: $dbSize KB" "OK"
        
        # Try to check database integrity if sqlite3 available
        $sqlite3 = Get-Command sqlite3 -ErrorAction SilentlyContinue
        if ($sqlite3) {
            try {
                $integrity = & sqlite3 $dbPath "PRAGMA integrity_check;" 2>$null
                if ($integrity -eq "ok") {
                    Write-Finding "Database integrity: OK" "OK"
                }
                else {
                    Write-Finding "Database integrity: CORRUPTED!" "Error"
                    $diagnosticReport += "ERROR: Database corrupted"
                }
            }
            catch {
                Write-Finding "Could not check database integrity" "Warning"
            }
        }
    }
    else {
        Write-Finding "Database not found (app not initialized)" "Info"
    }
    
    # Check license
    $licensePath = "$appData\license.json"
    if (Test-Path $licensePath) {
        Write-Finding "License file exists" "OK"
    }
    else {
        Write-Finding "License file not found" "Info"
    }
    
    # Check logs
    $logsPath = "$appData\logs"
    if (Test-Path $logsPath) {
        $logFiles = Get-ChildItem $logsPath -File -ErrorAction SilentlyContinue
        Write-Finding "Log files: $($logFiles.Count)" "OK"
        
        if ($Full -and $logFiles) {
            Write-Host "`n  📄 Recent Log Entries (last 10 lines):" -ForegroundColor Yellow
            $latestLog = $logFiles | Sort-Object LastWriteTime -Descending | Select-Object -First 1
            if ($latestLog) {
                Get-Content $latestLog.FullName -Tail 10 -ErrorAction SilentlyContinue | ForEach-Object {
                    Write-Host "     $_" -ForegroundColor Gray
                }
            }
        }
    }
    else {
        Write-Finding "No logs directory" "Info"
    }
}
else {
    Write-Finding "AppData folder not found (app never run)" "Info"
}

# ═══════════════════════════════════════════════════════════
# 4. ENVIRONMENT
# ═══════════════════════════════════════════════════════════

Write-Section "ENVIRONMENT"

# Node.js
try {
    $nodeVersion = node --version 2>$null
    if ($nodeVersion) {
        Write-Finding "Node.js: $nodeVersion" "OK"
    }
    else {
        Write-Finding "Node.js: Not found!" "Error"
        $diagnosticReport += "ERROR: Node.js not installed"
    }
}
catch {
    Write-Finding "Node.js: Error checking" "Error"
}

# npm
try {
    $npmVersion = npm --version 2>$null
    if ($npmVersion) {
        Write-Finding "npm: v$npmVersion" "OK"
    }
    else {
        Write-Finding "npm: Not found!" "Error"
        $diagnosticReport += "ERROR: npm not installed"
    }
}
catch {
    Write-Finding "npm: Error checking" "Error"
}

# ═══════════════════════════════════════════════════════════
# 5. RECENT BUILD LOGS
# ═══════════════════════════════════════════════════════════

if ($Full) {
    Write-Section "RECENT BUILD LOGS"
    
    if (Test-Path "dist\builder-debug.yml") {
        Write-Finding "Build log found" "OK"
        Write-Host "`n  Last 15 lines of builder-debug.yml:" -ForegroundColor Yellow
        Get-Content "dist\builder-debug.yml" -Tail 15 | ForEach-Object {
            Write-Host "    $_" -ForegroundColor Gray
        }
    }
    else {
        Write-Finding "No build log found" "Info"
    }
}

# ═══════════════════════════════════════════════════════════
# SUMMARY
# ═══════════════════════════════════════════════════════════

Write-Host "`n" ("═" * 60) -ForegroundColor Cyan
Write-Host "  DIAGNOSTIC SUMMARY" -ForegroundColor Cyan
Write-Host ("═" * 60) -ForegroundColor Cyan

if ($diagnosticReport.Count -eq 0) {
    Write-Host "`n  ✅ NO CRITICAL ISSUES DETECTED" -ForegroundColor Green
    Write-Host "`n  System appears healthy. If issues persist:" -ForegroundColor White
    Write-Host "    - Check application logs manually" -ForegroundColor Gray
    Write-Host "    - Review build output for errors" -ForegroundColor Gray
    Write-Host "    - Try a clean rebuild (delete dist, node_modules)" -ForegroundColor Gray
}
else {
    Write-Host "`n  ⚠️  ISSUES FOUND: $($diagnosticReport.Count)" -ForegroundColor Red
    Write-Host ""
    foreach ($issue in $diagnosticReport) {
        Write-Host "    • $issue" -ForegroundColor Red
    }
    
    Write-Host "`n  📋 RECOMMENDED ACTIONS:" -ForegroundColor Yellow
    if ($diagnosticReport -like "*disk space*") {
        Write-Host "    • Free up disk space (delete temp files, old backups)" -ForegroundColor Gray
    }
    if ($diagnosticReport -like "*node_modules*") {
        Write-Host "    • Run: npm install" -ForegroundColor Gray
    }
    if ($diagnosticReport -like "*database*") {
        Write-Host "    • Backup and restore database from backup/" -ForegroundColor Gray
    }
    if ($diagnosticReport -like "*dist/*") {
        Write-Host "    • Run: npm run build" -ForegroundColor Gray
    }
}

Write-Host "`n  💾 For full diagnostic, run: .\scripts\emergency-diag.ps1 -Full" -ForegroundColor Cyan
Write-Host ""

# Save report to file
$reportFile = "diagnostic-report-$(Get-Date -Format 'yyyyMMdd-HHmmss').txt"
@"
ULTRA_POS Emergency Diagnostic Report
Generated: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')

Issues Found: $($diagnosticReport.Count)

$($diagnosticReport -join "`n")

"@ | Out-File $reportFile

Write-Host "  📄 Report saved to: $reportFile`n" -ForegroundColor Gray

exit ($diagnosticReport.Count)
