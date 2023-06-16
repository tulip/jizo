import { healthCheck } from "../../utils/web-helpers";
import { findSiteMap, createUrlSet } from "../Sitemap/sitemap";
import { BrowserWindow } from "electron";
import AxeReporter from "./axe-reporter";

export const handleCreateAxeReport = async (_: any, args: Array<any>) => {
  if (args.length) {
    const url = args[0];
    healthCheck(url).then(async (res) => {
      if (res) {

        findSiteMap(url).then((sitemap) => {
          if (sitemap) {
            BrowserWindow.getAllWindows().forEach((win) => {
              win.webContents.send("sitemap-found", {
                type: "axe-report",
                sm: sitemap
              });
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

export const handleCreateUrlList = async (_: any, args: Array<any>) => {
  if (args.length) {
    const url = args[0];
    healthCheck(url).then(async (res) => {
      if (res) {
        findSiteMap(url).then((sitemap) => {
          if (sitemap) {
            BrowserWindow.getAllWindows().forEach((win) => {
              win.webContents.send("sitemap-found", {
                type: "url-list",
                sm: sitemap
              });
            });
          }
        }).catch(() => {
          throw new Error("findSiteMap - `@url` has returned a non-OK response code");
        });
      }
    }).catch(() => {
      throw new Error("healthCheck - `@url` has returned a non-OK response code");
    });
  }
}

export const createSitemapCsv = async (_: any, args: Array<any>) => {
  if (!args[0]) {
    // need to communicate this to the front end
    throw new Error("handleCreateSitemapCsv - there was an error parsing the `@sitemap` that was returned.");
  }
  // make directory for domain
  try {
    await createUrlSet(args[0]);

    if(!args[1]) {
      throw new Error("handleCreateSitemapCsv - there was an error generating a report for the `@url` provided.");
    }

    let resume = true;
    if (args[3] !== undefined  && args[3] === false) { resume = args[3]; }
    args.shift();
    if (resume) {
      resumeReport(_, args);
    } else {
      BrowserWindow.getAllWindows().forEach((win) => {
        win.webContents.send("report-created", {
          type: "url-list",
        });
      });
    };
  } catch(err) {
    console.log(`An error occurred: ${err}`);
  }
}

export const resumeReport = async (_: any, args: Array<any>) => {
  const axeReporter = new AxeReporter();
  const url = args[0];
  if (args[1]) {
    axeReporter.create(url, args[1]);
  } else {
    axeReporter.create(url);
  }
}
