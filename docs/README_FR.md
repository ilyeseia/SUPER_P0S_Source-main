# ULTRA_POS - Système de Caisse Professionnel

> Système de point de vente professionnel complet basé sur Electron avec gestion de licence, impression thermique et gestion complète des stocks.

## 🚀 Démarrage Rapide

### Installation

```bash
# 1. Installer les dépendances
npm install

# 2. Démarrer l'application
npm start
```

### Configuration Minimale

| Variable | Description | Défaut |
|----------|-------------|--------|
| NODE_ENV | Environnement d'exécution | development |
| DATABASE_PATH | Chemin de la base de données | ./data/pos.db |

## ✨ Fonctionnalités

### Gestion des Ventes
- 💰 Interface de caisse tactile et intuitive
- 🧾 Génération automatique de factures
- 💳 Support de multiples modes de paiement (espèces, carte, crédit)
- 📊 Statistiques de ventes en temps réel
- 🔄 Gestion des retours et remboursements

### Gestion des Stocks
- 📦 Inventaire en temps réel
- ⚠️ Alertes de stock bas
- 🏷️ Gestion des codes-barres
- 📈 Rapports de mouvement de stock
- 🔍 Recherche avancée de produits

### Impression
- 🖨️ Support des imprimantes thermiques POS
- 🏷️ Impression de codes-barres et étiquettes
- 📄 Personnalisation des formats de factures
- ✅ Impression automatique après vente

### Administration
- 👥 Gestion multi-utilisateurs avec rôles
- 🔐 Système de licence sécurisé
- 📊 Tableau de bord d'analyse
- 💼 Gestion des clients et fournisseurs
- ⚙️ Configuration système complète

## 📁 Structure du Projet

```
ULTRA_POS/
├── src/
│   ├── main.js                      # Point d'entrée principal Electron
│   ├── database.js                  # Gestion SQLite
│   ├── license.js                   # Système de licence
│   ├── license-crypto.js            # Cryptographie de licence
│   ├── license-utils.js             # Utilitaires de licence
│   ├── ThermalPrinterService.js     # Service d'impression thermique
│   ├── BarcodePrinterService.js     # Service d'impression de codes-barres
│   ├── preload.js                   # Script de preload Electron
│   ├── security/                    # Modules de sécurité
│   │   ├── anti-debug.js           # Protection anti-débogage
│   │   └── integrity.js            # Vérification d'intégrité
│   └── ui/                          # Frontend
│       ├── index.html              # Interface principale
│       ├── renderer.js             # Logique côté client
│       ├── styles.css              # Styles CSS
│       └── assets/                 # Ressources (images, icônes)
├── keygen-app/                      # Application de génération de licence
├── scripts/                         # Scripts de build et déploiement
├── package.json                     # Configuration npm
└── electron-builder.json            # Configuration de build
```

## 🔧 Configuration

### Variables d'Environnement

Créez un fichier `.env` à la racine :

```env
# Base de données
DATABASE_PATH=./data/pos.db

# Licence
LICENSE_SERVER_URL=https://votre-serveur.com/api/license

# Impression
PRINTER_PORT=USB
PRINTER_BAUDRATE=9600

# Application
APP_TITLE=ULTRA_POS
APP_VERSION=2.0.4
```

### Configuration de la Base de Données

La base de données SQLite est créée automatiquement au premier lancement. Structure :

- `users` - Utilisateurs et authentification
- `products` - Catalogue de produits
- `sales` - Transactions de vente
- `inventory` - Mouvements de stock
- `customers` - Base de données clients
- `settings` - Paramètres système

## 📖 Documentation

### Documentation Principale
- [Guide de Démarrage Rapide](../QUICK_START.md)
- [Guide de Déploiement](../DEPLOYMENT.md)
- [Architecture Backend](../BACKEND.md)
- [Architecture Frontend](../FRONTEND.md)

### API et Références
- [API IPC](./API_IPC_FR.md) - Communication inter-processus
- [API Base de Données](./API_DATABASE_FR.md) - Opérations de base de données
- [API Licence](./API_LICENSE_FR.md) - Système de licence

### Guides d'Utilisation
- [Guide Utilisateur](./USER_GUIDE_FR.md)
- [Guide Administrateur](./ADMIN_GUIDE_FR.md)
- [Guide de Configuration](./CONFIGURATION_FR.md)

## 🔐 Système de Licence

### Activation de l'Application

1. **Obtenir le Device Hash**
   - Lancer ULTRA_POS
   - Aller dans Paramètres > À propos
   - Copier le Device Hash affiché

2. **Générer une Clé de Licence**
   - Ouvrir `keygen.html` dans un navigateur
   - Coller le Device Hash
   - Sélectionner la date d'expiration
   - Cliquer sur "Générer la Clé"
   - Copier la clé générée

3. **Activer l'Application**
   - Coller la clé dans ULTRA_POS
   - Cliquer sur "Activer Maintenant"

### Application de Génération de Licence (Keygen)

Une application standalone est disponible dans `keygen-app/` pour générer des licences sans navigateur.

```bash
# Build du Keygen
cd keygen-app
npm install
npm run build
```

## 🏗️ Build et Déploiement

### Build de Développement

```bash
npm run dev
```

### Build de Production

```bash
# Windows 64-bit
npm run build:win64

# Windows 32-bit
npm run build:win32

# Portable
npm run build:portable

# Build complet (avec Keygen)
.\build_all.ps1
```

Les fichiers de build se trouvent dans `dist/` :
- `ULTRA_POS_Setup.exe` - Installateur principal
- `ULTRA_POS_Keygen_Setup.exe` - Installateur du générateur de licence

### Configuration de Build

La configuration se trouve dans `electron-builder.json`. Personnalisez selon vos besoins.

## 🧪 Tests

```bash
# Tests unitaires
npm test

# Tests d'intégration
npm run test:integration

# Couverture de code
npm run test:coverage
```

## 🔒 Sécurité

### Fonctionnalités de Sécurité

- ✅ Cryptage de la base de données
- ✅ Protection anti-débogage
- ✅ Vérification d'intégrité des fichiers
- ✅ Système de licence sécurisé avec cryptographie
- ✅ Authentification multi-utilisateurs avec hashage bcrypt
- ✅ Protection IPC contre les injections

### Bonnes Pratiques

1. **Ne jamais commiter** :
   - Clés de licence
   - Fichiers de base de données
   - Fichiers `.env`

2. **Sauvegardes régulières** :
   - Base de données (`data/pos.db`)
   - Configuration système
   - Données clients

3. **Mises à jour** :
   - Vérifier les dépendances NPM
   - Appliquer les correctifs de sécurité Electron

## 🛠️ Dépendances Principales

### Runtime
- `electron` v22.3.27 - Framework d'application
- `better-sqlite3` v9.4.3 - Base de données
- `bcryptjs` v3.0.3 - Cryptographie de mots de passe
- `node-thermal-printer` v4.5.0 - Impression thermique
- `canvas` v3.2.1 - Manipulation d'images
- `jimp` v1.6.0 - Édition d'images

### Développement
- `electron-builder` v24.13.3 - Packaging

## 📊 Changelog

Voir [CHANGELOG.md](./CHANGELOG_FR.md) pour l'historique détaillé des versions.

### Version 2.0.4 (Actuelle)
- ✅ Système de licence amélioré
- ✅ Interface utilisateur modernisée
- ✅ Optimisation des performances
- ✅ Nouveaux rapports de ventes

## 🤝 Contribution

### Guidelines de Contribution

1. Fork le repository
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

### Standards de Code

- **JavaScript**: Standard ES6+
- **Formatage**: Prettier
- **Linting**: ESLint
- **Commits**: Convention Conventional Commits

## 📞 Support

### Obtenir de l'Aide

- 📧 Email: support@ultrapos.com
- 🌐 Site Web: https://ultrapos.com
- 📖 Documentation: https://docs.ultrapos.com
- 💬 Forum: https://community.ultrapos.com

### Rapport de Bugs

Utilisez le système de tickets GitHub avec le template fourni.

## 📄 Licence

**ISC License**

Copyright (c) 2024 ULTRA_POS Developer

Permission d'utiliser, copier, modifier et/ou distribuer ce logiciel à toute fin avec ou sans frais est accordée, à condition que l'avis de copyright ci-dessus et cet avis de permission apparaissent dans toutes les copies.

## 👨‍💻 Auteur

**ULTRA_POS Developer**

---

**Construit avec ❤️ utilisant Electron**
