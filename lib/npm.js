var path = require('path');
var Funnel = require('broccoli-funnel');
var resolve = require('./utils/require-resolve');

module.exports = {
  main: main
};

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
 * npm.entry('foo') => [ 'index.js' ]
 * npm.entry('foo', 'foo.js') => [ 'foo.js' ]
 * npm.entry('foo', 'foo/index.js') => [ 'foo/index.js' ]
 *
 * @param moduleName of module to get script from
 * @param newName relative path to rename the retrieved file
 * @returns {*}
 */
function main(packageName, outputFileName) {
  var resolvedPath = resolve(packageName);

  var pkg = require(path.join(resolvedPath, 'package.json'));

  if (pkg.main == null) {
    throw new Error('package.json for ' + packageName + ' does not have main property');
  }

  var mainPath = path.join(resolvedPath, pkg.main);

  var inputPath = path.dirname(mainPath);
  var fileName = path.basename(mainPath);

  return new Funnel(inputPath, {
    files: [fileName],
    getDestinationPath: function() {
      return outputFileName || fileName;
    }
  });
}
