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
  var called = [];

  function mockDebugger() {
    return function() {
      called.push(arguments[0]);
    };
  }
  
  beforeEach(function() {
    process.env.DEBUG = 'test';
  });

  afterEach(function() {
    process.env.DEBUG = false;
    called = [];
    return cleanupBuilders();
  });

  var log = makeTestHelper({
    subject: _log,
    fixturePath: fixturePath
  });

  it('should print out the array of files in the tree', function() {
    return log(_find('node_modules/mocha'), {
      label: 'test',
      debugger: mockDebugger
    }).then(function(results) {
      var files = results.files;

      expect(called[0]).to.eql([
        'node_modules/mocha/mocha.css',
        'node_modules/mocha/mocha.js',
        'node_modules/mocha/package.json'
      ]);

      expect(files).to.eql([
        'node_modules/',
        'node_modules/mocha/',
        'node_modules/mocha/mocha.css',
        'node_modules/mocha/mocha.js',
        'node_modules/mocha/package.json'
      ]);
    });
  });

  it('should print out the tree of files to sdtout (as tree structure)', function() {
    return log(_find('node_modules/mocha'), {
      output: 'tree',
      label: 'test',
      debugger: mockDebugger
    }).then(function(results) {
      var files = results.files;

      expect(called[0]).to.eql('\n└── node_modules/\n'+
      '   └── node_modules/mocha/\n'+
      '      ├── node_modules/mocha/mocha.css\n'+
      '      ├── node_modules/mocha/mocha.js\n'+
      '      └── node_modules/mocha/package.json');
      expect(files).to.eql([
        'node_modules/',
        'node_modules/mocha/',
        'node_modules/mocha/mocha.css',
        'node_modules/mocha/mocha.js',
        'node_modules/mocha/package.json'
      ]);
    });
  });


  it('should be a pass through if not in process.env.DEBUG', function() {
    process.env.DEBUG = false;
    return log(_find('node_modules/mocha'), {
      label: 'baz',
      debugger: mockDebugger
    }).then(function() {
      expect(called).to.eql([]);
    });
  });
});
