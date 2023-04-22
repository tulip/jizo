import { healthCheck } from "../../api/utils/web-helpers";
import { SitemapType } from "./types";
import * as cheerio from 'cheerio';

const Sitemap: SitemapType = {
    urls: [],
}

const readSitemap = async (url: string) => {
    if (await healthCheck(url)) {
        return fetch(url)
            .then((result) => {
                return result.text();
            });
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

    const slugs = ["sitemap.xml", "sitemap1.xml", "sitemap_index.xml"];

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
        };
    }

    return fetch(sitemapUrl)
        .then((result) => {
            return result.text();
        });
};

export const createUrlSet = async (sitemap: string) => {
    const document = cheerio.load(sitemap);
    const sitemaps: Array<cheerio.Element> = document('sitemap').toArray();
    const locations: Array<cheerio.Element> = document('loc').toArray();

    if (sitemaps.length) {
        const sitemapUrls: Array<string> = [];
        sitemaps.forEach((sitemap: cheerio.Element) => {
            sitemap.children.forEach((child) => {
                (child as cheerio.Element).name?.toLowerCase() === 'loc' &&
                    sitemapUrls.push(
                        ((child as cheerio.Element)
                            .children[0] as unknown as Text
                        ).data
                    );
            })
        });

        for (const sitemapUrl of sitemapUrls) {
            await readSitemap(sitemapUrl).then((sitemap) => {
                if (sitemap) {
                    const doc = cheerio.load(sitemap);
                    const locs: Array<cheerio.Element> = doc('loc').toArray();
                    locs.forEach((loc: cheerio.Element) => {
                        Sitemap.urls.push((loc.children[0] as unknown as Text).data);
                    })
                }
            });
        }
    } else if (locations.length) {
        locations.forEach((loc: cheerio.Element) => {
            Sitemap.urls.push((loc.children[0] as unknown as Text).data);
        });
    };
    
    console.log(`Found ${Sitemap.urls.length} urls`);
    
    return true;
}

// parse urlsets
// parse all loc

