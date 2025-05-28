"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron"); // Added SaveDialogReturnValue
const path = __importStar(require("path"));
const electron_is_dev_1 = __importDefault(require("electron-is-dev"));
const promises_1 = require("fs/promises"); // Using fs.promises for async/await
// Changed 'const' to 'let' to allow reassignment to null
let win = null;
electron_1.ipcMain.handle('save-image', async (_event, base64DataUrl) => {
    if (!win) {
        console.error('Main window not available for save dialog.');
        return { success: false, error: 'Main window not available.' };
    }
    try {
        // Using a type assertion for the result
        const result = (await electron_1.dialog.showSaveDialog(win, {
            title: 'Save Captured Fingerprint',
            defaultPath: 'fingerprint.jpg',
            filters: [{ name: 'Images', extensions: ['jpg', 'jpeg'] }],
        })); // Type assertion
        if (result.canceled || !result.filePath) {
            console.log('Save dialog was canceled.');
            return { success: false, error: 'Save canceled by user.' };
        }
        const filePath = result.filePath; // filePath is now definitely a string here
        // Ensure base64DataUrl is a string and correctly formatted
        if (typeof base64DataUrl !== 'string' || !base64DataUrl.startsWith('data:image/')) {
            console.error('Invalid base64 data URL format.');
            return { success: false, error: 'Invalid image data format.' };
        }
        const parts = base64DataUrl.split(',');
        if (parts.length < 2) {
            console.error('Malformed base64 data URL.');
            return { success: false, error: 'Malformed image data.' };
        }
        const imageBuffer = Buffer.from(parts[1], 'base64');
        await (0, promises_1.writeFile)(filePath, imageBuffer);
        console.log('File saved successfully at', filePath);
        return { success: true, filePath: filePath };
    }
    catch (err) {
        console.error('Failed to save file:', err);
        // It's good practice to cast to Error to access message property safely
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
        return { success: false, error: `Failed to save file: ${errorMessage}` };
    }
});
function createWindow() {
    // Re-declare win here if it's only used within this function scope,
    // or ensure the global 'win' is correctly assigned.
    // For this structure, the global 'win' is intended.
    win = new electron_1.BrowserWindow({
        width: 1280,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, 'electron-preload.js'),
            contextIsolation: true,
            nodeIntegration: false, // Best practice: keep false
            // webSecurity: !isDev, // Consider for production to prevent loading local file system resources directly by renderer if not needed
        },
    });
    if (electron_is_dev_1.default) {
        win.loadURL('http://localhost:3000');
        //win.webContents.openDevTools(); // Open DevTools in development
    }
    else {
        // In production, load the static export from the 'out' directory
        // __dirname in this context will be frontend-web/electron-dist/
        // So, we need to go up one level to frontend-web/ and then into out/
        const indexPath = path.join(__dirname, '..', 'out', 'index.html');
        win.loadFile(indexPath);
    }
    win.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the cleanest
        // way to AVOID MEMORY LEAKS.
        win = null; // This is now allowed because 'win' is 'let'
    });
}
electron_1.app.whenReady().then(createWindow);
electron_1.app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        electron_1.app.quit();
    }
});
electron_1.app.on('activate', () => {
    if (electron_1.BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
