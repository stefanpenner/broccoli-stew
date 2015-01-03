var broccoli = require('broccoli');
var _find = require('../lib/find');
var _log = require('../lib/log');
var Promise  = require('rsvp').Promise;
var path = require('path');
var expect = require('chai').expect;
var walkSync = require('walk-sync');

describe('log', function() {
  var fixturePath = path.join(__dirname, 'fixtures');
  var builders = [];

  afterEach(function() {
    return Promise.all(builders.map(function(builder) {
      return builder.cleanup();
    }));
  });

  function tree(inputTree) {
    var builder = new broccoli.Builder(inputTree);

    builders.push(builder);

    return builder.build().then(function(inputTree) {
      return inputTree;
    });
  }

  function log() {
    var cwd = process.cwd();
    var args = arguments;

    return new Promise(function(resolve) {
      process.chdir(fixturePath);
      resolve(tree(_log.apply(undefined, args)));
    }).finally(function() {
      process.chdir(cwd);
    });
  }

  it('should print out the array of files in the tree', function() {
    return log(_find('node_modules/mocha')).then(function(files) {
      expect(files.directory).to.eql([
        'node_modules/mocha/mocha.css',
        'node_modules/mocha/mocha.js',
        'node_modules/mocha/package.json'
      ]);
    });
  });

  it('should print out the tree of files to sdtout', function() {
    return log(_find('node_modules/mocha'), {output: 'tree'}).then(function(files) {
      expect(files.directory).to.eql([
        'node_modules/mocha/mocha.css',
        'node_modules/mocha/mocha.js',
        'node_modules/mocha/package.json'
      ]);
    });
  });
});
