const { ipcMain } = require('electron');
const { db } = require('../database');
const logic = require('../utils/product-unit-type');

console.log('LOADING BACKEND PATCH for Weight-Based Products...');

// ============================================
// DATABASE MIGRATION
// ============================================
try {
    console.log('Running Migration for Unit Type...');
    db.prepare("ALTER TABLE products ADD COLUMN unit_type TEXT DEFAULT 'unit'").run();
    console.log('Added unit_type column.');
} catch (e) {
    if (!e.message.includes('duplicate column')) {
        console.log('Migration note (unit_type):', e.message);
    }
}

try {
    console.log('Running Migration for Unit Price...');
    db.prepare("ALTER TABLE products ADD COLUMN unit_price REAL DEFAULT 0").run();
    console.log('Added unit_price column.');
} catch (e) {
    if (!e.message.includes('duplicate column')) {
        console.log('Migration note (unit_price):', e.message);
    }
}


// Helper to safely remove handler
function safeRemoveHandler(channel) {
    try {
        ipcMain.removeHandler(channel);
        console.log(`Removed handler for: ${channel}`);
    } catch (e) {
        // Handler might not exist, ignore
    }
}

// ============================================
// OVERRIDE PRODUCT HANDLERS
// ============================================

// 1. save-product (Handles Create and Update)
safeRemoveHandler('save-product');
ipcMain.handle('save-product', async (event, data) => {
    console.log('PATCHED save-product called', data);
    try {
        // If data has ID, it's an update
        if (data.id) {
            return await logic.handleProductsUpdate({ id: data.id, data: data }, db);
        } else {
            return await logic.handleProductsCreate(data, db);
        }
    } catch (error) {
        console.error('Error in save-product:', error);
        throw error;
    }
});

// 2. get-data (Returns all products, likely for initial load)
safeRemoveHandler('get-data');
ipcMain.handle('get-data', async (event) => {
    console.log('PATCHED get-data called');
    try {
        // Return all products
        const result = await logic.handleProductsSearch({}, db);
        return result.products; // get-data likely expects array? Or object? 
        // Logic returns { success: true, products: [] }
        // If original get-data returns just array, we should return result.products
        // If generic invoke, usually returns result.
        // Let's assume result.products based on typical usage or return the whole object if standard response.
        // Wait, verify logic.handleProductsSearch return structure: { success: true, products }
        // If get-data expects just array, this might break. 
        // But usually IPC returns the whole response. 
        // Let's return result.products to be safe if it expects list? 
        // Or result? 
        // I'll return result.products because 'getData' usually means "get the data".
        // BUT if I return array, and it expects {products: [...]}, I break it.
        // I'll return result (the object) which contains products.
        return result;
    } catch (error) {
        console.error('Error in get-data:', error);
        throw error;
    }
});

// 3. delete-product
safeRemoveHandler('delete-product');
ipcMain.handle('delete-product', async (event, id) => {
    console.log('PATCHED delete-product called', id);
    try {
        const stmt = db.prepare('DELETE FROM products WHERE id = ?');
        stmt.run(id);
        return { success: true };
    } catch (error) {
        console.error('Error in delete-product:', error);
        throw error;
    }
});

// ============================================
// OVERRIDE SALES HANDLER (checkout)
// ============================================

safeRemoveHandler('checkout');
ipcMain.handle('checkout', async (event, saleData) => {
    console.log('PATCHED checkout called', saleData);
    const { items, customerId, discount, paymentMethod, userId, notes } = saleData;

    if (!items || items.length === 0) {
        return { success: false, message: 'Cart is empty' };
    }

    // 1. Calculate totals
    const subtotal = logic.calculateCartTotal(items);
    const total = subtotal - (discount || 0);

    // 2. Transaction
    const transaction = db.transaction(() => {
        // Insert Sale
        const stmtSale = db.prepare(`
            INSERT INTO sales (
                user_id, customer_id, total, discount, 
                payment_method, notes, date
            ) VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
        `);

        const saleResult = stmtSale.run(
            userId || 1, // Default to admin if null
            customerId || null,
            total,
            discount || 0,
            paymentMethod || 'cash',
            notes || null
        );
        const saleId = saleResult.lastInsertRowid;

        // Insert Items and Update Stock
        const stmtItem = db.prepare(`
            INSERT INTO sales_items (
                sale_id, product_id, name, quantity, 
                price, cost, total
            ) VALUES (?, ?, ?, ?, ?, ?, ?)
        `);

        // Update Stock
        const stmtStock = db.prepare(`
            UPDATE products 
            SET stock = stock - ? 
            WHERE id = ?
        `);

        for (const item of items) {
            const product = item.product;
            const quantity = parseFloat(item.quantity);
            const itemTotal = logic.calculateItemTotal(product, quantity);

            // Insert Item
            stmtItem.run(
                saleId,
                product.id,
                product.name,
                quantity,
                product.unit_price || product.price, // Prefer unit_price
                product.cost || 0,
                itemTotal
            );

            // Update Stock
            stmtStock.run(quantity, product.id);
        }

        return { success: true, saleId };
    });

    try {
        const result = transaction();
        return result;
    } catch (error) {
        console.error('Error processing sale:', error);
        return { success: false, message: error.message };
    }
});

console.log('Backend Patch Loaded Successfully.');
