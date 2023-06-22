/**
 * For...Of loop which will wait for the previous iteration
 * before starting the next
 * 
 * @param arr Array<any>
 * @param callback Function
 */
export const asyncForOf = async (arr: Array<any>, callback: Function) => {
  for await (const obj of arr) {
    callback(obj);
  }
};
