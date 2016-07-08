'use strict';

module.exports = function slowFunction (callback) {
  setTimeout(function () {
    callback(null, 'Random Number: ' + Math.random() * 1000);
  }, 3000);
};
