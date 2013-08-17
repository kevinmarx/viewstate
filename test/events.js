var assert = require('assert')
var ViewState = require('../lib/viewstate')
var _ = require('underscore')
var sinon = require('sinon')
var fixture = new require('./fixture')()

var State
var testObj = fixture.testObj()

beforeEach(function() {
  State = new ViewState(testObj)
})

describe('events', function() {

  it('triggers change on add', function() {
    var spy = sinon.spy()
    State.on('change', spy, this)
    State.add('addedState')
    assert(spy.calledOnce)
  })

  it('triggers change on remove', function() {
    var spy = sinon.spy()
    State.on('change', spy, this)
    State.remove('singularState')
    assert(spy.calledOnce)
  })

  it('passes itself as an argument on change', function() {
    var spy = sinon.spy()
    var obj
    State.on('change', function(state) { spy(); obj = state}, this)
    State.add('addedState')
    assert(spy.calledOnce)
    assert(obj)
    assert(obj instanceof ViewState)
  })

  it('triggers multiple change events', function() {
    var spy = sinon.spy()
    State.on('change:addedState', spy, this)
    State.add('addedState', ['spinning', 'loading', 'updating'])
    assert.equal(spy.callCount, 3)
  })

  it('passes itself and the state as arguments for a single state', function() {
    var args
    State.on('change:addedState', function() { args = arguments }, this)
    State.add('addedState')
    assert(args['0'] && args['0'] instanceof ViewState)
    assert(args['1'] && typeof args['1'] === 'boolean')
  })

  it('passes itself and the states as arguments for nested states', function() {
    var args
    State.on('change:addedState', function() { args = arguments }, this)
    State.add('addedState', ['spinning', 'loading'])
    assert(args['0'] && args['0'] instanceof ViewState)
    assert(args['1'] && typeof args['1'] === 'object')
  })

  it('scopes nested changes', function() {
    var spy = sinon.spy()
    State.on('change:addedState:spinning', spy, this)
    State.add('addedState', ['spinning', 'loading'])
    assert(spy.calledOnce)
  })

  it('triggers reset', function() {
    var spy = sinon.spy()
    State.on('reset', spy, this)
    State.reset()
    assert(spy.calledOnce)
  })

  it('triggers scoped reset event when item is passed', function() {
    var spy = sinon.spy()
    State.on('reset:singularState', spy, this)
    State.reset('singularState')
    assert(spy.calledOnce)
  })

  it('passes itself as an argument on reset', function() {
    var args
    State.on('reset', function() { args = arguments }, this)
    State.reset()
    assert(args['0'] instanceof ViewState)
  })

  it('triggers clear', function() {
    var spy = sinon.spy()
    State.on('clear', spy, this)
    State.clear()
    assert(spy.calledOnce)
  })

  it('passes itself as an argument on clear', function() {
    var args
    State.on('clear', function() { args = arguments }, this)
    State.clear()
    assert(args['0'] instanceof ViewState)
  })

  it("doesn't trigger on add with silent", function() {
    var spy = sinon.spy()
    State.on('change', spy, this)
    State.add('addedState', null, {silent: true})
    assert(!spy.called)
  })

  it("doesn't trigger on remove with silent", function() {
    var spy = sinon.spy()
    State.on('change', spy, this)
    State.remove('singularState', {silent: true})
    assert(!spy.called)
  })

})
