'use strict';

var expect = require('chai').expect
  , sinon = require('sinon');

describe('generate-cache-key', function () {

  var mod, ARGS, FN;

  beforeEach(function () {
    mod = require('../lib/generate-cache-key');
    ARGS = [1, 2];
    FN = sinon.spy();
  });

  it('should create key using defaults', function () {
    var ret = mod({}, ARGS, FN);

    expect(ret).to.equal('proxy-' + JSON.stringify(ARGS));
  });

  it('should create key using custom handler', function () {
    var keyStub = sinon.stub();
    keyStub.returns('a');

    var ret = mod({
      genCacheKey: keyStub
    }, ARGS, FN);

    expect(ret).to.equal('a');
    expect(keyStub.getCall(0).args).to.deep.equal([FN, ARGS]);
  });
});
