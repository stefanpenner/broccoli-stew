var _rm = require('../lib/rm');
var _find = require('../lib/find');
var path = require('path');
var chai = require('chai');
var expect = chai.expect;
var helpers = require('broccoli-test-helpers');
var makeTestHelper = helpers.makeTestHelper;
var cleanupBuilders = helpers.cleanupBuilders;

describe('rm', function() {
  var fixturePath = path.join(__dirname, 'fixtures');

  afterEach(function() {
    return cleanupBuilders();
  });

  var rm = makeTestHelper({
    subject: _rm,
    fixturePath: fixturePath,
    filter: function(paths) {
      return paths.filter(function(path) { return !/\/$/.test(path); });
    }
  });

  it('rm file', function() {
    return rm('node_modules', 'mocha/mocha.css').then(function(results) {
      var files = results.files;

      expect(files).to.eql([
        'foo/foo.css',
        'mocha/mocha.js',
        'mocha/package.json',
      ]);
    });
  });

  it('rm files', function() {
    return rm('node_modules', 'mocha/mocha.css', 'mocha/package.json').then(function(results) {
      var files = results.files;

      expect(files).to.eql([
        'foo/foo.css',
        'mocha/mocha.js',
      ]);
    });
  });

  it('rm glob', function() {
    return rm('node_modules', 'mocha/mocha.*').then(function(results) {
      var files = results.files;

      expect(files).to.eql([
        'foo/foo.css',
        'mocha/package.json',
      ]);
    });
  });

  // this needs no tmp folder at '/' to work
  // it('rm glob at root', function() {
  //   return rm('.', 'node_modules/mocha/mocha.js').then(function(results) {
  //     var files = results.files;

  //     expect(files).to.not.include('node_modules/mocha/mocha.js');
  //     expect(files).to.include('node_modules/mocha/package.json');
  //     expect(files).to.include('node_modules/foo/foo.css');
  //   });
  // });

  // funnel doesn't really support this yet
  // it('rm glob at root, but negated', function() {
  //   return rm('.', 'node_modules/mocha/mocha.js', '!node_modules/mocha/mocha.js').then(function(results) {
  //   var files = results.files;
  //
  //     expect(files).to.include('node_modules/mocha/mocha.js');
  //     expect(files).to.include('node_modules/mocha/package.json');
  //     expect(files).to.include('node_modules/foo/foo.css');
  //   });
  // });
});
