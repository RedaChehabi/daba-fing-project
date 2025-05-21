"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
electron_1.contextBridge.exposeInMainWorld('electronAPI', {
    saveImage: (base64) => electron_1.ipcRenderer.invoke('save-image', base64),
});
