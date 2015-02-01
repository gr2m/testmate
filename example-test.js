/* globals describe, it, expect */

describe('myLib', function () {
  it('should pass', function () {
    var foo = 'bar';
    expect(foo).to.equal('bar');
  });
  it.skip('should not pass', function () {
    expect('foo').to.equal('bar');
  });
});
