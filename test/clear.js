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

describe('clear', function() {

  it('clears all states that are set', function() {
    State.clear()
    assert(_.isEmpty(State.states))
  })

  it('returns itself on clear', function() {
    assert(State.clear() instanceof ViewState)
  })

})
