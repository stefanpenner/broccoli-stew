'use strict';

const decompose = require('../../lib/utils/decompose');
const path = require('path');
const path32 = require('path-win32');
const chai = require('chai');
const expect = chai.expect;

function mockPathSep(sep, cb) {
  let existing = path.sep;
  path.sep = sep;

  try {
    return cb();
  } finally {
    path.sep = existing;
  }
}

describe('decompose', function() {
  it('basic', function(){
    expect(decompose('path')).to.deep.eql({
      root: 'path',
      include: undefined,
      exclude: undefined
    });
  });

  it('path', function(){
    expect(decompose('path/to/something')).to.deep.eql({
      root: 'path/to/something',
      include: undefined,
      exclude: undefined
    });
  });

  it('simple glob', function(){
    expect(decompose('path/to/*')).to.deep.eql({
      root: 'path/to',
      include: ['*'],
      exclude: undefined
    });
  });

  it('simple glob 2', function(){
    expect(decompose('path/to/*/bar/*')).to.deep.eql({
      root: 'path/to',
      include: ['*/bar/*'],
      exclude: undefined
    });
  });

  it('simple glob 3', function(){
    expect(decompose('path/to/apple*/bar/*')).to.deep.eql({
      root: 'path/to',
      include: ['apple*/bar/*'],
      exclude: undefined
    });
  });

  it('simple expansion', function(){
    expect(decompose('foo/{bar,baz}')).to.deep.eql({
      root: 'foo',
      include: ['{bar,baz}'],
      exclude: undefined
    });
  });

  it('complex glob expansion', function(){
    expect(decompose('foo/bar*/{bar,baz}/{qux,}')).to.deep.eql({
      root: 'foo',
      include: ['bar*/{bar,baz}/{qux,}'],
      exclude: undefined
    });
  });

  it('file', function(){
    expect(decompose('foo/{bar.html}')).to.deep.eql({
      root: 'foo',
      include: ['bar.html'],
      exclude: undefined
    });
  });

  it('top level glob', function(){
    expect(() => decompose('{foo,bar}')).to.throw(/ /);
  });

  it('top level expansion', function(){
    expect(() => decompose('bar*')).to.throw(/ /);
  });

  it('top level glob expansion', function(){
    expect(() => decompose('{foo,bar*}')).to.throw(/ /)
  });

  describe('non-posix path.sep', function() {
    it('basic win32 path', function() {
      mockPathSep(path32.sep, () => {
        expect(decompose(path32.join('foo', 'bar'))).to.deep.equal({
          exclude: undefined,
          include: undefined,
          root: 'foo/bar'
        });
      });
    });

    it('win32 with glob', function() {
      mockPathSep(path32.sep, () => {
        expect(decompose(path32.join('foo', 'bar', '{apple}'))).to.deep.equal({
          exclude: undefined,
          include: ['apple'],
          root: 'foo/bar'
        });
      });
    });

    it('mixed posix and win32', function() {
      mockPathSep(path32.sep, () => {
        expect(decompose(path.join('app', path32.join('foo', 'bar'), 'red'))).to.deep.equal({
          exclude: undefined,
          include: undefined,
          root: 'app/foo/bar/red'
        });
      });
    });

    it('win32 with glob', function() {
      mockPathSep(path32.sep, () => {
        expect(decompose(path.join('app', path32.join('foo', 'bar'), 'red', '{blue}'))).to.deep.equal({
          exclude: undefined,
          include: ['blue'],
          root: 'app/foo/bar/red'
        });

        expect(decompose(path32.join('path','to', '*', 'bar', '*'))).to.deep.equal({
          root: 'path/to',
          include: ['*/bar/*'],
          exclude: undefined
        });
      });
    });
  });
});
