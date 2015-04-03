var Filter = require('broccoli-filter');
var minimatch = require('minimatch');
var debug = require('debug')('broccoli-stew:map');
var MagicString = require('magic-string');

/**
 * maps files, allow for simple content mutation
 *
 * @example
 *
 * var map = require('broccoli-map').map;
 *
 * dist = map('lib', function(content, relativePath) {
 *   return 'new content';
 * }); 
 *
 * dist = map('lib', function(content, relativePath) {
 *   return 'prepend' + content;
 * });
 *
 * dist = map('lib', function(content, relativePath) {
 *   return mutateSomehow(content);
 * });
 *
 * dist = map('lib', '*.js', function(content, relativePath) {
 *   // mutate only files that match *.js
 *   // leave the rest alone
 *   return mutateSomehow(content);
 * });
 *
 */
function Mapper(inputTree, _filter, _fn) {
  if (!(this instanceof Mapper)) {
    return new Mapper(inputTree, _filter, _fn);
  }

  if (typeof _filter === 'function') {
    this.fn = _filter;
    this.filter = false;
  } else {
    this.filter = _filter;
    this.fn = _fn;
  }

  this._matches = Object.create(null);

  Filter.call(this, inputTree);
}

Mapper.prototype = Object.create(Filter.prototype);
Mapper.prototype.constructor = Mapper;
Mapper.prototype.canProcessFile = function(relativePath) {
  if (this.filter) {
    var can = this.match(relativePath);
    debug('canProcessFile with filter: %s, %o', relativePath, can);
    return can;
  }

  debug('canProcessFile', relativePath);
  return true;
}

Mapper.prototype.getDestFilePath = function(path) {
  return path;
};

Mapper.prototype.match = function(path) {
  var cache = this._matches[path];
  if (cache === undefined) {
    return this._matches[path] = minimatch(path, this.filter);
  } else {
    return cache;
  }
};

Mapper.prototype.processString = function (string, relativePath) {
  debug('mapping: %s', relativePath);
  return this.fn(
    new MagicString(string),
    relativePath
  );
};

module.exports = Mapper;
