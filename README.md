expeditious-function-cache
==========================

Cache slow running functions using expeditious instances.

## Example
```js
'use strict';
var expeditious = require('expeditious');

var expedite = require('expeditious-function-cache')({
  expeditious: expeditious({
    namespace: 'cachedFunctions',
    engine: require('expeditious-engine-memory')(),
    defaultTtl: (10 * 1000)
  })
});

var cachedFunction = expedite(require('./slow-function.js'));

// This call will be slow...
cachedFunction(function (err, data) {

  // This will return the cached response immediately!
  cachedFunction(function (err, data) {});
});
```

## API
This module is a function that acts as a factory to create a unique function
that can be used to cache many functions.

#### module(opts)
Generate an _instance_ of this module. Currently supported options are:

* [Required] expeditious - An _expeditious_ instance that will be used to
perform caching.
* [Optional] ttl - Override for the _defaultTtl_, passed to _expeditious_. The
time for a cached response to survive.

Example:

```js
var expedite = require('expeditious-function-cache')({
  expeditious: require('expeditious')({
    namespace: 'cachedFunctions',
    engine: require('expeditious-engine-memory')(),
    defaultTtl: (10 * 1000)
  }),
  ttl: (120 * 1000)
});

var cached = expedite(require('./slow-function.js'))
```

#### instance([opts,] fn)
An instance is used to cache functions. It optionally accepts some options
that are the same as those passed to _module_ calls. The _opts_ passed here
will override options passed to _module_ for this specific function only.

Example:

```js
var expedite = require('expeditious-function-cache')({
  expeditious: require('./my-expeditous-instance'),
  ttl: (120 * 1000)
});

var cachedFunction = expedite({
  // Override the ttl above, but just for this function
  ttl: (30 * 1000)
}, require('./slow-function.js'));

```

## Behaviours

#### Cached Functions
Functions that you could like to cache _must_ take a callback as their last
parameter as per node.js conventions.

Example function:

```js
function slowFunction (params, callback) {
  setTimeout(function () {
    callback(null, 'response');
  }, 1000)
}
```

#### Cached Results
Since a function might take multiple parameters and therefore return different
results this needs to be taken into account when caching. By default
_expeditious-function-cache_ will cache results uniquely based on the args
provided.

This means these two calls would each generate a unique cache entry and
subsequent calls with matching arguments will return the same data for the given args. Neato!

```js
var slowFunction = require('./slow-function.js');

var expeditious = require('expeditious');

var expedite = require('expeditious-function-cache')({
  expeditious: expeditious({
    namespace: 'cachedFunctions',
    engine: require('expeditious-engine-memory')(),
    defaultTtl: (10 * 1000)
  })
});

var cachedFunction = expedite(slowFunction);

cachedFunction({
  name: 'john'
}, function (err, resultForJohn) {});

cachedFunction({
  name: 'john'
}, function (err, resultForJane) {});
```

## TODO

* Improve testing
* Handle potential type coercion requirements
