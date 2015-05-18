var _afterBuild = require('../lib/after-build');
var path = require('path');
var chai = require('chai');
var sinon = require('sinon');
var expect = chai.expect;
var helpers = require('broccoli-test-helpers');
var makeTestHelper = helpers.makeTestHelper;
var cleanupBuilders = helpers.cleanupBuilders;


describe('afterBuild', function() {
  var emptyFixturePath = path.join(__dirname, 'fixtures', 'empty'),
      spyFunc;

  afterEach(function() {
    return cleanupBuilders();
  });

  var afterBuild = makeTestHelper({
    subject: _afterBuild,
    fixturePath: emptyFixturePath
  });

  beforeEach(function() {
    spyFunc = sinon.spy();
  });

  it('it called after the inputTree builds', function() {
    expect(spyFunc.callCount).to.equal(0);

    return afterBuild(emptyFixturePath, spyFunc).then(function(results) {
      expect(spyFunc.callCount).to.equal(1);
      expect(spyFunc.calledWith(sinon.match.string)).to.be.true;
    });
  });
});
