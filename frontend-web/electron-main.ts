import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import * as path from 'path';
import isDev from 'electron-is-dev';
import { writeFile } from 'fs/promises'; // Using fs.promises for async/await

// Changed 'const' to 'let' to allow reassignment to null
let win: BrowserWindow | null = null;

ipcMain.handle('save-image', async (_event, base64DataUrl: string) => {
  if (!win) {
    console.error('Main window not available for save dialog.');
    return { success: false, error: 'Main window not available.' };
  }
  try {
    const result = await dialog.showSaveDialog(win, { // Pass the parent window
      title: 'Save Captured Fingerprint',
      defaultPath: 'fingerprint.jpg',
      filters: [{ name: 'Images', extensions: ['jpg', 'jpeg'] }],
    });

    if (result.canceled || !result.filePath) {
      console.log('Save dialog was canceled.');
      return { success: false, error: 'Save canceled by user.' };
    }

    const filePath = result.filePath;
    // Ensure base64DataUrl is a string and correctly formatted
    if (typeof base64DataUrl !== 'string' || !base64DataUrl.startsWith('data:image/')) {
        console.error('Invalid base64 data URL format.');
        return { success: false, error: 'Invalid image data format.'};
    }

    const parts = base64DataUrl.split(',');
    if (parts.length < 2) {
        console.error('Malformed base64 data URL.');
        return { success: false, error: 'Malformed image data.'};
    }
    const imageBuffer = Buffer.from(parts[1], 'base64');

    await writeFile(filePath, imageBuffer);
    console.log('File saved successfully at', filePath);
    return { success: true, filePath: filePath };

  } catch (err) {
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
  win = new BrowserWindow({ // Assign to the global 'win'
    width: 1280,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'electron-preload.js'),
      contextIsolation: true,
      nodeIntegration: false, // Best practice: keep false
      // webSecurity: !isDev, // Consider for production to prevent loading local file system resources directly by renderer if not needed
    },
  });

  if (isDev) {
    win.loadURL('http://localhost:3000');
    win.webContents.openDevTools(); // Open DevTools in development
  } else {
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

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
