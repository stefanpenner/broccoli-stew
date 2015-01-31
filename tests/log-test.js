var broccoli = require('broccoli');
var _find = require('../lib/find');
var _log = require('../lib/log');
var path = require('path');
var expect = require('chai').expect;
var sinon = require('sinon');
var helpers = require('broccoli-test-helpers');
var makeTestHelper = helpers.makeTestHelper;
var cleanupBuilders = helpers.cleanupBuilders;
var chalk = require('chalk');
var label = chalk.bold.cyan;

describe('log', function() {
  var fixturePath = path.join(__dirname, 'fixtures');
  var builders = [];

  beforeEach(function() {
    sinon.spy(console, 'log');
  });

  afterEach(function() {
    console.log.restore();
    return cleanupBuilders();
  });

  var log = makeTestHelper({
    subject: _log,
    fixturePath: fixturePath
  });

  it('should print out the array of files in the tree', function() {
    return log(_find('node_modules/mocha')).then(function(results) {
      var files = results.files;

      expect(console.log.calledWith([
        'node_modules/mocha/mocha.css',
        'node_modules/mocha/mocha.js',
        'node_modules/mocha/package.json'
      ])).to.be.ok;
      expect(files).to.eql([
        'node_modules/',
        'node_modules/mocha/',
        'node_modules/mocha/mocha.css',
        'node_modules/mocha/mocha.js',
        'node_modules/mocha/package.json'
      ]);
    });
  });

  it('should print out the tree of files to sdtout', function() {
    return log(_find('node_modules/mocha'), {output: 'tree'}).then(function(results) {
      var files = results.files;

      expect(console.log.calledWith('\n└── node_modules/\n'+
      '   └── node_modules/mocha/\n'+
      '      ├── node_modules/mocha/mocha.css\n'+
      '      ├── node_modules/mocha/mocha.js\n'+
      '      └── node_modules/mocha/package.json')).to.be.ok;
      expect(files).to.eql([
        'node_modules/',
        'node_modules/mocha/',
        'node_modules/mocha/mocha.css',
        'node_modules/mocha/mocha.js',
        'node_modules/mocha/package.json'
      ]);
    });
  });

  it('should print out the tree of files to sdtout', function() {
    return log(_find('node_modules/mocha'), {output: 'tree', label: 'log'}).then(function(results) {
      var files = results.files;

      expect(console.log.calledWith(label('log') + '\n└── node_modules/\n'+
      '   └── node_modules/mocha/\n'+
      '      ├── node_modules/mocha/mocha.css\n'+
      '      ├── node_modules/mocha/mocha.js\n'+
      '      └── node_modules/mocha/package.json')).to.be.ok;
    });
  });

  it('should print out the array of files in the tree', function() {
    return log(_find('node_modules/mocha'), {label: 'log'}).then(function(results) {
      var files = results.files;

      expect(console.log.calledWith(label('log'))).to.be.ok;
      expect(console.log.calledWith([
        'node_modules/mocha/mocha.css',
        'node_modules/mocha/mocha.js',
        'node_modules/mocha/package.json'
      ])).to.be.ok;
    });
  });

  it('should print out the array of files in the tree (with a string options label)', function() {
    return log(_find('node_modules/mocha'), 'the-label').then(function(results) {
      var files = results.files;

      expect(console.log.calledWith(label('the-label'))).to.be.ok;
      expect(console.log.calledWith([
        'node_modules/mocha/mocha.css',
        'node_modules/mocha/mocha.js',
        'node_modules/mocha/package.json'
      ])).to.be.ok;
    });
  });
});
