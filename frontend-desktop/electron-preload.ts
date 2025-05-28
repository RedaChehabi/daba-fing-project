import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  saveImage: (base64: string) => ipcRenderer.invoke('save-image', base64),
});
