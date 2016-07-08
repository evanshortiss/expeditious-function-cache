'use strict';

var warn = require('./warn')
  , log = require('./log')
  , assert = require('assert')
  , xtend = require('xtend')
  , isObject = require('is-object');

module.exports = function (opts) {

  assert(
    isObject(opts.expeditious),
    'opts.expeditious must be an expeditious instance'
  );


  log('creating function cacher');

  /**
   * Wrap a function so that it is cached.
   * @param  {Object}   [localOpts]   Overrides for the the default options
   * @param  {Function} fn            The function to cache results from
   * @return {Function}
   */
  return function expeditiousifyFunction (localOpts, fn) {

    // localOpts is an optional parameter
    if (typeof localOpts === 'function') {
      fn = localOpts;
      localOpts = {};
    }

    log('caching function "%s"', fn.name);

    // localOpts inherits properites from original opts
    localOpts = xtend(localOpts, opts);

    var generateCacheKey = require('./generate-cache-key');
    var getCachingCallback = require('./cache-callback');

    return function _expeditedFuction (/* developer args */) {

      log('running cached function %s', fn.name);

      // Arguments a developer passed to cached function
      var args = Array.prototype.slice.call(arguments);

      // The callback the developer passed to the wrapped function
      var callback = args[args.length - 1];

      // Key that will be used to cache data
      var cacheKey = null;

      try {
        cacheKey = generateCacheKey(localOpts, args, fn);
      } catch (e) {
        warn(
          'failed to generate cache key for function for "%s"\n',
          fn.name,
          e.stack
        );

        // Fallthrough and just call the function as normal
        return fn.apply(fn, args);
      }

      function onCachedData (err, data) {
        if (err) {
          warn(
            'error reading cache for expedited function\n',
            err.stack
          );
        } else if (data) {
          callback(null, data);
        } else {
          // Call the original function, but substitue the callback with our
          // own one so we can cache the results
          args[args.length - 1] = getCachingCallback(
            localOpts,
            cacheKey,
            callback
          );

          fn.apply(fn, args);
        }
      }

      opts.expeditious.get({
        key: cacheKey
      }, onCachedData);
    };

  };
};
