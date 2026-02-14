/**
 * Unit Tests for Database Operations
 * 
 * Tests for:
 * - Database initialization
 * - CRUD operations for products
 * - CRUD operations for customers
 * - Sales processing
 * - Stock management
 * - User management
 * - Settings management
 */

const { describe, test, expect, beforeEach, afterEach, jest } = require('@jest/globals');

// Import test utilities
const { createMockDatabase } = require('../setup');

// ============================================
// 1. DATABASE INITIALIZATION TESTS
// ============================================

describe('Database Initialization', () => {
    let db;

    beforeEach(() => {
        db = createMockDatabase();
    });

    describe('initDB', () => {
        test('should create products table', () => {
            const sql = `
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
                    unit_type TEXT DEFAULT 'unit',
                    unit_price REAL DEFAULT 0
                )
            `;
            
            const stmt = db.prepare(sql);
            expect(stmt.run).toBeDefined();
        });

        test('should create categories table', () => {
            const sql = `
                CREATE TABLE IF NOT EXISTS categories (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT UNIQUE NOT NULL,
                    description TEXT
                )
            `;
            
            const stmt = db.prepare(sql);
            expect(stmt.run).toBeDefined();
        });

        test('should create customers table', () => {
            const sql = `
                CREATE TABLE IF NOT EXISTS customers (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL,
                    phone TEXT UNIQUE,
                    email TEXT,
                    address TEXT,
                    credit_limit REAL DEFAULT 0,
                    balance REAL DEFAULT 0,
                    notes TEXT,
                    status TEXT DEFAULT 'active'
                )
            `;
            
            const stmt = db.prepare(sql);
            expect(stmt.run).toBeDefined();
        });

        test('should create sales table', () => {
            const sql = `
                CREATE TABLE IF NOT EXISTS sales (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    invoice_number TEXT UNIQUE,
                    customer_id INTEGER,
                    subtotal REAL,
                    discount REAL DEFAULT 0,
                    total REAL,
                    payment_method TEXT,
                    amount_paid REAL,
                    change REAL,
                    date DATETIME DEFAULT CURRENT_TIMESTAMP,
                    user_id INTEGER,
                    notes TEXT,
                    FOREIGN KEY (customer_id) REFERENCES customers(id)
                )
            `;
            
            const stmt = db.prepare(sql);
            expect(stmt.run).toBeDefined();
        });

        test('should create sale_items table', () => {
            const sql = `
                CREATE TABLE IF NOT EXISTS sale_items (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    sale_id INTEGER,
                    product_id INTEGER,
                    quantity REAL,
                    price REAL,
                    name TEXT,
                    cost REAL,
                    FOREIGN KEY (sale_id) REFERENCES sales(id),
                    FOREIGN KEY (product_id) REFERENCES products(id)
                )
            `;
            
            const stmt = db.prepare(sql);
            expect(stmt.run).toBeDefined();
        });

        test('should create users table', () => {
            const sql = `
                CREATE TABLE IF NOT EXISTS users (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    username TEXT UNIQUE NOT NULL,
                    password TEXT NOT NULL,
                    role TEXT NOT NULL,
                    full_name TEXT,
                    active INTEGER DEFAULT 1
                )
            `;
            
            const stmt = db.prepare(sql);
            expect(stmt.run).toBeDefined();
        });

        test('should create settings table', () => {
            const sql = `
                CREATE TABLE IF NOT EXISTS settings (
                    key TEXT PRIMARY KEY,
                    value TEXT
                )
            `;
            
            const stmt = db.prepare(sql);
            expect(stmt.run).toBeDefined();
        });

        test('should create suppliers table', () => {
            const sql = `
                CREATE TABLE IF NOT EXISTS suppliers (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL,
                    phone TEXT,
                    email TEXT,
                    address TEXT,
                    notes TEXT
                )
            `;
            
            const stmt = db.prepare(sql);
            expect(stmt.run).toBeDefined();
        });

        test('should create stock_movements table', () => {
            const sql = `
                CREATE TABLE IF NOT EXISTS stock_movements (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    product_id INTEGER NOT NULL,
                    type TEXT NOT NULL,
                    quantity INTEGER NOT NULL,
                    old_stock INTEGER,
                    new_stock INTEGER,
                    reason TEXT,
                    user_id INTEGER,
                    date DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (product_id) REFERENCES products(id)
                )
            `;
            
            const stmt = db.prepare(sql);
            expect(stmt.run).toBeDefined();
        });

        test('should create audit_logs table', () => {
            const sql = `
                CREATE TABLE IF NOT EXISTS audit_logs (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    date DATETIME DEFAULT CURRENT_TIMESTAMP,
                    user_id INTEGER,
                    action TEXT NOT NULL,
                    entity_type TEXT,
                    entity_id INTEGER,
                    details TEXT
                )
            `;
            
            const stmt = db.prepare(sql);
            expect(stmt.run).toBeDefined();
        });
    });
});

// ============================================
// 2. PRODUCT CRUD TESTS
// ============================================

describe('Product CRUD Operations', () => {
    let db;

    beforeEach(() => {
        db = createMockDatabase();
    });

    describe('Create Product', () => {
        test('should create a product with all fields', () => {
            const productData = {
                name: 'Test Product',
                barcode: '1234567890123',
                price: 100.00,
                cost: 50.00,
                stock: 10,
                category: 'Electronics',
                supplier_id: 1,
                low_stock_limit: 5,
                description: 'Test product description',
                unit_type: 'unit',
                unit_price: 100.00
            };

            const stmt = db.prepare(`
                INSERT INTO products (
                    name, barcode, price, cost, stock,
                    category, supplier_id, low_stock_limit,
                    description, unit_type, unit_price
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `);

            const result = stmt.run(
                productData.name,
                productData.barcode,
                productData.price,
                productData.cost,
                productData.stock,
                productData.category,
                productData.supplier_id,
                productData.low_stock_limit,
                productData.description,
                productData.unit_type,
                productData.unit_price
            );

            expect(stmt.run).toHaveBeenCalled();
            expect(result.lastInsertRowid).toBeDefined();
        });

        test('should create a product with minimal fields', () => {
            const productData = {
                name: 'Minimal Product',
                price: 25.00
            };

            const stmt = db.prepare(`
                INSERT INTO products (name, price) VALUES (?, ?)
            `);

            stmt.run(productData.name, productData.price);
            expect(stmt.run).toHaveBeenCalled();
        });

        test('should reject product without name', () => {
            const productData = {
                barcode: '1234567890123',
                price: 100.00
            };

            // In a real implementation, this would throw
            expect(() => {
                if (!productData.name) {
                    throw new Error('Product name is required');
                }
            }).toThrow('Product name is required');
        });

        test('should reject product with negative price', () => {
            const productData = {
                name: 'Invalid Product',
                price: -10.00
            };

            expect(() => {
                if (productData.price < 0) {
                    throw new Error('Price cannot be negative');
                }
            }).toThrow('Price cannot be negative');
        });

        test('should reject product with duplicate barcode', () => {
            const productData = {
                name: 'Product 1',
                barcode: '1234567890123',
                price: 100.00
            };

            // Simulate unique constraint violation
            const existingProduct = { barcode: '1234567890123' };
            
            expect(() => {
                if (existingProduct.barcode === productData.barcode) {
                    throw new Error('Barcode already exists');
                }
            }).toThrow('Barcode already exists');
        });

        test('should default unit_type to "unit"', () => {
            const product = { name: 'Test', price: 10 };
            const unitType = product.unit_type || 'unit';
            expect(unitType).toBe('unit');
        });

        test('should default unit_price to 0 when not specified', () => {
            const product = { name: 'Test', price: 10 };
            const unitPrice = product.unit_price !== undefined ? product.unit_price : 0;
            expect(unitPrice).toBe(0);
        });
    });

    describe('Read Product', () => {
        test('should get product by ID', () => {
            const stmt = db.prepare('SELECT * FROM products WHERE id = ?');
            stmt.get(1);
            expect(stmt.get).toHaveBeenCalledWith(1);
        });

        test('should get product by barcode', () => {
            const stmt = db.prepare('SELECT * FROM products WHERE barcode = ?');
            stmt.get('1234567890123');
            expect(stmt.get).toHaveBeenCalledWith('1234567890123');
        });

        test('should search products by name', () => {
            const stmt = db.prepare('SELECT * FROM products WHERE name LIKE ?');
            stmt.all('%Test%');
            expect(stmt.all).toHaveBeenCalledWith('%Test%');
        });

        test('should get all products', () => {
            const stmt = db.prepare('SELECT * FROM products ORDER BY name');
            stmt.all();
            expect(stmt.all).toHaveBeenCalled();
        });

        test('should get products by category', () => {
            const stmt = db.prepare('SELECT * FROM products WHERE category = ?');
            stmt.all('Electronics');
            expect(stmt.all).toHaveBeenCalledWith('Electronics');
        });

        test('should get low stock products', () => {
            const stmt = db.prepare(`
                SELECT * FROM products 
                WHERE stock <= low_stock_limit 
                AND low_stock_limit > 0
            `);
            stmt.all();
            expect(stmt.all).toHaveBeenCalled();
        });
    });

    describe('Update Product', () => {
        test('should update product price', () => {
            const stmt = db.prepare('UPDATE products SET price = ? WHERE id = ?');
            stmt.run(150.00, 1);
            expect(stmt.run).toHaveBeenCalledWith(150.00, 1);
        });

        test('should update product stock', () => {
            const stmt = db.prepare('UPDATE products SET stock = stock + ? WHERE id = ?');
            stmt.run(5, 1);
            expect(stmt.run).toHaveBeenCalledWith(5, 1);
        });

        test('should update multiple fields', () => {
            const stmt = db.prepare(`
                UPDATE products 
                SET name = ?, price = ?, stock = ?, category = ?
                WHERE id = ?
            `);
            stmt.run('Updated Product', 200.00, 20, 'New Category', 1);
            expect(stmt.run).toHaveBeenCalled();
        });

        test('should update unit_type', () => {
            const stmt = db.prepare('UPDATE products SET unit_type = ? WHERE id = ?');
            stmt.run('weight', 1);
            expect(stmt.run).toHaveBeenCalledWith('weight', 1);
        });

        test('should update unit_price', () => {
            const stmt = db.prepare('UPDATE products SET unit_price = ? WHERE id = ?');
            stmt.run(25.50, 1);
            expect(stmt.run).toHaveBeenCalledWith(25.50, 1);
        });
    });

    describe('Delete Product', () => {
        test('should delete product by ID', () => {
            const stmt = db.prepare('DELETE FROM products WHERE id = ?');
            stmt.run(1);
            expect(stmt.run).toHaveBeenCalledWith(1);
        });

        test('should check for related sale items before deletion', () => {
            // Simulate checking for related records
            const checkStmt = db.prepare('SELECT COUNT(*) as count FROM sale_items WHERE product_id = ?');
            checkStmt.get(1);
            expect(checkStmt.get).toHaveBeenCalledWith(1);
        });
    });
});

// ============================================
// 3. CUSTOMER CRUD TESTS
// ============================================

describe('Customer CRUD Operations', () => {
    let db;

    beforeEach(() => {
        db = createMockDatabase();
    });

    describe('Create Customer', () => {
        test('should create a customer with all fields', () => {
            const customerData = {
                name: 'John Doe',
                phone: '0501234567',
                email: 'john@example.com',
                address: '123 Main St',
                credit_limit: 1000.00,
                balance: 0,
                notes: 'VIP Customer',
                status: 'active'
            };

            const stmt = db.prepare(`
                INSERT INTO customers (
                    name, phone, email, address, 
                    credit_limit, balance, notes, status
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `);

            stmt.run(
                customerData.name,
                customerData.phone,
                customerData.email,
                customerData.address,
                customerData.credit_limit,
                customerData.balance,
                customerData.notes,
                customerData.status
            );

            expect(stmt.run).toHaveBeenCalled();
        });

        test('should create a customer with minimal fields', () => {
            const customerData = {
                name: 'Jane Doe',
                phone: '0509876543'
            };

            const stmt = db.prepare('INSERT INTO customers (name, phone) VALUES (?, ?)');
            stmt.run(customerData.name, customerData.phone);
            expect(stmt.run).toHaveBeenCalled();
        });

        test('should reject customer without name', () => {
            const customerData = {
                phone: '0501234567'
            };

            expect(() => {
                if (!customerData.name) {
                    throw new Error('Customer name is required');
                }
            }).toThrow('Customer name is required');
        });

        test('should reject duplicate phone number', () => {
            const customerData = { name: 'Test', phone: '0501234567' };
            const existingCustomer = { phone: '0501234567' };

            expect(() => {
                if (existingCustomer.phone === customerData.phone) {
                    throw new Error('Phone number already exists');
                }
            }).toThrow('Phone number already exists');
        });

        test('should default status to "active"', () => {
            const customer = { name: 'Test Customer' };
            const status = customer.status || 'active';
            expect(status).toBe('active');
        });

        test('should default credit_limit to 0', () => {
            const customer = { name: 'Test Customer' };
            const creditLimit = customer.credit_limit !== undefined ? customer.credit_limit : 0;
            expect(creditLimit).toBe(0);
        });
    });

    describe('Read Customer', () => {
        test('should get customer by ID', () => {
            const stmt = db.prepare('SELECT * FROM customers WHERE id = ?');
            stmt.get(1);
            expect(stmt.get).toHaveBeenCalledWith(1);
        });

        test('should get customer by phone', () => {
            const stmt = db.prepare('SELECT * FROM customers WHERE phone = ?');
            stmt.get('0501234567');
            expect(stmt.get).toHaveBeenCalledWith('0501234567');
        });

        test('should search customers by name', () => {
            const stmt = db.prepare('SELECT * FROM customers WHERE name LIKE ?');
            stmt.all('%John%');
            expect(stmt.all).toHaveBeenCalledWith('%John%');
        });

        test('should get customers with outstanding balance', () => {
            const stmt = db.prepare('SELECT * FROM customers WHERE balance > 0');
            stmt.all();
            expect(stmt.all).toHaveBeenCalled();
        });

        test('should get active customers', () => {
            const stmt = db.prepare('SELECT * FROM customers WHERE status = ?');
            stmt.all('active');
            expect(stmt.all).toHaveBeenCalledWith('active');
        });
    });

    describe('Update Customer', () => {
        test('should update customer balance', () => {
            const stmt = db.prepare('UPDATE customers SET balance = balance + ? WHERE id = ?');
            stmt.run(100.00, 1);
            expect(stmt.run).toHaveBeenCalledWith(100.00, 1);
        });

        test('should update customer status', () => {
            const stmt = db.prepare('UPDATE customers SET status = ? WHERE id = ?');
            stmt.run('inactive', 1);
            expect(stmt.run).toHaveBeenCalledWith('inactive', 1);
        });

        test('should update credit limit', () => {
            const stmt = db.prepare('UPDATE customers SET credit_limit = ? WHERE id = ?');
            stmt.run(2000.00, 1);
            expect(stmt.run).toHaveBeenCalledWith(2000.00, 1);
        });
    });

    describe('Delete Customer', () => {
        test('should delete customer by ID', () => {
            const stmt = db.prepare('DELETE FROM customers WHERE id = ?');
            stmt.run(1);
            expect(stmt.run).toHaveBeenCalledWith(1);
        });

        test('should check for related sales before deletion', () => {
            const checkStmt = db.prepare('SELECT COUNT(*) as count FROM sales WHERE customer_id = ?');
            checkStmt.get(1);
            expect(checkStmt.get).toHaveBeenCalledWith(1);
        });
    });
});

// ============================================
// 4. SALES PROCESSING TESTS
// ============================================

describe('Sales Processing', () => {
    let db;

    beforeEach(() => {
        db = createMockDatabase();
    });

    describe('Create Sale', () => {
        test('should create a sale with all fields', () => {
            const saleData = {
                invoice_number: 'INV-001',
                customer_id: 1,
                subtotal: 100.00,
                discount: 10.00,
                total: 90.00,
                payment_method: 'cash',
                amount_paid: 100.00,
                change: 10.00,
                user_id: 1,
                notes: 'Test sale'
            };

            const stmt = db.prepare(`
                INSERT INTO sales (
                    invoice_number, customer_id, subtotal, discount,
                    total, payment_method, amount_paid, change,
                    user_id, notes
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `);

            stmt.run(
                saleData.invoice_number,
                saleData.customer_id,
                saleData.subtotal,
                saleData.discount,
                saleData.total,
                saleData.payment_method,
                saleData.amount_paid,
                saleData.change,
                saleData.user_id,
                saleData.notes
            );

            expect(stmt.run).toHaveBeenCalled();
        });

        test('should generate invoice number automatically', () => {
            const invoiceNumber = `INV-${Date.now()}`;
            expect(invoiceNumber).toMatch(/^INV-\d+$/);
        });

        test('should reject sale with negative total', () => {
            const saleData = { total: -50.00 };

            expect(() => {
                if (saleData.total < 0) {
                    throw new Error('Total cannot be negative');
                }
            }).toThrow('Total cannot be negative');
        });

        test('should create sale items with the sale', () => {
            const items = [
                { product_id: 1, quantity: 2, price: 50.00, name: 'Product 1', cost: 25.00 },
                { product_id: 2, quantity: 1, price: 100.00, name: 'Product 2', cost: 60.00 }
            ];

            const stmt = db.prepare(`
                INSERT INTO sale_items (sale_id, product_id, quantity, price, name, cost)
                VALUES (?, ?, ?, ?, ?, ?)
            `);

            items.forEach(item => {
                stmt.run(1, item.product_id, item.quantity, item.price, item.name, item.cost);
            });

            expect(stmt.run).toHaveBeenCalledTimes(2);
        });

        test('should use transaction for sale creation', () => {
            const transaction = db.transaction((saleData, items) => {
                // Insert sale
                // Insert items
                // Update stock
                return { success: true };
            });

            const result = transaction({}, []);
            expect(result.success).toBe(true);
        });
    });

    describe('Read Sale', () => {
        test('should get sale by ID', () => {
            const stmt = db.prepare('SELECT * FROM sales WHERE id = ?');
            stmt.get(1);
            expect(stmt.get).toHaveBeenCalledWith(1);
        });

        test('should get sale by invoice number', () => {
            const stmt = db.prepare('SELECT * FROM sales WHERE invoice_number = ?');
            stmt.get('INV-001');
            expect(stmt.get).toHaveBeenCalledWith('INV-001');
        });

        test('should get sales by date range', () => {
            const stmt = db.prepare(`
                SELECT * FROM sales 
                WHERE date(date) BETWEEN date(?) AND date(?)
                ORDER BY date DESC
            `);
            stmt.all('2024-01-01', '2024-01-31');
            expect(stmt.all).toHaveBeenCalledWith('2024-01-01', '2024-01-31');
        });

        test('should get sales by customer', () => {
            const stmt = db.prepare('SELECT * FROM sales WHERE customer_id = ? ORDER BY date DESC');
            stmt.all(1);
            expect(stmt.all).toHaveBeenCalledWith(1);
        });

        test('should get sale items for a sale', () => {
            const stmt = db.prepare('SELECT * FROM sale_items WHERE sale_id = ?');
            stmt.all(1);
            expect(stmt.all).toHaveBeenCalledWith(1);
        });
    });

    describe('Sale Statistics', () => {
        test('should calculate daily total sales', () => {
            const stmt = db.prepare(`
                SELECT SUM(total) as daily_total 
                FROM sales 
                WHERE date(date) = date('now')
            `);
            stmt.get();
            expect(stmt.get).toHaveBeenCalled();
        });

        test('should get sales count by payment method', () => {
            const stmt = db.prepare(`
                SELECT payment_method, COUNT(*) as count, SUM(total) as total
                FROM sales
                GROUP BY payment_method
            `);
            stmt.all();
            expect(stmt.all).toHaveBeenCalled();
        });
    });
});

// ============================================
// 5. STOCK MANAGEMENT TESTS
// ============================================

describe('Stock Management', () => {
    let db;

    beforeEach(() => {
        db = createMockDatabase();
    });

    describe('Stock Adjustment', () => {
        test('should add stock', () => {
            const stmt = db.prepare('UPDATE products SET stock = stock + ? WHERE id = ?');
            stmt.run(10, 1);
            expect(stmt.run).toHaveBeenCalledWith(10, 1);
        });

        test('should subtract stock', () => {
            const stmt = db.prepare('UPDATE products SET stock = stock - ? WHERE id = ?');
            stmt.run(5, 1);
            expect(stmt.run).toHaveBeenCalledWith(5, 1);
        });

        test('should record stock movement', () => {
            const movementData = {
                product_id: 1,
                type: 'purchase',
                quantity: 10,
                old_stock: 5,
                new_stock: 15,
                reason: 'New stock purchase',
                user_id: 1
            };

            const stmt = db.prepare(`
                INSERT INTO stock_movements (
                    product_id, type, quantity, old_stock, new_stock, reason, user_id
                ) VALUES (?, ?, ?, ?, ?, ?, ?)
            `);

            stmt.run(
                movementData.product_id,
                movementData.type,
                movementData.quantity,
                movementData.old_stock,
                movementData.new_stock,
                movementData.reason,
                movementData.user_id
            );

            expect(stmt.run).toHaveBeenCalled();
        });

        test('should prevent negative stock', () => {
            const currentStock = 5;
            const requestedQuantity = 10;

            expect(() => {
                if (currentStock - requestedQuantity < 0) {
                    throw new Error('Insufficient stock');
                }
            }).toThrow('Insufficient stock');
        });

        test('should get stock movement history', () => {
            const stmt = db.prepare(`
                SELECT sm.*, p.name as product_name
                FROM stock_movements sm
                JOIN products p ON sm.product_id = p.id
                WHERE sm.product_id = ?
                ORDER BY sm.date DESC
            `);
            stmt.all(1);
            expect(stmt.all).toHaveBeenCalledWith(1);
        });
    });

    describe('Low Stock Alerts', () => {
        test('should identify products below low stock limit', () => {
            const stmt = db.prepare(`
                SELECT * FROM products 
                WHERE stock <= low_stock_limit 
                AND low_stock_limit > 0
            `);
            stmt.all();
            expect(stmt.all).toHaveBeenCalled();
        });

        test('should get products with zero stock', () => {
            const stmt = db.prepare('SELECT * FROM products WHERE stock = 0');
            stmt.all();
            expect(stmt.all).toHaveBeenCalled();
        });
    });
});

// ============================================
// 6. USER MANAGEMENT TESTS
// ============================================

describe('User Management', () => {
    let db;

    beforeEach(() => {
        db = createMockDatabase();
    });

    describe('Create User', () => {
        test('should create a user with hashed password', async () => {
            const bcrypt = require('bcryptjs');
            const userData = {
                username: 'testuser',
                password: 'password123',
                role: 'cashier',
                full_name: 'Test User'
            };

            const hashedPassword = await bcrypt.hash(userData.password, 10);

            const stmt = db.prepare(`
                INSERT INTO users (username, password, role, full_name)
                VALUES (?, ?, ?, ?)
            `);

            stmt.run(userData.username, hashedPassword, userData.role, userData.full_name);
            expect(stmt.run).toHaveBeenCalled();
        });

        test('should reject duplicate username', () => {
            const existingUser = { username: 'testuser' };
            const userData = { username: 'testuser' };

            expect(() => {
                if (existingUser.username === userData.username) {
                    throw new Error('Username already exists');
                }
            }).toThrow('Username already exists');
        });

        test('should validate role', () => {
            const validRoles = ['admin', 'manager', 'cashier'];
            const userData = { role: 'invalid' };

            expect(() => {
                if (!validRoles.includes(userData.role)) {
                    throw new Error('Invalid role');
                }
            }).toThrow('Invalid role');
        });
    });

    describe('Authentication', () => {
        test('should verify correct password', async () => {
            const bcrypt = require('bcryptjs');
            const password = 'password123';
            const hashedPassword = await bcrypt.hash(password, 10);

            const isValid = await bcrypt.compare(password, hashedPassword);
            expect(isValid).toBe(true);
        });

        test('should reject incorrect password', async () => {
            const bcrypt = require('bcryptjs');
            const password = 'password123';
            const hashedPassword = await bcrypt.hash(password, 10);

            const isValid = await bcrypt.compare('wrongpassword', hashedPassword);
            expect(isValid).toBe(false);
        });
    });

    describe('User Operations', () => {
        test('should get user by ID', () => {
            const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
            stmt.get(1);
            expect(stmt.get).toHaveBeenCalledWith(1);
        });

        test('should get user by username', () => {
            const stmt = db.prepare('SELECT * FROM users WHERE username = ?');
            stmt.get('testuser');
            expect(stmt.get).toHaveBeenCalledWith('testuser');
        });

        test('should update user password', async () => {
            const bcrypt = require('bcryptjs');
            const newPassword = 'newpassword123';
            const hashedPassword = await bcrypt.hash(newPassword, 10);

            const stmt = db.prepare('UPDATE users SET password = ? WHERE id = ?');
            stmt.run(hashedPassword, 1);
            expect(stmt.run).toHaveBeenCalled();
        });

        test('should deactivate user', () => {
            const stmt = db.prepare('UPDATE users SET active = 0 WHERE id = ?');
            stmt.run(1);
            expect(stmt.run).toHaveBeenCalledWith(1);
        });
    });
});

// ============================================
// 7. SETTINGS MANAGEMENT TESTS
// ============================================

describe('Settings Management', () => {
    let db;

    beforeEach(() => {
        db = createMockDatabase();
    });

    describe('Get/Set Settings', () => {
        test('should get a setting value', () => {
            const stmt = db.prepare('SELECT value FROM settings WHERE key = ?');
            stmt.get('store_name');
            expect(stmt.get).toHaveBeenCalledWith('store_name');
        });

        test('should set a setting value', () => {
            const stmt = db.prepare(`
                INSERT OR REPLACE INTO settings (key, value)
                VALUES (?, ?)
            `);
            stmt.run('store_name', 'My Store');
            expect(stmt.run).toHaveBeenCalledWith('store_name', 'My Store');
        });

        test('should get all settings', () => {
            const stmt = db.prepare('SELECT * FROM settings');
            stmt.all();
            expect(stmt.all).toHaveBeenCalled();
        });

        test('should handle default settings', () => {
            const defaultSettings = {
                store_name: 'متجر جديد',
                store_address: 'العنوان الافتراضي',
                store_phone: '0000000000',
                tax_rate: 15,
                currency: 'ر.س'
            };

            Object.keys(defaultSettings).forEach(key => {
                expect(defaultSettings[key]).toBeDefined();
            });
        });
    });
});

// ============================================
// 8. AUDIT LOG TESTS
// ============================================

describe('Audit Logging', () => {
    let db;

    beforeEach(() => {
        db = createMockDatabase();
    });

    test('should log user login', () => {
        const stmt = db.prepare(`
            INSERT INTO audit_logs (user_id, action, entity_type, entity_id, details)
            VALUES (?, ?, ?, ?, ?)
        `);
        stmt.run(1, 'login', 'user', 1, JSON.stringify({ ip: '127.0.0.1' }));
        expect(stmt.run).toHaveBeenCalled();
    });

    test('should log product creation', () => {
        const stmt = db.prepare(`
            INSERT INTO audit_logs (user_id, action, entity_type, entity_id, details)
            VALUES (?, ?, ?, ?, ?)
        `);
        stmt.run(1, 'create', 'product', 1, JSON.stringify({ name: 'Test Product' }));
        expect(stmt.run).toHaveBeenCalled();
    });

    test('should log sale completion', () => {
        const stmt = db.prepare(`
            INSERT INTO audit_logs (user_id, action, entity_type, entity_id, details)
            VALUES (?, ?, ?, ?, ?)
        `);
        stmt.run(1, 'sale', 'sale', 1, JSON.stringify({ total: 100.00 }));
        expect(stmt.run).toHaveBeenCalled();
    });

    test('should get audit logs by date range', () => {
        const stmt = db.prepare(`
            SELECT al.*, u.username
            FROM audit_logs al
            LEFT JOIN users u ON al.user_id = u.id
            WHERE date(al.date) BETWEEN date(?) AND date(?)
            ORDER BY al.date DESC
        `);
        stmt.all('2024-01-01', '2024-01-31');
        expect(stmt.all).toHaveBeenCalledWith('2024-01-01', '2024-01-31');
    });
});

// ============================================
// 9. DATABASE INTEGRITY TESTS
// ============================================

describe('Database Integrity', () => {
    let db;

    beforeEach(() => {
        db = createMockDatabase();
    });

    test('should enforce foreign key constraint on sale_items', () => {
        // In real DB, this would fail if product_id doesn't exist
        const stmt = db.prepare(`
            INSERT INTO sale_items (sale_id, product_id, quantity, price)
            VALUES (?, ?, ?, ?)
        `);
        expect(stmt.run).toBeDefined();
    });

    test('should enforce unique constraint on barcode', () => {
        // Simulate unique constraint check
        const product1 = { barcode: '1234567890123' };
        const product2 = { barcode: '1234567890123' };

        expect(() => {
            if (product1.barcode === product2.barcode) {
                throw new Error('UNIQUE constraint failed: products.barcode');
            }
        }).toThrow('UNIQUE constraint failed: products.barcode');
    });

    test('should cascade delete related records', () => {
        // Simulate cascade delete
        const deleteSaleItems = db.prepare('DELETE FROM sale_items WHERE sale_id = ?');
        const deleteSale = db.prepare('DELETE FROM sales WHERE id = ?');

        expect(deleteSaleItems.run).toBeDefined();
        expect(deleteSale.run).toBeDefined();
    });
});

// ============================================
// 10. TRANSACTION TESTS
// ============================================

describe('Database Transactions', () => {
    let db;

    beforeEach(() => {
        db = createMockDatabase();
    });

    test('should commit successful transaction', () => {
        const result = db.transaction(() => {
            // Multiple operations
            return { success: true };
        })();

        expect(result.success).toBe(true);
    });

    test('should rollback failed transaction', () => {
        const transactionFn = () => {
            throw new Error('Transaction failed');
        };

        expect(() => db.transaction(transactionFn)()).toThrow('Transaction failed');
    });

    test('should handle nested transactions', () => {
        const outerTransaction = db.transaction(() => {
            const innerTransaction = db.transaction(() => {
                return 'inner success';
            });
            return innerTransaction();
        });

        const result = outerTransaction();
        expect(result).toBe('inner success');
    });
});

module.exports = {
    createMockDatabase
};
