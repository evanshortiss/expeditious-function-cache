'use strict';

var warn = require('./warn');

/**
 * Returns a callback that will be passed to a cached function instead of the
 * callback a developer supplied. This allows us to cache the function result
 * @param  {Object}   opts
 * @param  {String}   cacheKey
 * @param  {Function} callback
 * @return {Function}
 */
module.exports = function getCachingCallback (opts, cacheKey, callback) {

  function cacheResponse (data) {
    var params = {
      key: cacheKey,
      val: data,
      ttl: opts.ttl
    };

    opts.expeditious.set(params, function (err) {
      if (err) {
        warn('failed to cache data with key %s', cacheKey, err);
      }
    });
  }

  return function _onOriginalFunctionComplete (err, data) {
    if (!err) {
      // No error occurred, cache this response!
      cacheResponse(data);
    }

    callback(err, data);
  };
};
