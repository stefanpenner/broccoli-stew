var _map = require('../lib/map');
var _find = require('../lib/find');
var path = require('path');
var chai = require('chai');
var expect = chai.expect;
var fs = require('fs');
var helpers = require('broccoli-test-helpers');
var makeTestHelper = helpers.makeTestHelper;
var cleanupBuilders = helpers.cleanupBuilders;

describe('map', function() {
  var fixturePath = path.join(__dirname, 'fixtures');

  afterEach(function() {
    return cleanupBuilders();
  });

  function fixtureContent(p) {
    return fs.readFileSync(path.join(fixturePath, p)).toString();
  }

  var map = makeTestHelper({
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
    it('identity', function() {
      return map(_find('node_modules/**/*'), function(content) {
        return content;
      }).then(function(results) {
        var files = results.files;

        expect(files['node_modules/foo/foo.css'       ]).to.eql(fixtureContent('node_modules/foo/foo.css'));
        expect(files['node_modules/mocha/mocha.css'   ]).to.eql(fixtureContent('node_modules/mocha/mocha.css'));
        expect(files['node_modules/mocha/mocha.js'    ]).to.eql(fixtureContent('node_modules/mocha/mocha.js'));
        expect(files['node_modules/mocha/package.json']).to.eql(fixtureContent('node_modules/mocha/package.json'));
      });
    });

    it('prepend', function() {
      return map(_find('node_modules/**/*'), function(content) {
        return 'hi\n' + content;
      }).then(function(results) {
        var files = results.files;

        expect(files['node_modules/foo/foo.css'       ]).to.eql('hi\n' + fixtureContent('node_modules/foo/foo.css'));
        expect(files['node_modules/mocha/mocha.css'   ]).to.eql('hi\n' + fixtureContent('node_modules/mocha/mocha.css'));
        expect(files['node_modules/mocha/mocha.js'    ]).to.eql('hi\n' + fixtureContent('node_modules/mocha/mocha.js'));
        expect(files['node_modules/mocha/package.json']).to.eql('hi\n' + fixtureContent('node_modules/mocha/package.json'));
      });
    });
  });

  describe('tree, filter and mapper', function() {
    it('leaves all files but the match alone', function() {
      var count = 0;
      return map(_find('node_modules/**/*'), '**/*.js', function(content, relativePath) {
        expect(relativePath).to.eql('node_modules/mocha/mocha.js');
        count++;
        return 'hi\n' + content;
      }).then(function(results) {
        var files = results.files;

        expect(count).to.eql(1);
        expect(files['node_modules/foo/foo.css'       ]).to.eql(fixtureContent('node_modules/foo/foo.css'));
        expect(files['node_modules/mocha/mocha.css'   ]).to.eql(fixtureContent('node_modules/mocha/mocha.css'));
        expect(files['node_modules/mocha/mocha.js'    ]).to.eql('hi\n' + fixtureContent('node_modules/mocha/mocha.js'));
        expect(files['node_modules/mocha/package.json']).to.eql(fixtureContent('node_modules/mocha/package.json'));
      });
    });

    it('prepend', function() {
      return map(_find('node_modules/**/*'), function(content) {
        return 'hi\n' + content;
      }).then(function(results) {
        var files = results.files;

        expect(files['node_modules/foo/foo.css'       ]).to.eql('hi\n' + fixtureContent('/node_modules/foo/foo.css'));
        expect(files['node_modules/mocha/mocha.css'   ]).to.eql('hi\n' + fixtureContent('/node_modules/mocha/mocha.css'));
        expect(files['node_modules/mocha/mocha.js'    ]).to.eql('hi\n' + fixtureContent('/node_modules/mocha/mocha.js'));
        expect(files['node_modules/mocha/package.json']).to.eql('hi\n' + fixtureContent('/node_modules/mocha/package.json'));
      });
    });

    it('should keep output paths stable across builds', function() {
      var args = [];
      var builds = [];
      var Filter = require('cauliflower-filter');
      function F(inputTree) {
        'use strict';
        if (!this) return new F(inputTree);
        Filter.call(this, inputTree);
      }
      F.prototype = Object.create(Filter.prototype);
      F.prototype.canProcessFile = function() { return true; };
      F.prototype.processString = function(string, relativePath) {
        args.push({
          string: string,
          relativePath: relativePath,
          inputPath: this.inputPath
        });
        return 'STABLE\n' + string;
      };

      var f = makeTestHelper({
        subject: F,
        fixturePath: fixturePath,
        filter: function(paths, inputTree) {
          return paths.filter(function(p) { return !/\/$/.test(p); }).reduce(function(files, p) {
                   files[p] = fs.readFileSync(path.join(inputTree.directory, p)).toString();
                   return files;
                 }, {});
        }
      });

      var cachePath;
      var outputPath;
      var inputPath;
      var files;

      var finder = _find('node_modules/**/*');
      var mapper = _map(finder, function(content) {
        return 'hi\n' + content;
      });

      return f(mapper).then(function(results) {
        var files = results.files;
        expect(files['node_modules/foo/foo.css'       ]).to.eql('STABLE\nhi\n' + fixtureContent('/node_modules/foo/foo.css'));
        expect(files['node_modules/mocha/mocha.css'   ]).to.eql('STABLE\nhi\n' + fixtureContent('/node_modules/mocha/mocha.css'));
        expect(files['node_modules/mocha/mocha.js'    ]).to.eql('STABLE\nhi\n' + fixtureContent('/node_modules/mocha/mocha.js'));
        expect(files['node_modules/mocha/package.json']).to.eql('STABLE\nhi\n' + fixtureContent('/node_modules/mocha/package.json'));

        expect(args.length).to.equal(4);
        builds.push(args);
        args = [];

        // Bust the filter's Cache
        results.subject._cache.deleteExcept([]);

        // Rebuild to verify build stability
        return results.builder();
      }).then(function(results) {
        var files = results.files;
        expect(files['node_modules/foo/foo.css'       ]).to.eql('STABLE\nhi\n' + fixtureContent('/node_modules/foo/foo.css'));
        expect(files['node_modules/mocha/mocha.css'   ]).to.eql('STABLE\nhi\n' + fixtureContent('/node_modules/mocha/mocha.css'));
        expect(files['node_modules/mocha/mocha.js'    ]).to.eql('STABLE\nhi\n' + fixtureContent('/node_modules/mocha/mocha.js'));
        expect(files['node_modules/mocha/package.json']).to.eql('STABLE\nhi\n' + fixtureContent('/node_modules/mocha/package.json'));

        expect(args.length).to.equal(4);
        expect(builds[0]).to.eql(args);
      });
    });
  });
});
