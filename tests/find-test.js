var broccoli = require('broccoli');
var _find = require('../lib/find');
var path = require('path');
var walkSync = require('walk-sync');
var Promise = require('rsvp').Promise;
var chai = require('chai');
var expect = chai.expect;

describe('find', function() {
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
      return walkSync(inputTree.directory)
        .sort()
        .filter(function(path) { /* drop folders*/ return !/\/$/.test(path); });
    });
  }

  function find() {
    var cwd = process.cwd();
    var args = arguments;

    return new Promise(function(resolve) {
      process.chdir(fixturePath);
      resolve(tree(_find.apply(undefined, args)))
    }).finally(function() {
      process.chdir(cwd);
    });
  }

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
