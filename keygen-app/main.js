const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        title: "ULTRA_POS Keygen",
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false // For simple improved compatibility with local file loading
        },
        autoHideMenuBar: true
    });

    win.loadFile('keygen.html');
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
