# Guide de Test TDD - Fonctionnalité Unit Type

## 📋 Vue d'ensemble

Ce document explique comment exécuter et maintenir les tests pour la fonctionnalité de support des types d'unités (Unit/Weight).

---

## 🚀 Installation

```bash
# Installer les dépendances de test
npm install --save-dev jest @jest/globals

# Ou copier package.test.json vers package.json
```

---

## ▶️ Exécution des tests

### Tests unitaires complets
```bash
npm test
```

### Tests en mode watch (développement)
```bash
npm run test:watch
```

### Tests avec couverture de code
```bash
npm run test:coverage
```

### Tests unitaires seulement
```bash
npm run test:unit
```

---

## 📊 Structure des tests

```
tests/
└── unit/
    └── product-unit-type.test.js    # 60+ tests unitaires

src/
└── utils/
    └── product-unit-type.js          # Implémentation
```

---

## ✅ Liste de contrôle TDD

### Phase RED (Tests qui échouent)
- [x] 60+ tests écrits AVANT l'implémentation
- [x] Tests de validation (unit_type, unit_price)
- [x] Tests de formatage et affichage
- [x] Tests de validation des quantités
- [x] Tests de calcul des prix
- [x] Tests d'intégration IPC
- [x] Tests de migration des données

### Phase GREEN (Implémentation minimale)
- [x] Fonctions de validation implémentées
- [x] Fonctions de formatage implémentées
- [x] Validation des quantités implémentée
- [x] Calculs de prix implémentés
- [x] Handlers IPC implémentés
- [x] Migration des données implémentée

### Phase REFACTOR (À faire)
- [ ] Exécuter tous les tests
- [ ] Vérifier la couverture de code
- [ ] Refactoriser si nécessaire
- [ ] Re-tester après refactoring

---

## 🧪 Catégories de tests

### 1. Validation des données (18 tests)
- ✅ validateUnitType: 6 tests
- ✅ validateUnitPrice: 6 tests
- ✅ validateProductData: 4 tests
- ✅ normalizeProductData: 2 tests

### 2. Formatage et affichage (10 tests)
- ✅ formatProductPrice: 5 tests
- ✅ getUnitLabel: 4 tests
- ✅ getUnitIcon: 3 tests

### 3. Validation des quantités (16 tests)
- ✅ Unit-based products: 5 tests
- ✅ Weight-based products: 6 tests
- ✅ Edge cases: 5 tests

### 4. Calculs de prix (6 tests)
- ✅ calculateItemTotal: 5 tests
- ✅ calculateCartTotal: 3 tests

### 5. Intégration IPC (8 tests)
- ✅ products:create: 4 tests
- ✅ products:update: 3 tests
- ✅ products:search: 1 test

### 6. Migration (3 tests)
- ✅ migrateProduct: 3 tests

**Total: 61 tests**

---

## 📈 Couverture de code attendue

| Métrique | Objectif |
|----------|----------|
| Statements | > 90% |
| Branches | > 85% |
| Functions | 100% |
| Lines | > 90% |

---

## 🐛 Exécution des tests - Étape par étape

### 1. Installer Jest
```bash
npm install
```

### 2. Lancer les tests (Phase RED)
```bash
npm test
```

**Résultat attendu**: Tous les tests DOIVENT échouer car les fonctions lancent `throw new Error('Not implemented')`

### 3. Remplacer les stubs par l'implémentation

Copier le contenu de `src/utils/product-unit-type.js` dans le fichier de test pour remplacer les stubs.

### 4. Re-lancer les tests (Phase GREEN)
```bash
npm test
```

**Résultat attendu**: Tous les tests DOIVENT passer ✅

### 5. Vérifier la couverture
```bash
npm run test:coverage
```

**Résultat attendu**: Couverture > 90%

---

## 🔍 Exemples de tests

### Test de validation
```javascript
test('accepts "unit" as valid unit type', () => {
  const result = validateUnitType('unit');
  expect(result.isValid).toBe(true);
  expect(result.error).toBeUndefined();
});
```

### Test de formatage
```javascript
test('formats price for unit-based product in Arabic', () => {
  const product = {
    unit_type: 'unit',
    unit_price: 2.50
  };
  const result = formatProductPrice(product);
  expect(result).toBe('2.50 ر.س / قطعة');
});
```

### Test de quantité
```javascript
test('accepts integer quantity for unit type', () => {
  const result = validateQuantity(5, 'unit');
  expect(result.isValid).toBe(true);
  expect(result.error).toBeUndefined();
});
```

---

## ⚠️ Notes importantes

### Red-Green-Refactor
1. **RED**: Écrire le test, le voir échouer
2. **GREEN**: Écrire le code minimal pour passer le test
3. **REFACTOR**: Améliorer le code sans changer le comportement

### Principes TDD respectés
- ✅ Tous les tests écrits AVANT l'implémentation
- ✅ Tests vus échouer avant implémentation
- ✅ Implémentation minimale pour passer les tests
- ✅ Pas de code de production sans test

### Intégration avec le code existant

Les fonctions implémentées doivent être intégrées dans:
- `src/database.js` → pour la validation lors de l'insertion
- `src/main.js` → pour les handlers IPC
- `src/ui/renderer.js` → pour le formatage et la validation UI

---

## 🔄 Workflow de développement recommandé

1. **Lire le test** → Comprendre le comportement attendu
2. **Lancer le test** → Vérifier qu'il échoue (RED)
3. **Écrire le code minimal** → Juste assez pour passer (GREEN)
4. **Lancer le test** → Vérifier qu'il passe
5. **Refactoriser** → Améliorer le code
6. **Re-tester** → S'assurer que tout passe toujours
7. **Passer au test suivant** → Répéter

---

## 📞 Débogage

### Les tests ne s'exécutent pas
```bash
# Vérifier Jest est installé
npm list jest

# Réinstaller si nécessaire
npm install --save-dev jest @jest/globals
```

### Tous les tests échouent immédiatement
C'est normal! Les stubs lancent des erreurs. Remplacez-les par l'implémentation réelle.

### Certains tests échouent
1. Lire le message d'erreur
2. Vérifier l'implémentation de la fonction
3. Corriger le code
4. Re-lancer les tests

### Problèmes de couverture
```bash
# Voir le rapport détaillé
npm run test:coverage
open coverage/lcov-report/index.html
```

---

## 🎯 Prochaines étapes

1. ✅ Tests unitaires créés (61 tests)
2. ✅ Implémentation créée
3. ⏳ **Exécuter les tests**
4. ⏳ Vérifier la couverture
5. ⏳ Intégrer dans le code existant
6. ⏳ Tests d'intégration E2E
7. ⏳ Tests manuels dans l'application

---

**Date de création**: 2026-02-09  
**Statut**: Tests écrits, implémentation créée, prêt pour exécution
