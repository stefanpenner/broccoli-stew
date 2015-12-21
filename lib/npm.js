var path = require('path');
var Funnel = require('broccoli-funnel');
var resolve = require('./utils/require-resolve');

/**
 * Return tree containing the file referenced in package.json.
 * Optionally, you can rename the file in the returned tree.
 *
 * given a module called foo with the following package.json
 * {
 *   name: "foo",
 *   main: "lib/index.js"
 * }
 *
 * npm.main('foo') => [ 'index.js' ]
 * npm.main('foo', 'foo.js') => [ 'foo.js' ]
 * npm.main('foo', 'foo/index.js') => [ 'foo/index.js' ]
 *
 * @param moduleName of module to get script from
 * @param newName relative path to rename the retrieved file
 * @returns {*}
 */
module.exports.main = function main(packageName, outputFileName) {
  var mainPath = resolve(packageName);

  var inputPath = path.dirname(mainPath);
  var fileName = path.basename(mainPath);

  return new Funnel(inputPath, {
    files: [fileName],
    getDestinationPath: function() {
      return outputFileName || fileName;
    }
  });
}
