var p = require('path');
var find = require('./find');
var rename = require('./rename');

module.exports.entry = function main(moduleName, newName) {
  var modulePath = require.resolve(moduleName);

  var pkg = require(p.join(modulePath, 'package.json'));
  if (pkg.main == null) {
    throw "package.json for " + moduleName + " does not have main property";
  }
  var entry = p.join(modulePath, pkg.main);

  var foundTree = find(expand(entry));
  if (newName) {
    return rename(foundTree, function(){
      return newName;
    })
  }
  return foundTree;
};

function expand(input) {
  var path = p.dirname(input);
  var file = p.basename(input);

  return path + '/{' + file + '}';
}