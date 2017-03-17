'use strict';

const broccoli = require('broccoli');
const _find = require('../lib/find');
const _log = require('../lib/log');
const path = require('path');
const expect = require('chai').expect;
const sinon = require('sinon');
const helpers = require('broccoli-test-helpers');
const makeTestHelper = helpers.makeTestHelper;
const cleanupBuilders = helpers.cleanupBuilders;
const chalk = require('chalk');
const label = chalk.bold.cyan;
const co = require('co');

describe('log', function() {
  let fixturePath = path.join(__dirname, 'fixtures');

  let log = makeTestHelper({
    subject: _log,
    fixturePath: fixturePath
  });

  describe('console output', function() {
    afterEach(function() {
      console.log.restore();
      process.stdout.write.restore();
      return cleanupBuilders();
    });

    beforeEach(function() {
      sinon.spy(console, 'log');
      sinon.spy(process.stdout, 'write');
    });

    it('should print out the array of files in the tree', co.wrap(function* () {
      let results = yield log(_find('node_modules/mocha'));
      let files = results.files;

      expect(process.stdout.write.calledWith(JSON.stringify([
        'node_modules/',
        'node_modules/mocha/',
        'node_modules/mocha/mocha.css',
        'node_modules/mocha/mocha.js',
        'node_modules/mocha/package.json'
      ], null, 2)));

      expect(files).to.eql([
        'node_modules/',
        'node_modules/mocha/',
        'node_modules/mocha/mocha.css',
        'node_modules/mocha/mocha.js',
        'node_modules/mocha/package.json'
      ]);
    }));

    it('should print out the array of files with a label', co.wrap(function* () {
      let results = yield log(_find('node_modules/mocha'), {
        label: 'test'
      });
      let files = results.files;

      expect(console.log.calledOnce).to.be.ok;
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
    }));

    it('should print out a tree of files', co.wrap(function* () {
      let results = yield log(_find('node_modules/mocha'), { output: 'tree' });
      let files = results.files;

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
    }));

    it('should print out a tree of files with a label', co.wrap(function* () {
      let results = yield log(_find('node_modules/mocha'), {
        output: 'tree',
        label: 'test'
      });
      let files = results.files;

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
    }));
  });

  describe('debug output', function() {
    let called = [];

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

    it('shouldn\'t print if the label doesn\'t match DEBUG env', co.wrap(function* () {
      process.env.DEBUG = 'fhqwhgads';

      let results = yield log(_find('node_modules/mocha'), {
        label: 'test',
        debugOnly: true,
        debugger: mockDebugger
      });

      let files = results.files;

      expect(called.length).to.eql(0);
    }));

    it('should print out the array of files in the tree', co.wrap(function* () {
      let results = yield log(_find('node_modules/mocha'), {
        label: 'test',
        debugOnly: true,
        debugger: mockDebugger
      });
      let files = results.files;

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
    }));

    it('should print out the array of files in the tree for partial pattern match', co.wrap(function* () {
      process.env.DEBUG = '*test';

      let results = yield log(_find('node_modules/mocha'), {
        label: 'test',
        debugOnly: true,
        debugger: mockDebugger
      });

      let files = results.files;

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
    }));

    it('should print out the tree of files to sdtout (as tree structure)', co.wrap(function* () {
      let results = yield log(_find('node_modules/mocha'), {
        output: 'tree',
        debugOnly: true,
        label: 'test',
        debugger: mockDebugger
      });
      let files = results.files;

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
    }));

    it('should be a pass through if not in process.env.DEBUG', co.wrap(function* () {
      process.env.DEBUG = false;
      let results = yield log(_find('node_modules/mocha'), {
        label: 'baz',
        debugOnly: true,
        debugger: mockDebugger
      });
      expect(called).to.eql([]);
    }));
  });
});
