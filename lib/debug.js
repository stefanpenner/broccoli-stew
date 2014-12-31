var walkSync  = require('walk-sync');
var path      = require('path');
var fs        = require('fs-extra');
var DIR_REGEX = /\/$/;

/**
 * Writes the passed tree to disk at the root of
 * the project.
 * @param  {String|Object} tree    The input tree to debug.
 * @param  {Object} options
 * @property {String} options.name The name of directory you want to write to
 */
module.exports = function(tree, options) {
  return {
    read: function(readTree) {
      return readTree(tree).then(function(dir) {
        if (!options.name) {
          throw Error('Must pass folder name to write to.');
        }

        var paths = walkSync(dir);
        var debugDirPath = path.join(process.cwd(), 'DEBUG-' + options.name);

        fs.mkdirsSync(debugDirPath);
        paths.forEach(function(_path) {
          if (DIR_REGEX.test(_path)) {
            fs.mkdirsSync(path.join(debugDirPath, _path));
          } else {
            var contents = fs.readFileSync(path.join(dir, _path), {encoding: 'utf8'});
            fs.writeFileSync(path.join(debugDirPath, _path), contents);
          }
        });

        return paths;
      });
    },
    cleanup: function() {}
  }
};