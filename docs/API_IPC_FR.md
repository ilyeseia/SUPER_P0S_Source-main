# Référence API - Communication IPC

## Vue d'ensemble

ULTRA_POS utilise le système IPC (Inter-Process Communication) d'Electron pour la communication sécurisée entre le processus principal (Backend) et le processus de rendu (Frontend).

## Architecture IPC

```
┌─────────────────┐         IPC         ┌─────────────────┐
│                 │◄──────────────────►│                 │
│   Renderer      │    invoke/handle    │   Main Process  │
│   Process       │      send/on        │                 │
│   (Frontend)    │                     │   (Backend)     │
└─────────────────┘                     └─────────────────┘
```

---

## Canaux IPC Disponibles

### 📊 Gestion des Ventes

#### `sales:create`

Créer une nouvelle vente.

**Paramètres:**
| Nom | Type | Requis | Description |
|-----|------|--------|-------------|
| items | Array | Oui | Liste des articles vendus |
| customer | Object | Non | Informations client |
| paymentMethod | String | Oui | Mode de paiement |
| discount | Number | Non | Remise appliquée |

**Réponse:**
- 200: Objet de vente créé avec ID
- 400: Données invalides
- 500: Erreur interne

**Exemple:**
```javascript
// Frontend (renderer.js)
const saleData = {
  items: [
    { productId: 1, quantity: 2, price: 15.99 },
    { productId: 3, quantity: 1, price: 29.99 }
  ],
  customer: { id: 123, name: 'Jean Dupont' },
  paymentMethod: 'cash',
  discount: 5.00
};

const result = await window.api.invoke('sales:create', saleData);
console.log('Vente créée:', result);
```

#### `sales:get`

Récupérer une vente par ID.

**Paramètres:**
| Nom | Type | Requis | Description |
|-----|------|--------|-------------|
| id | Number | Oui | ID de la vente |

**Réponse:**
- 200: Objet de vente
- 404: Vente non trouvée

**Exemple:**
```javascript
const sale = await window.api.invoke('sales:get', { id: 42 });
```

#### `sales:list`

Lister les ventes avec filtres.

**Paramètres:**
| Nom | Type | Requis | Description |
|-----|------|--------|-------------|
| startDate | String | Non | Date de début (ISO) |
| endDate | String | Non | Date de fin (ISO) |
| limit | Number | Non | Nombre max de résultats |
| offset | Number | Non | Pagination |

**Exemple:**
```javascript
const sales = await window.api.invoke('sales:list', {
  startDate: '2024-01-01',
  endDate: '2024-01-31',
  limit: 50,
  offset: 0
});
```

---

### 📦 Gestion des Produits

#### `products:search`

Rechercher des produits.

**Paramètres:**
| Nom | Type | Requis | Description |
|-----|------|--------|-------------|
| query | String | Oui | Terme de recherche |
| category | String | Non | Filtrer par catégorie |
| inStock | Boolean | Non | Seulement en stock |

**Exemple:**
```javascript
const products = await window.api.invoke('products:search', {
  query: 'Café',
  inStock: true
});
```

#### `products:update`

Mettre à jour un produit.

**Paramètres:**
| Nom | Type | Requis | Description |
|-----|------|--------|-------------|
| id | Number | Oui | ID du produit |
| data | Object | Oui | Données à mettre à jour |

**Exemple:**
```javascript
await window.api.invoke('products:update', {
  id: 15,
  data: {
    price: 19.99,
    stock: 150
  }
});
```

---

### 🖨️ Services d'Impression

#### `print:receipt`

Imprimer un reçu de vente.

**Paramètres:**
| Nom | Type | Requis | Description |
|-----|------|--------|-------------|
| saleId | Number | Oui | ID de la vente |
| printerName | String | Non | Nom de l'imprimante |

**Exemple:**
```javascript
await window.api.invoke('print:receipt', {
  saleId: 42,
  printerName: 'ThermalPrinter'
});
```

#### `print:barcode`

Imprimer un code-barres.

**Paramètres:**
| Nom | Type | Requis | Description |
|-----|------|--------|-------------|
| productId | Number | Oui | ID du produit |
| quantity | Number | Non | Nombre d'étiquettes |

**Exemple:**
```javascript
await window.api.invoke('print:barcode', {
  productId: 15,
  quantity: 10
});
```

---

### 🔐 Licence et Authentification

#### `license:validate`

Valider la licence actuelle.

**Réponse:**
```javascript
{
  valid: true,
  expiresAt: '2025-12-31T23:59:59Z',
  deviceHash: 'abc123...'
}
```

**Exemple:**
```javascript
const licenseStatus = await window.api.invoke('license:validate');
if (!licenseStatus.valid) {
  showActivationDialog();
}
```

#### `license:activate`

Activer une nouvelle licence.

**Paramètres:**
| Nom | Type | Requis | Description |
|-----|------|--------|-------------|
| licenseKey | String | Oui | Clé de licence |

**Exemple:**
```javascript
try {
  await window.api.invoke('license:activate', {
    licenseKey: 'ULTRA-POS-...'
  });
  showSuccessMessage('Application activée!');
} catch (error) {
  showErrorMessage('Clé invalide');
}
```

#### `auth:login`

Connexion utilisateur.

**Paramètres:**
| Nom | Type | Requis | Description |
|-----|------|--------|-------------|
| username | String | Oui | Nom d'utilisateur |
| password | String | Oui | Mot de passe |

**Réponse:**
```javascript
{
  success: true,
  user: {
    id: 1,
    username: 'admin',
    role: 'administrator'
  },
  token: 'session-token-123'
}
```

---

### ⚙️ Paramètres Système

#### `settings:get`

Récupérer les paramètres.

**Paramètres:**
| Nom | Type | Requis | Description |
|-----|------|--------|-------------|
| key | String | Non | Clé spécifique ou null pour tout |

**Exemple:**
```javascript
// Récupérer un paramètre spécifique
const taxRate = await window.api.invoke('settings:get', { key: 'tax_rate' });

// Récupérer tous les paramètres
const allSettings = await window.api.invoke('settings:get');
```

#### `settings:update`

Mettre à jour un paramètre.

**Paramètres:**
| Nom | Type | Requis | Description |
|-----|------|--------|-------------|
| key | String | Oui | Clé du paramètre |
| value | Any | Oui | Nouvelle valeur |

**Exemple:**
```javascript
await window.api.invoke('settings:update', {
  key: 'tax_rate',
  value: 0.20
});
```

---

## Gestion des Événements (send/on)

### Événements du Main vers le Renderer

#### `sale:completed`

Émis après validation d'une vente.

**Payload:**
```javascript
{
  saleId: 42,
  total: 158.97,
  timestamp: '2024-01-15T14:30:00Z'
}
```

**Écoute:**
```javascript
window.api.on('sale:completed', (data) => {
  console.log('Vente complétée:', data);
  updateDashboard();
});
```

#### `inventory:low-stock`

Émis quand un produit atteint le seuil bas.

**Payload:**
```javascript
{
  productId: 15,
  productName: 'Café Arabica',
  currentStock: 5,
  minStock: 10
}
```

#### `license:expired`

Émis quand la licence expire.

**Exemple:**
```javascript
window.api.on('license:expired', () => {
  showActivationDialog();
  disableFeatures();
});
```

---

## Sécurité IPC

### Bonnes Pratiques

1. **Validation côté Backend**
   ```javascript
   // ❌ Mauvais
   ipcMain.handle('delete-product', (event, id) => {
     database.delete('products', id);
   });

   // ✅ Bon
   ipcMain.handle('delete-product', (event, id) => {
     if (!Number.isInteger(id) || id <= 0) {
       throw new Error('Invalid product ID');
     }
     return database.delete('products', id);
   });
   ```

2. **Gestion d'erreurs**
   ```javascript
   // Frontend
   try {
     const result = await window.api.invoke('sales:create', data);
   } catch (error) {
     console.error('Erreur de vente:', error.message);
     showErrorToUser(error.message);
   }
   ```

3. **Timeouts pour opérations longues**
   ```javascript
   const timeout = 5000; // 5 secondes
   const result = await Promise.race([
     window.api.invoke('heavy-operation'),
     new Promise((_, reject) => 
       setTimeout(() => reject(new Error('Timeout')), timeout)
     )
   ]);
   ```

---

## Débogage IPC

### Activer les logs

```javascript
// Dans preload.js
console.log('[IPC] Channel:', channel, 'Data:', data);
```

### Monitorer les appels

```javascript
// Dans main.js
ipcMain.handle('*', (event, ...args) => {
  console.log(`[IPC Handler] ${event.frameId}:`, args);
});
```

---

## Référence Complète

Pour la liste exhaustive des canaux IPC disponibles, consultez:
- `src/preload.js` - Exposition des APIs
- `src/main.js` - Handlers IPC
- [Guide du Développeur](./DEVELOPER_GUIDE_FR.md)

---

**Navigation:**
- [← Retour au README](./README_FR.md)
- [API Base de Données →](./API_DATABASE_FR.md)
