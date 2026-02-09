# Guide de Déploiement - ULTRA_POS Cashier System

> **Principes de Déploiement de Production**
> Ce guide applique les principes de déploiement sécurisé pour des releases de production fiables.
> **Apprenez à PENSER, pas à mémoriser des scripts.**

## 📋 Table des Matières

- [Prérequis](#prérequis)
- [Configuration Initiale](#configuration-initiale)
- [Processus de Build](#processus-de-build)
- [Types de Build](#types-de-build)
- [Distribution](#distribution)
- [Gestion des Versions](#gestion-des-versions)
- [Dépannage](#dépannage)
- [Checklist de Déploiement](#checklist-de-déploiement)
- [Principes de Déploiement](#principes-de-déploiement)
- [Workflow de Déploiement](#workflow-de-déploiement)
- [Vérification Post-Déploiement](#vérification-post-déploiement)
- [Procédures de Rollback](#procédures-de-rollback)
- [Procédures d'Urgence](#procédures-durgence)
- [Anti-Patterns et Meilleures Pratiques](#anti-patterns-et-meilleures-pratiques)

---

## 🔧 Prérequis

### Environnement de Développement

- **Node.js**: v16.0.0 ou supérieur
- **npm**: v7.0.0 ou supérieur
- **Système**: Windows 10/11 (pour builds Windows)
- **Espace disque**: Minimum 2 GB libres
- **RAM**: Minimum 4 GB

### Vérification des Prérequis

```powershell
# Vérifier Node.js
node --version

# Vérifier npm
npm --version

# Vérifier le projet
.\scripts\verify.ps1
```

---

## ⚙️ Configuration Initiale

### 1. Installation des Dépendances

```powershell
cd C:\Users\seia\Desktop\SUPER_P0S_Source
npm install
```

Cette commande installe:
- **Dépendances de production**: better-sqlite3, bcryptjs, canvas, etc.
- **Dépendances de développement**: electron, electron-builder

### 2. Configuration des Icônes (Optionnel)

Placez votre icône d'application dans:
```
build/icon.ico
```

Spécifications recommandées:
- Format: ICO multi-résolution
- Tailles incluses: 16x16, 32x32, 48x48, 64x64, 128x128, 256x256
- Profondeur de couleur: 32-bit avec transparence

> **Note**: Si aucune icône n'est fournie, l'icône par défaut d'Electron sera utilisée.

### 3. Vérification de la Configuration

```powershell
.\scripts\verify.ps1
```

---

## 🏗️ Processus de Build

### Build Standard (Production)

Pour créer une version de production complète:

```powershell
.\scripts\build.ps1
```

**Ce script va:**
1. ✅ Vérifier les prérequis (Node.js, npm)
2. 🧹 Nettoyer les builds précédents
3. 📦 Installer toutes les dépendances
4. ⚙️ Vérifier la configuration
5. 🏗️ Créer les installateurs

**Durée estimée**: 5-10 minutes (première fois)

### Build Rapide (Développement)

Pour des tests rapides durant le développement:

```powershell
.\scripts\build-dev.ps1
```

**Différences:**
- ⚡ Plus rapide (64-bit uniquement)
- 🔓 Sans signature de code
- 📦 Un seul format (NSIS)

**Durée estimée**: 2-5 minutes

---

## 📦 Types de Build

### Builds Disponibles

| Commande | Description | Sortie |
|----------|-------------|--------|
| `npm run build` | Build complet (32 & 64-bit) | NSIS + Portable |
| `npm run build:win64` | Build 64-bit uniquement | NSIS x64 |
| `npm run build:win32` | Build 32-bit uniquement | NSIS ia32 |
| `npm run build:portable` | Version portable | Portable exe |

### Formats de Sortie

#### NSIS Installer
- **Fichier**: `ULTRA_POS Cashier System-2.0.1-Setup.exe`
- **Type**: Installateur avec assistant
- **Caractéristiques**:
  - ✅ Choix du dossier d'installation
  - ✅ Raccourcis Bureau + Menu Démarrer
  - ✅ Désinstallateur inclus
  - ✅ Support multi-utilisateurs

#### Portable
- **Fichier**: `ULTRA_POS Cashier System-2.0.1-Portable.exe`
- **Type**: Exécutable standalone
- **Caractéristiques**:
  - ✅ Aucune installation requise
  - ✅ Portable sur clé USB
  - ✅ Données dans le même dossier

---

## 📤 Distribution

### Emplacement des Fichiers

Après un build réussi, les fichiers se trouvent dans:
```
dist/
├── ULTRA_POS Cashier System-2.0.1-Setup.exe        (Installateur NSIS)
├── ULTRA_POS Cashier System-2.0.1-Portable.exe     (Version portable)
├── win-unpacked/                                    (Version non packagée)
└── builder-debug.yml                                (Logs de build)
```

### Méthodes de Distribution

#### 1. Distribution Locale
- Copier les fichiers `.exe` sur une clé USB
- Partager via réseau local
- Graver sur CD/DVD

#### 2. Distribution en Ligne
- Télécharger sur un serveur web
- Utiliser un service de cloud (Dropbox, Google Drive, OneDrive)
- Hébergement sur GitHub Releases

#### 3. Distribution Professionnelle
- Serveur de téléchargement dédié
- CDN pour downloads rapides
- Auto-update server (futur)

---

## 🔄 Gestion des Versions

### Mise à Jour de Version

Avant chaque release, mettez à jour la version dans `package.json`:

```json
{
  "version": "2.0.2"
}
```

### Stratégie de Versioning

Utilisez le **Semantic Versioning** (SemVer):

```
MAJOR.MINOR.PATCH
  |      |     |
  |      |     └─ Bug fixes (2.0.1 → 2.0.2)
  |      └─────── Nouvelles fonctionnalités (2.0.0 → 2.1.0)
  └────────────── Changements majeurs/breaking (2.0.0 → 3.0.0)
```

### Commandes npm pour Versions

```powershell
# Patch (2.0.1 → 2.0.2)
npm version patch

# Minor (2.0.1 → 2.1.0)
npm version minor

# Major (2.0.1 → 3.0.0)
npm version major
```

---

## 🐛 Dépannage

### Problème: Build échoue avec "Cannot find module"

**Solution:**
```powershell
# Nettoyer et réinstaller
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
```

### Problème: "electron-builder not found"

**Solution:**
```powershell
npm install --save-dev electron-builder
```

### Problème: Build très lent

**Causes possibles:**
- Première installation de better-sqlite3 (compile native)
- Antivirus scannant les fichiers
- Disque plein

**Solutions:**
- Ajouter une exception antivirus pour le dossier du projet
- Libérer de l'espace disque
- Attendre (normal pour la première fois)

### Problème: Application ne démarre pas après installation

**Vérifications:**
1. Vérifier que `main` dans package.json pointe vers `src/main.js`
2. Vérifier que tous les fichiers src/ sont inclus dans le build
3. Consulter les logs: `%APPDATA%\ULTRA_POS Cashier System\logs`

### Problème: Icône par défaut Electron

**Solution:**
Créer/placer votre icône dans `build/icon.ico` avant le build

### Problème: Antivirus bloque l'installateur

**Raison:** Applications non signées sont suspectes pour certains antivirus

**Solutions:**
- Code signing (certificat de signature)
- Soumettre à Microsoft SmartScreen
- Documenter pour les utilisateurs finaux

---

## ✅ Checklist de Déploiement

### Pré-Build

- [ ] Code testé et fonctionnel
- [ ] Version mise à jour dans `package.json`
- [ ] `node_modules` à jour (`npm install`)
- [ ] Icône d'application présente (`build/icon.ico`)
- [ ] Fichiers inutiles exclus (voir `.gitignore`)

### Build

- [ ] Exécuter `.\scripts\verify.ps1`
- [ ] Exécuter `.\scripts\build.ps1`
- [ ] Vérifier aucune erreur dans les logs
- [ ] Vérifier la taille des fichiers générés

### Post-Build

- [ ] Tester l'installateur NSIS
  - [ ] Installation réussie
  - [ ] Application démarre
  - [ ] Raccourcis créés
  - [ ] Désinstallation fonctionne
- [ ] Tester la version portable
  - [ ] Exécution sans installation
  - [ ] Base de données créée
  - [ ] Licence fonctionnelle
- [ ] Tester les fonctionnalités clés
  - [ ] Login
  - [ ] Point de vente (POS)
  - [ ] Gestion produits
  - [ ] Impression
  - [ ] Rapports

### Distribution

- [ ] Fichiers uploadés sur serveur/plateforme
- [ ] Liens de téléchargement testés
- [ ] Documentation utilisateur disponible
- [ ] Notes de version rédigées
- [ ] Support/Contact communiqué

---

## 🔐 Sécurité et Signature de Code (Avancé)

### Pourquoi Signer le Code?

- ✅ Windows SmartScreen ne bloque pas
- ✅ Confiance des utilisateurs
- ✅ Vérification de l'éditeur
- ✅ Protection contre modifications

### Obtenir un Certificat

1. Acheter un certificat Code Signing (DigiCert, Sectigo, etc.)
2. Coût: ~200-400€/an
3. Format: fichier `.pfx` + mot de passe

### Configuration (si certificat disponible)

Dans `electron-builder.json`, ajouter:

```json
{
  "win": {
    "certificateFile": "path/to/certificate.pfx",
    "certificatePassword": "${env.CSC_PASSWORD}",
    "signingHashAlgorithms": ["sha256"]
  }
}
```

Puis définir la variable d'environnement:
```powershell
$env:CSC_PASSWORD = "votre_mot_de_passe"
```

---

## 📊 Monitoring Post-Déploiement

### Métriques à Surveiller

1. **Téléchargements**: Combien d'utilisateurs?
2. **Installations réussies**: Taux de succès?
3. **Crashes**: Erreurs au lancement?
4. **Feedback**: Retours utilisateurs?

### Outils Recommandés

- **Logs**: Consultez les logs dans `%APPDATA%\ULTRA_POS Cashier System\logs`
- **Analytics**: Implémenter un système de télémétrie (futur)
- **Support**: Canal de support pour feedback

---

## 📚 Ressources

### Documentation

- [Electron Builder](https://www.electron.build/)
- [Electron Documentation](https://www.electronjs.org/docs)
- [NSIS Documentation](https://nsis.sourceforge.io/Docs/)

### Support

- Documentation locale: `README.md`, `BACKEND.md`, `FRONTEND.md`
- Logs d'erreur: `dist/builder-debug.yml`

---

## 🎯 Workflow Rapide

### Build de Test

```powershell
.\scripts\build-dev.ps1
```

### Build de Production

```powershell
# 1. Mettre à jour version
npm version patch

# 2. Vérifier
.\scripts\verify.ps1

# 3. Builder
.\scripts\build.ps1

# 4. Tester dist/*.exe
```

---

---

## 🎯 Principes de Déploiement

### Le Processus en 5 Phases

> **Chaque déploiement doit suivre ces phases dans l'ordre.**

```
1. PRÉPARER
   └── Vérifier code, build, variables d'environnement

2. SAUVEGARDER
   └── Backup de l'état actuel avant modification

3. DÉPLOYER
   └── Exécuter avec monitoring actif

4. VÉRIFIER
   └── Health check, logs, flux critiques

5. CONFIRMER ou ROLLBACK
   └── Tout OK? Confirmer. Problèmes? Rollback.
```

### Principes par Phase

| Phase | Principe |
|-------|----------|
| **Préparer** | Ne jamais déployer du code non testé |
| **Sauvegarder** | Pas de rollback sans backup |
| **Déployer** | Surveiller l'exécution, ne pas partir |
| **Vérifier** | Faire confiance mais vérifier |
| **Confirmer** | Avoir le trigger de rollback prêt |

### Les 4 Catégories de Vérification Pré-Déploiement

| Catégorie | Quoi Vérifier |
|-----------|---------------|
| **Qualité du Code** | Tests passent, linting clean, code reviewé |
| **Build** | Build de production fonctionne, pas d'avertissements |
| **Environnement** | Variables d'env définies, secrets à jour |
| **Sécurité** | Backup fait, plan de rollback prêt |

---

## 🔍 Vérification Post-Déploiement

### Quoi Vérifier

| Check | Pourquoi |
|-------|----------|
| **Démarrage application** | Le service fonctionne |
| **Logs d'erreur** | Pas de nouvelles erreurs |
| **Flux utilisateur clés** | Fonctionnalités critiques OK |
| **Performance** | Temps de réponse acceptables |

### Fenêtre de Vérification Temporelle

| Période | Action |
|---------|--------|
| **5 premières minutes** | Monitoring actif intensif |
| **15 minutes** | Confirmer stabilité |
| **1 heure** | Vérification finale |
| **Jour suivant** | Revue des métriques |

### Checklist de Vérification ULTRA_POS

Après installation sur un nouveau poste :

- [ ] **Démarrage** : L'application se lance sans erreur
- [ ] **Login** : Connexion utilisateur fonctionne
- [ ] **POS** : Création d'une vente test réussie
- [ ] **Impression** : Ticket de caisse s'imprime correctement
- [ ] **Base de données** : Données persistées correctement
- [ ] **Licence** : Activation/Vérification fonctionne
- [ ] **Logs** : Aucune erreur critique dans `%APPDATA%\ULTRA_POS Cashier System\logs`

---

## ⏪ Procédures de Rollback

### Quand Effectuer un Rollback

| Symptôme | Action |
|----------|--------|
| Application ne démarre pas | Rollback immédiat |
| Erreurs critiques au fonctionnement | Rollback |
| Performance dégradée >50% | Envisager rollback |
| Problèmes mineurs | Fix forward si rapide |

### Stratégie de Rollback pour ULTRA_POS

#### 1. Application Desktop (Electron)

```powershell
# Désinstaller la version problématique
# Via Panneau de Configuration ou:
Start-Process -FilePath "C:\Program Files\ULTRA_POS Cashier System\Uninstall ULTRA_POS Cashier System.exe" -Wait

# Réinstaller la version précédente
Start-Process -FilePath ".\backup\ULTRA_POS-2.0.0-Setup.exe" -Wait
```

#### 2. Version Portable

```powershell
# Sauvegarder les données utilisateur
Copy-Item "$env:APPDATA\ULTRA_POS Cashier System\*.db" ".\backup\data\"

# Remplacer par l'ancienne version
Remove-Item ".\ULTRA_POS-Portable-2.0.1\" -Recurse -Force
Copy-Item ".\backup\ULTRA_POS-Portable-2.0.0\" -Destination ".\ULTRA_POS-Portable\" -Recurse

# Restaurer les données
Copy-Item ".\backup\data\*.db" "$env:APPDATA\ULTRA_POS Cashier System\"
```

### Principes de Rollback

1. **Vitesse plutôt que perfection** : Rollback d'abord, debug ensuite
2. **Ne pas accumuler les erreurs** : Un seul rollback, pas de changements multiples
3. **Communiquer** : Informer l'équipe de ce qui s'est passé
4. **Post-mortem** : Comprendre le problème une fois stable

### Préparation du Rollback (AVANT Déploiement)

```powershell
# Créer un dossier de backup avant chaque déploiement
$version = "2.0.0"  # Version actuelle AVANT mise à jour
$backupDir = ".\backup\$version-$(Get-Date -Format 'yyyyMMdd-HHmmss')"

New-Item -ItemType Directory -Path $backupDir -Force

# Sauvegarder l'installateur actuel
Copy-Item ".\dist\*.exe" $backupDir

# Sauvegarder la base de données utilisateur
Copy-Item "$env:APPDATA\ULTRA_POS Cashier System\*.db" $backupDir
Copy-Item "$env:APPDATA\ULTRA_POS Cashier System\*.json" $backupDir

Write-Host "✅ Backup créé: $backupDir"
```

---

## 🚨 Procédures d'Urgence

### Priorité en Cas de Panne

1. **Évaluer** : Quel est le symptôme ?
2. **Quick fix** : Redémarrer si cause incertaine
3. **Rollback** : Si le redémarrage ne résout pas
4. **Investiguer** : Après stabilisation

### Ordre d'Investigation

| Check | Problèmes Courants |
|-------|--------------------|
| **Logs Application** | Erreurs, exceptions, stack traces |
| **Ressources Système** | Disque plein, mémoire saturée |
| **Base de Données** | Corruption, verrouillage, permissions |
| **Dépendances** | DLLs manquantes, versions incompatibles |

### Actions d'Urgence ULTRA_POS

#### Application ne démarre pas

```powershell
# 1. Vérifier les logs
Get-Content "$env:APPDATA\ULTRA_POS Cashier System\logs\*.log" -Tail 50

# 2. Vérifier l'intégrité de la base
sqlite3 "$env:APPDATA\ULTRA_POS Cashier System\database.db" "PRAGMA integrity_check;"

# 3. Mode debug (si disponible)
cd "C:\Program Files\ULTRA_POS Cashier System"
.\ULTRA_POS.exe --debug
```

#### Base de données corrompue

```powershell
# Restaurer depuis backup
Copy-Item ".\backup\latest\database.db" "$env:APPDATA\ULTRA_POS Cashier System\database.db" -Force

# Ou réinitialiser (PERTE DE DONNÉES)
Remove-Item "$env:APPDATA\ULTRA_POS Cashier System\database.db"
# L'application recréera une base vide au démarrage
```

#### Problèmes de licence

```powershell
# Réinitialiser la licence
Remove-Item "$env:APPDATA\ULTRA_POS Cashier System\license.json"
# Relancer l'application et réactiver
```

---

## ❌ Anti-Patterns et Meilleures Pratiques

### Ce qu'il ne faut PAS faire

| ❌ À Éviter | ✅ À Faire |
|-------------|-----------|
| Déployer le vendredi | Déployer en début de semaine |
| Déployer dans l'urgence | Suivre le processus |
| Sauter le staging/test | Toujours tester d'abord |
| Déployer sans backup | Backup avant chaque déploiement |
| Partir après déploiement | Surveiller 15+ minutes minimum |
| Plusieurs changements à la fois | Un changement à la fois |
| Modifier en production | Tester en local puis déployer |

### Meilleures Pratiques

1. **Petits déploiements fréquents** plutôt que grosses releases
2. **Feature flags** pour les changements risqués
3. **Automatiser** les étapes répétitives
4. **Documenter** chaque déploiement
5. **Analyser** ce qui a mal tourné après incidents
6. **Tester le rollback** avant d'en avoir besoin

### Checklist de Décision Finale

Avant de déployer, vérifiez :

- [ ] **Procédure adaptée à la plateforme ?**
- [ ] **Stratégie de backup prête ?**
- [ ] **Plan de rollback documenté ?**
- [ ] **Monitoring configuré ?**
- [ ] **Équipe notifiée ?**
- [ ] **Temps disponible pour surveiller après ?**

---

> **Rappel Important:** Chaque déploiement est un risque. Minimisez le risque par la préparation, pas par la vitesse.

---

**Version du guide**: 2.0  
**Dernière mise à jour**: 2026-02-09  
**Application**: ULTRA_POS Cashier System v2.0.1
