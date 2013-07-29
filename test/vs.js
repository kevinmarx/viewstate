var assert = require('assert')
var ViewState = require('../lib/viewstate')
var _ = require('underscore')
var sinon = require('sinon')

var State
var testItem = {
  'nestedState': {
    'spinning': true,
    'loading': true,
    'disabled': true
  },
  'singularState': true
}

beforeEach(function() {
  State = new ViewState(testItem)
})

describe('ViewState initilization', function() {

  it('creates an instance', function() {
    assert(State)
  })

  it('creates an instance with initilization data', function() {
    assert(!_.isEmpty(State.states))
  })

  it('sets the initilization state on _initState', function() {
    assert(!_.isEmpty(State._initState))
  })

})

describe('get', function() {

  it('gets nested states for an item', function() {
    var s = State.get('nestedState')
    assert(s)
    assert(typeof s === 'object')
  })

  it('gets a singular state', function() {
    var s = State.get('singularState')
    assert(s)
    assert(typeof s === 'boolean')
  })

  it('gets item states with an array of states', function() {
    var s = State.get('nestedState', ['spinning', 'disabled'])
    assert(s)
    assert(typeof s === 'object')
  })

  it('gets item state with a singular string', function() {
    var s = State.get('nestedState', 'spinning')
    assert(s)
    assert(typeof s === 'boolean')
  })

})

describe('add', function() {

  it('adds singular states', function() {
    State.add('addedState')
    assert(State.get('addedState'))
  })

  it('adds to existing nested states', function() {
    State.add('nestedState', 'added')
    assert(_.keys(State.get('nestedState')).length === 4)
  })

  it('adds nested states', function() {
    State.add('addedState', ['loading', 'spinning'])
    var s = State.get('addedState')
    assert(s)
    assert(typeof s === 'object')
  })

  it('adds singular nested states by string', function() {
    State.add('addedState', 'loading')
    var s = State.get('addedState', 'loading')
    assert(s)
    assert(typeof s === 'boolean')
  })

  it('adds singular nested states with an array', function() {
    State.add('addedState', ['loading'])
    var s = State.get('addedState', 'loading')
    assert(s)
    assert(typeof s === 'boolean')
  })

  it('returns itself on add', function() {
    assert(State.add('addedState') instanceof ViewState)
  })

})

describe('remove', function() {

  it('removes singular states', function() {
    State.remove('singularState')
    assert(!State.get('singularState'))
  })

  it('removes a state with nested states', function() {
    State.remove('nestedState')
    assert(!State.get('nestedState'))
  })

  it('removes a nested state on an item', function() {
    State.remove('nestedState', 'spinning')
    assert(!State.get('nestedState', 'spinning'))
  })

  it('removes nested states on an item with an array', function() {
    State.remove('nestedState', ['spinning', 'loading'])
    assert(_.isEmpty(State.get('nestedState', ['spinning', 'loading'])))
  })

})

describe('reset', function() {

  it('resets all the states back to init state', function() {
    State.add('addedState')
    State.clear()
    State.reset()
    assert(State.get('nestedState'))
    assert(State.get('singularState'))
    assert(!State.get('addedState'))
  })

  it('resets a singular state back to init state', function() {
    State.remove('singularState')
    State.remove('nestedState')
    State.reset('singularState')
    assert(State.get('singularState'))
    assert(!State.get('nestedState'))
  })

  it('returns itself on reset', function() {
    assert(State.reset() instanceof ViewState)
  })

})

describe('clear', function() {

  it('clears all states that are set', function() {
    State.clear()
    assert(_.isEmpty(State.states))
  })

  it('returns itself on clear', function() {
    assert(State.clear() instanceof ViewState)
  })

})

describe('toJSON', function() {

  it('returns a JSON object of the current states', function() {
    var s = State.toJSON()
    assert(s)
    assert(typeof s === 'object')
    assert(JSON.stringify(s))
  })

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


