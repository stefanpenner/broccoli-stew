'use strict';

const path = require('path');
const chai = require('chai');
const expect = chai.expect;
const helpers = require('broccoli-test-helpers');
const makeTestHelper = helpers.makeTestHelper;
const cleanupBuilders = helpers.cleanupBuilders;
const npm = require('../lib/npm');

describe('npm', function() {
  let fixturePath = path.join(__dirname, 'fixtures', 'empty');

  afterEach(function() {
    return cleanupBuilders();
  });

  let npmMain = makeTestHelper({
    subject: npm.main,
    fixturePath: fixturePath
  });

  describe('npm.main', function(){
    it("benchmark.js", function() {
      return npmMain('benchmark').then(result => {
        expect(result.files).to.eql([
          'benchmark.js'
        ]);
      });
    });

    it('benchmark.js rename to index.js', function() {
      return npmMain('benchmark', 'index.js').then(result => {
        expect(result.files).to.eql([
          'index.js'
        ]);
      });
    });

    it('whatwg-fetch', function() {
      return npmMain('whatwg-fetch').then(result => {
        expect(result.files).to.eql([
          'fetch.umd.js'
        ]);
      });
    });

    it('whatwg-fetch rename to index.js', function() {
      return npmMain('whatwg-fetch', 'index.js').then(result => {
        expect(result.files).to.eql([
          'index.js'
        ]);
      });
    });
  });
});
