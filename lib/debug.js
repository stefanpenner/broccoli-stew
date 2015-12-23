var path      = require('path');
var fs        = require('fs-extra');
var sanitize  = require('sanitize-filename');
var map       = require('./map');

/**
 * Writes the passed tree to disk at the root of
 * the project.
 *
 * @example
 * var myTree = someBroccoliPlugin('lib');
 *
 * myTree = debug(myTree);
 *
 * module.exports = myTree;
 *
 * @param  {String|Object} tree    The input tree to debug.
 * @param  {Object} options
 * @property {String} options.name The name of directory you want to write to
 */
module.exports = function debug(tree, options) {
  return map(tree, function(contents, relativePath) {
    if (typeof options === 'string') {
      options = {
        name: options
      };
    }

    if (!options) {
      options = {};
    }

    if (!options.name && tree) {
      options.name = sanitize(tree.toString());
    }

    if (!options.name) {
      throw Error('Must pass folder name to write to. stew.debug(tree, { name: "foldername" })');
    }

    var debugDir;

    if (options.dir) {
      debugDir = options.dir + '/' + options.name;
    } else {
      debugDir = './DEBUG-' + options.name;
    }

    var debugPath = path.resolve(path.join(debugDir, relativePath));

    fs.mkdirsSync(path.dirname(debugPath));
    fs.writeFileSync(debugPath, contents);

    return contents;
  });
};
