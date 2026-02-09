# Guide Utilisateur ULTRA_POS

## Bienvenue dans ULTRA_POS

Ce guide vous accompagne dans l'utilisation quotidienne du système de caisse ULTRA_POS.

---

## 📖 Table des Matières

1. [Premier Démarrage](#premier-démarrage)
2. [Interface Principale](#interface-principale)
3. [Effectuer une Vente](#effectuer-une-vente)
4. [Gestion des Produits](#gestion-des-produits)
5. [Clients et Fournisseurs](#clients-et-fournisseurs)
6. [Rapports et Statistiques](#rapports-et-statistiques)
7. [Paramètres](#paramètres)
8. [Dépannage](#dépannage)

---

## Premier Démarrage

### 1. Activation de l'Application

Au premier lancement, vous devez activer ULTRA_POS :

1. **Récupérer votre Device Hash**
   - Lancez l'application
   - L'écran d'activation s'affiche automatiquement
   - Notez ou copiez le **Device Hash** affiché

2. **Obtenir une Clé de Licence**
   - Contactez votre administrateur ou
   - Utilisez le générateur de licence si disponible
   - Fournissez votre Device Hash

3. **Activer**
   - Collez la clé de licence dans le champ prévu
   - Cliquez sur **"Activer Maintenant"**
   - L'application se déverrouille immédiatement

### 2. Première Connexion

1. **Identifiants par défaut** (à changer immédiatement) :
   - Utilisateur : `admin`
   - Mot de passe : `admin123`

2. **Connexion** :
   - Entrez vos identifiants
   - Cliquez sur "Connexion"

> [!WARNING]
> **Changez le mot de passe par défaut** dès la première connexion pour sécuriser le système.

---

## Interface Principale

### Zones de l'Écran

```
┌─────────────────────────────────────────────────┐
│  Logo ULTRA_POS            [Utilisateur ▼]      │
├─────────────────────────────────────────────────┤
│  ┌─────────┐ ┌─────────┐ ┌─────────┐           │
│  │  Caisse │ │Produits │ │Rapports │  ← Menu   │
│  └─────────┘ └─────────┘ └─────────┘           │
├─────────────────────────────────────────────────┤
│                                                 │
│           Zone de Travail Principale            │
│                                                 │
├─────────────────────────────────────────────────┤
│  Statut: Connecté  |  Licence: Valide  | v2.0.4│
└─────────────────────────────────────────────────┘
```

### Barre de Menu

- **🏠 Caisse** : Interface de vente
- **📦 Produits** : Gestion du catalogue
- **👥 Clients** : Base de données clients
- **📊 Rapports** : Statistiques et analyses
- **⚙️ Paramètres** : Configuration système

---

## Effectuer une Vente

### Processus de Vente Standard

#### Étape 1 : Sélectionner les Produits

**Méthode 1 : Scanner le code-barres**
```
1. Utilisez le lecteur de code-barres
2. Scannez le produit
3. Le produit s'ajoute automatiquement au panier
```

**Méthode 2 : Recherche manuelle**
```
1. Cliquez sur la barre de recherche
2. Tapez le nom ou le code du produit
3. Sélectionnez dans les résultats
4. Cliquez sur "Ajouter au panier"
```

**Méthode 3 : Catalogue visuel**
```
1. Parcourez les catégories
2. Cliquez directement sur les produits
```

#### Étape 2 : Modifier les Quantités

```
- Cliquez sur le champ "Quantité"
- Entrez la nouvelle valeur
- Ou utilisez les boutons [+] [-]
```

#### Étape 3 : Appliquer une Remise (Optionnel)

```
1. Cliquez sur "Remise" sur la ligne du produit
2. Choisissez :
   - Pourcentage (ex: 10%)
   - Montant fixe (ex: 5 €)
3. La remise est appliquée instantanément
```

#### Étape 4 : Finaliser la Vente

1. **Vérifier le Total**
   ```
   Sous-total :     45,00 €
   Remise :         -5,00 €
   TVA (20%) :       8,00 €
   ────────────────────────
   TOTAL :          48,00 €
   ```

2. **Choisir le Mode de Paiement**
   - 💵 Espèces
   - 💳 Carte bancaire
   - 📝 Crédit (client)

3. **Encaissement**
   - Pour espèces : Entrez le montant reçu
   - Le système calcule la monnaie à rendre
   - Validez avec **"Payer"**

4. **Impression de la Facture**
   - La facture s'imprime automatiquement
   - Ou cliquez sur "Réimprimer" si nécessaire

### Cas Particuliers

#### Vente avec Client Enregistré

```
1. Avant de finaliser, cliquez sur "Client"
2. Recherchez le client par nom/téléphone
3. Sélectionnez-le
4. Les points de fidélité sont automatiquement calculés
```

#### Retour de Produit

```
1. Menu > Caisse > Retours
2. Recherchez la vente par numéro ou date
3. Sélectionnez les articles à retourner
4. Validez le remboursement
```

---

## Gestion des Produits

### Ajouter un Nouveau Produit

1. **Accéder au Catalogue**
   ```
   Menu > Produits > Ajouter un produit
   ```

2. **Informations Obligatoires**
   | Champ | Description | Exemple |
   |-------|-------------|---------|
   | Nom | Nom du produit | Café Arabica 250g |
   | Code-barres | EAN/UPC | 3760123456789 |
   | Prix de vente | Prix TTC | 12,50 € |
   | Catégorie | Classification | Épicerie > Café |

3. **Informations Optionnelles**
   - Description
   - Image du produit
   - Prix d'achat
   - Stock initial
   - Stock minimum (alerte)
   - Fournisseur

4. **Enregistrer**
   ```
   Cliquez sur "Enregistrer"
   Le produit est immédiatement disponible à la vente
   ```

### Modifier un Produit

```
1. Menu > Produits
2. Recherchez le produit
3. Cliquez sur l'icône "Modifier" ✏️
4. Effectuez les changements
5. Sauvegardez
```

### Gestion du Stock

#### Ajuster le Stock Manuellement

```
1. Produits > Sélectionner un produit
2. Cliquez sur "Ajuster Stock"
3. Indiquez :
   - Nouvelle quantité OU
   - Ajout/Retrait de quantité
4. Motif (optionnel) : Inventaire, Casse, etc.
5. Validez
```

#### Alerte Stock Bas

- Les produits en stock bas apparaissent en **orange**
- Définissez le seuil d'alerte dans les paramètres du produit
- Recevez des notifications automatiques

---

## Clients et Fournisseurs

### Ajouter un Client

```
1. Menu > Clients > Nouveau Client
2. Remplissez :
   - Nom *
   - Prénom
   - Téléphone *
   - Email
   - Adresse
3. Options :
   - Limite de crédit
   - Remise personnalisée
   - Carte de fidélité
4. Enregistrer
```

### Consulter l'Historique Client

```
1. Sélectionnez un client
2. Onglet "Historique"
3. Consultez :
   - Toutes les ventes
   - Total dépensé
   - Crédit restant
   - Points de fidélité
```

---

## Rapports et Statistiques

### Rapports Disponibles

#### 📊 Tableau de Bord

Vue d'ensemble quotidienne :
- Chiffre d'affaires du jour
- Nombre de ventes
- Produits les plus vendus
- Stock bas
- Objectifs vs Réalisé

#### 💰 Rapports de Ventes

```
Menu > Rapports > Ventes
```

Filtres disponibles :
- Période (Jour, Semaine, Mois, Personnalisé)
- Utilisateur (caissier)
- Mode de paiement
- Client

Exports :
- 📄 PDF
- 📊 Excel
- 📧 Email

#### 📦 Rapports de Stock

```
Menu > Rapports > Stock
```

- **Inventaire Complet** : Liste tous les produits avec stock actuel
- **Mouvements** : Historique des entrées/sorties
- **Valorisation** : Valeur totale du stock

#### 👥 Rapports Clients

- Top clients (par CA)
- Clients inactifs
- Statistiques de fidélité

---

## Paramètres

### Paramètres Généraux

#### Informations de l'Entreprise

```
Menu > Paramètres > Entreprise
```

- Nom de l'entreprise
- Adresse
- Téléphone
- Email
- Logo (pour les factures)
- Numéro SIRET/TVA

#### Configuration des Taxes

```
Menu > Paramètres > Taxes
```

- Taux de TVA par défaut
- Taux réduits
- Activation/Désactivation de la TVA

#### Impression

```
Menu > Paramètres > Impression
```

- Sélection de l'imprimante
- Format de facture
- Impression automatique
- Impression du logo
- Mentions légales sur facture

### Gestion des Utilisateurs

#### Créer un Utilisateur

```
Menu > Paramètres > Utilisateurs > Ajouter
```

**Rôles disponibles :**

| Rôle | Permissions |
|------|-------------|
| **Administrateur** | Accès complet |
| **Gérant** | Tout sauf suppression de données |
| **Caissier** | Ventes uniquement |
| **Stockiste** | Gestion produits et stock |

#### Modifier les Permissions

```
1. Sélectionnez l'utilisateur
2. Cliquez sur "Permissions"
3. Cochez/Décochez les accès
4. Sauvegardez
```

---

## Dépannage

### Problèmes Courants

#### ❌ "Licence Expirée"

**Solution :**
```
1. Menu > Paramètres > À propos
2. Vérifiez la date d'expiration
3. Contactez votre administrateur pour renouvellement
4. Entrez la nouvelle clé de licence
```

#### ❌ L'imprimante ne répond pas

**Solutions :**
1. **Vérifier la connexion**
   - USB bien branché
   - Imprimante allumée

2. **Redémarrer l'imprimante**
   ```
   Éteignez > Attendez 10s > Rallumez
   ```

3. **Réinstaller le pilote**
   ```
   Paramètres Windows > Imprimantes
   Supprimez et réinstallez l'imprimante
   ```

4. **Changer d'imprimante dans ULTRA_POS**
   ```
   Menu > Paramètres > Impression
   Sélectionnez la bonne imprimante
   ```

#### ❌ Produit non trouvé au scan

**Solutions :**
1. **Vérifier le code-barres**
   - Est-il bien enregistré dans le système ?
   
2. **Scanner manuellement**
   ```
   Menu > Produits > Recherche par code-barres
   Entrez le code manuellement
   ```

3. **Ajouter le code-barres**
   ```
   Produits > Modifier le produit
   Ajoutez/Corrigez le code-barres
   ```

#### ❌ Erreur "Base de données verrouillée"

**Solution :**
```
1. Fermez ULTRA_POS complètement
2. Attendez 30 secondes
3. Relancez l'application
```

> [!CAUTION]
> Si le problème persiste, **NE TOUCHEZ PAS** aux fichiers de base de données. Contactez le support technique.

### Sauvegardes

#### Créer une Sauvegarde Manuelle

```
Menu > Paramètres > Sauvegarde > Créer une sauvegarde
```

Le fichier est enregistré dans :
```
C:\ProgramData\ULTRA_POS\Backups\
```

#### Restaurer une Sauvegarde

```
Menu > Paramètres > Sauvegarde > Restaurer
```

> [!WARNING]
> La restauration écrase toutes les données actuelles. Confirmez avant de procéder.

---

## Raccourcis Clavier

| Raccourci | Action |
|-----------|--------|
| `F1` | Aide |
| `F2` | Nouvelle vente |
| `F3` | Recherche produit |
| `F4` | Clients |
| `F5` | Actualiser |
| `F9` | Ouvrir le tiroir-caisse |
| `F12` | Paramètres |
| `Ctrl + P` | Imprimer |
| `Ctrl + S` | Sauvegarder |
| `Échap` | Annuler/Retour |

---

## Support et Assistance

### Obtenir de l'Aide

- 📞 **Téléphone** : 01 23 45 67 89
- 📧 **Email** : support@ultrapos.com
- 🌐 **Site Web** : https://ultrapos.com/support
- 💬 **Chat en ligne** : Disponible 9h-18h

### Tutoriels Vidéo

Accédez à notre bibliothèque de vidéos :
```
https://ultrapos.com/tutorials
```

---

**Bonne utilisation de ULTRA_POS ! 🎉**
