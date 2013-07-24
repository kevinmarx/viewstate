// State model for Backbone
// Kevin Marx, Sportngin
// license: MIT

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['underscore', 'backbone'], factory)
  } else {
    root.State = factory(root._, root.Backbone)
  }
}(this, function (_, Backbone) { 'use strict'

  var State = function(attributes) {
    var attrs = attributes || {}
    this.states = {}
    this._initStates = deepClone(null, attrs)
    this.set(attributes)
  }

  _.extend(State.prototype, Backbone.Events, {

    toJSON: function() {
      return _.clone(this.states)
    },

    get: function(item, states) {
      if (!states) return this.states[item]
      if (Array.isArray(states)) {
        var attrs = {}
        _.each(states, function(state) {
          attrs[state] = this.states[item][state]
        }, this)
        return attrs
      }
      return this.states[item][states]
    },

    set: function(item, states, options) {
      if (typeof states === 'object' && !options && arguments.length === 2) {
        options = states
        states = undefined
      }
      var silent = options.silent

      if (Array.isArray(states)) {
        _.each(states, function(state) {
          this.states[item][state] = true
          if (!silent) this.trigger(item + ':' + state, true)
        }, this)
        return this
      } else {
        states ? this.states[item][states] = true : this.states[item] = true
        if (!silent) this.trigger(item + ':' + states, true)
        return this
      }
    },

    unset: function(item, states, options) {
      if (typeof states === 'object' && !options && arguments.length === 2) {
        options = states
        states = undefined
      }
      var silent = options.silent

      if (Array.isArray(states)) {
        _.each(states, function(state) {
          this.states[item][state] = false
          if (!silent) this.trigger(item + ':' + state, false)
        }, this)
        return this
      } else {
        states ? this.states[item][states] = false : this.states[item] = false
        if (!silent) this.trigger(item + ':' + states, false)
        return this
      }
    },

    reset: function(item, options) {
      options = options || {}
      if (!item) {
        if (options.empty)
          this.states = {}
        else
          this.states = this._initStates
      } else {
        if (options.empty)
          this.states[item] = {}
        else
          this.states[item] = this._initStates[item]
      }
      if (!options.silent) this.trigger('reset:' + item)
      return this
    }

  })

  return State

}));

function deepClone(dest, source) {
  dest = dest || {}
  for (var prop in source) {
    if (typeof source[prop] === 'object' && source[prop] !== null)
      clone(dest[prop], source[prop])
    else
      dest[prop] = source[prop]
  }
  return dest
}
