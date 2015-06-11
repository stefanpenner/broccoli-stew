'use strict';

var Funnel = require('broccoli-funnel');
var decompose = require('./utils/decompose');
var debug = require('debug')('broccoli-stew:find');
var merge = require('broccoli-merge-trees');

/**
 * Allows you to find files in a tree via a glob patterns.
 *
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
 *
 * also given:
 *   other/foo/bar.jcs
 *   other/foo/bar.css
 *   other/foo/package.json
 *
 * other = 'other';
 *
 * find([
 *  root,
 *  other
 *]) => [
 *   package.json
 *   lib/bar.js
 *   lib/foo.js
 *   lib/bar.coffee
 *   lib/bar.txt
 *   foo/bar.jcs
 *   foo/bar.css
 * ]
 **
 * find([
 *  root,
 *  other
 * ],'**//*.js') => [
 *   lib/bar.js
 *   lib/foo.js
 * ]
 *
 * find([
 *  root,
 *  other
 * ],{ overrite: true }') => [
 *   lib/bar.js
 *   lib/foo.js
 * ]
 *
 * @name find
 * @argument tree
 * @argument filter
 */
module.exports = function find(tree, options) {
  var arity = arguments.length;

  if (Array.isArray(tree)) {
    var mergeOptions;
    if (options && typeof options === 'object' && options.overwrite) {
      mergeOptions = {
        overwrite: true
      };
    }
    return merge(tree.map(invokeFindWithCorrectArity(options, arity)), mergeOptions);
  } else {
    return invokeFindWithCorrectArity(options, arity)(tree);
  }
};

function invokeFindWithCorrectArity(options, arity) {
  return function(tree) {
    return arity > 1 ? _find(tree, options) : _find(tree);
  };
}

function _find(tree, _options) {
  var options = {};
  var root = tree;

  if (arguments.length === 1 && typeof root === 'string') {
    var decomposition = decompose(root);

    if (decomposition.include === undefined &&
        decomposition.exclude === undefined) {
      return decomposition.root;
    }

    root = decomposition.root;

    options.destDir = root;
    options.include = decomposition.include;
    options.exclude = decomposition.exclude;
  } else if (arguments.length > 1) {

    if (typeof _options === 'string') {

      var pattern = decompose.expandSingle(_options);
      var lastChar = pattern.charAt(pattern.length - 1);

      if (typeof root === 'string') {
        options.destDir = root;
      } else if (root.inputTree && typeof root.inputTree.destDir === 'string') {
        options.destDir = root.inputTree.destDir;
      }

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
}
