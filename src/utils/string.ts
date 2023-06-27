String.prototype.toKebabCase = function () {
  // for strings like URL's or paths, sometimes we need to nuke
  // double-whacks, and other repeated non-alpha characters
  let str = String(this);
  while (str.match(/\W\W/g)) {
    str = str.replace(/\W\W/g, '-');
  }

  return String(str)
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

export {};
