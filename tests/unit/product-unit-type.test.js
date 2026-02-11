/**
 * Tests unitaires pour les fonctionnalités de support des types d'unités (Unit/Weight)
 * 
 * Tests pour:
 * - Validation des données (unit_type, unit_price)
 * - Fonctions de formatage et d'affichage
 * - Fonctions de validation de quantité
 * - Logique métier
 */

const { describe, test, expect, beforeEach } = require('@jest/globals');
const {
    validateUnitType,
    validateUnitPrice,
    validateProductData,
    normalizeProductData,
    formatProductPrice,
    getUnitLabel,
    getUnitIcon,
    validateQuantity,
    calculateItemTotal,
    calculateCartTotal,
    handleProductsCreate,
    handleProductsUpdate,
    handleProductsSearch,
    migrateProduct
} = require('../../src/utils/product-unit-type');

// ============================================
// 1. TESTS DE VALIDATION DES DONNÉES
// ============================================

describe('Product Data Validation', () => {
    describe('validateUnitType', () => {
        test('accepts "unit" as valid unit type', () => {
            const result = validateUnitType('unit');
            expect(result.isValid).toBe(true);
            expect(result.error).toBeUndefined();
        });

        test('accepts "weight" as valid unit type', () => {
            const result = validateUnitType('weight');
            expect(result.isValid).toBe(true);
            expect(result.error).toBeUndefined();
        });

        test('rejects invalid unit type', () => {
            const result = validateUnitType('invalid');
            expect(result.isValid).toBe(false);
            expect(result.error).toBe('Invalid unit_type. Must be "unit" or "weight"');
        });

        test('rejects null unit type', () => {
            const result = validateUnitType(null);
            expect(result.isValid).toBe(false);
            expect(result.error).toBeDefined();
        });

        test('rejects undefined unit type', () => {
            const result = validateUnitType(undefined);
            expect(result.isValid).toBe(false);
            expect(result.error).toBeDefined();
        });

        test('rejects empty string unit type', () => {
            const result = validateUnitType('');
            expect(result.isValid).toBe(false);
            expect(result.error).toBeDefined();
        });
    });

    describe('validateUnitPrice', () => {
        test('accepts positive number as valid price', () => {
            const result = validateUnitPrice(10.50);
            expect(result.isValid).toBe(true);
            expect(result.error).toBeUndefined();
        });

        test('accepts zero as valid price', () => {
            const result = validateUnitPrice(0);
            expect(result.isValid).toBe(true);
            expect(result.error).toBeUndefined();
        });

        test('rejects negative price', () => {
            const result = validateUnitPrice(-5.00);
            expect(result.isValid).toBe(false);
            expect(result.error).toBe('Invalid unit_price. Must be a positive number');
        });

        test('rejects NaN as price', () => {
            const result = validateUnitPrice(NaN);
            expect(result.isValid).toBe(false);
            expect(result.error).toBeDefined();
        });

        test('rejects string as price', () => {
            const result = validateUnitPrice('10.50');
            expect(result.isValid).toBe(false);
            expect(result.error).toBeDefined();
        });

        test('rejects null as price', () => {
            const result = validateUnitPrice(null);
            expect(result.isValid).toBe(false);
            expect(result.error).toBeDefined();
        });
    });

    describe('validateProductData', () => {
        test('accepts valid product with unit type', () => {
            const product = {
                name: 'قلم رصاص',
                unit_type: 'unit',
                unit_price: 2.50
            };
            const result = validateProductData(product);
            expect(result.isValid).toBe(true);
            expect(result.errors).toEqual([]);
        });

        test('accepts valid product with weight type', () => {
            const product = {
                name: 'رز بسمتي',
                unit_type: 'weight',
                unit_price: 12.50
            };
            const result = validateProductData(product);
            expect(result.isValid).toBe(true);
            expect(result.errors).toEqual([]);
        });

        test('rejects product with invalid unit type and negative price', () => {
            const product = {
                name: 'منتج اختبار',
                unit_type: 'invalid',
                unit_price: -10
            };
            const result = validateProductData(product);
            expect(result.isValid).toBe(false);
            expect(result.errors.length).toBe(2);
        });

        test('uses default values when fields are missing', () => {
            const product = {
                name: 'منتج اختبار'
            };
            const normalized = normalizeProductData(product);
            expect(normalized.unit_type).toBe('unit');
            expect(normalized.unit_price).toBe(0);
        });
    });
});

// ============================================
// 2. TESTS DE FORMATAGE ET AFFICHAGE
// ============================================

describe('Product Display Formatting', () => {
    describe('formatProductPrice', () => {
        test('formats price for unit-based product in Arabic', () => {
            const product = {
                unit_type: 'unit',
                unit_price: 2.50
            };
            const result = formatProductPrice(product);
            expect(result).toBe('2.50 ر.س / قطعة');
        });

        test('formats price for weight-based product in Arabic', () => {
            const product = {
                unit_type: 'weight',
                unit_price: 12.50
            };
            const result = formatProductPrice(product);
            expect(result).toBe('12.50 ر.س / كيلو');
        });

        test('handles zero price correctly', () => {
            const product = {
                unit_type: 'unit',
                unit_price: 0
            };
            const result = formatProductPrice(product);
            expect(result).toBe('0.00 ر.س / قطعة');
        });

        test('rounds decimal prices to 2 places', () => {
            const product = {
                unit_type: 'weight',
                unit_price: 15.999
            };
            const result = formatProductPrice(product);
            expect(result).toBe('16.00 ر.س / كيلو');
        });

        test('handles missing unit_price gracefully', () => {
            const product = {
                unit_type: 'unit'
            };
            const result = formatProductPrice(product);
            expect(result).toBe('0.00 ر.س / قطعة');
        });
    });

    describe('getUnitLabel', () => {
        test('returns "قطعة" for unit type', () => {
            expect(getUnitLabel('unit')).toBe('قطعة');
        });

        test('returns "كيلو" for weight type', () => {
            expect(getUnitLabel('weight')).toBe('كيلو');
        });

        test('returns default for invalid type', () => {
            expect(getUnitLabel('invalid')).toBe('قطعة');
        });

        test('handles null input', () => {
            expect(getUnitLabel(null)).toBe('قطعة');
        });
    });

    describe('getUnitIcon', () => {
        test('returns box emoji for unit type', () => {
            expect(getUnitIcon('unit')).toBe('📦');
        });

        test('returns scale emoji for weight type', () => {
            expect(getUnitIcon('weight')).toBe('⚖️');
        });

        test('returns default icon for invalid type', () => {
            expect(getUnitIcon('invalid')).toBe('📦');
        });
    });
});

// ============================================
// 3. TESTS DE VALIDATION DES QUANTITÉS
// ============================================

describe('Quantity Validation', () => {
    describe('validateQuantity for unit-based products', () => {
        test('accepts integer quantity for unit type', () => {
            const result = validateQuantity(5, 'unit');
            expect(result.isValid).toBe(true);
            expect(result.error).toBeUndefined();
        });

        test('rejects decimal quantity for unit type', () => {
            const result = validateQuantity(2.5, 'unit');
            expect(result.isValid).toBe(false);
            expect(result.error).toBe('Quantity must be a whole number for unit-based products');
        });

        test('rejects zero quantity for unit type', () => {
            const result = validateQuantity(0, 'unit');
            expect(result.isValid).toBe(false);
            expect(result.error).toBe('Quantity must be greater than zero');
        });

        test('rejects negative quantity for unit type', () => {
            const result = validateQuantity(-3, 'unit');
            expect(result.isValid).toBe(false);
            expect(result.error).toBe('Quantity must be greater than zero');
        });

        test('accepts large integer quantity', () => {
            const result = validateQuantity(1000, 'unit');
            expect(result.isValid).toBe(true);
        });
    });

    describe('validateQuantity for weight-based products', () => {
        test('accepts decimal quantity for weight type', () => {
            const result = validateQuantity(2.5, 'weight');
            expect(result.isValid).toBe(true);
            expect(result.error).toBeUndefined();
        });

        test('accepts integer quantity for weight type', () => {
            const result = validateQuantity(3, 'weight');
            expect(result.isValid).toBe(true);
            expect(result.error).toBeUndefined();
        });

        test('accepts small decimal (0.5 kg)', () => {
            const result = validateQuantity(0.5, 'weight');
            expect(result.isValid).toBe(true);
        });

        test('accepts very small decimal (0.25 kg)', () => {
            const result = validateQuantity(0.25, 'weight');
            expect(result.isValid).toBe(true);
        });

        test('rejects zero quantity for weight type', () => {
            const result = validateQuantity(0, 'weight');
            expect(result.isValid).toBe(false);
            expect(result.error).toBe('Quantity must be greater than zero');
        });

        test('rejects negative quantity for weight type', () => {
            const result = validateQuantity(-1.5, 'weight');
            expect(result.isValid).toBe(false);
            expect(result.error).toBe('Quantity must be greater than zero');
        });
    });

    describe('validateQuantity edge cases', () => {
        test('handles string numbers correctly', () => {
            const result = validateQuantity('5', 'unit');
            expect(result.isValid).toBe(false);
            expect(result.error).toBe('Quantity must be a number');
        });

        test('rejects NaN', () => {
            const result = validateQuantity(NaN, 'unit');
            expect(result.isValid).toBe(false);
        });

        test('rejects Infinity', () => {
            const result = validateQuantity(Infinity, 'weight');
            expect(result.isValid).toBe(false);
        });

        test('rejects null', () => {
            const result = validateQuantity(null, 'unit');
            expect(result.isValid).toBe(false);
        });

        test('rejects undefined', () => {
            const result = validateQuantity(undefined, 'weight');
            expect(result.isValid).toBe(false);
        });
    });
});

// ============================================
// 4. TESTS DE CALCUL DES PRIX
// ============================================

describe('Price Calculation', () => {
    describe('calculateItemTotal', () => {
        test('calculates total for unit-based product', () => {
            const product = {
                unit_type: 'unit',
                unit_price: 2.50
            };
            const quantity = 5;
            const total = calculateItemTotal(product, quantity);
            expect(total).toBe(12.50);
        });

        test('calculates total for weight-based product with decimal quantity', () => {
            const product = {
                unit_type: 'weight',
                unit_price: 12.50
            };
            const quantity = 2.5;
            const total = calculateItemTotal(product, quantity);
            expect(total).toBe(31.25);
        });

        test('handles single unit correctly', () => {
            const product = {
                unit_type: 'unit',
                unit_price: 10.00
            };
            const total = calculateItemTotal(product, 1);
            expect(total).toBe(10.00);
        });

        test('handles zero price correctly', () => {
            const product = {
                unit_type: 'unit',
                unit_price: 0
            };
            const total = calculateItemTotal(product, 5);
            expect(total).toBe(0);
        });

        test('rounds result to 2 decimal places', () => {
            const product = {
                unit_type: 'weight',
                unit_price: 3.33
            };
            const total = calculateItemTotal(product, 3);
            expect(total).toBe(9.99);
        });
    });

    describe('calculateCartTotal', () => {
        test('calculates total for mixed cart (unit + weight)', () => {
            const cart = [
                {
                    product: { unit_type: 'unit', unit_price: 2.50 },
                    quantity: 5
                },
                {
                    product: { unit_type: 'weight', unit_price: 12.50 },
                    quantity: 2.5
                }
            ];
            const total = calculateCartTotal(cart);
            expect(total).toBe(43.75); // (5 × 2.50) + (2.5 × 12.50)
        });

        test('handles empty cart', () => {
            const total = calculateCartTotal([]);
            expect(total).toBe(0);
        });

        test('handles single item cart', () => {
            const cart = [
                {
                    product: { unit_type: 'unit', unit_price: 10.00 },
                    quantity: 3
                }
            ];
            const total = calculateCartTotal(cart);
            expect(total).toBe(30.00);
        });
    });
});

// ============================================
// 5. TESTS D'INTÉGRATION IPC
// ============================================

describe('IPC Handler Integration Tests', () => {
    let db;

    beforeEach(() => {
        // Mock database
        db = {
            prepare: jest.fn().mockReturnValue({
                run: jest.fn().mockReturnValue({ lastInsertRowid: 1 }),
                get: jest.fn(),
                all: jest.fn()
            })
        };
    });

    describe('products:create handler', () => {
        test('creates product with valid unit type and price', async () => {
            const productData = {
                name: 'قلم رصاص',
                barcode: '1234567890',
                price: 2.50,
                unit_type: 'unit',
                unit_price: 2.50
            };

            const result = await handleProductsCreate(productData, db);

            expect(result.success).toBe(true);
            expect(result.product.unit_type).toBe('unit');
            expect(result.product.unit_price).toBe(2.50);
        });

        test('applies default values when unit fields are missing', async () => {
            const productData = {
                name: 'منتج اختبار',
                price: 10.00
            };

            const result = await handleProductsCreate(productData, db);

            expect(result.success).toBe(true);
            expect(result.product.unit_type).toBe('unit');
            expect(result.product.unit_price).toBe(0);
        });

        test('rejects invalid unit type', async () => {
            const productData = {
                name: 'منتج اختبار',
                unit_type: 'invalid',
                unit_price: 10.00
            };

            await expect(handleProductsCreate(productData, db)).rejects.toThrow(
                'Invalid unit_type'
            );
        });

        test('rejects negative unit price', async () => {
            const productData = {
                name: 'منتج اختبار',
                unit_type: 'unit',
                unit_price: -5.00
            };

            await expect(handleProductsCreate(productData, db)).rejects.toThrow(
                'Invalid unit_price'
            );
        });
    });

    describe('products:update handler', () => {
        test('updates product unit type successfully', async () => {
            const updateData = {
                id: 1,
                data: {
                    unit_type: 'weight',
                    unit_price: 25.00
                }
            };

            const result = await handleProductsUpdate(updateData, db);

            expect(result.success).toBe(true);
        });

        test('validates unit type on update', async () => {
            const updateData = {
                id: 1,
                data: {
                    unit_type: 'invalid'
                }
            };

            await expect(handleProductsUpdate(updateData, db)).rejects.toThrow(
                'Invalid unit_type'
            );
        });

        test('allows updating only unit price', async () => {
            const updateData = {
                id: 1,
                data: {
                    unit_price: 15.00
                }
            };

            const result = await handleProductsUpdate(updateData, db);

            expect(result.success).toBe(true);
        });
    });

    describe('products:search handler', () => {
        test('returns products with unit type and price fields', async () => {
            const mockProducts = [
                {
                    id: 1,
                    name: 'قلم',
                    unit_type: 'unit',
                    unit_price: 2.50
                },
                {
                    id: 2,
                    name: 'رز',
                    unit_type: 'weight',
                    unit_price: 12.50
                }
            ];

            db.prepare().all.mockReturnValue(mockProducts);

            const result = await handleProductsSearch({ query: '' }, db);

            expect(result.success).toBe(true);
            expect(result.products).toHaveLength(2);
            expect(result.products[0]).toHaveProperty('unit_type');
            expect(result.products[0]).toHaveProperty('unit_price');
        });
    });
});

// ============================================
// 6. TESTS DE MIGRATION DES DONNÉES
// ============================================

describe('Data Migration', () => {
    describe('migrateExistingProducts', () => {
        test('adds default values to products without unit_type', () => {
            const oldProduct = {
                id: 1,
                name: 'منتج قديم',
                price: 10.00
            };

            const migrated = migrateProduct(oldProduct);

            expect(migrated.unit_type).toBe('unit');
            expect(migrated.unit_price).toBe(0);
        });

        test('preserves existing unit_type and unit_price', () => {
            const product = {
                id: 1,
                name: 'منتج جديد',
                unit_type: 'weight',
                unit_price: 15.00
            };

            const migrated = migrateProduct(product);

            expect(migrated.unit_type).toBe('weight');
            expect(migrated.unit_price).toBe(15.00);
        });

        test('handles null unit_price in old products', () => {
            const oldProduct = {
                id: 1,
                name: 'منتج قديم',
                unit_type: null,
                unit_price: null
            };

            const migrated = migrateProduct(oldProduct);

            expect(migrated.unit_type).toBe('unit');
            expect(migrated.unit_price).toBe(0);
        });
    });
});

// Export pour utilisation dans les tests
module.exports = {
    validateUnitType,
    validateUnitPrice,
    validateProductData,
    normalizeProductData,
    formatProductPrice,
    getUnitLabel,
    getUnitIcon,
    validateQuantity,
    calculateItemTotal,
    calculateCartTotal,
    handleProductsCreate,
    handleProductsUpdate,
    handleProductsSearch,
    migrateProduct
};
