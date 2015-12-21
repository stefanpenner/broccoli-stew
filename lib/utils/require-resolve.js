var resolve = require('resolve');

module.exports = function requireResolve(p) {
  return resolve.sync(p, { basedir: process.cwd() });
};