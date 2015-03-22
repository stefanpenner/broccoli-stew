var path = require('path');
var chai = require('chai');
var expect = chai.expect;
var helpers = require('broccoli-test-helpers');
var makeTestHelper = helpers.makeTestHelper;
var cleanupBuilders = helpers.cleanupBuilders;
var _npm = require('../lib/npm');

describe('npm', function() {
  var fixturePath = path.join(__dirname, 'fixtures', 'npm');

  afterEach(function() {
    return cleanupBuilders();
  });

  var entry = makeTestHelper({
    subject: _npm.entry,
    fixturePath: fixturePath,
    filter: function(paths) {
      return paths.filter(function(path) { return !/\/$/.test(path); });
    }
  });

  it("return tree with file in entry", function() {
    return entry('bar').then(function(result){
      var files = result.files;

      expect(files).to.eq([
        'stool.js'
      ]);
    });
  });

  it("renames file in entry when new file name given", function(){
    return entry('bar', 'hot/chili.js').then(function(result){
      var files = result.files;

      expect(files).to.eq([
        'hot/chili.js'
      ])
    })
  });

  it("entry throws an exception when not present in package.json", function(){
    return entry('baz').catch(function(error){
      expect(error.message).to.eq('package.json for baz does not have main property');
    });
  });
});
