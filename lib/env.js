module.exports = function env(/* envName..., cb */) {
  var length = arguments.length;
  var envs = Array.prototype.slice.call(arguments).slice(0, length - 1);
  var cb = arguments[length - 1];

  var currentEnv = process.env.BROCCOLI_ENV || 'development';

  var match = envs.map(function(name) {
    if (name.charAt(0) === '!') {
      return name.substring(1) !== currentEnv;
    } else {
      return name == currentEnv;
    }
  }).filter(Boolean).length > 0;

  if (match) {
    return cb();
  }
}
