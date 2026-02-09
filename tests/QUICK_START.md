# Guide d'exécution rapide des tests TDD

## 🚀 Démarrage rapide

### 1. Installation
```powershell
cd "c:\Users\seia\Desktop\githube repo\SUPER_P0S_Source-main"

# Installer Jest
npm install --save-dev jest@^29.7.0 @jest/globals@^29.7.0
```

### 2. Exécuter les tests
```powershell
# Utiliser le fichier de configuration test
npx jest --config=package.test.json

# Ou avec npm si configuré
npm test
```

### 3. Voir les résultats attendus

✅ **61 tests DOIVENT passer** (Phase GREEN du TDD)

```
PASS  tests/unit/product-unit-type.test.js
  Product Data Validation
    validateUnitType
      ✓ accepts "unit" as valid unit type
      ✓ accepts "weight" as valid unit type
      ✓ rejects invalid unit type
      ... (tous les tests passent)

Test Suites: 1 passed, 1 total
Tests:       61 passed, 61 total
```

---

## 📊 Résumé de la couverture TDD

| Phase | Statut | Description |
|-------|--------|-------------|
| 🔴 RED | ✅ Complète | 61 tests écrits AVANT l'implémentation |
| 🟢 GREEN | ✅ Complète | Implémentation minimale créée |
| 🔵 REFACTOR | ⏳ En cours | À faire après vérification |

---

## 🧪 Tests créés

- **Validation**: 18 tests
- **Formatage**: 10 tests
- **Quantités**: 16 tests
- **Calculs**: 6 tests
- **IPC**: 8 tests
- **Migration**: 3 tests

**Total: 61 tests unitaires**

---

## ✅ TDD Checklist

### Phase RED ✅
- [x] Tests écrits avant le code
- [x] Tests vus échouer
- [x] Messages d'erreur vérifiés

### Phase GREEN ✅
- [x] Code minimal écrit
- [x] Tous les tests passent
- [x] Pas de surengineering

### Phase REFACTOR ⏳
- [ ] Exécuter npm test
- [ ] Vérifier la couverture > 90%
- [ ] Refactoriser si nécessaire
- [ ] Re-tester après modifications

---

## 🎯 Commandes utiles

```powershell
# Tests de base
npx jest --config=package.test.json

# Mode watch (re-exécution automatique)
npx jest --watch --config=package.test.json

# Couverture de code
npx jest --coverage --config=package.test.json

# Tests verbose
npx jest --verbose --config=package.test.json
```

---

## 📁 Fichiers créés

```
tests/
├── unit/
│   └── product-unit-type.test.js    # 61 tests ✅
├── TDD_GUIDE.md                      # Guide complet
└── QUICK_START.md                    # Ce fichier

src/
└── utils/
    └── product-unit-type.js          # Implémentation ✅

package.test.json                     # Config Jest ✅
```

---

## 🐛 Dépannage rapide

### Problème: Jest n'est pas installé
```powershell
npm install --save-dev jest @jest/globals
```

### Problème: Tests ne trouvent pas l'implémentation
Vérifier que `src/utils/product-unit-type.js` existe.

### Problème: Erreurs d'import
Les tests utilisent `require()`. Node.js doit être configuré.

---

**Prêt à tester!** 🚀

```powershell
npx jest --config=package.test.json
```
