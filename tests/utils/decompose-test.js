var assert = require('assert');
var decompose = require('../../lib/utils/decompose');
var path = require('path');
var path32 = require('path-win32');
var chai = require('chai');
var expect = chai.expect;

function mockPathSep(sep, cb) {
  var existing = path.sep;
  path.sep = sep;

  try {
    return cb();
  } finally {
    path.sep = existing;
  }
}

describe('decompose', function() {
  it('basic', function(){
    assert.deepEqual(decompose('path'), {
      root: 'path',
      include: undefined,
      exclude: undefined
    })
  });

  it('path', function(){
    assert.deepEqual(decompose('path/to/something'), {
      root: 'path/to/something',
      include: undefined,
      exclude: undefined
    })
  });

  it('simple glob', function(){
    assert.deepEqual(decompose('path/to/*'), {
      root: 'path/to',
      include: ['*'],
      exclude: undefined
    })
  });

  it('simple glob 2', function(){
    assert.deepEqual(decompose('path/to/*/bar/*'), {
      root: 'path/to',
      include: ['*/bar/*'],
      exclude: undefined
    })
  });

  it('simple glob 3', function(){
    assert.deepEqual(decompose('path/to/apple*/bar/*'), {
      root: 'path/to',
      include: ['apple*/bar/*'],
      exclude: undefined
    })
  });

  it('simple expansion', function(){
    assert.deepEqual(decompose('foo/{bar,baz}'), {
      root: 'foo',
      include: ['{bar,baz}'],
      exclude: undefined
    })
  });

  it('complex glob expansion', function(){
    assert.deepEqual(decompose('foo/bar*/{bar,baz}/{qux,}'), {
      root: 'foo',
      include: ['bar*/{bar,baz}/{qux,}'],
      exclude: undefined
    })
  });

  it('file', function(){
    assert.deepEqual(decompose('foo/{bar.html}'), {
      root: 'foo',
      include: ['bar.html'],
      exclude: undefined
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

  describe('non-posix path.sep', function() {
    it('basic win32 path', function() {
      mockPathSep(path32.sep, function() {
        expect(decompose(path32.join('foo', 'bar'))).to.deep.equal({
          exclude: undefined,
          include: undefined,
          root: 'foo/bar'
        });
      });
    });

    it('win32 with glob', function() {
      mockPathSep(path32.sep, function() {
        expect(decompose(path32.join('foo', 'bar', '{apple}'))).to.deep.equal({
          exclude: undefined,
          include: ['apple'],
          root: 'foo/bar'
        });
      });
    });

    it('mixed posix and win32', function() {
      mockPathSep(path32.sep, function() {
        expect(decompose(path.join('app', path32.join('foo', 'bar'), 'red'))).to.deep.equal({
          exclude: undefined,
          include: undefined,
          root: 'app/foo/bar/red'
        });
      });
    });

    it('win32 with glob', function() {
      mockPathSep(path32.sep, function() {
        expect(decompose(path.join('app', path32.join('foo', 'bar'), 'red', '{blue}'))).to.deep.equal({
          exclude: undefined,
          include: ['blue'],
          root: 'app/foo/bar/red'
        });

        expect(decompose(path32.join('path','to', '*', 'bar', '*'))).to.deep.equal({
          root: 'path/to',
          include: ['*/bar/*'],
          exclude: undefined
        })
      });
    });
  });
});
