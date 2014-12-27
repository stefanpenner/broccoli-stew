var Funnel = require('broccoli-funnel');
var debug = require('debug')('broccoli-stew:rename');

module.exports = function rename(tree, from, to) {
  var replacer;

  if (arguments.length === 2 && typeof from === 'function') {
    replacer = from;
  } else {
    replacer = function defaultReplace(relativePath) {
      return relativePath.replace(from, to);
    }
  }

  debug('%s from: %s to: %s', tree, from, to); 

  return new Funnel(tree, {
    getDestinationPath: replacer
  });
};
