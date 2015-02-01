var runNode = require('./lib/run-node');
var runBrowser = require('./lib/run-browser');

module.exports = function(args, callback) {
  var options = require('./lib/options')(args);

  if (options.client === 'node') {
    return runNode(options, callback);
  }
  if (/^selenium/.test(options.client)) {
    return runBrowser(options, callback);
  }
  if (/^saucelabs/.test(options.client)) {
    return runBrowser(options, callback);
  }

  throw new Error(options.client + ' is not supported.');
};
