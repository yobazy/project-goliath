// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { contextBridge, ipcRenderer, IpcRendererEvent, dialog } from 'electron';
// import fs from 'fs';

export type Channels = 'ipc-example' | 'select-directory';

const electronHandler = {
  ipcRenderer: {
    sendMessage(channel: Channels, ...args: unknown[]) {
      ipcRenderer.send(channel, ...args);
    },
    on(channel: Channels, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },
    once(channel: Channels, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
  },
  // selectDirectory: async () => {
  //   const { dialog } = require('electron');
  //   console.log(dialog)
  //   const result = await dialog.showOpenDialog({
  //     properties: ['openDirectory'],
  //   });
  //   return result;
  // },
  selectDirectory: () => ipcRenderer.invoke('select-directory'),
  getFilenames: (folderPath: string) => ipcRenderer.invoke('getFilenames', folderPath),
  downloadPlaylist: (url: string, folderPath: string) => ipcRenderer.invoke('download-playlist', url, folderPath),
  downloadTrack: (url) => ipcRenderer.invoke('download-track', url)


  // getFilesMetadata: (folderPath) => ipcRenderer.invoke('getFilesMetadata', folderPath),
};

contextBridge.exposeInMainWorld('electron', electronHandler);

export type ElectronHandler = typeof electronHandler;
