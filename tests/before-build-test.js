var _beforeBuild = require('../lib/before-build');
var path = require('path');
var chai = require('chai');
var sinon = require('sinon');
var expect = chai.expect;
var helpers = require('broccoli-test-helpers');
var makeTestHelper = helpers.makeTestHelper;
var cleanupBuilders = helpers.cleanupBuilders;


describe('beforeBuild', function() {
  var emptyFixturePath = path.join(__dirname, 'fixtures', 'empty'),
      spyFunc;

  afterEach(function() {
    return cleanupBuilders();
  });

  var beforeBuild = makeTestHelper({
    subject: _beforeBuild,
    fixturePath: emptyFixturePath
  });

  beforeEach(function() {
    spyFunc = sinon.spy();
  });

  it('it called before the inputTree builds', function() {
    expect(spyFunc.callCount).to.equal(0);

    return beforeBuild(emptyFixturePath, spyFunc).then(function(results) {
      expect(spyFunc.callCount).to.equal(1);
    });
  });
});
