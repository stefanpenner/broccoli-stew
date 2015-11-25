var _find = require('../lib/find');
var path = require('path');
var chai = require('chai');
var expect = chai.expect;
var helpers = require('broccoli-test-helpers');
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
      return find('.', 'node_modules/mocha/').then(function(results) {
        var files = results.files;

        expect(files).to.eql([
          'node_modules/mocha/mocha.css',
          'node_modules/mocha/mocha.js',
          'node_modules/mocha/package.json'
        ]);
      });
    });

    it('finds sub tree (ambigious folder/file)', function() {
      return find('.', 'node_modules/mocha').then(function(results) {
        var files = results.files;

        expect(files).to.eql([]);
      });
    });

    it('finds sub tree (with glob)', function() {
      return find('.', 'node_modules/mocha/**/*').then(function(results) {
        var files = results.files;

        expect(files).to.eql([
          'node_modules/mocha/mocha.css',
          'node_modules/mocha/mocha.js',
          'node_modules/mocha/package.json'
        ]);
      });
    });

    it('finds subtree via globed expansion', function() {
      return find('.', 'node_modules/mocha/*.{css,js}').then(function(results) {
        var files = results.files;

        expect(files).to.eql([
          'node_modules/mocha/mocha.css',
          'node_modules/mocha/mocha.js'
        ]);
      });
    });

    it('finds subtree via globed expansion for a single file', function() {
      return find('.', 'node_modules/mocha/{mocha.css}').then(function(results) {
        var files = results.files;

        expect(files).to.eql([
          'node_modules/mocha/mocha.css'
        ]);
      });
    });

    it('finds subtree via dual glob + single expansion', function() {
      return find('.', '*/mocha/*.css').then(function(results) {
        var files = results.files;

        expect(files).to.eql([
          'node_modules/mocha/mocha.css',
          'other/mocha/apple.css',
        ]);
      });
    });

    it('finds subtree via dual glob + double expansion', function() {
      return find('.', 'node_modules/**/*.{js,css}').then(function(results) {
        var files = results.files;

        expect(files).to.eql([
          'node_modules/foo/foo.css',
          'node_modules/mocha/mocha.css',
          'node_modules/mocha/mocha.js',
        ]);
      });
    });

    it('root + matcher path with glob + double expansion', function() {
      return find('.', 'node_modules/**/*.{js,css}').then(function(results) {
        var files = results.files;

        expect(files).to.eql([
          'node_modules/foo/foo.css',
          'node_modules/mocha/mocha.css',
          'node_modules/mocha/mocha.js',
        ]);
      });
    });

    it('input tree, and string filter', function() {
      return find(_find('node_modules/mocha/'), '**/*.js').then(function(results) {
        var files = results.files;

        expect(files).to.eql([
          'node_modules/mocha/mocha.js',
        ]);
      });
    });

    it('input tree, not filter', function() {
      return find(_find('node_modules/mocha/')).then(function(results) {
        var files = results.files;

        expect(files).to.eql([
          'node_modules/mocha/mocha.css',
          'node_modules/mocha/mocha.js',
          'node_modules/mocha/package.json'
        ]);
      });
    });

    it('nested input tree and string filter', function() {
      return find(_find(_find('node_modules'), '**/*.css')).then(function(results) {
        var files = results.files;

        expect(files).to.eql([
          'node_modules/foo/foo.css',
          'node_modules/mocha/mocha.css'
        ]);
      });
    });
  });

  describe('unrooted', function() {
    it('finds sub tree', function() {
      return find('node_modules/mocha').then(function(results) {
        var files = results.files;

        expect(files).to.eql([
          'node_modules/mocha/mocha.css',
          'node_modules/mocha/mocha.js',
          'node_modules/mocha/package.json',
        ]);
      });
    });

    it('finds subtree via globed expansion', function() {
      return find('node_modules/mocha/*.{css,js}').then(function(results) {
        var files = results.files;

        expect(files).to.eql([
          'node_modules/mocha/mocha.css',
          'node_modules/mocha/mocha.js',
        ]);
      });
    });

    it('finds subtree via glob', function() {
      return find('node_modules/mocha/*').then(function(results) {
        var files = results.files;

        expect(files).to.eql([
          'node_modules/mocha/mocha.css',
          'node_modules/mocha/mocha.js',
          'node_modules/mocha/package.json',
        ]);
      });
    });

    it('does not allow top level expansion', function() {
      return find('{other,node_modules}/mocha/*.css').then(function(results) {
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
      return find('node_modules/*/*.css').then(function(results) {
        var files = results.files;

        expect(files).to.eql([
          'node_modules/foo/foo.css',
          'node_modules/mocha/mocha.css',
        ]);
      });
    });

    it('does allow 2nd level or more expansion', function() {
      return find('node_modules/{mocha,}/*.css').then(function(results) {
        var files = results.files;
        expect(files).to.eql([
          'node_modules/mocha/mocha.css',
        ]);
      });
    });

    it('specific file, but no expansion', function() {
      return find('node_modules/mocha/{mocha.css}').then(function(results) {
        var files = results.files;

        expect(files).to.eql([
          'node_modules/mocha/mocha.css',
        ]);
      });
    });
  });

  describe('find([])', function() {
    it('multiple roots without globs', function() {
      return find([
        'node_modules/mocha',
        'other/mocha'
      ]).then(function(results) {
        var files = results.files;

        expect(files).to.eql([
          'node_modules/mocha/mocha.css',
          'node_modules/mocha/mocha.js',
          'node_modules/mocha/package.json',
          'other/mocha/apple.css',
          'other/mocha/apple.js',
        ]);
      });
    });

    it('multiple roots with globs', function() {
      return find([
        'node_modules/mocha/*.js',
        'other/mocha/*.js',
      ]).then(function(results) {
        var files = results.files;

        expect(files).to.eql([
          'node_modules/mocha/mocha.js',
          'other/mocha/apple.js',
        ]);
      });
    });

    it('multiple roots + matcher path with glob + double expansion', function() {
      return find([
        'node_modules/mocha/',
        'other/mocha/',
      ], '**/*.js').then(function(results) {
        var files = results.files;

        expect(files).to.eql([
          'node_modules/mocha/mocha.js',
          'other/mocha/apple.js',
        ]);
      });
    });
  });

  describe('ambient os', function() {
    it('correctly handles path.join inputs', function() {
      return find(
        path.join('node_modules', 'mocha', '{mocha.js}')
      ).then(function(results) {
        var files = results.files;

        expect(files).to.eql([
          'node_modules/mocha/mocha.js',
        ]);
      });
    });

    function expand(input) {
      var filePath = path.dirname(input);
      var file = path.basename(input);

      return filePath + '/{' + file + '}';
    }

    it('correctly handles require.resolve + expand', function() {
      var root =  process.cwd().replace(/[a-z]:[\\\/]/i, '').split(path.sep).join('/').replace(/^\//, '');

      return find(
        expand(require.resolve('whatwg-fetch'))
      ).then(function(results) {
        var files = results.files;

        expect(files).to.eql([
          root + '/node_modules/whatwg-fetch/fetch.js'
        ]);
      });
    });
  });
});
