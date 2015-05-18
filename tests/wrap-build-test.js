var _wrapBuild = require('../lib/wrap-build');
var path = require('path');
var chai = require('chai');
var sinon = require('sinon');
var expect = chai.expect;
var helpers = require('broccoli-test-helpers');
var makeTestHelper = helpers.makeTestHelper;
var cleanupBuilders = helpers.cleanupBuilders;


describe('wrapBuild', function() {
  var emptyFixturePath = path.join(__dirname, 'fixtures', 'empty'),
      beforeSpyFunc,
      afterSpyFunc;

  afterEach(function() {
    return cleanupBuilders();
  });

  var wrapBuild = makeTestHelper({
    subject: _wrapBuild,
    fixturePath: emptyFixturePath
  });

  beforeEach(function() {
    beforeSpyFunc = sinon.spy();
    afterSpyFunc = sinon.spy();
  });

  it('it called wrap the inputTree builds', function() {
    expect(beforeSpyFunc.callCount).to.equal(0);
    expect(afterSpyFunc.callCount).to.equal(0);

    return wrapBuild(emptyFixturePath, beforeSpyFunc, afterSpyFunc).then(function(results) {
      expect(beforeSpyFunc.callCount).to.equal(1);
      expect(afterSpyFunc.callCount).to.equal(1);
      expect(afterSpyFunc.calledWith(sinon.match.string)).to.be.true;

      sinon.assert.callOrder(beforeSpyFunc, afterSpyFunc);
    });
  });
});
