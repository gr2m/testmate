# wurst

> [wɜːst] A tasty end-to-end test runner for JavaScript Libraries

[![Build Status](https://api.travis-ci.org/gr2m/wurst.svg?branch=master)](https://travis-ci.org/gr2m/wurst/)
[![Dependencies Status](https://david-dm.org/gr2m/wurst.svg)](https://david-dm.org/gr2m/wurst)

Write tests once, run them in

1. Node
2. local Browsers using Selenium
3. remote Browsers / Plattforms using [saucelabs](https://saucelabs.com/).

`wurst` is very opiniated. It runs tests using

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
wurst --client=node test/test-mylib.js

# run in local browser
wurst --client=selenium:firefox test/test-mylib.js

# run in any browser/plattform/version using saucelabs
SAUCE_USERNAME="user" SAUCE_ACCESS_KEY="key" wurst client="saucelabs:internet explorer:10:Windows 8" test/test-mylib.js

# instead of passing --client, you can also set the WURST_CLIENT env variable
```

## Projects testing with wurst

- [initials](https://github.com/gr2m/initials)

add yours, send a pull request <3

## wurst?

> Everything has one end, only wurst has two.

—[Stephan Remmler](https://www.youtube.com/watch?v=a4JSE32fuOc)

## License

MIT
