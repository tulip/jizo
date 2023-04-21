import { healthCheck, findSiteMap } from "../../src/utils/web-helpers";
import { BrowserWindow } from "electron";
import AxeReporter from "./axe-reporter";

export const handleCreateReport = async (_, args) => {
  if (args.length) {
    const url = args[0];
    healthCheck(url).then(async (res) => {
      if (res) {

        findSiteMap(url).then((sitemap) => {
          if (sitemap) {
            BrowserWindow.getAllWindows().forEach((win) => {
              win.webContents.send("sitemap-found", sitemap);
            });
          } else {
            resumeReport(_, args);
          }
        });
      } else {
        throw new Error("healthCheck - `@url` has returned a non-OK response code");
      }
    }).catch((err) => {
      // toast for the user to let them know that the URL they want to test does not exist
    });
      // make directory for domain
      // parse the urls returned in the sitemap
  }
}

export const handleCreateSitemapReport = async (_, args) => {
  console.log(args[0]);
}

export const resumeReport = async (_, args) => {
  const axeReporter = new AxeReporter();
  const url = args[0];
  if (args[1]) {
    axeReporter.create(url, args[1]);
  } else {
    axeReporter.create(url);
  }
}
