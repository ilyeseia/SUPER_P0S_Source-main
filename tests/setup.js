/**
 * Jest Test Setup Configuration
 * 
 * This file configures the test environment with mocks for Electron APIs,
 * database utilities, and other test helpers.
 */

// ============================================
// 1. ELECTRON API MOCKS
// ============================================

// Mock Electron app
const mockApp = {
    getPath: jest.fn((pathType) => {
        const paths = {
            userData: '/tmp/test-user-data',
            appData: '/tmp/test-app-data',
            temp: '/tmp',
            desktop: '/tmp/desktop',
            documents: '/tmp/documents'
        };
        return paths[pathType] || '/tmp';
    }),
    getVersion: jest.fn(() => '2.0.4'),
    getName: jest.fn(() => 'ultra-pos'),
    quit: jest.fn(),
    on: jest.fn(),
    whenReady: jest.fn(() => Promise.resolve()),
    requestSingleInstanceLock: jest.fn(() => true),
    disableHardwareAcceleration: jest.fn()
};

// Mock Electron BrowserWindow
const mockBrowserWindow = jest.fn().mockImplementation((options) => ({
    loadFile: jest.fn(),
    loadURL: jest.fn(),
    show: jest.fn(),
    hide: jest.fn(),
    close: jest.fn(),
    on: jest.fn(),
    once: jest.fn(),
    webContents: {
        openDevTools: jest.fn(),
        send: jest.fn(),
        on: jest.fn()
    },
    isMinimized: jest.fn(() => false),
    restore: jest.fn(),
    focus: jest.fn(),
    maximize: jest.fn(),
    unmaximize: jest.fn(),
    isMaximized: jest.fn(() => false)
}));

// Mock Electron ipcMain
const mockIpcMain = {
    handle: jest.fn(),
    on: jest.fn(),
    once: jest.fn(),
    removeHandler: jest.fn()
};

// Mock Electron ipcRenderer
const mockIpcRenderer = {
    invoke: jest.fn(),
    on: jest.fn(),
    once: jest.fn(),
    send: jest.fn(),
    removeListener: jest.fn(),
    removeAllListeners: jest.fn()
};

// Mock Electron dialog
const mockDialog = {
    showMessageBox: jest.fn(() => Promise.resolve({ response: 0 })),
    showErrorBox: jest.fn(),
    showOpenDialog: jest.fn(() => Promise.resolve({ filePaths: [] })),
    showSaveDialog: jest.fn(() => Promise.resolve({ filePath: '' }))
};

// Mock Electron contextBridge
const mockContextBridge = {
    exposeInMainWorld: jest.fn((key, api) => {
        global[key] = api;
    })
};

// Set up Electron mock module
jest.mock('electron', () => ({
    app: mockApp,
    BrowserWindow: mockBrowserWindow,
    ipcMain: mockIpcMain,
    ipcRenderer: mockIpcRenderer,
    dialog: mockDialog,
    contextBridge: mockContextBridge,
    nativeImage: {
        createFromPath: jest.fn(),
        createFromDataURL: jest.fn()
    },
    screen: {
        getPrimaryDisplay: jest.fn(() => ({
            workAreaSize: { width: 1920, height: 1080 }
        }))
    },
    Menu: {
        buildFromTemplate: jest.fn(),
        setApplicationMenu: jest.fn()
    },
    shell: {
        openExternal: jest.fn(),
        openPath: jest.fn()
    }
}));

// ============================================
// 2. DATABASE MOCK UTILITIES
// ============================================

/**
 * Creates a mock database instance for testing
 */
function createMockDatabase() {
    const statements = new Map();
    const data = {
        products: [],
        categories: [],
        customers: [],
        sales: [],
        sale_items: [],
        users: [],
        settings: [],
        suppliers: [],
        stock_movements: [],
        audit_logs: [],
        suspended_carts: [],
        product_variants: []
    };
    
    let lastInsertRowid = 0;

    const mockStatement = (sql) => {
        const stmt = {
            run: jest.fn((...params) => {
                lastInsertRowid++;
                return { lastInsertRowid, changes: 1 };
            }),
            get: jest.fn((...params) => {
                // Return mock data based on SQL
                if (sql.includes('SELECT')) {
                    return null;
                }
                return { lastInsertRowid: ++lastInsertRowid };
            }),
            all: jest.fn((...params) => []),
            pluck: jest.fn(function() { return this; }),
            expand: jest.fn(function() { return this; }),
            raw: jest.fn(function() { return this; }),
            columns: jest.fn(() => []),
            finalize: jest.fn()
        };
        statements.set(sql, stmt);
        return stmt;
    };

    const db = {
        prepare: jest.fn(mockStatement),
        transaction: jest.fn((fn) => fn),
        exec: jest.fn(),
        close: jest.fn(),
        pragma: jest.fn(),
        backup: jest.fn(() => Promise.resolve()),
        serialize: jest.fn(),
        inTransaction: false,
        open: jest.fn(),
        read: jest.fn(),
        write: jest.fn(),
        
        // Test helpers
        _data: data,
        _statements: statements,
        _lastInsertRowid: lastInsertRowid,
        _resetData: () => {
            Object.keys(data).forEach(key => {
                data[key] = [];
            });
            lastInsertRowid = 0;
        }
    };

    return db;
}

/**
 * In-memory SQLite database for integration testing
 */
async function createTestDatabase() {
    const Database = require('better-sqlite3');
    const db = new Database(':memory:');
    
    // Enable foreign keys
    db.pragma('journal_mode = WAL');
    
    return db;
}

// ============================================
// 3. BCRYPT MOCK
// ============================================

jest.mock('bcryptjs', () => ({
    hash: jest.fn((password, rounds) => Promise.resolve(`hashed_${password}_${rounds}`)),
    compare: jest.fn((password, hash) => {
        // Simple mock: return true if password is in hash
        return Promise.resolve(hash.includes(password));
    }),
    genSalt: jest.fn((rounds) => Promise.resolve(`salt_${rounds}`)),
    hashSync: jest.fn((password, rounds) => `hashed_${password}_${rounds}`),
    compareSync: jest.fn((password, hash) => hash.includes(password)),
    getRounds: jest.fn(() => 10)
}));

// ============================================
// 4. OS MODULE MOCK
// ============================================

jest.mock('os', () => ({
    hostname: jest.fn(() => 'test-machine'),
    platform: jest.fn(() => 'win32'),
    arch: jest.fn(() => 'x64'),
    cpus: jest.fn(() => [{ model: 'Test CPU' }]),
    totalmem: jest.fn(() => 16 * 1024 * 1024 * 1024),
    freemem: jest.fn(() => 8 * 1024 * 1024 * 1024),
    homedir: jest.fn(() => '/home/test'),
    tmpdir: jest.fn(() => '/tmp'),
    type: jest.fn(() => 'Windows_NT'),
    release: jest.fn(() => '10.0.0'),
    userInfo: jest.fn(() => ({
        username: 'testuser',
        homedir: '/home/test'
    }))
}));

// ============================================
// 5. CRYPTO MODULE EXTENSION
// ============================================

// Ensure crypto module is available
const crypto = require('crypto');

// Add polyfill for subtle if needed
if (!crypto.subtle) {
    crypto.subtle = {
        digest: jest.fn(() => Promise.resolve(new ArrayBuffer(32)))
    };
}

// ============================================
// 6. FS MODULE MOCK
// ============================================

jest.mock('fs', () => {
    const originalFs = jest.requireActual('fs');
    return {
        ...originalFs,
        existsSync: jest.fn(() => true),
        mkdirSync: jest.fn(),
        writeFileSync: jest.fn(),
        readFileSync: jest.fn((path) => {
            if (path.includes('settings')) {
                return JSON.stringify({ store_name: 'Test Store' });
            }
            return '';
        }),
        unlinkSync: jest.fn(),
        readdirSync: jest.fn(() => []),
        statSync: jest.fn(() => ({
            isFile: () => true,
            isDirectory: () => false,
            size: 1024,
            mtime: new Date()
        })),
        createWriteStream: jest.fn(() => ({
            write: jest.fn(),
            end: jest.fn(),
            on: jest.fn()
        })),
        createReadStream: jest.fn(() => ({
            on: jest.fn(),
            pipe: jest.fn()
        }))
    };
});

// ============================================
// 7. PATH MODULE MOCK
// ============================================

jest.mock('path', () => {
    const originalPath = jest.requireActual('path');
    return {
        ...originalPath,
        join: jest.fn((...args) => args.join('/').replace(/\/+/g, '/')),
        resolve: jest.fn((...args) => {
            const resolved = originalPath.resolve(...args);
            return resolved;
        }),
        dirname: jest.fn((p) => {
            const parts = p.split('/');
            parts.pop();
            return parts.join('/');
        }),
        basename: jest.fn((p) => p.split('/').pop()),
        extname: jest.fn((p) => {
            const parts = p.split('.');
            return parts.length > 1 ? '.' + parts.pop() : '';
        })
    };
});

// ============================================
// 8. GLOBAL TEST UTILITIES
// ============================================

global.testUtils = {
    createMockDatabase,
    createTestDatabase,
    mockApp,
    mockBrowserWindow,
    mockIpcMain,
    mockIpcRenderer,
    mockDialog,
    mockContextBridge
};

// ============================================
// 9. TEST TIMEOUT CONFIGURATION
// ============================================

// Increase timeout for slower tests
jest.setTimeout(30000);

// ============================================
// 10. CLEANUP
// ============================================

// Clean up after each test
afterEach(() => {
    jest.clearAllMocks();
});

// Clean up after all tests
afterAll(() => {
    jest.restoreAllMocks();
});

// ============================================
// 11. CUSTOM MATCHERS
// ============================================

expect.extend({
    toBeValidProduct(received) {
        const pass = received &&
            typeof received.name === 'string' &&
            typeof received.price === 'number' &&
            typeof received.stock === 'number' &&
            (received.unit_type === 'unit' || received.unit_type === 'weight');
        
        return {
            pass,
            message: () => pass
                ? `expected ${received} not to be a valid product`
                : `expected ${received} to be a valid product with name, price, stock, and valid unit_type`
        };
    },
    
    toBeValidLicense(received) {
        const pass = received &&
            typeof received.active === 'boolean' &&
            typeof received.licenseType === 'string' &&
            typeof received.device_hash === 'string';
        
        return {
            pass,
            message: () => pass
                ? `expected ${received} not to be a valid license`
                : `expected ${received} to be a valid license with active, licenseType, and device_hash`
        };
    },
    
    toBeValidSale(received) {
        const pass = received &&
            typeof received.id === 'number' &&
            typeof received.total === 'number' &&
            typeof received.date === 'string';
        
        return {
            pass,
            message: () => pass
                ? `expected ${received} not to be a valid sale`
                : `expected ${received} to be a valid sale with id, total, and date`
        };
    },
    
    toBeWithinRange(received, floor, ceiling) {
        const pass = received >= floor && received <= ceiling;
        return {
            pass,
            message: () => pass
                ? `expected ${received} not to be within range ${floor} - ${ceiling}`
                : `expected ${received} to be within range ${floor} - ${ceiling}`
        };
    }
});

// Console suppression for cleaner test output
const originalConsole = { ...console };
beforeAll(() => {
    console.log = jest.fn();
    console.warn = jest.fn();
    console.error = jest.fn();
});

afterAll(() => {
    console.log = originalConsole.log;
    console.warn = originalConsole.warn;
    console.error = originalConsole.error;
});

module.exports = {
    createMockDatabase,
    createTestDatabase,
    mockApp,
    mockBrowserWindow,
    mockIpcMain,
    mockIpcRenderer,
    mockDialog,
    mockContextBridge
};
