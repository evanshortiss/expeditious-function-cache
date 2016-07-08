'use strict';

var log = require('./util/log');

// Our slow function that we will speed up
var slowFunction = require('./util/slow-function');

// We use expeditious as the storage engine for caching`
var expeditious = require('expeditious');

// Returns a function to wrap slow functions with a cache layer
var expeditiousFnCache = require('../lib/cache-function.js');

// Our instance that can be used to wrap functions
var expedite = expeditiousFnCache({
  // An expeditious instance that will hold cached data
  expeditious: expeditious({
    namespace: 'cachedFunctions',
    engine: require('expeditious-engine-memory')(),
    defaultTtl: (10 * 1000)
  })
});

// Version of "slowFunction" that will have results cached
var cachedFunction = expedite(slowFunction);

log('make first call, this will take 3 seconds');
cachedFunction(function (err, data) {
  log('first call finished. result:', data);
  log('make second call, this will return almost immediately');

  cachedFunction(function (err, data) {
    log('second call finished, should match the first result:', data);
    log('program will hang until cached items expire (defaultTtl)');
  });
});
