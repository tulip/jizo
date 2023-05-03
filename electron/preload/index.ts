import { contextBridge, ipcRenderer } from "electron";
import { electronAPI } from "@electron-toolkit/preload";

require('dotenv').config();

const api = {
  createReport: async (url: string, filename: string) => ipcRenderer.invoke("create-report", [url, filename]),
  createSitemapCsv: async (sitemap: any, url: string, filename: string) => ipcRenderer.invoke("create-sitemap-csv", [sitemap, url, filename]),
  resumeReport: async (url: string, filename: string) => ipcRenderer.invoke("resume-report", [url, filename]),
  reportCreated: (callback: (event: Electron.IpcRendererEvent, ...args: any[]) => void) => ipcRenderer.on('report-created', callback),
  sitemapFound: async (sitemap: (event: Electron.IpcRendererEvent, ...args: any[]) => void) => ipcRenderer.on('sitemap-found', sitemap),
  updateNodeOutput: async (output: (event: Electron.IpcRendererEvent, ...args: any[]) => void) => ipcRenderer.on('update-node-output', output),
};

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld("electron", electronAPI);
    contextBridge.exposeInMainWorld("axeApi", api);
  } catch (error) {
    console.error(error);
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI;
  // @ts-ignore (define in dts)
  window.api = api;
}
