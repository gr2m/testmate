# testmate

> A humble cross node/browser/saucelabs test runner

[![Build Status](https://api.travis-ci.org/gr2m/testmate.svg?branch=master)](https://travis-ci.org/gr2m/testmate/)
[![Dependencies Status](https://david-dm.org/gr2m/testmate.svg)](https://david-dm.org/gr2m/testmate)

Write tests once, run them in

1. Node
2. local Browsers using Selenium
3. remote Browsers / Plattforms using [saucelabs](https://saucelabs.com/).

`testmate` is very opiniated. It runs tests using

- [mocha](http://mochajs.org/)
- [chai](http://chaijs.com/)
- [browserify](http://browserify.org/) for browser testing.

## Example

Let's assume this is your `test/test-mylib.js`

```js
var myLib = require('./my-lib');
describe('myLib', function () {
  it('should pass', function () {
    expect(myLib('foo')).to.be('bar');
  });
});
```

Then you can run it with different clients

```js
# run in node (default)
testmate --client=node test/test-mylib.js

# run in local browser
testmate --client=selenium:firefox test/test-mylib.js

# run in any browser/plattform/version using saucelabs
SAUCE_USERNAME="user" SAUCE_ACCESS_KEY="key" testmate client="saucelabs:internet explorer:10:Windows 8" test/test-mylib.js

# instead of passing --client, you can also set the TEST_CLIENT env variable
```

## Projects testing with testmate

- [initials](https://github.com/gr2m/initials)

add yours, send a pull request <3

## Credits

The idea and lots of its code is taken from [PouchDB](https://github.com/pouchdb/pouchdb)'s
test setup.

## License

MIT
