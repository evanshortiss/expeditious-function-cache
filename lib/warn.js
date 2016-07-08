'use strict';

// Logs a warning prefixed with this module's name
module.exports = function () {
  // Append the module name
  var args = Array.prototype.slice.call(arguments);
  args[0] = require('../package.json').name + ' - ' + args[0];

  console.warn.apply(console, args);
};
