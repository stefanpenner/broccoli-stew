var Funnel = require('broccoli-funnel');
var debug = require('debug')('broccoli-stew:mv');

/**
 * Moves an input tree to a different location.
 *
 * @example
 *
 * var mv = require('broccoli-stew').mv;
 *
 * var dist = 'lib';
 * dist = mv(dist, 'my-lib');
 * 
 * @param  {String|Object} input An input tree that is going to be moved.
 * @param  {String} to    Where you want to move the tree
 * @return {Object}       The tree at the new location
 */
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
