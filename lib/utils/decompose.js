var Minimatch = require('minimatch').Minimatch;

function isExpansion(entry) {
  return /[\{\}]/.test(entry);
}

module.exports = function(path) {
  var match = new Minimatch(path);

  var set = match.set;
  var position = 0;
  var root = [], include = [];
  var matcher = false;

  path.split('/').forEach(function(entry, index) {
    matcher = matcher || typeof set[0][index]!== 'string';

    if (!matcher) {
      var prev = set[0][index];
      if (isExpansion(prev)) {
        matcher = true;
      } else {
        var x;
        for (var i = 0; i < set.length; i++) {
          x = set[i][index];
          if (prev !== x || isExpansion(entry)) {
            matcher = true;
            break;
          }
        }
      }
    }
      
    if (index === 0 && matcher) {
      throw Error("top level glob or expansion not currently supported: `" + path + "`");
    } else if (matcher) {
      include.push(entry);
    } else {
      root.push(entry);  
    }
  });

  return {
    root:  root.join('/'),
    include: [include.join('/')].filter(Boolean),
    exclude: []
  };
};
