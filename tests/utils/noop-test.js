'use strict';

const Noop = require('../../lib/utils/noop');
const chai = require('chai');
const expect = chai.expect;
const helper  = require('broccoli-test-helper');
const createBuilder = helper.createBuilder;
const createTempDir = helper.createTempDir;
const co = require('co');

describe('noop', function() {
  let input;
  let subject;
  let output;
  let count = 0;

  beforeEach(() => {
    return createTempDir().then(_input => {
      input = _input;
      subject = new Noop(input.path(), {
        build() {
          count++;
        }
      });
      output = createBuilder(subject);
    });
  });

  it('it called before the inputTree builds', co.wrap(function* () {
    input.write({
      'index.js': `export { A } from './lib/a';`,
      'lib': {
        'a.js': `export class A {};`,
        'b.js': `export class B {};`,
        'c.js': `export class C {};`
      }
    });

    expect(count).to.eql(0);
    yield output.build();
    expect(count).to.eql(1);
    expect(output.changes()).to.deep.eql({
      'index.js': 'create',
      'lib/': 'mkdir',
      'lib/a.js': 'create',
      'lib/b.js': 'create',
      'lib/c.js': 'create'
    });

    expect(output.read()).to.deep.equal({
      'index.js': `export { A } from './lib/a';`,
      'lib': {
        'a.js': `export class A {};`,
        'b.js': `export class B {};`,
        'c.js': `export class C {};`
      }
    });

    yield output.build();
    expect(count).to.eql(2);
    expect(output.changes()).to.deep.eql({});
    expect(output.read()).to.deep.equal({
      'index.js': `export { A } from './lib/a';`,
      'lib': {
        'a.js': `export class A {};`,
        'b.js': `export class B {};`,
        'c.js': `export class C {};`
      }
    });
  }));
});
