-- Migration: Add Product Unit Type Support
-- Date: 2026-02-09
-- Description: Adds unit_type and unit_price columns to products table
--              to support both unit-based (بالوحدة) and weight-based (بالميزان) products

-- ==============================================================================
-- Add unit_type column
-- ==============================================================================
-- Values: 'unit' for piece-based products, 'weight' for weight-based products
-- Default: 'unit' (existing products default to unit-based)

-- Note: SQLite doesn't support CHECK constraints on ALTER TABLE
-- For new installations, the CHECK constraint should be added during table creation

ALTER TABLE products 
ADD COLUMN unit_type TEXT DEFAULT 'unit';

-- Explanation:
-- unit_type = 'unit'   -> Products sold by piece (قطعة)
-- unit_type = 'weight' -> Products sold by weight (كيلو/جرام)

-- ==============================================================================
-- Add unit_price column
-- ==============================================================================
-- Stores the price per unit or per kilogram depending on unit_type

ALTER TABLE products 
ADD COLUMN unit_price REAL DEFAULT 0;

-- Explanation:
-- For unit_type='unit':   unit_price = price per piece (سعر القطعة)
-- For unit_type='weight': unit_price = price per kg/gram (سعر الكيلو)

-- ==============================================================================
-- Data Migration Notes
-- ==============================================================================
-- After running this migration:
-- 1. All existing products will have unit_type='unit' and unit_price=0
-- 2. You should manually update the unit_price for existing products
-- 3. Change unit_type to 'weight' for products sold by weight
-- 4. The application UI will handle new products appropriately

-- Example update for existing data:
-- UPDATE products SET unit_type='weight', unit_price=price WHERE name LIKE '%رز%';
-- UPDATE products SET unit_price=price WHERE unit_type='unit';

-- ==============================================================================
-- Verification Queries
-- ==============================================================================
-- Check that columns were added successfully:
-- PRAGMA table_info(products);

-- View sample data:
-- SELECT id, name, price, unit_type, unit_price FROM products LIMIT 10;

-- Count products by type:
-- SELECT unit_type, COUNT(*) FROM products GROUP BY unit_type;
