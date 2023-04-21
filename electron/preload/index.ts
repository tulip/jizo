import { contextBridge, ipcRenderer } from "electron";
import { electronAPI } from "@electron-toolkit/preload";

require('dotenv').config();

const api = {
  createReport: async (url: string, filename: string) => ipcRenderer.invoke("create-report", [url, filename]),
  createSitemapReport: async (sitemap) => ipcRenderer.invoke("create-sitemap-report", [sitemap]),
  resumeReport: async (url: string, filename: string) => ipcRenderer.invoke("resume-report", [url, filename]),
  reportCreated: (callback) => ipcRenderer.on('report-created', callback),
  sitemapFound: async (sitemap) => ipcRenderer.on('sitemap-found', sitemap),
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
