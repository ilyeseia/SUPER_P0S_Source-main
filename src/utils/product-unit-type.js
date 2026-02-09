/**
 * Implémentation des fonctions pour le support des types d'unités
 * 
 * Ce fichier contient l'implémentation réelle des fonctions testées
 * dans product-unit-type.test.js
 */

// ============================================
// 1. VALIDATION DES DONNÉES
// ============================================

/**
 * Valide le type d'unité du produit
 * @param {string} unitType - Type d'unité ('unit' ou 'weight')
 * @returns {{isValid: boolean, error?: string}}
 */
function validateUnitType(unitType) {
    if (unitType === null || unitType === undefined || unitType === '') {
        return {
            isValid: false,
            error: 'Unit type is required'
        };
    }

    if (unitType !== 'unit' && unitType !== 'weight') {
        return {
            isValid: false,
            error: 'Invalid unit_type. Must be "unit" or "weight"'
        };
    }

    return { isValid: true };
}

/**
 * Valide le prix unitaire du produit
 * @param {number} price - Prix unitaire
 * @returns {{isValid: boolean, error?: string}}
 */
function validateUnitPrice(price) {
    if (price === null || price === undefined) {
        return {
            isValid: false,
            error: 'Unit price is required'
        };
    }

    if (typeof price !== 'number' || isNaN(price)) {
        return {
            isValid: false,
            error: 'Unit price must be a valid number'
        };
    }

    if (price < 0) {
        return {
            isValid: false,
            error: 'Invalid unit_price. Must be a positive number'
        };
    }

    return { isValid: true };
}

/**
 * Valide toutes les données d'un produit
 * @param {Object} product - Données du produit
 * @returns {{isValid: boolean, errors: string[]}}
 */
function validateProductData(product) {
    const errors = [];

    // Valider unit_type si fourni
    if (product.unit_type !== undefined) {
        const unitTypeValidation = validateUnitType(product.unit_type);
        if (!unitTypeValidation.isValid) {
            errors.push(unitTypeValidation.error);
        }
    }

    // Valider unit_price si fourni
    if (product.unit_price !== undefined) {
        const priceValidation = validateUnitPrice(product.unit_price);
        if (!priceValidation.isValid) {
            errors.push(priceValidation.error);
        }
    }

    return {
        isValid: errors.length === 0,
        errors
    };
}

/**
 * Normalise les données du produit avec valeurs par défaut
 * @param {Object} product - Données du produit
 * @returns {Object} Produit normalisé
 */
function normalizeProductData(product) {
    return {
        ...product,
        unit_type: product.unit_type || 'unit',
        unit_price: product.unit_price !== undefined ? product.unit_price : 0
    };
}

// ============================================
// 2. FORMATAGE ET AFFICHAGE
// ============================================

/**
 * Formate le prix du produit avec l'unité appropriée
 * @param {Object} product - Produit
 * @returns {string} Prix formaté en arabe
 */
function formatProductPrice(product) {
    const price = parseFloat(product.unit_price || 0).toFixed(2);
    const unitLabel = product.unit_type === 'weight' ? 'كيلو' : 'قطعة';
    return `${price} ر.س / ${unitLabel}`;
}

/**
 * Retourne le label de l'unité en arabe
 * @param {string} unitType - Type d'unité
 * @returns {string} Label en arabe
 */
function getUnitLabel(unitType) {
    if (unitType === 'weight') {
        return 'كيلو';
    }
    return 'قطعة'; // Défaut
}

/**
 * Retourne l'icône emoji pour le type d'unité
 * @param {string} unitType - Type d'unité
 * @returns {string} Emoji
 */
function getUnitIcon(unitType) {
    if (unitType === 'weight') {
        return '⚖️';
    }
    return '📦'; // Défaut
}

// ============================================
// 3. VALIDATION DES QUANTITÉS
// ============================================

/**
 * Valide la quantité selon le type d'unité
 * @param {number} quantity - Quantité
 * @param {string} unitType - Type d'unité
 * @returns {{isValid: boolean, error?: string}}
 */
function validateQuantity(quantity, unitType) {
    // Vérifier que c'est un nombre
    if (typeof quantity !== 'number' || isNaN(quantity) || !isFinite(quantity)) {
        return {
            isValid: false,
            error: 'Quantity must be a number'
        };
    }

    // Vérifier que c'est positif
    if (quantity <= 0) {
        return {
            isValid: false,
            error: 'Quantity must be greater than zero'
        };
    }

    // Pour les produits à l'unité, vérifier que c'est un entier
    if (unitType === 'unit' && !Number.isInteger(quantity)) {
        return {
            isValid: false,
            error: 'Quantity must be a whole number for unit-based products'
        };
    }

    return { isValid: true };
}

// ============================================
// 4. CALCUL DES PRIX
// ============================================

/**
 * Calcule le total pour un article
 * @param {Object} product - Produit
 * @param {number} quantity - Quantité
 * @returns {number} Total arrondi à 2 décimales
 */
function calculateItemTotal(product, quantity) {
    const unitPrice = parseFloat(product.unit_price || 0);
    const total = unitPrice * quantity;
    return Math.round(total * 100) / 100; // Arrondir à 2 décimales
}

/**
 * Calcule le total du panier
 * @param {Array} cart - Articles du panier
 * @returns {number} Total du panier
 */
function calculateCartTotal(cart) {
    if (!cart || cart.length === 0) {
        return 0;
    }

    const total = cart.reduce((sum, item) => {
        return sum + calculateItemTotal(item.product, item.quantity);
    }, 0);

    return Math.round(total * 100) / 100;
}

// ============================================
// 5. HANDLERS IPC (Simulation)
// ============================================

/**
 * Handler pour créer un produit
 * @param {Object} productData - Données du produit
 * @param {Object} db - Instance de la base de données
 * @returns {Promise<Object>} Résultat
 */
async function handleProductsCreate(productData, db) {
    // Normaliser les données
    const normalizedData = normalizeProductData(productData);

    // Valider les données
    const validation = validateProductData(normalizedData);
    if (!validation.isValid) {
        throw new Error(validation.errors[0]);
    }

    // Insérer dans la base de données
    const stmt = db.prepare(`
    INSERT INTO products (
      name, barcode, price, cost, stock,
      category, supplier_id, low_stock_limit,
      description, unit_type, unit_price
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

    const result = stmt.run(
        normalizedData.name,
        normalizedData.barcode,
        normalizedData.price || 0,
        normalizedData.cost || 0,
        normalizedData.stock || 0,
        normalizedData.category,
        normalizedData.supplier_id,
        normalizedData.low_stock_limit || 0,
        normalizedData.description,
        normalizedData.unit_type,
        normalizedData.unit_price
    );

    return {
        success: true,
        product: {
            id: result.lastInsertRowid,
            ...normalizedData
        }
    };
}

/**
 * Handler pour mettre à jour un produit
 * @param {Object} updateData - Données de mise à jour
 * @param {Object} db - Instance de la base de données
 * @returns {Promise<Object>} Résultat
 */
async function handleProductsUpdate(updateData, db) {
    const { id, data } = updateData;

    // Valider les nouvelles données si présentes
    if (data.unit_type !== undefined) {
        const validation = validateUnitType(data.unit_type);
        if (!validation.isValid) {
            throw new Error(validation.error);
        }
    }

    if (data.unit_price !== undefined) {
        const validation = validateUnitPrice(data.unit_price);
        if (!validation.isValid) {
            throw new Error(validation.error);
        }
    }

    // Construire la requête de mise à jour
    const allowedFields = [
        'name', 'barcode', 'price', 'cost', 'stock',
        'category', 'supplier_id', 'low_stock_limit',
        'description', 'unit_type', 'unit_price'
    ];

    const updates = [];
    const values = [];

    for (const field of allowedFields) {
        if (data[field] !== undefined) {
            updates.push(`${field} = ?`);
            values.push(data[field]);
        }
    }

    if (updates.length === 0) {
        return { success: true };
    }

    values.push(id);

    const stmt = db.prepare(`
    UPDATE products
    SET ${updates.join(', ')}
    WHERE id = ?
  `);

    stmt.run(...values);

    return { success: true };
}

/**
 * Handler pour rechercher des produits
 * @param {Object} params - Paramètres de recherche
 * @param {Object} db - Instance de la base de données
 * @returns {Promise<Object>} Résultat
 */
async function handleProductsSearch(params, db) {
    const { query = '', category, inStock } = params;

    let sql = `
    SELECT 
      id, name, barcode, price, cost, stock,
      category, supplier_id, low_stock_limit,
      description, unit_type, unit_price
    FROM products
    WHERE 1=1
  `;

    const queryParams = [];

    if (query) {
        sql += ' AND (name LIKE ? OR barcode LIKE ?)';
        queryParams.push(`%${query}%`, `%${query}%`);
    }

    if (category) {
        sql += ' AND category = ?';
        queryParams.push(category);
    }

    if (inStock) {
        sql += ' AND stock > 0';
    }

    const stmt = db.prepare(sql);
    const products = stmt.all(...queryParams);

    return {
        success: true,
        products
    };
}

// ============================================
// 6. MIGRATION DES DONNÉES
// ============================================

/**
 * Migre un produit ancien vers le nouveau schéma
 * @param {Object} product - Produit à migrer
 * @returns {Object} Produit migré
 */
function migrateProduct(product) {
    return {
        ...product,
        unit_type: product.unit_type || 'unit',
        unit_price: product.unit_price !== null && product.unit_price !== undefined
            ? product.unit_price
            : 0
    };
}

// ============================================
// EXPORTS
// ============================================

module.exports = {
    // Validation
    validateUnitType,
    validateUnitPrice,
    validateProductData,
    normalizeProductData,

    // Formatage
    formatProductPrice,
    getUnitLabel,
    getUnitIcon,

    // Quantités
    validateQuantity,

    // Calculs
    calculateItemTotal,
    calculateCartTotal,

    // IPC Handlers
    handleProductsCreate,
    handleProductsUpdate,
    handleProductsSearch,

    // Migration
    migrateProduct
};
