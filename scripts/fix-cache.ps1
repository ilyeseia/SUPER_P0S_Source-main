Write-Host "Reparation FORCEE du cache Electron-Builder..." -ForegroundColor Cyan

$cacheDir = "$env:LOCALAPPDATA\electron-builder\Cache\winCodeSign"
# Utiliser 7za.exe inclus dans node_modules
$7za = ".\node_modules\7zip-bin\win\x64\7za.exe"

if (-not (Test-Path $7za)) {
    Write-Host "Impossible de trouver 7za.exe dans node_modules" -ForegroundColor Red
    exit 1
}

if (-not (Test-Path $cacheDir)) {
    Write-Host "Cache winCodeSign introuvable. Lancez d'abord le build pour telecharger les outils." -ForegroundColor Yellow
    exit 0
}

$archives = Get-ChildItem "$cacheDir\*.7z"

foreach ($archive in $archives) {
    # Nom du dossier cible (base name sans extension .7z)
    $targetDirName = $archive.BaseName
    $targetDir = Join-Path $cacheDir $targetDirName
    
    Write-Host "Traitement de: $($archive.Name)" -ForegroundColor Yellow
    
    # 1. Supprimer le dossier existant s'il existe (pour forcer la re-extraction)
    if (Test-Path $targetDir) {
        Write-Host "   - Suppression du dossier existant..." -ForegroundColor Gray
        Remove-Item -Recurse -Force $targetDir -ErrorAction SilentlyContinue
    }
    
    # 2. Creer le dossier
    New-Item -ItemType Directory -Force -Path $targetDir | Out-Null
    
    # 3. Extraire en ignorant les erreurs
    Write-Host "   - Extraction..." -ForegroundColor Gray
    
    $proc = Start-Process -FilePath $7za -ArgumentList "x `"$($archive.FullName)`" -o`"$targetDir`" -aoa" -Wait -NoNewWindow -PassThru
    
    if ($proc.ExitCode -ne 0) {
        Write-Host "   ! Extraction terminee avec code $($proc.ExitCode) (erreurs symboliques attendues)" -ForegroundColor Magenta
    }
    else {
        Write-Host "   + Extraction reussie" -ForegroundColor Green
    }
}

Write-Host "Reparation terminee. Vous pouvez relancer le build." -ForegroundColor Green
