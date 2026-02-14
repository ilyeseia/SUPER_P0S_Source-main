/**
 * Electron Mock Module
 * 
 * Mocks all Electron APIs for testing purposes
 */

// Mock Electron app
const app = {
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
    disableHardwareAcceleration: jest.fn(),
    exit: jest.fn(),
    relaunch: jest.fn(),
    hide: jest.fn(),
    show: jest.fn(),
    focus: jest.fn(),
    isReady: jest.fn(() => true)
};

// Mock Electron BrowserWindow
const BrowserWindow = jest.fn().mockImplementation((options) => ({
    loadFile: jest.fn(),
    loadURL: jest.fn(),
    show: jest.fn(),
    hide: jest.fn(),
    close: jest.fn(),
    on: jest.fn(),
    once: jest.fn(),
    emit: jest.fn(),
    webContents: {
        openDevTools: jest.fn(),
        send: jest.fn((channel, data) => {}),
        on: jest.fn(),
        once: jest.fn(),
        executeJavaScript: jest.fn(() => Promise.resolve()),
        getURL: jest.fn(() => 'file://test.html'),
        isLoading: jest.fn(() => false)
    },
    isMinimized: jest.fn(() => false),
    restore: jest.fn(),
    focus: jest.fn(),
    maximize: jest.fn(),
    unmaximize: jest.fn(),
    isMaximized: jest.fn(() => false),
    minimize: jest.fn(),
    isFullScreen: jest.fn(() => false),
    setFullScreen: jest.fn(),
    setSize: jest.fn(),
    getSize: jest.fn(() => [1200, 800]),
    setPosition: jest.fn(),
    getPosition: jest.fn(() => [0, 0]),
    center: jest.fn(),
    setMenuBarVisibility: jest.fn(),
    setAutoHideMenuBar: jest.fn(),
    setTitle: jest.fn(),
    getTitle: jest.fn(() => 'ULTRA POS')
}));

// Mock Electron ipcMain
const ipcMain = {
    handle: jest.fn((channel, handler) => {}),
    on: jest.fn((channel, handler) => {}),
    once: jest.fn((channel, handler) => {}),
    removeHandler: jest.fn((channel) => {}),
    emit: jest.fn()
};

// Mock Electron ipcRenderer
const ipcRenderer = {
    invoke: jest.fn((channel, ...args) => Promise.resolve({})),
    on: jest.fn((channel, handler) => {}),
    once: jest.fn((channel, handler) => {}),
    send: jest.fn((channel, ...args) => {}),
    sendSync: jest.fn((channel, ...args) => ({})),
    removeListener: jest.fn((channel, handler) => {}),
    removeAllListeners: jest.fn((channel) => {}),
    emit: jest.fn()
};

// Mock Electron dialog
const dialog = {
    showMessageBox: jest.fn(() => Promise.resolve({ response: 0, checkboxChecked: false })),
    showErrorBox: jest.fn(),
    showOpenDialog: jest.fn(() => Promise.resolve({ filePaths: [], bookmarks: [] })),
    showSaveDialog: jest.fn(() => Promise.resolve({ filePath: '', bookmark: '' })),
    showCertificateTrustDialog: jest.fn(() => Promise.resolve())
};

// Mock Electron contextBridge
const contextBridge = {
    exposeInMainWorld: jest.fn((key, api) => {
        // Expose to global for testing
        global[key] = api;
    })
};

// Mock Electron nativeImage
const nativeImage = {
    createFromPath: jest.fn((path) => ({
        toDataURL: jest.fn(() => 'data:image/png;base64,test'),
        toBitmap: jest.fn(() => Buffer.from('')),
        getSize: jest.fn(() => ({ width: 100, height: 100 })),
        resize: jest.fn(function() { return this; }),
        crop: jest.fn(function() { return this; })
    })),
    createFromDataURL: jest.fn((dataURL) => ({
        toDataURL: jest.fn(() => dataURL),
        toBitmap: jest.fn(() => Buffer.from('')),
        getSize: jest.fn(() => ({ width: 100, height: 100 }))
    })),
    createEmpty: jest.fn(() => ({
        toDataURL: jest.fn(() => ''),
        toBitmap: jest.fn(() => Buffer.from('')),
        getSize: jest.fn(() => ({ width: 0, height: 0 }))
    }))
};

// Mock Electron screen
const screen = {
    getPrimaryDisplay: jest.fn(() => ({
        workAreaSize: { width: 1920, height: 1080 },
        size: { width: 1920, height: 1080 },
        scaleFactor: 1,
        bounds: { x: 0, y: 0, width: 1920, height: 1080 }
    })),
    getAllDisplays: jest.fn(() => [{
        workAreaSize: { width: 1920, height: 1080 },
        size: { width: 1920, height: 1080 },
        scaleFactor: 1
    }]),
    on: jest.fn(),
    removeAllListeners: jest.fn()
};

// Mock Electron Menu
const Menu = {
    buildFromTemplate: jest.fn((template) => ({
        popup: jest.fn(),
        closePopup: jest.fn(),
        append: jest.fn(),
        insert: jest.fn()
    })),
    setApplicationMenu: jest.fn(),
    getApplicationMenu: jest.fn(() => null),
    sendActionToFirstResponder: jest.fn()
};

// Mock Electron MenuItem
const MenuItem = jest.fn().mockImplementation((options) => ({
    ...options,
    click: options.click || jest.fn()
}));

// Mock Electron shell
const shell = {
    openExternal: jest.fn(() => Promise.resolve()),
    openPath: jest.fn(() => Promise.resolve('')),
    showItemInFolder: jest.fn(),
    moveItemToTrash: jest.fn(() => Promise.resolve(true)),
    beep: jest.fn(),
    writeShortcutLink: jest.fn(),
    readShortcutLink: jest.fn(() => ({}))
};

// Mock Electron clipboard
const clipboard = {
    writeText: jest.fn(),
    readText: jest.fn(() => ''),
    writeHTML: jest.fn(),
    readHTML: jest.fn(() => ''),
    writeImage: jest.fn(),
    readImage: jest.fn(() => nativeImage.createEmpty()),
    write: jest.fn(),
    read: jest.fn(() => ({})),
    availableFormats: jest.fn(() => []),
    clear: jest.fn()
};

// Mock Electron net
const net = {
    request: jest.fn(() => ({
        on: jest.fn(),
        write: jest.fn(),
        end: jest.fn(),
        abort: jest.fn(),
        setHeader: jest.fn(),
        getHeader: jest.fn(),
        removeHeader: jest.fn()
    })),
    online: true
};

// Mock Electron session
const session = {
    defaultSession: {
        cookies: {
            get: jest.fn(() => Promise.resolve([])),
            set: jest.fn(() => Promise.resolve()),
            remove: jest.fn(() => Promise.resolve())
        },
        webRequest: {
            onBeforeRequest: jest.fn(),
            onBeforeSendHeaders: jest.fn(),
            onHeadersReceived: jest.fn(),
            onCompleted: jest.fn()
        },
        clearCache: jest.fn(() => Promise.resolve()),
        clearStorageData: jest.fn(() => Promise.resolve()),
        setDownloadPath: jest.fn()
    },
    fromPartition: jest.fn(() => session.defaultSession)
};

// Mock Electron Notification
const Notification = jest.fn().mockImplementation((options) => ({
    show: jest.fn(),
    close: jest.fn(),
    on: jest.fn()
}));

// Mock Electron powerMonitor
const powerMonitor = {
    on: jest.fn(),
    getSystemIdleState: jest.fn(() => 'active'),
    getSystemIdleTime: jest.fn(() => 0)
};

// Export all mocks
module.exports = {
    app,
    BrowserWindow,
    ipcMain,
    ipcRenderer,
    dialog,
    contextBridge,
    nativeImage,
    screen,
    Menu,
    MenuItem,
    shell,
    clipboard,
    net,
    session,
    Notification,
    powerMonitor,
    
    // Additional exports
    clipboardEx: clipboard,
    crashReporter: {
        start: jest.fn(),
        getLastCrashReport: jest.fn(),
        getUploadedReports: jest.fn(() => [])
    },
    
    // Desktop capturer mock
    desktopCapturer: {
        getSources: jest.fn(() => Promise.resolve([]))
    },
    
    // GlobalShortcut mock
    globalShortcut: {
        register: jest.fn(() => true),
        unregister: jest.fn(),
        unregisterAll: jest.fn(),
        isRegistered: jest.fn(() => false)
    },
    
    // Protocol mock
    protocol: {
        registerSchemesAsPrivileged: jest.fn(),
        registerFileProtocol: jest.fn(),
        registerHttpProtocol: jest.fn(),
        interceptFileProtocol: jest.fn(),
        interceptHttpProtocol: jest.fn(),
        uninterceptProtocol: jest.fn()
    },
    
    // SafeStorage mock
    safeStorage: {
        encryptString: jest.fn(() => Buffer.from('')),
        decryptString: jest.fn(() => ''),
        isEncryptionAvailable: jest.fn(() => true)
    },
    
    // Tray mock
    Tray: jest.fn().mockImplementation((image) => ({
        destroy: jest.fn(),
        setImage: jest.fn(),
        setPressedImage: jest.fn(),
        setToolTip: jest.fn(),
        setTitle: jest.fn(),
        setContextMenu: jest.fn(),
        popUpContextMenu: jest.fn(),
        on: jest.fn(),
        once: jest.fn(),
        emit: jest.fn()
    })),
    
    // WebContents mock
    webContents: {
        getAllWebContents: jest.fn(() => []),
        getFocusedWebContents: jest.fn(() => null)
    }
};
