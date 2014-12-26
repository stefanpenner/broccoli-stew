var Funnel = require('broccoli-funnel');

module.exports = function mv(input, to) {
  var options;

  if (typeof to === 'function') {
    options = { getDestinationPath: to };
  } else {
    options = { destDir: to };
  }

  return new Funnel(input, options);
};
