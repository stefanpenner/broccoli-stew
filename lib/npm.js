var p = require('path');
var find = require('./find');
var rename = require('./rename');

module.exports = {
  entry: entry,
  entryPath: entryPath
};

/**
 * Return tree containing the file referenced in package.json.
 * Optionally, you can rename the file in the returned tree.
 * @param moduleName of module to get script from
 * @param newName relative path to rename the retrieved file
 * @returns {*}
 */
function entry(moduleName, newName) {
  var entry = entryPath(moduleName);

  var foundTree = find(expand(entry));
  if (newName) {
    return rename(foundTree, function(){
      return newName;
    })
  }
  return foundTree;
}

/**
 * Return path to script referenced in package.json#main
 * @param moduleName
 * @returns {string}
 */
function entryPath(moduleName) {
  var modulePath = resolve(moduleName);
  var pkg = require(p.join(modulePath, 'package.json'));
  if (pkg.main == null) {
    throw "package.json for " + moduleName + " does not have main property";
  }
  return p.join(modulePath, pkg.main);
}

function expand(input) {
  var path = p.dirname(input);
  var file = p.basename(input);

  return path + '/{' + file + '}';
}

var resolve = function (path) {
  return require.resolve(path);
};