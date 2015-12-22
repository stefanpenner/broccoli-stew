var path = require('path');
var chai = require('chai');
var expect = chai.expect;
var helpers = require('broccoli-test-helpers');
var makeTestHelper = helpers.makeTestHelper;
var cleanupBuilders = helpers.cleanupBuilders;
var npm = require('../lib/npm');

describe('npm', function() {
  var fixturePath = path.join(__dirname, 'fixtures', 'empty');

  afterEach(function() {
    return cleanupBuilders();
  });

  var npmMain = makeTestHelper({
    subject: npm.main,
    fixturePath: fixturePath
  });

  describe('npm.main', function(){
    it("benchmark.js", function() {
      return npmMain('benchmark').then(function(result){
        expect(result.files).to.eql([
          'benchmark.js'
        ]);
      });
    });

    it('benchmark.js rename to index.js', function() {
      return npmMain('benchmark', 'index.js').then(function(result){
        expect(result.files).to.eql([
          'index.js'
        ]);
      });
    });

    it('whatwg-fetch', function() {
      return npmMain('whatwg-fetch').then(function(result){
        expect(result.files).to.eql([
          'fetch.js'
        ]);
      });
    });

    it('whatwg-fetch rename to index.js', function() {
      return npmMain('whatwg-fetch', 'index.js').then(function(result){
        expect(result.files).to.eql([
          'index.js'
        ]);
      });
    });
  });
});
