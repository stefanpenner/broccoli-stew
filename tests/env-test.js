var assert = require('assert');
var env = require('../lib/env');

describe('env', function() {
  ['BROCCOLI_ENV', 'EMBER_ENV'].forEach(function(ENV_VAR) {
    afterEach(function() {
      delete process.env[ENV_VAR];
    });

    describe('no env', function() {
      it('invokes the callback', function() {
        var wasInvoked = false;

        env('development', function() {
          wasInvoked = true;
        });
        assert(wasInvoked);
      });
    });

    describe('development', function() {
      it('invokes the calback', function() {
        var wasInvoked = false;

        env('development', function() {
          wasInvoked = true;
        });
        assert(wasInvoked);
      });
    });

    describe('production', function() {
      beforeEach(function() {
        process.env[ENV_VAR] = 'production';
      });

      it('does NOT invoke the development callback', function() {
        var wasInvoked = false;

        env('development', function() {
          wasInvoked = true;
        });

        assert(!wasInvoked);
      });

      it('does invoke the production callback', function() {
        var wasInvoked = false;

        env('production', function() {
          wasInvoked = true;
        });

        assert(wasInvoked);
      });

      it('does NOT invoke the !production callback', function() {
        var wasInvoked = false;

        env('!production', function() {
          wasInvoked = true;
        });

        assert(!wasInvoked);
      });

      it('does invoke the development,production callback', function() {
        var wasInvoked = false;

        env('development', 'production', function() {
          wasInvoked = true;
        });

        assert(wasInvoked);
      });

      it('does NOT invoke the development,!production callback', function() {
        var wasInvoked = false;

        env('development', '!production', function() {
          wasInvoked = true;
        });

        assert(!wasInvoked);
      });
    })
  });
});
