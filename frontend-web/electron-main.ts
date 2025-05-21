import { app, BrowserWindow } from 'electron';
import * as path from 'path';
import isDev from 'electron-is-dev';

import { ipcMain, dialog } from 'electron';
import { writeFile } from 'fs';

let win: BrowserWindow | null = null;

ipcMain.handle('save-image', async (event, base64: string) => {
  const { canceled, filePath } = await dialog.showSaveDialog({
    title: 'Save Captured Fingerprint',
    defaultPath: 'fingerprint.jpg',
    filters: [{ name: 'Images', extensions: ['jpg', 'jpeg'] }],
  });

  if (canceled || !filePath) return;

  const imageBuffer = Buffer.from(base64.split(',')[1], 'base64');
  await writeFile(filePath, imageBuffer, (err) => {
    if (err) {
      console.error('Failed to save file:', err);
    } else {
      console.log('File saved successfully at', filePath);
    }
  });
});
function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'electron-preload.js'), 
      contextIsolation: true,
      nodeIntegration: false,
    },
  });
  
  if (isDev) {
    win.loadURL('http://localhost:3000'); // CHANGED from 3004 to 3000
  } else {
    win.loadFile(path.join(__dirname, 'out', 'index.html')); 
  }

  win.on('closed', () => {
    win = null;
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
