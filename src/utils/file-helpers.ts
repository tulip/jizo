import { createReadStream } from "fs";
import { parse } from "csv-parse";

export const parseUrlCsv = async (file: string) => {
  return new Promise((resolve, reject) => {
    const urls: Array<string> = [];

    try {
      createReadStream(file)
        .pipe(parse())
        .on("data", (row) => {
          urls.push(row[0]);
        })
        .on("end", () => {
          resolve(urls);
        })
        .on("error", reject);
    } catch (error) {
      throw new Error("@parseUrlCsv - error reading file.");
    }
  });
}
