import { ChildProcessWithoutNullStreams, spawn } from "node:child_process";
import { BrowserWindow } from "electron";

export default class AxeReporter {
  IS_WINDOWS: boolean;
  process: ChildProcessWithoutNullStreams | null;
  timestamp: Date;
  fileName: string;
  fileExtension: string;
  urlList: string[] | null;

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
    this.urlList = null;
  }

  public setUrlList = (urlList: string[]) => {
    this.urlList = urlList;
  }

  public create = (
    target: string = "https://google.com",
    fileName?: string
  ) => {
    if (fileName) {
      this.fileName = fileName;
    } else {
      this.fileName = `${target.toKebabCase()}-${this.fileName}`;
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
      process.env.AXE_RESULT_DIR ? process.env.AXE_RESULT_DIR : "./axe-results",
      "--save",
      `${this.fileName}.${this.fileExtension}`,
    ]);

    this.process.stderr.on("data", (d) => {
      BrowserWindow.getAllWindows().forEach((win) => {
        win.webContents.send("update-node-output", d.toString());
      })
    });

    this.process.stdout.on("data", (d) => {
      BrowserWindow.getAllWindows().forEach((win) => {
        win.webContents.send("update-node-output", d.toString());
      });
    });

    this.process.on("exit", () => {
      BrowserWindow.getAllWindows().forEach((win) => {
        win.webContents.send("report-created", {
          type: "axe-report"
        });
      });
    });
  };
}
