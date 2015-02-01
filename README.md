# wurst

> [wɜːst] A tasty end-to-end test runner for JavaScript Libraries

[![Build Status](https://api.travis-ci.org/gr2m/wurst.svg?branch=master)](https://travis-ci.org/gr2m/wurst/)

Write tests once, run them in

1. Node
2. local Browsers using Selenium
3. remote Browsers / Plattforms using [saucelabs](https://saucelabs.com/).

## Example

Let's assume this is your `test/test-mylib.js`

```js
describe('myLib', function () {
  it('should pass', function () {
    expect(myLib('foo')).to.be('bar');
  });
});
```

Then you can run it with different clients

```js
# run in node
WURST_CLIENT=node wurst test/test-mylib.js

# run in local browser
WURST_CLIENT=selenium:firefox wurst test/test-mylib.js

# run in any browser/plattform/version using saucelabs
SAUCE_USERNAME="user" SAUCE_ACCESS_KEY="key" WURST_CLIENT="saucelabs:internet explorer:10:Windows 8" wurst test/test-mylib.js
```

## wurst?

> Everything has one end, only wurst has two.

—[Stephan Remmler](https://www.youtube.com/watch?v=a4JSE32fuOc)

## License

MIT
