var walkSync   = require('walk-sync');
var Promise    = require('rsvp').Promise;
var chalk      = require('chalk');
var DIR_REGEX  = /\/$/;

/**
 * Logs out files in the passed tree.
 *
 * @example
 *
 * var tree = find('zoo/animals/*.js');
 *
 * log(tree);
 * // [cat.js, dog.js]
 *
 * log(tree, {output: 'tree'});
 * // /Users/chietala/workspace/broccoli-stew/tmp/funnel-dest_Q1EeTD.tmp
 * // ├── cat.js
 * // └── dog.js
 *
 *
 * @param  {String|Object} tree    The input tree to debug
 * @param  {Object} [options]
 * @property {String} [options.output] Print to stdout as a tree
 * @property {String} [options.label] Will label the the tree in stdout
 */
module.exports = function log(tree, options) {
  options = options || {};
  return {
    read: function(readTree) {
      return readTree(tree).then(function(dir) {
        var label = chalk.bold.cyan;

        if (options.output === 'tree') {
          var printTree = treeOutput(dir);

          if (options.label) {
            console.log(label(options.label) + printTree.stdout);
          } else {
            console.log(printTree.stdout);
          }

        } else {
          var files = walkSync(dir).filter(function(path) {
            return !DIR_REGEX.test(path);
          });

          if (options.label) {
            console.log(label(options.label));
          }

          console.log(files);
        }

        return dir;
      }).catch(function(err) {
        console.log(err);
        throw err;
      });
    },
    cleanup: function() {}
  };
};

function treeOutput(dir) {
  var end = '└── ',
      ls = '├── ',
      newLine = '\n',
      stdout = '';

  function tab(size) {
    var _tab = '   ';
    return new Array(size).join(_tab);
  }

  var files = walkSync(dir).map(function(path, i, arr) {
    var depth = path.split('/').length;
    if (DIR_REGEX.test(path)) {
      stdout += (newLine + tab(depth - 1) + end + path);
    } else {
      stdout += (newLine + tab(depth));
      if (DIR_REGEX.test(arr[i + 1]) || i === (arr.length - 1)) {
        stdout += (end + path);
      } else {
        stdout += (ls + path);
      }
    }
    return path;
  }).filter(function(path) { return !DIR_REGEX.test(path); });

  return {
    stdout: stdout,
    files: files
  };
}
