---
description: Déployer SUPER_POS avec mise à jour de version et build
---

# Workflow de Déploiement SUPER_POS

Ce workflow guide le déploiement complet de l'application SUPER_POS Cashier System.

## ⚠️ Prérequis Important

> [!IMPORTANT]
> **Privilèges Administrateur Requis**: Le processus de build (electron-builder) nécessite des privilèges administrateur pour extraire correctement les outils de signature (winCodeSign) sur Windows.
> **Veuillez lancer votre terminal (PowerShell/CMD) en tant qu'administrateur avant d'exécuter les scripts.**

## Prérequis

- Node.js v16+ installé
- Toutes les modifications de code committées
- Tests locaux passés

## Étapes de Déploiement

### 1. Vérifier la configuration du projet

```powershell
.\scripts\verify.ps1
```

### 2. Mettre à jour la version

Choisir le type de mise à jour:

```powershell
# Pour corrections de bugs (2.0.1 → 2.0.2)
npm version patch

# Pour nouvelles fonctionnalités (2.0.1 → 2.1.0)  
npm version minor

# Pour changements majeurs (2.0.1 → 3.0.0)
npm version major
```

// turbo
### 3. Installer/Mettre à jour les dépendances

```powershell
npm install
```

// turbo
### 4. Lancer le build de production

```powershell
.\scripts\build.ps1
```

### 5. Tester l'installateur

**Actions manuelles requises:**
1. Naviguer vers le dossier `dist/`
2. Exécuter `SUPER_P0S Cashier System-X.X.X-Setup.exe`
3. Installer sur une machine de test ou VM
4. Vérifier:
   - ✅ Installation réussie
   - ✅ Application démarre
   - ✅ Login fonctionne
   - ✅ Point de vente opérationnel
   - ✅ Impression de test OK
   - ✅ Base de données créée

### 6. Tester la version portable

**Actions manuelles requises:**
1. Exécuter `SUPER_P0S Cashier System-X.X.X-Portable.exe` 
2. Vérifier le fonctionnement sans installation

### 7. Créer les notes de version

Documenter dans un fichier texte ou sur la plateforme de distribution:
- 🆕 Nouvelles fonctionnalités
- 🐛 Corrections de bugs
- ⚡ Améliorations de performance
- ⚠️ Breaking changes (si applicable)

### 8. Distribuer

Uploader les fichiers de `dist/` vers:
- Serveur web de téléchargement
- Plateforme cloud (Google Drive, Dropbox, etc.)
- GitHub Releases
- Serveur FTP client

### 9. Notifier les utilisateurs

- Envoyer un email aux clients
- Publier sur les canaux de communication
- Mettre à jour le site web
- Mettre à jour la documentation

## Build de Développement Rapide

Pour des tests rapides durant le développement (sans la checklist complète):

// turbo
```powershell
.\scripts\build-dev.ps1
```

## Rollback en Cas de Problème

Si des problèmes sont détectés après distribution:

1. **Retirer le téléchargement** de la version problématique
2. **Remettre à disposition** la version précédente stable
3. **Notifier** les utilisateurs immédiatement
4. **Corriger** le problème localement
5. **Redéployer** avec un nouveau patch version

## Vérifications Post-Déploiement

Dans les 24h suivant le déploiement:

- [ ] Surveiller les logs de téléchargement
- [ ] Vérifier les retours utilisateurs
- [ ] Monitorer les rapports d'erreur
- [ ] Confirmer fonctionnement sur différents systèmes Windows

## Troubleshooting

En cas de problème, consulter:
- `DEPLOYMENT.md` section Dépannage
- Logs dans `dist/builder-debug.yml`
- Documentation electron-builder

## Notes Importantes

- ⏰ **Ne pas déployer le vendredi**: Privilégier début de semaine pour avoir le temps de corriger si problème
- 🔍 **Toujours tester avant**: Ne jamais distribuer sans tester l'installateur
- 💾 **Garder les anciennes versions**: Archiver les builds précédents pour rollback rapide
- 📝 **Documenter**: Toujours créer des notes de version claires
