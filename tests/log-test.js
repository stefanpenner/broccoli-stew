var broccoli = require('broccoli');
var find = require('../lib/find');
var log = require('../lib/log');
var path = require('path')
var expect = require('chai').expect;

describe('log', function() {
  it('should print out the array of files in the tree', function() {
    var tree = find('tests/fixtures/node_modules/mocha');
    var build = new broccoli.Builder(log(tree));
    return build.build().then(function(files) {
      expect(files.directory).to.eql([
        'tests/fixtures/node_modules/mocha/mocha.css',
        'tests/fixtures/node_modules/mocha/mocha.js',
        'tests/fixtures/node_modules/mocha/package.json'
      ]);
    });
  });

  it('should print out the tree of files to sdtout', function() {
    var tree = find('tests/fixtures/node_modules/mocha');
    var build = new broccoli.Builder(log(tree, {output: 'tree'}));
    return build.build().then(function(files) {
      expect(files.directory).to.eql([
        'tests/fixtures/node_modules/mocha/mocha.css',
        'tests/fixtures/node_modules/mocha/mocha.js',
        'tests/fixtures/node_modules/mocha/package.json'
      ]);
    });
  });
});