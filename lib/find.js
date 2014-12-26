var Funnel = require('broccoli-funnel');

module.exports = function find(path, _options) {
  if (arguments.length === 1) {
    return path;
  }

  var options = _options || {};

  return new Funnel(path, {
    include: options.only,
    exclude: options.except
  });
};
