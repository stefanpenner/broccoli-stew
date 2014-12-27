var Funnel = require('broccoli-funnel');
var decompose = require('./utils/decompose');
var debug = require('debug')('broccoli-stew:find');

module.exports = function find(path, _options) {
  var decomposition = decompose(path);
  var options = _options || {};

  if (arguments.length === 1 &&
      decomposition.include === undefined &&
      decomposition.exclude === undefined) {
    return decomposition.root;
  }

  var root = decomposition.root;
  var include = options.only   || decomposition.include;
  var exclude = options.except || decomposition.exclude;

  debug('%s include: %o exclude: %o', root, include, exclude);

  return new Funnel(root, {
    include: include,
    exclude: exclude
  });
};
