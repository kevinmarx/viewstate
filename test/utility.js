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

describe('toJSON', function() {

  it('returns a JSON object of the current states', function() {
    var s = State.toJSON()
    assert(s)
    assert(typeof s === 'object')
    assert(JSON.stringify(s))
  })

})
