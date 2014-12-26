var Funnel = require('broccoli-funnel');

module.exports = function rename(tree, from, to) {
  var replacer;

  if (arguments.length === 2 && typeof from === 'function') {
    replacer = from;
  } else {
    replacer = defaultReplace;
  }

  return new Funnel(tree, {
    getDestinationPath: replacer
  });

  function defaultReplace(relativePath) {
    return relativePath.replace(from, to);
  }
};
