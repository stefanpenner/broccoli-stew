'use strict';

const _rm = require('../lib/rm');
const _find = require('../lib/find');
const path = require('path');
const chai = require('chai');
const expect = chai.expect;
const helpers = require('broccoli-test-helpers');
const makeTestHelper = helpers.makeTestHelper;
const cleanupBuilders = helpers.cleanupBuilders;

describe('rm', function() {
  let fixturePath = path.join(__dirname, 'fixtures');

  afterEach(function() {
    return cleanupBuilders();
  });

  let rm = makeTestHelper({
    subject: _rm,
    fixturePath,
    filter(paths) {
      return paths.filter(path => !/\/$/.test(path));
    }
  });

  it('rm file', function() {
    return rm('node_modules', 'mocha/mocha.css').then(results => {
      let files = results.files;

      expect(files).to.eql([
        'foo/foo.css',
        'mocha/mocha.js',
        'mocha/package.json',
      ]);
    });
  });

  it('rm files', function() {
    return rm('node_modules', 'mocha/mocha.css', 'mocha/package.json').then(results => {
      let files = results.files;

      expect(files).to.eql([
        'foo/foo.css',
        'mocha/mocha.js',
      ]);
    });
  });

  it('rm glob', function() {
    return rm('node_modules', 'mocha/mocha.*').then(results => {
      let files = results.files;

      expect(files).to.eql([
        'foo/foo.css',
        'mocha/package.json',
      ]);
    });
  });

  // this needs no tmp folder at '/' to work
  // it('rm glob at root', function() {
  //   return rm('.', 'node_modules/mocha/mocha.js').then(function(results) {
  //     let files = results.files;

  //     expect(files).to.not.include('node_modules/mocha/mocha.js');
  //     expect(files).to.include('node_modules/mocha/package.json');
  //     expect(files).to.include('node_modules/foo/foo.css');
  //   });
  // });

  // funnel doesn't really support this yet
  // it('rm glob at root, but negated', function() {
  //   return rm('.', 'node_modules/mocha/mocha.js', '!node_modules/mocha/mocha.js').then(function(results) {
  //   let files = results.files;
  //
  //     expect(files).to.include('node_modules/mocha/mocha.js');
  //     expect(files).to.include('node_modules/mocha/package.json');
  //     expect(files).to.include('node_modules/foo/foo.css');
  //   });
  // });
});
