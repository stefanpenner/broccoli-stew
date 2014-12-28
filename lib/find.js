'use strict';

var Funnel = require('broccoli-funnel');
var decompose = require('./utils/decompose');
var debug = require('debug')('broccoli-stew:find');

/**
 * @example
 *
 * given:
 *   root/package.json
 *   root/lib/bar.js
 *   root/lib/foo.js
 *   root/lib/bar.coffee
 *   root/lib/bar.txt
 *
 * var tree = 'root';
 *
 * find(tree) => identity;
 *
 * find('root/lib/*.js') => [
 *   'root/lib/bar.js'
 *   'root/lib/foo.js'
 * ];
 *
 * find(tree, '*.js') => [
 *   'lib/bar.js'
 *   'lib/foo.js'
 * ];
 *
 * find(tree, 'lib/*.{coffee.js}') => [
 *   'lib/bar.js',
 *   'lib/bar.coffee',
 *   'lib/foo.js',
 * ];
 *
 * find(tree, function(path) {
 *   return /*.js/.test(path);
 * }) => [
 *   'lib/bar.js',
 *   'lib/foo.js',
 * ];
 *
 * find(tree, { include: ['*.js'], exclude: [ 'bar.*' ]) => [
 *  'lib/foo.js'
 * ]);
 *
 * find(tree, { include: [/*.js/], exclude: [ 'bar.*' ]) => [
 *  'lib/foo.js'
 * ]);
 * @name find
 * @argument tree
 * @argument filter
 */
module.exports = function find(tree, _options) {
  var options, root;

  if (arguments.length === 1) {
    var decomposition = decompose(tree);

    if (decomposition.include === undefined &&
        decomposition.exclude === undefined) {
      return decomposition.root;
    }

    root = decomposition.root;

    options = {};
    options.destDir = root;
    options.include = decomposition.include;
    options.exclude = decomposition.exclude;
  } else {
    root = tree;
    if (typeof _options === 'string') {
      options = {};
      var pattern = decompose.expandSingle(_options);
      var lastChar = pattern.charAt(pattern.length - 1);

      if (lastChar === '*' || lastChar !== '/') {
        options.include = [pattern];
      } else {
        options.include = [pattern + '**/*'];
      }
    } else {
      options = _options;
    }
  }

  debug('%s include: %o exclude: %o', root, options.include, options.exclude);
  return new Funnel(root, options);
};
