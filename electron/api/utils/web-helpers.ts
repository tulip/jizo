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
