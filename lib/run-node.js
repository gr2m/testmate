var Mocha = require('mocha');
var glob = require('glob');
var chai = require('chai');

global.expect = chai.expect;

// https://github.com/mochajs/mocha/wiki/Using-mocha-programmatically
module.exports = function(options) {
  var mocha = new Mocha(options);
  var testFiles = glob.sync(options.testsPath);

  testFiles.forEach(mocha.addFile.bind(mocha));

  // Now, you can run the tests.
  mocha.run(function(failures){
    process.on('exit', function () {
      process.exit(failures);
    });
  });
};
