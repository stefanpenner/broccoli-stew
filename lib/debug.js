var path      = require('path');
var fs        = require('fs-extra');
var map       = require('./map');

/**
 * Writes the passed tree to disk at the root of
 * the project.
 * @param  {String|Object} tree    The input tree to debug.
 * @param  {Object} options
 * @property {String} options.name The name of directory you want to write to
 */
module.exports = function(tree, options) {
  return map(tree, function(contents, _path) {
    if (!options.name) {
      throw Error('Must pass folder name to write to.');
    }

    var debugDir = 'DEBUG-' + options.name;
    var cwd = process.cwd();

    var debugDirPath = path.join(process.cwd(), debugDir);
    var parts = _path.split('/');
    var debugFileDirs = parts.splice(0, parts.length - 1).join('/');
    fs.mkdirsSync(debugDirPath);
    process.chdir(debugDirPath);
    fs.mkdirsSync(path.join(process.cwd(), debugFileDirs));
    fs.writeFileSync(path.join(process.cwd(), _path), contents);
    process.chdir(cwd);
  });
};