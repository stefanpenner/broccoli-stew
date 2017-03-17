'use strict';

const _mv = require('../lib/mv');
const _find = require('../lib/find');
const path = require('path');
const chai = require('chai');
const expect = chai.expect;
const helpers = require('broccoli-test-helpers');
const makeTestHelper = helpers.makeTestHelper;
const cleanupBuilders = helpers.cleanupBuilders;

describe('mv', function() {
  let fixturePath = path.join(__dirname, 'fixtures');

  afterEach(function() {
    return cleanupBuilders();
  });

  let mv = makeTestHelper({
    subject: _mv,
    fixturePath,
    filter(paths) {
      return paths.filter(path => !/\/$/.test(path));
    }
  });

  describe('tree + destination', function() {
    it('move into node_modules', function() {
      return mv(_find('node_modules'), 'toy_modules').then(results => {
        let files = results.files;

        expect(files).to.eql([
          'toy_modules/node_modules/foo/foo.css',
          'toy_modules/node_modules/mocha/mocha.css',
          'toy_modules/node_modules/mocha/mocha.js',
          'toy_modules/node_modules/mocha/package.json',
        ]);
      });
    });

    it('find node_modules/mocha and move whole tree into toy_modules', function() {
      return mv(_find('node_modules/mocha'), 'toy_modules').then(results => {
        let files = results.files;

        expect(files).to.eql([
          'toy_modules/node_modules/mocha/mocha.css',
          'toy_modules/node_modules/mocha/mocha.js',
          'toy_modules/node_modules/mocha/package.json',
        ]);
      });
    });
  });

  describe('tree + from + destination', function() {
    it('move subgraph with matcher', function() {
      return mv(_find('node_modules'), 'node_modules/', 'toy_modules/').then(results => {
        let files = results.files;

        expect(files).to.eql([
          'toy_modules/foo/foo.css',
          'toy_modules/mocha/mocha.css',
          'toy_modules/mocha/mocha.js',
          'toy_modules/mocha/package.json',
        ]);
      });
    });

    it('move file with matcher (exact match)', function() {
      return mv(_find('node_modules'), 'node_modules/mocha/mocha.css', 'toy_modules/foo.css').then(results => {
        let files = results.files;

        expect(files).to.eql([
          'node_modules/foo/foo.css',
          'node_modules/mocha/mocha.js',
          'node_modules/mocha/package.json',
          'toy_modules/foo.css',
        ]);
      });
    });

    it('move files with matcher (expansion)', function() {
      return mv(_find('node_modules'), 'node_modules/mocha/mocha.{css,js}', 'toy_modules/').then(results => {
        let files = results.files;

        expect(files).to.eql([
          'node_modules/foo/foo.css',
          'node_modules/mocha/package.json',
          'toy_modules/mocha.css',
          'toy_modules/mocha.js',
        ]);
      });
    });

    it('move files with matcher (glob + expansion)', function() {
      return mv(_find('node_modules'), 'node_modules/*/mocha.{css,js}', 'toy_modules/').then(results => {
        let files = results.files;

        expect(files).to.eql([
          'node_modules/foo/foo.css',
          'node_modules/mocha/package.json',
          'toy_modules/mocha.css',
          'toy_modules/mocha.js',
        ]);
      });
    });

    it('move files with matcher (glob + expansion) another', function() {
      return mv(_find('node_modules'), 'node_modules/mocha/mocha.{css,js}', 'toy_modules/').then(results => {
        let files = results.files;

        expect(files).to.eql([
          'node_modules/foo/foo.css',
          'node_modules/mocha/package.json',
          'toy_modules/mocha.css',
          'toy_modules/mocha.js',
        ]);
      });
    });

    it('move files with matcher (glob + expansion) another one', function() {
      return mv(_find('node_modules'), 'node_modules/mocha/*.{css,js}', 'toy_modules/').then(results => {
        let files = results.files;

        expect(files).to.eql([
          'node_modules/foo/foo.css',
          'node_modules/mocha/package.json',
          'toy_modules/mocha.css',
          'toy_modules/mocha.js',
        ]);
      });
    });

    it('move files with matcher (glob + expansion) another another one', function() {
      return mv(_find('node_modules'), 'node_modules/*/*.{css,js}', 'toy_modules/').then(results => {
        let files = results.files;

        expect(files).to.eql([
          'node_modules/mocha/package.json',
          'toy_modules/foo.css',
          'toy_modules/mocha.css',
          'toy_modules/mocha.js',
        ]);
      });
    });

    it('move subgraph with matcher!!', function() {
      return mv(_find('node_modules'), 'node_modules/mocha/', 'toy_modules/').then(results => {
        let files = results.files;

        expect(files).to.eql([
          'node_modules/foo/foo.css',
          'toy_modules/mocha.css',
          'toy_modules/mocha.js',
          'toy_modules/package.json',
        ]);
      });
    });
  });
});
