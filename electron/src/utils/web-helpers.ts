export const healthCheck = async (url: string) => {
  if (!url) {
    throw new Error("healthCheck - `@url` is required");
  }

  const pattern = /^((http|https|ftp):\/\/)/;
  if (!pattern.test(url)) {
    url = `https://${url}`;
  }

  return fetch(url)
    .then((res) => {
      return res.ok;
    })
    .catch(() => {
      throw new Error("healthCheck - `@url` does not exist");
    });
};

export const findSiteMap = async (url: string) => {
  if (!url) {
    throw new Error("findSiteMap - `@url` is required");
  }

  const pattern = /^((http|https|ftp):\/\/)/;
  if (!pattern.test(url)) {
    url = `https://${url}`;
  }

  const slugs = ["sitemap", "sitemap.xml", "sitemap1.xml", "sitemap_index.xml"];

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
    };
  }

  console.log('looking for sitemap at', sitemapUrl);

  return fetch(sitemapUrl)
    .then((result) => {
      return result.text();
    });
};
