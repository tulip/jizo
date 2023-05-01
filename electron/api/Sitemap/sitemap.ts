import { appendFile } from "fs";
import { healthCheck } from "../../utils/web-helpers";
import { SitemapType } from "./types";
import * as cheerio from "cheerio";
import path from "node:path";
import fs from "fs";

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
};

const makeCsvFile = async () => {
  const outputDir = `${process.env.AXE_RESULT_DIR}/sitemaps/`;
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }
  const filename = `${
    Sitemap.host.length ? `${Sitemap.host.toKebabCase()}-` : ""
  }sitemap.csv`;
  console.log(
    `Generating a CSV file at the following location: ${outputDir}${filename}`
  );
  const strData = Sitemap.urls.map((row) => row).join("\n");
  try {
    appendFile(`${outputDir}${filename}`, strData, () => {
      console.log(`CSV file created at ${outputDir}${filename}`);
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
  console.log(slugs);

  let shouldBreak = 0;
  let sitemapUrl = "";
  let i = 0;
  for await (const slug of slugs) {
    // console.log('looking for sitemap at', sitemapUrl);
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

  console.log(`Found ${Sitemap.urls.length} urls`);
  makeCsvFile();

  return true;
};

// parse urlsets
// parse all loc
