var Mocha = require('mocha');
var chai = require('chai');

global.expect = chai.expect;

// https://github.com/mochajs/mocha/wiki/Using-mocha-programmatically
module.exports = function(options, callback) {
  var mocha = new Mocha(options);

  options.testFiles.forEach(mocha.addFile.bind(mocha));

  // Now, you can run the tests.
  mocha.run(function(failures){
    process.on('exit', function () {
      callback(failures);
    });
  });
};
