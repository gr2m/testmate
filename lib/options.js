var extend = require('extend');
var defaults = {
  client: process.env.TEST_CLIENT || 'node'
};
var glob = require('glob');

module.exports = function (args) {
  var testFiles = glob.sync(args.testsPath);
  return extend({}, defaults, args, {
    testFiles: testFiles
  });
};
