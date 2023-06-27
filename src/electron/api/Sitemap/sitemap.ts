import { writeFile } from "fs";
import { BrowserWindow } from "electron";
import fs from "fs";
import * as cheerio from "cheerio";

import { healthCheck } from "@utils/web-helpers";
import { SitemapType } from "@jizo/Sitemap/types";

const Sitemap: SitemapType = {
  host: "",
  urls: [],
};

/**
 * Simple fetch wrapper for each sitemap URL
 *
 * @param url string
 * @returns Promise<string>
 */
const readSitemap = async (url: string) => {
  if (await healthCheck(url)) {
    return fetch(url).then((result) => {
      return result.text();
    });
  }

  return false;
};

/**
 * Generates a CSV file from the sitemap URLs
 * @returns Promise<void>
 */
const makeCsvFile = async () => {
  const outputDir = `${process.env.AXE_RESULT_DIR}/sitemaps/`;
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }
  const filename = `${
    Sitemap.host.length ? `${Sitemap.host.toKebabCase()}-` : ""
  }sitemap.csv`;
  BrowserWindow.getAllWindows().forEach((win) => {
    win.webContents.send(
      "update-node-output",
      `Generating a CSV file at the following location: ${outputDir}${filename}`
    );
  });

  const strData = Sitemap.urls.map((row) => row).join("\n");

  try {
    writeFile(`${outputDir}${filename}`, strData, () => {
      BrowserWindow.getAllWindows().forEach((win) => {
        win.webContents.send(
          "update-node-output",
          `CSV file created at ${outputDir}${filename}`
        );
      });
    });
  } catch (err) {
    console.error(`CSV file could not be created at ${outputDir}${filename}`);
  }
};

/**
 * Checks the given URL for the existence of a sitemap
 *
 * @param url string
 * @returns Promise<SitemapType>
 */
export const findSiteMap = async (url: string) => {
  if (!url) {
    throw new Error("findSiteMap - `@url` is required");
  }

  const pattern = /^((http|https|ftp):\/\/)/;
  if (!pattern.test(url)) {
    url = `https://${url}`;
  }

  Sitemap.host = url;
  const slugs = process.env.SITEMAP_URLS!.split(",").map((item) => item.trim());

  let shouldBreak = 0;
  let sitemapUrl = "";
  let i = 0;
  for await (const slug of slugs) {
    i += 1;
    if (await healthCheck(`${url}/${slug}`)) {
      sitemapUrl = `${url}/${slug}`;
      shouldBreak += 1;
    }

    if (shouldBreak) {
      break;
    }

    if (i === slugs.length - 1) {
      return false;
    }
  }

  return fetch(sitemapUrl).then((result) => {
    return result.text();
  });
};

/**
 * Once a sitemap has been detected, the application needs to determine
 * what what shape the XML object is. Sitemaps can contain either a single
 * index with multiple sitemaps, or a single sitemap with multiple locations.
 *
 * For more information on sitemap formatting review the following links:
 *
 * https://en.wikipedia.org/wiki/Sitemaps#Element_definitions
 * https://www.sitemaps.org/protocol.html
 *
 * @param sitemap
 * @returns boolean
 */
export const createUrlSet = async (sitemap: string) => {
  Sitemap.urls = [];

  const document = cheerio.load(sitemap);
  const sitemaps: Array<cheerio.Element> = document("sitemap").toArray();
  const locations: Array<cheerio.Element> = document("loc").toArray();

  if (sitemaps.length) {
    const sitemapUrls: Array<string> = [];
    sitemaps.forEach((sitemap: cheerio.Element) => {
      sitemap.children.forEach((child) => {
        (child as cheerio.Element).name?.toLowerCase() === "loc" &&
          sitemapUrls.push(
            ((child as cheerio.Element).children[0] as unknown as Text).data
          );
      });
    });

    for (const sitemapUrl of sitemapUrls) {
      await readSitemap(sitemapUrl).then((sitemap) => {
        if (sitemap) {
          const doc = cheerio.load(sitemap);
          const locs: Array<cheerio.Element> = doc("loc").toArray();
          locs.forEach((loc: cheerio.Element) => {
            Sitemap.urls.push((loc.children[0] as unknown as Text).data);
          });
        }
      });
    }
  } else if (locations.length) {
    locations.forEach((loc: cheerio.Element) => {
      Sitemap.urls.push((loc.children[0] as unknown as Text).data);
    });
  }

  BrowserWindow.getAllWindows().forEach((win) => {
    win.webContents.send(
      "update-node-output",
      `Found ${Sitemap.urls.length} urls`
    );
  });
  await makeCsvFile();

  return true;
};
