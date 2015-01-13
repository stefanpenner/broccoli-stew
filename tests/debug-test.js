var _find = require('../lib/find');
var _debug = require('../lib/debug');
var expect = require('chai').expect;
var fs = require('fs-extra');
var path = require('path');
var helpers = require('broccoli-test-helpers');
var makeTestHelper = helpers.makeTestHelper;
var cleanupBuilders = helpers.cleanupBuilders;

describe('debug', function() {

  var fixturePath = path.join(__dirname, 'fixtures');

  afterEach(function() {
    return cleanupBuilders(function() {
      fs.removeSync(path.join(__dirname, 'fixtures/DEBUG-debug'));
    });
  });

  var debug = makeTestHelper({
    subject: _debug,
    fixturePath: fixturePath
  });

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
      var base = 'tests/fixtures/';
      var debugDir = path.join(process.cwd(), base + 'DEBUG-debug');
      var fixture = path.join(process.cwd(), base + 'node_modules/mocha/mocha.js');

      files.forEach(function(file) {
        expect(fs.existsSync(path.join(debugDir, file))).to.be.ok;
      });

      expect(fs.readFileSync(path.join(debugDir, 'node_modules/mocha/mocha.js'), {
        encoding: 'utf8'
      })).to.equal(fs.readFileSync(fixture, {encoding: 'utf8'}));
    });
  });
});
