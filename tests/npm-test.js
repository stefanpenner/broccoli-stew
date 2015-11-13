var path = require('path');
var chai = require('chai');
var expect = chai.expect;
var helpers = require('broccoli-test-helpers');
var makeTestHelper = helpers.makeTestHelper;
var cleanupBuilders = helpers.cleanupBuilders;
var proxyquire =  require('proxyquire');

describe('npm', function() {
  var fixturePath = path.join(__dirname, 'fixtures', 'npm');

  function mockResolve(moduleName) {
    return path.join(fixturePath, 'node_modules', moduleName);
  }

  var npm = proxyquire('../lib/npm', {
    './utils/require-resolve': mockResolve
  });

  afterEach(function() {
    return cleanupBuilders();
  });

  var npmMain = makeTestHelper({
    subject: npm.main,
    fixturePath: fixturePath,
    filter: function(paths) {
      return paths.filter(function(path) { return !/\/$/.test(path); });
    }
  });

  describe('npm.main', function(){
    it("returns tree with file from main", function() {
      return npmMain('bar').then(function(result){
        expect(result.files).to.eql(['stool.js']);
      });
    });

    it("renames file in entry when new file name given", function(){
      return npmMain('bar', 'hot/chili.js').then(function(result){
        var files = result.files;

        expect(files).to.eql([
          'hot/chili.js'
        ]);
      })
    });

    it("entry throws an exception when not present in package.json", function(){
      return npmMain('baz').catch(function(error){
        expect(error.message).to.eq('package.json for baz does not have main property');
      });
    });
  });
});
