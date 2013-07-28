var assert = require('assert')
var ViewState = require('../lib/viewstate')
var _ = require('underscore')

var testItem = {
  'testItem': {
    'spinning': true,
    'loading': true
  }
}

describe('ViewState', function() {

  it('creates an instance', function() {
    var State = new ViewState()
    assert(State)
  })

  it('creates an instance with initilization data', function() {
    var State = new ViewState(testItem)
    assert(State)
    assert(!_.isEmpty(State.states))
  })
})


