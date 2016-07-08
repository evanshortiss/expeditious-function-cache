'use strict';

var log = require('./log');

module.exports = function (opts, args, fn) {
  var ret = null;
  if (opts.genCacheKey) {
    log('generating cache key for "%s" with custom function', fn.name);
    ret = opts.genCacheKey(fn, args);
  } else {
    log('generating cache key for "%s" with default function', fn.name);
    ret = fn.name + '-' + JSON.stringify(args);
  }

  log('generated cache key "%s"', ret);

  return ret;
};
