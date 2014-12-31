var broccoli = require('broccoli');
var _find     = require('../lib/find');
var _debug    = require('../lib/debug');
var expect   = require('chai').expect;
var fs       = require('fs-extra');
var path     = require('path');
var Promise  = require('rsvp').Promise;
var walkSync = require('walk-sync');

describe.only('debug', function() {

  var fixturePath = path.join(__dirname, 'fixtures');
  var builders = [];

  afterEach(function() {
    return Promise.all(builders.map(function(builder) {
      fs.removeSync(path.join(__dirname, 'fixtures/DEBUG-debug'));
      return builder.cleanup();
    }));
  });


  function tree(inputTree) {
    builder = new broccoli.Builder(inputTree);

    builders.push(builder);

    return builder.build().then(function(inputTree) {
      return walkSync(inputTree.directory);
    });
  }

  function debug() {
    var cwd = process.cwd();
    var args = arguments;

    return new Promise(function(resolve) {
      process.chdir(fixturePath);
      resolve(tree(_debug.apply(undefined, args)))
    }).finally(function() {
      process.chdir(cwd);
    });
  }

  it('should have an array of files and directorys in the tree', function() {
    return debug(_find('node_modules/mocha'), {name: 'debug'}).then(function(files) {
      expect(files).to.eql([
        'node_modules/',
        'node_modules/mocha/',
        'node_modules/mocha/mocha.css',
        'node_modules/mocha/mocha.js',
        'node_modules/mocha/package.json'
      ]);
    });
  });

  it('should write files to disk in correct folder', function() {
    return debug(_find('node_modules/mocha'), {name: 'debug'}).then(function(files) {
      var debugDir = path.join(process.cwd(), 'tests/fixtures/DEBUG-debug');
      files.forEach(function(file) {
        expect(fs.existsSync(path.join(debugDir, file))).to.be.ok;
      });
    });
  });
});