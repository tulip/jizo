import { createReadStream } from "fs";
import { parse } from "csv-parse";

export const segmentUrlCsv = async (file: string, maxPerSegment: number = 10) => {
  return new Promise((resolve, reject) => {
    const urls: Array<Array<string>> = [[]];

    try {
      let segmentIndex = 0;
      let count = 0;

      createReadStream(file)
        .pipe(parse())
        .on("data", (row) => {
          if (count >= maxPerSegment) {
            count = 0;
            segmentIndex += 1;
            urls[segmentIndex] = [];
          }
          urls[segmentIndex].push(row[0]);

          count += 1;
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
