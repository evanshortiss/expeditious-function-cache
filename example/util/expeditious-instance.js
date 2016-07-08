'use strict';

// We use expeditious as the storage engine for caching`
var expeditious = require('expeditious');

module.exports = expeditious({
  namespace: 'cachedFunctions',
  engine: require('expeditious-engine-memory')(),
  defaultTtl: (10 * 1000)
});
