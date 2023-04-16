String.prototype.toKebabCase = function () {
  return String(this)
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
};

String.prototype.toCamelCase = function(separator = ' ') {
  return this.split(separator)
    .map((val, index) => {
      return index > 0 ? val.charAt(0).toUpperCase() + val.slice(1) : val;
    })
    .join('');
};

String.prototype.padWithChar = function(len: number, char: string = '-') {
  if (!len) return -1;
  if (char.length > 1) return -1;
  return 'asdf';
}

export {};
