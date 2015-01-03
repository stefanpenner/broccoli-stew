var _find = require('../lib/find');
var path = require('path');
var chai = require('chai');
var expect = chai.expect;
var helpers = require('./helpers');
var makeTestHelper = helpers.makeTestHelper;
var cleanupBuilders = helpers.cleanupBuilders;

describe('find', function() {
  var fixturePath = path.join(__dirname, 'fixtures');

  afterEach(function() {
    return cleanupBuilders();
  });

  var find = makeTestHelper({
    subject: _find,
    fixturePath: fixturePath,
    filter: function (paths) {
      return paths.filter(function(path) { return !/\/$/.test(path); });
    }
  });

  describe('rooted at: ' + fixturePath, function() {
    it('finds sub tree (folder no glob)', function() {
      return find(fixturePath, 'node_modules/mocha/').then(function(files) {
        expect(files).to.eql([
          'node_modules/mocha/mocha.css',
          'node_modules/mocha/mocha.js',
          'node_modules/mocha/package.json',
        ]);
      });
    });

    it('finds sub tree (ambigious folder/file)', function() {
      return find(fixturePath, 'node_modules/mocha').then(function(files) {
        expect(files).to.eql([]);
      });
    });

    it('finds sub tree (with glob)', function() {
      return find(fixturePath, 'node_modules/mocha/**/*').then(function(files) {
        expect(files).to.eql([
          'node_modules/mocha/mocha.css',
          'node_modules/mocha/mocha.js',
          'node_modules/mocha/package.json'
        ]);
      });
    });

    it('finds subtree via globed expansion', function() {
      return find(fixturePath, 'node_modules/mocha/*.{css,js}').then(function(files) {
        expect(files).to.eql([
          'node_modules/mocha/mocha.css',
          'node_modules/mocha/mocha.js'
        ]);
      });
    });

    it('finds subtree via globed expansion for a single file', function() {
      return find(fixturePath, 'node_modules/mocha/{mocha.css}').then(function(files) {
        expect(files).to.eql([
          'node_modules/mocha/mocha.css'
        ]);
      });
    });

    it('finds subtree via dual glob + single expansion', function() {
      return find(fixturePath, '*/mocha/*.css').then(function(files) {
        expect(files).to.eql([
          'node_modules/mocha/mocha.css',
          'other/mocha/apple.css',
        ]);
      });
    });

    it('finds subtree via dual glob + double expansion', function() {
      return find(fixturePath, 'node_modules/**/*.{js,css}').then(function(files) {
        expect(files).to.eql([
          'node_modules/foo/foo.css',
          'node_modules/mocha/mocha.css',
          'node_modules/mocha/mocha.js',
        ]);
      });
    });

    it('root + matcher path with glob + double expansion', function() {
      return find(fixturePath, 'node_modules/**/*.{js,css}').then(function(files) {
        expect(files).to.eql([
          'node_modules/foo/foo.css',
          'node_modules/mocha/mocha.css',
          'node_modules/mocha/mocha.js',
        ]);
      });
    });
  });

  describe('unrooted', function() {
    it('finds sub tree', function() {
      return find('node_modules/mocha').then(function(files) {
        expect(files).to.eql([
          'node_modules/mocha/mocha.css',
          'node_modules/mocha/mocha.js',
          'node_modules/mocha/package.json',
        ]);
      });
    });

    it('finds subtree via globed expansion', function() {
      return find('node_modules/mocha/*.{css,js}').then(function(files) {
        expect(files).to.eql([
          'node_modules/mocha/mocha.css',
          'node_modules/mocha/mocha.js',
        ]);
      });
    });

    it('finds subtree via glob', function() {
      return find('node_modules/mocha/*').then(function(files) {
        expect(files).to.eql([
          'node_modules/mocha/mocha.css',
          'node_modules/mocha/mocha.js',
          'node_modules/mocha/package.json',
        ]);
      });
    });

    it('does not allow top level expansion', function() {
      return find('{other,node_modules}/mocha/*.css').then(function(files) {
        throw new Error('should not get here');
      }, function(reason) {
        expect(reason.message).to.eq('top level glob or expansion not currently supported: `{other,node_modules}/mocha/*.css`');
      });
    });

    it('does not allow top level glob', function() {
      return find('*/mocha/*.css').then(function() {
        throw new Error('should not get here');
      }, function(reason) {
        expect(reason.message).to.eq('top level glob or expansion not currently supported: `*/mocha/*.css`');
      });
    });

    it('does allow 2nd level or more glob', function() {
      return find('node_modules/*/*.css').then(function(files) {
        expect(files).to.eql([
          'node_modules/foo/foo.css',
          'node_modules/mocha/mocha.css',
        ]);
      });
    });

    it('does allow 2nd level or more expansion', function() {
      return find('node_modules/{mocha,}/*.css').then(function(files) {
        expect(files).to.eql([
          'node_modules/mocha/mocha.css',
        ]);
      });
    });

    it('specific file, but no expansion', function() {
      return find('node_modules/mocha/{mocha.css}').then(function(files) {
        expect(files).to.eql([
          'node_modules/mocha/mocha.css',
        ]);
      });
    });
  });
});
