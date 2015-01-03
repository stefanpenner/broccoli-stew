var broccoli = require('broccoli');
var Promise  = require('rsvp').Promise;
var walkSync = require('walk-sync');
var builders = [];

function tree(inputTree, filter) {
  var builder = new broccoli.Builder(inputTree);

  builders.push(builder);

  return builder.build().then(function(inputTree) {
    var paths = walkSync(inputTree.directory);

    if (filter) {
      return filter(paths, inputTree);
    }
    return paths;
  });
}

/**
 * Takes a test subject and returns the result of a
 * build with test subject applied to it.
 * 
 * @param  {Object} options
 * @property {Function} options.subject The function that is under test
 * @property {String} options.fixturePath The path to the fixtures being used for the test
 * @property {Function} [options.filter] Filtering function that is applied to result of the build.
 * @return {Promise}
 */
function makeTestHelper(options) {
  var cwd = process.cwd();
  return function() {
    var args = arguments;
    return new Promise(function(resolve) {
      process.chdir(options.fixturePath);
      resolve(tree(options.subject.apply(undefined, args), options.filter));
    }).finally(function() {
      process.chdir(cwd);
    });
  };
}

/**
 * Cleans up all the builders and optionally run a
 * callback.
 * @param  {Function} [cb]
 * @return {Promise}
 */
function cleanupBuilders(cb) {
  return Promise.all(builders.map(function(builder) {
    if (cb) {
      cb();
    }
    return builder.cleanup();
  }));
}

module.exports = {
  makeTestHelper: makeTestHelper,
  cleanupBuilders: cleanupBuilders
};
