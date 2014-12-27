var assert = require('assert');
var decompose = require('../../lib/utils/decompose');

describe('decompose', function() {
  it('basic', function(){
    assert.deepEqual(decompose('path'), {
      root: 'path',
      include: [],
      exclude: []
    })
  });

  it('path', function(){
    assert.deepEqual(decompose('path/to/something'), {
      root: 'path/to/something',
      include: [],
      exclude: []
    })
  });

  it('simple glob', function(){
    assert.deepEqual(decompose('path/to/*'), {
      root: 'path/to',
      include: ['*'],
      exclude: []
    })
  });

  it('simple glob 2', function(){
    assert.deepEqual(decompose('path/to/*/bar/*'), {
      root: 'path/to',
      include: ['*/bar/*'],
      exclude: []
    })
  });

  it('simple glob 3', function(){
    assert.deepEqual(decompose('path/to/apple*/bar/*'), {
      root: 'path/to',
      include: ['apple*/bar/*'],
      exclude: []
    })
  });

  it('simple expansion', function(){
    assert.deepEqual(decompose('foo/{bar,baz}'), {
      root: 'foo',
      include: ['{bar,baz}'],
      exclude: []
    })
  });

  it('complex glob expansion', function(){
    assert.deepEqual(decompose('foo/bar*/{bar,baz}/{qux,}'), {
      root: 'foo',
      include: ['bar*/{bar,baz}/{qux,}'],
      exclude: []
    })
  });

  it('file', function(){
    assert.deepEqual(decompose('foo/{bar.html}'), {
      root: 'foo',
      include: ['bar.html'],
      exclude: []
    });
  });

  it('top level glob', function(){
    assert.throws(function() {
      decompose('{foo,bar}');
    }, / /);
  });

  it('top level expansion', function(){
    assert.throws(function() {
      decompose('bar*');
    }, / /);
  });

  it('top level glob expansion', function(){
    assert.throws(function() {
      decompose('{foo,bar*}');
    }, / /);
  });
});
