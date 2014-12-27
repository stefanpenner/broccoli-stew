var Funnel = require('broccoli-funnel');
var debug = require('debug')('broccoli-stew:mv');

module.exports = function mv(input, to) {
  var options;

  if (typeof to === 'function') {
    options = { getDestinationPath: to };
  } else {
    options = { destDir: to };
  }

  debug('mv %s %o', input, options);

  return new Funnel(input, options);
};
