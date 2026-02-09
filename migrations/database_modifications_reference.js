/**
 * Database Initialization Code - Reference for modifying database.js
 * 
 * NOTE: Since database.js is obfuscated, use this as a reference for where
 * to add the new columns in the initDB() function.
 * 
 * These ALTER TABLE statements should be added in the initDB() function
 * after the existing table creation statements.
 */

// ==============================================================================
// Add these statements in initDB() function
// ==============================================================================

// Add unit_type column to products table
try {
    db.prepare(`
        ALTER TABLE products 
        ADD COLUMN unit_type TEXT DEFAULT 'unit'
    `).run();
    console.log('✓ Added unit_type column to products table');
} catch (error) {
    // Column already exists, safe to ignore
    console.log('unit_type column already exists');
}

// Add unit_price column to products table
try {
    db.prepare(`
        ALTER TABLE products 
        ADD COLUMN unit_price REAL DEFAULT 0
    `).run();
    console.log('✓ Added unit_price column to products table');
} catch (error) {
    // Column already exists, safe to ignore
    console.log('unit_price column already exists');
}

// ==============================================================================
// Optional: Update existing CREATE TABLE statement for new installations
// ==============================================================================

/**
 * For new installations, add these columns to the CREATE TABLE IF NOT EXISTS
 * products statement:
 * 
 * unit_type TEXT DEFAULT 'unit' CHECK(unit_type IN ('unit', 'weight')),
 * unit_price REAL DEFAULT 0,
 * 
 * Example complete table creation:
 */

const createProductsTableExample = `
    CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        barcode TEXT UNIQUE,
        price REAL NOT NULL,
        cost REAL DEFAULT 0,
        stock INTEGER DEFAULT 0,
        category TEXT,
        supplier_id INTEGER,
        low_stock_limit INTEGER DEFAULT 0,
        description TEXT,
        unit_type TEXT DEFAULT 'unit' CHECK(unit_type IN ('unit', 'weight')),
        unit_price REAL DEFAULT 0,
        FOREIGN KEY (supplier_id) REFERENCES suppliers(id)
    )
`;

// ==============================================================================
// Location in database.js
// ==============================================================================

/**
 * Find the initDB() function (or initialization code block)
 * 
 * Look for patterns like:
 * - CREATE TABLE IF NOT EXISTS
 * - db.prepare(...).run()
 * - Table initialization section
 * 
 * Add the ALTER TABLE statements AFTER all CREATE TABLE statements
 * but BEFORE the function returns.
 */

module.exports = {
    db,
    initDB,
    // ... other exports
};
