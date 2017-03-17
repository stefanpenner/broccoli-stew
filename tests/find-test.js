'use strict';

const _find = require('../lib/find');
const path = require('path');
const chai = require('chai');
const expect = chai.expect;
const helpers = require('broccoli-test-helpers');
const makeTestHelper = helpers.makeTestHelper;
const cleanupBuilders = helpers.cleanupBuilders;
const co = require('co');

describe('find', function() {
  let fixturePath = path.join(__dirname, 'fixtures');

  afterEach(function() {
    return cleanupBuilders();
  });

  let find = makeTestHelper({
    subject: _find,
    fixturePath,
    filter(paths) {
      return paths.filter(path => !/\/$/.test(path));
    }
  });

  describe('rooted at: ' + fixturePath, function() {
    it('finds sub tree (folder no glob)', co.wrap(function* () {
      let results = yield find('.', 'node_modules/mocha/');
      let files = results.files;

      expect(files).to.eql([
        'node_modules/mocha/mocha.css',
        'node_modules/mocha/mocha.js',
        'node_modules/mocha/package.json'
      ]);
    }));

    it('finds sub tree (ambigious folder/file)', co.wrap(function* () {
      let results = yield find('.', 'node_modules/mocha');
      let files = results.files;

      expect(files).to.eql([]);
    }));

    it('finds sub tree (with glob)', co.wrap(function* () {
      let results = yield find('.', 'node_modules/mocha/**/*');
      let files = results.files;

      expect(files).to.eql([
        'node_modules/mocha/mocha.css',
        'node_modules/mocha/mocha.js',
        'node_modules/mocha/package.json'
      ]);
    }));

    it('finds subtree via globed expansion', co.wrap(function* () {
      let results = yield find('.', 'node_modules/mocha/*.{css,js}');
      let files = results.files;

      expect(files).to.eql([
        'node_modules/mocha/mocha.css',
        'node_modules/mocha/mocha.js'
      ]);
    }));

    it('finds subtree via globed expansion for a single file', co.wrap(function* () {
      let results = yield find('.', 'node_modules/mocha/{mocha.css}');
      let files = results.files;

      expect(files).to.eql([
        'node_modules/mocha/mocha.css'
      ]);
    }));

    it('finds subtree via dual glob + single expansion', co.wrap(function* () {
      let results = yield find('.', '*/mocha/*.css');
      let files = results.files;

      expect(files).to.eql([
        'node_modules/mocha/mocha.css',
        'other/mocha/apple.css',
      ]);
    }));

    it('finds subtree via dual glob + double expansion', co.wrap(function* () {
      let results = yield find('.', 'node_modules/**/*.{js,css}');
      let files = results.files;

      expect(files).to.eql([
        'node_modules/foo/foo.css',
        'node_modules/mocha/mocha.css',
        'node_modules/mocha/mocha.js',
      ]);
    }));

    it('root + matcher path with glob + double expansion', co.wrap(function* () {
      let results = yield find('.', 'node_modules/**/*.{js,css}');
      let files = results.files;

      expect(files).to.eql([
        'node_modules/foo/foo.css',
        'node_modules/mocha/mocha.css',
        'node_modules/mocha/mocha.js',
      ]);
    }));

    it('input tree, and string filter', co.wrap(function* () {
      let results = yield find(_find('node_modules/mocha/'), '**/*.js');
      let files = results.files;

      expect(files).to.eql([
        'node_modules/mocha/mocha.js',
      ]);
    }));

    it('input tree, not filter', co.wrap(function* () {
      let results = yield find(_find('node_modules/mocha/'));
      let files = results.files;

      expect(files).to.eql([
        'node_modules/mocha/mocha.css',
        'node_modules/mocha/mocha.js',
        'node_modules/mocha/package.json'
      ]);
    }));

    it('nested input tree and string filter', co.wrap(function* () {
      let results = yield find(_find(_find('node_modules'), '**/*.css'));
      let files = results.files;

      expect(files).to.eql([
        'node_modules/foo/foo.css',
        'node_modules/mocha/mocha.css'
      ]);
    }));
  });

  describe('unrooted', function() {
    it('finds sub tree', co.wrap(function* () {
      let results = yield find('node_modules/mocha');
      let files = results.files;

      expect(files).to.eql([
        'node_modules/mocha/mocha.css',
        'node_modules/mocha/mocha.js',
        'node_modules/mocha/package.json',
      ]);
    }));

    it('finds subtree via globed expansion', co.wrap(function* () {
      let results = yield find('node_modules/mocha/*.{css,js}');
      let files = results.files;

      expect(files).to.eql([
        'node_modules/mocha/mocha.css',
        'node_modules/mocha/mocha.js',
      ]);
    }));

    it('finds subtree via glob', co.wrap(function* () {
      let results = yield find('node_modules/mocha/*');
      let files = results.files;

      expect(files).to.eql([
        'node_modules/mocha/mocha.css',
        'node_modules/mocha/mocha.js',
        'node_modules/mocha/package.json',
      ]);
    }));

    it('does not allow top level expansion', co.wrap(function* () {
      try {
        yield find('{other,node_modules}/mocha/*.css');
        throw new Error('should not get here');
      } catch(reason) {
        expect(reason.message).to.eq('top level glob or expansion not currently supported: `{other,node_modules}/mocha/*.css`');
      }
    }));

    it('does not allow top level glob', co.wrap(function* () {
      try {
        yield find('*/mocha/*.css');
        throw new Error('should not get here');
      } catch(reason) {
        expect(reason.message).to.eq('top level glob or expansion not currently supported: `*/mocha/*.css`');
      }
    }));

    it('does allow 2nd level or more glob', co.wrap(function* () {
      let results = yield find('node_modules/*/*.css');
      let files = results.files;

      expect(files).to.eql([
        'node_modules/foo/foo.css',
        'node_modules/mocha/mocha.css',
      ]);
    }));

    it('does allow 2nd level or more expansion', co.wrap(function* () {
      let results = yield find('node_modules/{mocha,}/*.css');
      let files = results.files;
      expect(files).to.eql([
        'node_modules/mocha/mocha.css',
      ]);
    }));

    it('specific file, but no expansion', co.wrap(function* () {
      let results = yield find('node_modules/mocha/{mocha.css}');
      let files = results.files;

      expect(files).to.eql([
        'node_modules/mocha/mocha.css',
      ]);
    }));
  });

  describe('find([])', function() {
    it('multiple roots without globs', co.wrap(function* () {
      let results = yield find([
        'node_modules/mocha',
        'other/mocha'
      ]);
      let files = results.files;

      expect(files).to.eql([
        'node_modules/mocha/mocha.css',
        'node_modules/mocha/mocha.js',
        'node_modules/mocha/package.json',
        'other/mocha/apple.css',
        'other/mocha/apple.js',
      ]);
    }));

    it('multiple roots with globs', co.wrap(function* () {
      let results = yield  find([
        'node_modules/mocha/*.js',
        'other/mocha/*.js',
      ]);
      let files = results.files;

      expect(files).to.eql([
        'node_modules/mocha/mocha.js',
        'other/mocha/apple.js',
      ]);
    }));

    it('multiple roots + matcher path with glob + double expansion', co.wrap(function* () {
      let results = yield find([
        'node_modules/mocha/',
        'other/mocha/',
      ], '**/*.js');
      let files = results.files;

      expect(files).to.eql([
        'node_modules/mocha/mocha.js',
        'other/mocha/apple.js',
      ]);
    }));
  });

  describe('ambient os', function() {
    it('correctly handles path.join inputs', co.wrap(function* () {
      let results = yield find(
        path.join('node_modules', 'mocha', '{mocha.js}')
      );
      let files = results.files;

      expect(files).to.eql([
        'node_modules/mocha/mocha.js',
      ]);
    }));

    function expand(input) {
      let filePath = path.dirname(input);
      let file = path.basename(input);

      return filePath + '/{' + file + '}';
    }

    it('correctly handles require.resolve + expand', co.wrap(function* () {
      let root =  process.cwd().replace(/[a-z]:[\\\/]/i, '').split(path.sep).join('/').replace(/^\//, '');

      let results = yield find(expand(require.resolve('whatwg-fetch')));
      let files = results.files;

      expect(files).to.eql([
        root + '/node_modules/whatwg-fetch/fetch.js'
      ]);
    }));
  });
});
