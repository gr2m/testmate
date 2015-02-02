/* globals describe, it, expect */

var foo = require('./example-lib');

describe('myLib', function () {
  it('should pass', function () {
    expect(foo()).to.equal('bar');
  });
  it.skip('should not pass', function () {
    expect('foo').to.equal('bar');
  });
});
