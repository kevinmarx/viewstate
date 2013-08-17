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
