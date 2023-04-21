export const sitemap = {
  findSitemap: async (url: string) => {
    if (!url) {
      throw new Error("sitemap - `@url` is required");
    }
  },
  handleSitemapFound: async () => {
    alert('sitemap found!');
  },
}
