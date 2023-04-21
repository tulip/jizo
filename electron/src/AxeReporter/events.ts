import { healthCheck, findSiteMap } from "../../src/utils/web-helpers";
import { BrowserWindow } from "electron";
import AxeReporter from "./axe-reporter";

export const handleCreateReport = async (_, args) => {
  const axeReporter = new AxeReporter();
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
            console.log('no sitemap found! :(');
            console.log('proceeding as per usual');
            // if (args[1]) {
            //   axeReporter.create(url, args[1]);
            // } else {
            //   axeReporter.create(url);
            // }
          }
        });
      } else {
        throw new Error("healthCheck - `@url` has returned a non-OK response code");
      }
    }).catch((err) => {
      // toast for the user to let them know that the URL they want to test does not exist
    });
    // ask the user if they wanna sitemap it up
      // make directory for domain
      // make a csv file of all the locations
      // figure out how to axe/cli with csv file
  }
}
