/**
 * Returns a new tree that causes a callback to be called before every build of
 * the passed inputTree
 *
 * @example
 *
 * var tree = find('zoo/animals/*.js');
 *
 * tree = stew.beforeBuild(tree, function() {
 *   // Whatever debugging you'd like to do before the build is run, maybe set
 *   // timer?
 * });
 *
 *
 * @param  {String|Object} tree    The desired input tree
 * @param  {Function} callback     The function to call before every time the tree is built
 */
function beforeBuild(tree, cb) {
  if (tree === null || tree === undefined) {
    throw new Error('No inputTree passed to stew.beforeBuild');
  }

  if (typeof cb !== 'function') {
    throw new Error('No callback passed to stew.beforeBuild');
  }

  return {
    read: function(readTree) {
      cb();
      return readTree(tree);
    },

    cleanup: function() {}
  };
}

module.exports = beforeBuild;
