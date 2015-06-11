var _find = require('../lib/find');
var _debug = require('../lib/debug');
var expect = require('chai').expect;
var fs = require('fs-extra');
var path = require('path');
var helpers = require('broccoli-test-helpers');
var makeTestHelper = helpers.makeTestHelper;
var cleanupBuilders = helpers.cleanupBuilders;
var walkSync = require('walk-sync');

describe('debug', function() {

  var fixturePath = path.join(__dirname, 'fixtures');

  afterEach(function() {
    return cleanupBuilders(function() {
      fs.removeSync(path.join(__dirname, 'fixtures/DEBUG-debug'));
    });
  });

  var debug = makeTestHelper({
    subject: _debug,
    fixturePath: fixturePath
  });

  it('should have an array of files and directorys in the tree', function() {
    return debug(_find('node_modules/mocha'), {name: 'debug'}).then(function(results) {
      var files = results.files;

      expect(files).to.eql([
        'node_modules/',
        'node_modules/mocha/',
        'node_modules/mocha/mocha.css',
        'node_modules/mocha/mocha.js',
        'node_modules/mocha/package.json'
      ]);
    });
  });

  it('should write output to both debug folder and normal result', function() {
    var mochaFixturePath = path.join(fixturePath, 'node_modules', 'mocha');

    return debug(mochaFixturePath, {name: 'debug'}).then(function(results) {
      var files = walkSync(mochaFixturePath);
      var outputDir = results.directory;

      files.forEach(function(file) {
        if (file.slice(-1) === '/') { return; }

        var debugPath = path.join(fixturePath, 'DEBUG-debug', file);
        var treeOutputPath = path.join(outputDir, file);
        var sourcePath = path.join(mochaFixturePath, file);

        var expected = fs.readFileSync(sourcePath, { encoding: 'utf8' });

        expect(fs.readFileSync(debugPath, { encoding: 'utf8' })).to.equal(expected);
        expect(fs.readFileSync(treeOutputPath, { encoding: 'utf8' })).to.equal(expected);
      });
    });
  });

  it('suports string second argument as label', function() {
    var mochaFixturePath = path.join(fixturePath, 'node_modules', 'mocha');

    return debug(mochaFixturePath, 'debug2').then(function(results) {
      var outputDir = results.directory;

      var debugPath = path.join(fixturePath, 'DEBUG-debug2');
      expect(fs.existsSync(debugPath)).to.be.true;
    });
  });

  it('should write files to disk in correct folder', function() {
    return debug(_find('node_modules/mocha'), {name: 'debug'}).then(function(results) {
      var files = results.files;

      var base = 'tests/fixtures/';
      var debugDir = path.join(process.cwd(), base + 'DEBUG-debug');
      var fixture = path.join(process.cwd(), base + 'node_modules/mocha/mocha.js');

      files.forEach(function(file) {
        expect(fs.existsSync(path.join(debugDir, file))).to.be.ok;
      });

      expect(fs.readFileSync(path.join(debugDir, 'node_modules/mocha/mocha.js'), {
        encoding: 'utf8'
      })).to.equal(fs.readFileSync(fixture, {encoding: 'utf8'}));
    });
  });

  it('should write files to disk in correct folder with dir option', function() {
    return debug(_find('node_modules/mocha'), {name: 'debug', dir: 'mydir'}).then(function(results) {
      var files = results.files;

      var base = 'tests/fixtures/';
      var debugDir = path.join(process.cwd(), base + 'mydir/debug');
      var fixture = path.join(process.cwd(), base + 'node_modules/mocha/mocha.js');

      files.forEach(function(file) {
        expect(fs.existsSync(path.join(debugDir, file))).to.be.ok;
      });

      expect(fs.readFileSync(path.join(debugDir, 'node_modules/mocha/mocha.js'), {
        encoding: 'utf8'
      })).to.equal(fs.readFileSync(fixture, {encoding: 'utf8'}));
    });
  });

});
