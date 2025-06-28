const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('node:path');
const { marked } = require('marked');

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    });

    win.setMenuBarVisibility(false);
    win.loadFile(path.join(__dirname, "public", "main", "index.html"));
}

function initializeIPCFunctions() {
    ipcMain.handle('ping', () => "pong!");
    ipcMain.handle('info', (e, msg) => console.log("[INFO] " + msg));
    ipcMain.handle('debug', (e, msg) => console.debug("[DEBUG] " + msg));
    ipcMain.handle('warn', (e, msg) => console.warn("[WARNING] " + msg));
    ipcMain.handle('error', (e, msg) => console.error("[ERROR] " + msg));
    ipcMain.handle('fatal', (e, msg) => console.error("[FATAL/SEVERE] " + msg));

    ipcMain.handle('format_markdown', (e, ival) => {
        return marked(ival);
    });
}

function initialize() {
    createWindow();
    initializeIPCFunctions();
}

app.whenReady().then(() => initialize());
app.on('window-all-closed', () => {
    if (process.platform !== "darwin") app.quit();
})