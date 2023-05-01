import { healthCheck } from "../../utils/web-helpers";
import { findSiteMap, createUrlSet } from "../../api/Sitemap/sitemap";
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
        }).catch((err) => {
          throw new Error("findSiteMap - `@url` has returned a non-OK response code");
        });
      } else {
        resumeReport(_, args);
      }
    }).catch((err) => {
      throw new Error("healthCheck - `@url` has returned a non-OK response code");
    });
  }
}

export const handleCreateSitemapReport = async (_, args) => {
  if (!args[0]) {
    // need to communicate this to the front end
    throw new Error("handleCreateSitemapReport - there was an error parsing the `@sitemap` that was returned.");
  }
  // make directory for domain
  try {
    const isDone = await createUrlSet(args[0]);
    console.log(isDone);
  } catch(err) {
    console.log(`An error occurred: ${err}`);
  }
  console.log(`Reports have been generated in a subdirectory under the default output folder as configured by your .env file.`);
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
