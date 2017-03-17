'use strict';

const _map = require('../lib/map');
const _find = require('../lib/find');
const path = require('path');
const chai = require('chai');
const expect = chai.expect;
const fs = require('fs');
const helpers = require('broccoli-test-helpers');
const makeTestHelper = helpers.makeTestHelper;
const cleanupBuilders = helpers.cleanupBuilders;
const co = require('co');

describe('map', function() {
  let fixturePath = path.join(__dirname, 'fixtures');

  afterEach(function() {
    return cleanupBuilders();
  });

  function fixtureContent(p) {
    return fs.readFileSync(path.join(fixturePath, p)).toString();
  }

  let map = makeTestHelper({
    subject: _map,
    fixturePath: fixturePath,
    filter: function(paths, inputTree) {
      return paths.filter(function(p) { return !/\/$/.test(p); }).reduce(function(files, p) {
               files[p] = fs.readFileSync(path.join(inputTree.directory, p)).toString();
               return files;
             }, {});
    }
  });

  describe('tree and mapper', function() {
    it('identity', co.wrap(function* () {
      let results = yield map(_find('node_modules/**/*'), content => content);
      let files = results.files;

      expect(files['node_modules/foo/foo.css'       ]).to.eql(fixtureContent('node_modules/foo/foo.css'));
      expect(files['node_modules/mocha/mocha.css'   ]).to.eql(fixtureContent('node_modules/mocha/mocha.css'));
      expect(files['node_modules/mocha/mocha.js'    ]).to.eql(fixtureContent('node_modules/mocha/mocha.js'));
      expect(files['node_modules/mocha/package.json']).to.eql(fixtureContent('node_modules/mocha/package.json'));
    }));

    it('prepend', co.wrap(function* () {
      let results = yield map(_find('node_modules/**/*'), content => 'hi\n' + content);
      let files = results.files;

      expect(files['node_modules/foo/foo.css'       ]).to.eql('hi\n' + fixtureContent('node_modules/foo/foo.css'));
      expect(files['node_modules/mocha/mocha.css'   ]).to.eql('hi\n' + fixtureContent('node_modules/mocha/mocha.css'));
      expect(files['node_modules/mocha/mocha.js'    ]).to.eql('hi\n' + fixtureContent('node_modules/mocha/mocha.js'));
      expect(files['node_modules/mocha/package.json']).to.eql('hi\n' + fixtureContent('node_modules/mocha/package.json'));
    }));
  });

  describe('tree, filter and mapper', function() {
    it('leaves all files but the match alone', co.wrap(function* () {
      let count = 0;
      let results = yield map(_find('node_modules/**/*'), '**/*.js', (content, relativePath) => {
        expect(relativePath).to.eql('node_modules/mocha/mocha.js');
        count++;
        return 'hi\n' + content;
      });
      let files = results.files;

      expect(count).to.eql(1);
      expect(files['node_modules/foo/foo.css'       ]).to.eql(fixtureContent('node_modules/foo/foo.css'));
      expect(files['node_modules/mocha/mocha.css'   ]).to.eql(fixtureContent('node_modules/mocha/mocha.css'));
      expect(files['node_modules/mocha/mocha.js'    ]).to.eql('hi\n' + fixtureContent('node_modules/mocha/mocha.js'));
      expect(files['node_modules/mocha/package.json']).to.eql(fixtureContent('node_modules/mocha/package.json'));
    }));

    it('prepend', co.wrap(function* () {
      let results = yield map(_find('node_modules/**/*'), content => 'hi\n' + content);
      let files = results.files;

      expect(files['node_modules/foo/foo.css'       ]).to.eql('hi\n' + fixtureContent('/node_modules/foo/foo.css'));
      expect(files['node_modules/mocha/mocha.css'   ]).to.eql('hi\n' + fixtureContent('/node_modules/mocha/mocha.css'));
      expect(files['node_modules/mocha/mocha.js'    ]).to.eql('hi\n' + fixtureContent('/node_modules/mocha/mocha.js'));
      expect(files['node_modules/mocha/package.json']).to.eql('hi\n' + fixtureContent('/node_modules/mocha/package.json'));
    }));
  });
});
