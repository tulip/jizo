import { BrowserWindow } from "electron";
import { access } from "fs";

import AxeReporter from "@jizo/AxeReporter/axe-reporter";
import { findSiteMap, createUrlSet } from "@jizo/Sitemap/sitemap";
import { healthCheck } from "@utils/web-helpers";
import { asyncForOf } from "@utils/loop-helpers";
import { parseUrlCsv } from "@utils/file-helpers";

export const handleCreateAxeReport = async (_: any, args: Array<any>) => {
  if (args.length) {
    const url = args[0];
    healthCheck(url).then((res) => {
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

  return;
}

export const handleCreateBulkAxeReport = async (_: any, args: Array<any>) => {
  if (args.length) {
    const file = args[0];
    try {
      access(file, async (err) => {
        if (err) {
          throw new Error("handleCreateBulkAxeReport - error reading file.");
        }
        const urls = await parseUrlCsv(file) as Array<string>;
        if (urls.length) {
          asyncForOf(urls, async (url: string) => {
            const isHealthy = await healthCheck(url);
            if (isHealthy) {
              await resumeReport(_, args); 
            }
          });
        } else {
          return;
          // TODO : feedback on no urls parsed
        }
      });
    } catch (error) {
      throw new Error("handleCreateBulkAxeReport - error reading file.");
    }

    // do a health check
    // if the health check is OK
    // resume the report
    // if the health check is not OK
    // throw an error

    // TODO : u should log this error somewhere

    // Q: do we rate-limit the for-loop?
    // Q: is there any way to "multi-thread" this?
  } else {
    throw new Error("handleCreateBulkAxeReport - no file was provided.");
  }

  return; 
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

  return;
}

export const createSitemapCsv = async (_: any, args: Array<any>) => {
  if (!args[0]) {
    // need to communicate this to the front end
    throw new Error("handleCreateSitemapCsv - there was an error parsing the `@sitemap` that was returned.");
  }
  // make directory for domain
  try {
    await createUrlSet(args[0]);

    if (!args[1]) {
      throw new Error("handleCreateSitemapCsv - there was an error generating a report for the `@url` provided.");
    }

    let resume = true;
    if (args[3] !== undefined && args[3] === false) { resume = args[3]; }
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
  } catch (err) {
    console.log(`An error occurred: ${err}`);
  }

  return;
}

export const resumeReport = (_: any, args: Array<any>) => {
  return new Promise(async (resolve) => {
    const axeReporter = new AxeReporter();
    const url = args[0];
    if (args[1]) {
      await axeReporter.create(url, args[1]);
    } else {
      await axeReporter.create(url);
    }

    resolve;
  });
}
