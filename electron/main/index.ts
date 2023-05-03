import { app, shell, BrowserWindow, ipcMain } from "electron";
import { join } from "path";
import { electronApp, optimizer, is } from "@electron-toolkit/utils";
import { handleCreateReport, handleCreateSitemapCsv, resumeReport } from "../api/AxeReporter/events";
import * as dotenv from 'dotenv';

import "../utils/string";

dotenv.config();

function configureIpc() {
  ipcMain.handle("create-report", handleCreateReport);
  ipcMain.handle("create-sitemap-csv", handleCreateSitemapCsv);
  ipcMain.handle("resume-report", resumeReport)
}

function createWindow(): void {
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 768,
    show: false,
    autoHideMenuBar: true,
    webPreferences: {
      sandbox: false,
      nodeIntegration: true,
      contextIsolation: true,
      preload: join(__dirname, "../preload/index.js"),
    },
  });

  mainWindow.on("ready-to-show", () => {
    mainWindow.show();
  });

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: "deny" };
  });

  if (is.dev && process.env["ELECTRON_RENDERER_URL"]) {
    mainWindow.loadURL(process.env["ELECTRON_RENDERER_URL"]);
  } else {
    mainWindow.loadFile(join(__dirname, "../index.html"));
  }
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId("com.electron");
  configureIpc();

  app.on("browser-window-created", (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  createWindow();

  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
