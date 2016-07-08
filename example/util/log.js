'use strict';

module.exports = function log () {
  console.log.apply(
    console,
    [new Date().toJSON(), '-'].concat(Array.prototype.slice.call(arguments))
  );
};
