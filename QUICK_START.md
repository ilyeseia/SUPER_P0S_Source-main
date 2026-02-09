# 🚀 Guide de Démarrage Rapide - Déploiement & Activation

## Vous venez d'appliquer le skill deployment-procedures!

Votre projet ULTRA_POS est maintenant prêt pour le déploiement professionnel.
**Un générateur de licence (Keygen) est également disponible.**

---

## ⚡ Démarrage Rapide (5 Minutes)

> [!IMPORTANT]
> **ADMINISTRATEUR REQUIS**: Lancez votre terminal (PowerShell) en tant qu'administrateur pour éviter les erreurs de build!

### Étape 1: Activer PowerShell Scripts

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Étape 2: Installer les Dépendances

```powershell
npm install
```
⏱️ Durée: 5-10 min (première fois)

### Étape 3: Vérifier la Configuration

```powershell
.\scripts\verify.ps1
```

### Étape 4: Premier Build de Test

```powershell
.\scripts\build-dev.ps1
```
⏱️ Durée: 2-5 min

---

## 🔑 Activation du Logiciel (Keygen)

Le système de licence a été mis à jour pour vous permettre de générer vos propres clés.

1.  Ouvrez le fichier `keygen.html` (à la racine du projet) dans votre navigateur (Chrome, Edge, etc.).
2.  Lancez l'application ULTRA_POS.
3.  Allez dans **Paramètres > À propos** et copiez le **Device Hash**.
4.  Collez le Hash dans le Keygen.
5.  Cliquez sur **Générer la Clé**.
6.  Copiez la clé générée et collez-la dans ULTRA_POS pour activer.

---

## 📁 Fichiers Créés

| Fichier | Description |
|---------|-------------|
| `keygen.html` | **Outil de génération de licence** |
| `src/license-crypto.js` | Module crypto mis à jour (non-obfusqué) |
| `electron-builder.json` | Configuration du build |
| `scripts/build.ps1` | Build production |
| `scripts/build-dev.ps1` | Build développement |
| `DEPLOYMENT.md` | Documentation complète |

---

## 🎯 Commandes Principales

```powershell
# Production (Admin requis)
.\scripts\build.ps1
```

Si vous rencontrez l'erreur "Cannot create symbolic link", n'oubliez pas d'exécuter en tant qu'administrateur.

---

**Prêt à déployer et activer! 🎉**
