var path = require('path');
var chai = require('chai');
var expect = chai.expect;
var helpers = require('broccoli-test-helpers');
var makeTestHelper = helpers.makeTestHelper;
var cleanupBuilders = helpers.cleanupBuilders;
var rewire =  require('rewire');

describe('npm', function() {
  var fixturePath = path.join(__dirname, 'fixtures', 'npm');

  function mockResolve(moduleName) {
    return path.join(fixturePath, 'node_modules', moduleName);
  }

  var _npm = rewire('../lib/npm');
  _npm.__set__('resolve', mockResolve);

  afterEach(function() {
    return cleanupBuilders();
  });

  var npmMain = makeTestHelper({
    subject: _npm.main,
    fixturePath: fixturePath,
    filter: function(paths) {
      return paths.filter(function(path) { return !/\/$/.test(path); });
    }
  });

  describe('npm.main', function(){
    it("returns tree with file from main", function() {
      return npmMain('bar').then(function(result){
        var files = result.files;

        expect(files).to.eql([
          // TODO: ask stef why find returns relative paths
          path.join(mockResolve('bar'), 'stool.js').substring(1)
        ]);
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
        expect(error).to.eq('package.json for baz does not have main property');
      });
    });
  });
});
