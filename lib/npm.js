var path = require('path');
var Funnel = require('broccoli-funnel');

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
   var resolvedPath = require.resolve(packageName);

   var inputPath = path.dirname(resolvedPath);
   var fileName = path.basename(resolvedPath);

   return new Funnel(inputPath, {
     files: [fileName],
     getDestinationPath: function() {
       return outputFileName || fileName;
     }
   });
 }
