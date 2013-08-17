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
