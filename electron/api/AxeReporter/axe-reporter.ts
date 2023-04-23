import { ChildProcessWithoutNullStreams, spawn } from "node:child_process";
import { BrowserWindow } from "electron";
import path from "node:path";

export default class AxeReporter {
  IS_WINDOWS: boolean;
  process: ChildProcessWithoutNullStreams | null;
  timestamp: Date;
  fileName: string;
  fileExtension: string;

  constructor() {
    this.IS_WINDOWS = process.platform === "win32";
    this.process = null;
    this.timestamp = new Date();
    this.fileName = `${this.timestamp.getFullYear()}_${String(
      this.timestamp.getMonth()
    ).padStart(2, "0")}_${String(this.timestamp.getDate()).padStart(
      2,
      "0"
    )}_${this.timestamp.getTime()}_report`;
    this.fileExtension = "json";
  }

  create = (
    target: string = "https://google.com",
    fileName: string = this.fileName
  ) => {
    if (fileName) {
      this.fileName = fileName;
    }
    const spawnCmd = this.IS_WINDOWS ? "npm.cmd" : "npm";
    this.process = spawn(`${spawnCmd}`, [
      "run",
      "axe",
      "--",
      `${target}`,
      "--tags",
      "wcag2aa,wcag21aa,wcag22aa,best-practice",
      "--dir",
      process.env.AXE_RESULT_DIR ? path.join(__dirname, process.env.AXE_RESULT_DIR) : "./axe-results",
      "--save",
      `${this.fileName}.${this.fileExtension}`,
    ]);

    this.process.stdout.on("data", (d) => console.log(d.toString()));

    this.process.on("exit", () => {
      BrowserWindow.getAllWindows().forEach((win) => {
        win.webContents.send("report-created");
      });
    });
  };
}
