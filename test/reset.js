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
