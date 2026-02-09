/**
 * IPC Handlers Reference - main.js modifications
 * 
 * NOTE: Since main.js is obfuscated, use this as a reference for updating
 * the product-related IPC handlers to support unit_type and unit_price fields.
 * 
 * Look for ipcMain.handle() calls for 'products:*' channels
 */

const { ipcMain } = require('electron');

// ==============================================================================
// products:create Handler
// ==============================================================================

/**
 * Update the products:create handler to accept and store unit_type and unit_price
 */

ipcMain.handle('products:create', async (event, productData) => {
    try {
        // Validate input data
        if (!productData.name) {
            throw new Error('Product name is required');
        }

        // Extract all fields including new ones
        const {
            name,
            barcode,
            price,
            cost = 0,
            stock = 0,
            category,
            supplier_id,
            low_stock_limit = 0,
            description,
            unit_type = 'unit',      // NEW FIELD
            unit_price = 0,          // NEW FIELD
        } = productData;

        // Validate unit_type
        if (!['unit', 'weight'].includes(unit_type)) {
            throw new Error('Invalid unit_type. Must be "unit" or "weight"');
        }

        // Validate unit_price
        if (typeof unit_price !== 'number' || unit_price < 0) {
            throw new Error('Invalid unit_price. Must be a positive number');
        }

        // Insert into database
        const stmt = db.prepare(`
            INSERT INTO products (
                name, 
                barcode, 
                price, 
                cost, 
                stock, 
                category, 
                supplier_id, 
                low_stock_limit, 
                description,
                unit_type,
                unit_price
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        const result = stmt.run(
            name,
            barcode,
            price,
            cost,
            stock,
            category,
            supplier_id,
            low_stock_limit,
            description,
            unit_type,
            unit_price
        );

        return {
            success: true,
            product: {
                id: result.lastInsertRowid,
                ...productData,
            },
        };
    } catch (error) {
        console.error('Error creating product:', error);
        throw error;
    }
});

// ==============================================================================
// products:update Handler
// ==============================================================================

/**
 * Update the products:update handler to allow updating unit_type and unit_price
 */

ipcMain.handle('products:update', async (event, { id, data }) => {
    try {
        if (!id) {
            throw new Error('Product ID is required');
        }

        // Build dynamic UPDATE query based on provided fields
        const allowedFields = [
            'name',
            'barcode',
            'price',
            'cost',
            'stock',
            'category',
            'supplier_id',
            'low_stock_limit',
            'description',
            'unit_type',      // NEW FIELD
            'unit_price',     // NEW FIELD
        ];

        const updates = [];
        const values = [];

        for (const [key, value] of Object.entries(data)) {
            if (allowedFields.includes(key)) {
                // Validate unit_type if being updated
                if (key === 'unit_type' && !['unit', 'weight'].includes(value)) {
                    throw new Error('Invalid unit_type');
                }

                // Validate unit_price if being updated
                if (key === 'unit_price' && (typeof value !== 'number' || value < 0)) {
                    throw new Error('Invalid unit_price');
                }

                updates.push(`${key} = ?`);
                values.push(value);
            }
        }

        if (updates.length === 0) {
            throw new Error('No valid fields to update');
        }

        values.push(id);

        const stmt = db.prepare(`
            UPDATE products 
            SET ${updates.join(', ')} 
            WHERE id = ?
        `);

        stmt.run(...values);

        return { success: true };
    } catch (error) {
        console.error('Error updating product:', error);
        throw error;
    }
});

// ==============================================================================
// products:search Handler
// ==============================================================================

/**
 * Update the products:search handler to return unit_type and unit_price
 */

ipcMain.handle('products:search', async (event, { query, category, inStock }) => {
    try {
        let sql = `
            SELECT 
                id, 
                name, 
                barcode, 
                price, 
                cost, 
                stock, 
                category, 
                supplier_id, 
                low_stock_limit, 
                description,
                unit_type,     -- NEW FIELD
                unit_price     -- NEW FIELD
            FROM products 
            WHERE 1=1
        `;

        const params = [];

        if (query) {
            sql += ' AND (name LIKE ? OR barcode LIKE ?)';
            params.push(`%${query}%`, `%${query}%`);
        }

        if (category) {
            sql += ' AND category = ?';
            params.push(category);
        }

        if (inStock) {
            sql += ' AND stock > 0';
        }

        const stmt = db.prepare(sql);
        const products = stmt.all(...params);

        return {
            success: true,
            products,
        };
    } catch (error) {
        console.error('Error searching products:', error);
        throw error;
    }
});

// ==============================================================================
// products:get Handler (if exists)
// ==============================================================================

/**
 * If there's a products:get handler, make sure it also returns the new fields
 */

ipcMain.handle('products:get', async (event, { id }) => {
    try {
        const stmt = db.prepare(`
            SELECT 
                id, 
                name, 
                barcode, 
                price, 
                cost, 
                stock, 
                category, 
                supplier_id, 
                low_stock_limit, 
                description,
                unit_type,
                unit_price
            FROM products 
            WHERE id = ?
        `);

        const product = stmt.get(id);

        if (!product) {
            throw new Error('Product not found');
        }

        return {
            success: true,
            product,
        };
    } catch (error) {
        console.error('Error getting product:', error);
        throw error;
    }
});

// ==============================================================================
// Location in main.js
// ==============================================================================

/**
 * Look for patterns like:
 * - ipcMain.handle('products:create', ...)
 * - ipcMain.handle('products:update', ...)
 * - ipcMain.handle('products:search', ...)
 * 
 * Update the SQL statements and data handling to include:
 * - unit_type field
 * - unit_price field
 */
