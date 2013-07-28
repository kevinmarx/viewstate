// ViewState for Backbone
// Kevin Marx, Sportngin
// license: MIT

(function (root, factory) {
  if ( module && typeof module.exports === 'object' ) { // node.js
    var underscore = require('underscore')
    var backbone = require('backbone')
    module.exports = factory(underscore, backbone)
  } else if (typeof define === 'function' && define.amd) { // require.js
    define(['underscore', 'backbone'], factory)
  } else { // browser globals
    root.ViewState = factory(root._, root.Backbone)
  }
}(this, function (_, Backbone) { 'use strict'

  var ViewState = function(attributes) {
    var attrs = attributes || {}
    this.states = {}
    this.add(attrs)
    this._initStates = deepClone(this.states)
    return this
  }

  _.extend(ViewState.prototype, Backbone.Events, {

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

    add: function(item, states, options) {
      var attr
      var attrs
      var silent
      var current
      var changing
      var prev
      var changes
      var remove
      var state
      var s
      var obj
      options = options || {}

      if (typeof item === 'object') {
        attrs = item
      } else {
        obj = objectify(states, options)
        attrs = obj
        if (typeof attrs !== 'object' || !this.states[item])
          (attrs = {})[item] = obj
      }

      silent         = options.silent
      remove         = options.remove
      changes        = []
      changing       = this._changing
      this._changing = true

      if (!changing) {
        this._previousStates = _.clone(this.states)
        this.changed = {}
      }

      current = this.states[item]
      if (!current || remove) current = this.states

      prev = this._previousStates

      for (attr in attrs) {
        state = attrs[attr]
        if (typeof state === 'object') {
          if (!current[attr]) current[attr] = {}
          this.add(attr, state)
        } else {
          if (_.isEqual(current[attr], state)) changes.push(attr)
          if (_.isEqual(prev[attr], state)) {
            this.changed[attr] = state
          } else {
            delete this.changed[attr]
          }
          remove ? delete current[attr] : current[attr] = state
        }
      }

      if (!silent) {
        if (changes.length) this._pending = true
        for (var i = 0; i < changes.length; i++) {
          this.trigger(changes[i], bool)
        }
      }

      if (changing) return this
      if (!silent) {
        while (this._pending) {
          this._pending = false
          this.trigger('change', this)
        }
      }
      this._pending = false
      this._changing = false
      return this
    },

    remove: function(item, states, options) {
      if (typeof states === 'object') {
        options = states
        return this.add(item, undefined, _.extend({}, options, {remove: true}))
      } else {
        return this.add(item, states, _.extend({}, options, {remove: true}))
      }
    },

    reset: function(item, options) {
      var key
      options = options || {}
      if (!item) {
        if (!_.isEmpty(this.states)) {
          for (key in this.states) {
            this.remove(key, {silent: true})
            if (this._initStates[key]) this.add(key, this._initStates[key], {silent: true})
          }
        } else {
          for (key in this._initStates) {
            this.add(this._initStates, null, {silent: true})
          }
        }
      } else {
        this.remove(this.states[item], {silent: true})
        this.add(item, this._initStates[item], {silent: true})
      }
      if (!options.silent) this.trigger('reset:' + item)
      return this
    },

    clear: function(options) {
      var attrs = {}
      for (var key in this.states) attrs[key] = undefined
      return this.add(attrs, null, _.extend({}, options, {remove: true}))
    }

  })

  return ViewState

}));

function deepClone(source) {
  var dest = {}
  for (var prop in source) {
    if (typeof source[prop] === 'object' && source[prop] !== null)
      dest[prop] = deepClone(source[prop])
    else
      dest[prop] = source[prop]
  }
  return dest
}

function objectify(arr, options) {
  if (!Array.isArray(arr) && typeof arr === 'object') return arr
  options = options || {}
  var obj = {}
  var bool = options.remove ? false : true
  if (typeof arr === 'string') return obj[arr] = bool
  _.each(arr, function(item) {
    obj[item] = bool
  })
  return obj
}

