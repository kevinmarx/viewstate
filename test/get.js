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
