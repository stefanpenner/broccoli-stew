'use strict';

const expect = require('chai').expect;
const env = require('../lib/env');

describe('env', function() {
  ['BROCCOLI_ENV', 'EMBER_ENV'].forEach(function(ENV_VAR) {
    afterEach(function() {
      delete process.env[ENV_VAR];
    });

    describe('no env', function() {
      it('invokes the callback', function() {
        let wasInvoked = false;

        env('development', () => wasInvoked = true);
        expect(wasInvoked).to.eql(true);
      });
    });

    describe('development', function() {
      it('invokes the calback', function() {
        let wasInvoked = false;

        env('development', () => wasInvoked = true);
        expect(wasInvoked).to.eql(true);
      });
    });

    describe('production', function() {
      beforeEach(function() {
        process.env[ENV_VAR] = 'production';
      });

      it('does NOT invoke the development callback', function() {
        let wasInvoked = false;

        env('development', () => wasInvoked = true);
        expect(wasInvoked).to.eql(false);
      });

      it('does invoke the production callback', function() {
        let wasInvoked = false;

        env('production', () => wasInvoked = true);

        expect(wasInvoked).to.eql(true);
      });

      it('does NOT invoke the !production callback', function() {
        let wasInvoked = false;

        env('!production', () => wasInvoked = true);

        expect(wasInvoked).to.eql(false);
      });

      it('does invoke the development,production callback', function() {
        let wasInvoked = false;

        env('development', 'production', () => wasInvoked = true);

        expect(wasInvoked).to.eql(true);
      });

      it('does NOT invoke the development,!production callback', function() {
        let wasInvoked = false;

        env('development', '!production', () => wasInvoked = true);

        expect(wasInvoked).to.eql(false);
      });
    });
  });
});
