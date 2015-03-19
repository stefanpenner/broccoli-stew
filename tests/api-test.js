var stew = require('../');
var expect = require('chai').expect;

describe('api', function() {
  it('has expected api members', function() {
    expect(stew.mv).a('function');
    expect(stew.find).a('function');
    expect(stew.rename).a('function');
    expect(stew.env).a('function');
    expect(stew.map).a('function');
    expect(stew.log).a('function');
    expect(stew.debug).a('function');
    expect(stew.rm).a('function');
    expect(stew.afterBuild).a('function');
  });
});
