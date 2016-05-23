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

  var log = makeTestHelper({
    subject: _log,
    fixturePath: fixturePath
  });

  describe('console output', function() {
    afterEach(function() {
      console.log.restore();
      return cleanupBuilders();
    });

    beforeEach(function() {
      sinon.spy(console, 'log');
    });

    it('should print out the array of files in the tree', function() {
      return log(_find('node_modules/mocha')).then(function(results) {
        var files = results.files;

        expect(console.log.calledWith([
          'node_modules/',
          'node_modules/mocha/',
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

    it('should print out the array of files with a label', function() {
      return log(_find('node_modules/mocha'), {
        label: 'test'
      }).then(function(results) {
        var files = results.files;

        expect(console.log.calledTwice).to.be.ok;
        expect(console.log.withArgs('test')).to.be.ok;
        expect(console.log.withArgs([
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

    it('should print out a tree of files', function() {
      return log(_find('node_modules/mocha'), {
        output: 'tree'
      }).then(function(results) {
        var files = results.files;

        expect(console.log.calledOnce).to.be.ok;
        expect(console.log.withArgs('\n└── node_modules/\n'+
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

    it('should print out a tree of files with a label', function() {
      return log(_find('node_modules/mocha'), {
        output: 'tree',
        label: 'test'
      }).then(function(results) {
        var files = results.files;

        expect(console.log.calledTwice).to.be.ok;
        expect(console.log.withArgs('test'));
        expect(console.log.withArgs('\n└── node_modules/\n'+
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
  });

  describe('debug output', function() {
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

    it('shouldn\'t throw if there is no DEBUG env', function(done) {
      function runMe() {
        delete process.env.DEBUG;
        return log(_find('node_modules/mocha'), {
          label: 'test',
          debugOnly: true,
          debugger: mockDebugger
        }).then(function() {
          done();
        });
      }

      expect(runMe).to.not.throw(TypeError);
    });

    it('shouldn\'t print if the label doesn\'t match DEBUG env', function() {
      process.env.DEBUG = 'fhqwhgads';
      return log(_find('node_modules/mocha'), {
        label: 'test',
        debugOnly: true,
        debugger: mockDebugger
      }).then(function(results) {
        var files = results.files;
        expect(called.length).to.eql(0);
      });
    });

    it('should print out the array of files in the tree', function() {
      return log(_find('node_modules/mocha'), {
        label: 'test',
        debugOnly: true,
        debugger: mockDebugger
      }).then(function(results) {
        var files = results.files;

        expect(called[0]).to.eql([
          'node_modules/',
          'node_modules/mocha/',
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

    it('should print out the array of files in the tree for partial pattern match', function() {
      process.env.DEBUG = '*test';
      return log(_find('node_modules/mocha'), {
        label: 'test',
        debugOnly: true,
        debugger: mockDebugger
      }).then(function(results) {
        var files = results.files;

        expect(called[0]).to.eql([
          'node_modules/',
          'node_modules/mocha/',
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
        debugOnly: true,
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
        debugOnly: true,
        debugger: mockDebugger
      }).then(function() {
        expect(called).to.eql([]);
      });
    });

  });
});
