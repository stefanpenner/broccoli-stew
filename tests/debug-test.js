'use strict';

const _find = require('../lib/find');
const _debug = require('../lib/debug');
const expect = require('chai').expect;
const fs = require('fs-extra');
const path = require('path');
const helpers = require('broccoli-test-helpers');
const makeTestHelper = helpers.makeTestHelper;
const cleanupBuilders = helpers.cleanupBuilders;
const walkSync = require('walk-sync');
const co = require('co');

describe('debug', function() {

  const fixturePath = path.join(__dirname, 'fixtures');

  afterEach(() => {
    return cleanupBuilders(() => {
      fs.removeSync(path.join(process.cwd(), 'DEBUG'));
    });
  });

  let debug = makeTestHelper({
    subject: _debug,
    fixturePath: fixturePath
  });

  it('should have an array of files and directorys in the tree', co.wrap(function* () {
    let results = yield debug(_find('node_modules/mocha'), { name: 'debug' });
    let files = results.files;

    expect(files).to.eql([
      'node_modules/',
      'node_modules/mocha/',
      'node_modules/mocha/mocha.css',
      'node_modules/mocha/mocha.js',
      'node_modules/mocha/package.json'
    ]);
  }));

  it('should write output to both debug folder and normal result', co.wrap(function* () {
    let mochaFixturePath = path.join(fixturePath, 'node_modules', 'mocha');

    let results = yield debug(mochaFixturePath, {name: 'debug'});
    let files = walkSync(mochaFixturePath);
    let outputDir = results.directory;

    files.forEach(file => {
      if (file.slice(-1) === '/') { return; }

      let debugPath = path.join(process.cwd(), 'DEBUG', 'debug', file);
      let treeOutputPath = path.join(outputDir, file);
      let sourcePath = path.join(mochaFixturePath, file);

      let expected = fs.readFileSync(sourcePath, { encoding: 'utf8' });

      expect(fs.readFileSync(debugPath, { encoding: 'utf8' })).to.equal(expected);
      expect(fs.readFileSync(treeOutputPath, { encoding: 'utf8' })).to.equal(expected);
    });
  }));

  it('suports string second argument as label', co.wrap(function* () {
    let mochaFixturePath = path.join(fixturePath, 'node_modules', 'mocha');

    let results = yield debug(mochaFixturePath, 'debug2');
    let outputDir = results.directory;

    let debugPath = path.join(process.cwd(), 'DEBUG', 'debug2');
    expect(fs.existsSync(debugPath)).to.be.true;
  }));

  it('should write files to disk in correct folder', co.wrap(function* () {
    let results = yield debug(_find('node_modules/mocha'), {name: 'debug'});
    let files = results.files;

    let base = 'tests/fixtures/';
    let debugDir = path.join(process.cwd(), 'DEBUG/debug');
    let fixture = path.join(process.cwd(), base + 'node_modules/mocha/mocha.js');

    files.forEach(file => {
      expect(fs.existsSync(path.join(debugDir, file))).to.be.ok;
    });

    expect(fs.readFileSync(path.join(debugDir, 'node_modules/mocha/mocha.js'), {
      encoding: 'utf8'
    })).to.equal(fs.readFileSync(fixture, {encoding: 'utf8'}));
  }));

  it('should write files to disk in correct folder with dir option', co.wrap(function* () {
    let results = yield debug(_find('node_modules/mocha'), { name: 'debug', dir: 'mydir' })
    let files = results.files;

    let base = 'tests/fixtures/';
    let debugDir = path.join(process.cwd(), base + 'mydir/debug');
    let fixture = path.join(process.cwd(), base + 'node_modules/mocha/mocha.js');

    files.forEach(file => {
      expect(fs.existsSync(path.join(debugDir, file))).to.be.ok;
    });

    expect(fs.readFileSync(path.join(debugDir, 'node_modules/mocha/mocha.js'), {
      encoding: 'utf8'
    })).to.equal(fs.readFileSync(fixture, {encoding: 'utf8'}));
  }));
});
