
/*
 * Split the string at the first occurrence of sep, and return a 3-items array containing the part before the
 * separator, the separator itself, and the part after the separator. If the separator is not found, return
 * a 3-item array containing the string itself, followed by two empty strings.
 */
module.exports.partition = function (s, sep) {
  'use strict';
  let p = s.indexOf(sep);
  if (p === -1) {
    return [s, '', ''];
  } else {
    return [s.substr(0, p), sep, s.substr(p + sep.length)];
  }
};

module.exports.decodePackageJsonTask = function (done) {
  'strict';
  const p = '../package.json';
  let packagejson = require(p);
  for (let [k, v] of Object.entries(packagejson)) {
    console.log(`# ${k}`);
    if (['dependencies', 'devDependencies'].includes(k)) {
      let devopt = '';
      if (k === 'devDependencies') {
        devopt = ' --dev';
      }
      for (let [kk, vv] of Object.entries(v)) {
        console.log(`yarn add${devopt} ${kk}`);
      }
    }
  }
  done();
};

