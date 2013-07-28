var assert = require('assert')
var ViewState = require('../lib/viewstate')
var _ = require('underscore')
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

})

describe('clear', function() {

  it('clears all states that are set', function() {
    State.clear()
    assert(_.isEmpty(State.states))
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


