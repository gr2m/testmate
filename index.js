var runNode = require('./lib/run-node');

module.exports = function(args, callback) {
  var options = require('./lib/options')(args);

  if (options.client === 'node') {
    runNode(options, callback);
  } else {
    throw new Error(options.client + ' is not supported.');
  }
};
