'use strict';

var expect = require('chai').expect
  , sinon = require('sinon');

describe('cache-callback', function () {

  var mod, cbStub, expeditious, CACHE_KEY, ttl;

  beforeEach(function () {
    mod = require('../lib/cache-callback');
    cbStub = sinon.stub();
    expeditious = {
      set: sinon.stub()
    };
    CACHE_KEY = 'the-key';
    ttl = 1000;
  });

  it('should return a function', function () {
    var ret = mod({
      ttl: ttl,
      expeditious: expeditious
    }, CACHE_KEY, cbStub);

    expect(ret).to.be.a('function');
    expect(cbStub.called).to.be.false;
  });

  it('should not call expeditious.set on error being passed', function () {
    var ret = mod({
      ttl: ttl,
      expeditious: expeditious
    }, CACHE_KEY, cbStub);
    var err = new Error('oops');

    ret(err, null);

    expect(cbStub.called).to.be.true;
    expect(cbStub.getCall(0).args).to.deep.equal([err, null]);
    expect(expeditious.set.called).to.be.false;
  });

  it('should call expeditious.set on success', function () {
    var ret = mod({
      ttl: ttl,
      expeditious: expeditious
    }, CACHE_KEY, cbStub);
    var err = null;
    var data = {};

    ret(err, data);

    expect(cbStub.called).to.be.true;
    expect(cbStub.getCall(0).args).to.deep.equal([err, data]);
    expect(expeditious.set.called).to.be.true;
    expect(expeditious.set.getCall(0).args[0]).to.deep.equal({
      key: CACHE_KEY,
      val: data,
      ttl: ttl
    });
  });
});
