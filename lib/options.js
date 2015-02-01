var extend = require('extend');
var defaults = {
  client: process.env.WURST_CLIENT || 'node'
};

module.exports = function (args) {
  return extend({}, defaults, args);
};
