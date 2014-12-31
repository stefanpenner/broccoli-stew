var broccoli = require('broccoli');
var find     = require('../lib/find');
var debug    = require('../lib/debug');
var expect   = require('chai').expect;
var fs       = require('fs-extra');
var path     = require('path');

describe('debug', function() {
  it('should have an array of files and directorys in the tree', function() {
    var tree = find('tests/fixtures/node_modules/mocha');
    var build = new broccoli.Builder(debug(tree, {name: 'debug'}));
    return build.build().then(function(files) {
      expect(files.directory).to.eql([
        'tests/',
        'tests/fixtures/',
        'tests/fixtures/node_modules/',
        'tests/fixtures/node_modules/mocha/',
        'tests/fixtures/node_modules/mocha/mocha.css',
        'tests/fixtures/node_modules/mocha/mocha.js',
        'tests/fixtures/node_modules/mocha/package.json'
      ]);
    });
  });
  it('should write files to disk in correct folder', function() {
    var tree = find('tests/fixtures/node_modules/mocha');
    var build = new broccoli.Builder(debug(tree, {name: 'debug'}));
    return build.build().then(function(files) {
      var debugDir = path.join(process.cwd(), 'DEBUG-debug');
      files.directory.forEach(function(file) {
        expect(fs.existsSync(path.join(debugDir, file))).to.be.ok;
      });
    });
  });
});