var broccoli = require('broccoli');
var _mv = require('../lib/mv');
var _find = require('../lib/find');
var path = require('path');
var walkSync = require('walk-sync');
var Promise = require('rsvp').Promise;
var chai = require('chai');
var expect = chai.expect;

describe('mv', function() {
  var fixturePath = path.join(__dirname, 'fixtures');
  var builders = [];

  afterEach(function() {
    return Promise.all(builders.map(function(builder) {
      return builder.cleanup();
    }));
  });

  function tree(inputTree) {
    builder = new broccoli.Builder(inputTree);

    builders.push(builder);

    return builder.build().then(function(inputTree) {
      return walkSync(inputTree.directory).
        sort().
        filter(function(path) {
          return !/\/$/.test(path);
      });
    });
  }

  function mv() {
    var cwd = process.cwd();
    var args = arguments;

    return new Promise(function(resolve) {
      process.chdir(fixturePath);
      resolve(tree(_mv.apply(undefined, args)))
    }).finally(function() {
      process.chdir(cwd);
    });
  }

  describe('tree + destination', function() {
    it('move into node_modules', function() {
      return mv(_find('node_modules'), 'toy_modules').then(function(files) {
        expect(files.sort()).to.eql([
          'toy_modules/node_modules/foo/foo.css',
          'toy_modules/node_modules/mocha/mocha.css',
          'toy_modules/node_modules/mocha/mocha.js',
          'toy_modules/node_modules/mocha/package.json',
        ]);
      });
    });

    it('find node_modules/mocha and move whole tree into toy_modules', function() {
      return mv(_find('node_modules/mocha'), 'toy_modules').then(function(files) {
        expect(files.sort()).to.eql([
          'toy_modules/node_modules/mocha/mocha.css',
          'toy_modules/node_modules/mocha/mocha.js',
          'toy_modules/node_modules/mocha/package.json',
        ]);
      });
    });
  });

  describe('tree + from + destination', function() {
    it('move subgraph with matcher', function() {
      return mv(_find('node_modules'), 'node_modules/', 'toy_modules/').then(function(files) {
        expect(files.sort()).to.eql([
          'toy_modules/foo/foo.css',
          'toy_modules/mocha/mocha.css',
          'toy_modules/mocha/mocha.js',
          'toy_modules/mocha/package.json',
        ]);
      });
    });

    it('move file with matcher (exact match)', function() {
      return mv(_find('node_modules'), 'node_modules/mocha/mocha.css', 'toy_modules/foo.css').then(function(files) {
        expect(files.sort()).to.eql([
          'node_modules/foo/foo.css',
          'node_modules/mocha/mocha.js',
          'node_modules/mocha/package.json',
          'toy_modules/foo.css',
        ]);
      });
    });

    it('move files with matcher (expansion)', function() {
      return mv(_find('node_modules'), 'node_modules/mocha/mocha.{css,js}', 'toy_modules/').then(function(files) {
        expect(files.sort()).to.eql([
          'node_modules/foo/foo.css',
          'node_modules/mocha/package.json',
          'toy_modules/mocha.css',
          'toy_modules/mocha.js',
        ]);
      });
    });

    it('move files with matcher (glob + expansion)', function() {
      return mv(_find('node_modules'), 'node_modules/*/mocha.{css,js}', 'toy_modules/').then(function(files) {
        expect(files.sort()).to.eql([
          'node_modules/foo/foo.css',
          'node_modules/mocha/package.json',
          'toy_modules/mocha.css',
          'toy_modules/mocha.js',
        ]);
      });
    });

    it('move files with matcher (glob + expansion) another', function() {
      return mv(_find('node_modules'), 'node_modules/mocha/mocha.{css,js}', 'toy_modules/').then(function(files) {
        expect(files.sort()).to.eql([
          'node_modules/foo/foo.css',
          'node_modules/mocha/package.json',
          'toy_modules/mocha.css',
          'toy_modules/mocha.js',
        ]);
      });
    });

    it('move files with matcher (glob + expansion) another one', function() {
      return mv(_find('node_modules'), 'node_modules/mocha/*.{css,js}', 'toy_modules/').then(function(files) {
        expect(files.sort()).to.eql([
          'node_modules/foo/foo.css',
          'node_modules/mocha/package.json',
          'toy_modules/mocha.css',
          'toy_modules/mocha.js',
        ]);
      });
    });

    it('move files with matcher (glob + expansion) another another one', function() {
      return mv(_find('node_modules'), 'node_modules/*/*.{css,js}', 'toy_modules/').then(function(files) {
        expect(files.sort()).to.eql([
          'node_modules/mocha/package.json',
          'toy_modules/foo.css',
          'toy_modules/mocha.css',
          'toy_modules/mocha.js',
        ]);
      });
    });

 
    it('move subgraph with matcher!!', function() {
      return mv(_find('node_modules'), 'node_modules/mocha/', 'toy_modules/').then(function(files) {
        expect(files.sort()).to.eql([
          'node_modules/foo/foo.css',
          'toy_modules/mocha.css',
          'toy_modules/mocha.js',
          'toy_modules/package.json',
        ]);
      });
    });
  });
});
