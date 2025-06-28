const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('log', {
    info: (msg) => ipcRenderer.invoke("info", msg),
    debug: (msg) => ipcRenderer.invoke("debug", msg),
    warn: (msg) => ipcRenderer.invoke("warn", msg),
    error: (msg) => ipcRenderer.invoke("error", msg),
    fatal: (msg) => ipcRenderer.invoke("fatal", msg)
});

contextBridge.exposeInMainWorld('util', {
    format_markdown: (ival) => ipcRenderer.invoke('format_markdown', ival)
});

contextBridge.exposeInMainWorld('versions', {
    node: () => process.versions.node,
    chrome: () => process.versions.chrome,
    electron: () => process.versions.electron,
    ping: () => ipcRenderer.invoke("ping")
});