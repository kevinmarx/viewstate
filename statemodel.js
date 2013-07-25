// StateModel for Backbone
// Kevin Marx, Sportngin
// license: MIT

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['underscore', 'backbone'], factory)
  } else {
    root.StateModel = factory(root._, root.Backbone)
  }
}(this, function (_, Backbone) { 'use strict'

  var StateModel = function(attributes) {
    var attrs = attributes || {}
    this.states = {}
    this.set(attrs)
    this._initStates = deepClone(this.states)
    return this
  }

  _.extend(StateModel.prototype, Backbone.Events, {

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

    set: function(item, states, bool, options) {
      var attr, attrs, silent, current, changing, prev, changes, unset, state, s, obj

      if (typeof bool === 'object') {
        options = bool
        bool = undefined
      }

      if (bool !== false) bool = true
      options = options || {}

      if (typeof item === 'object') {
        attrs = item
      } else {
        obj = objectify(states, bool)
        attrs = obj
        if (typeof attrs !== 'object' || !this.states[item])
          (attrs = {})[item] = obj
      }

      silent         = options.silent
      unset          = options.unset
      changes        = []
      changing       = this._changing
      this._changing = true

      if (!changing) {
        this._previousStates = _.clone(this.states)
        this.changed = {}
      }

      current = this.states[item]
      if (!current || unset) current = this.states

      prev = this._previousStates

      for (attr in attrs) {
        state = attrs[attr]
        if (typeof state === 'object') {
          if (!current[attr]) current[attr] = {}
          this.set(attr, state)
        } else {
          if (_.isEqual(current[attr], state)) changes.push(attr)
          if (_.isEqual(prev[attr]), state) {
            this.changed[attr] = state
          } else {
            delete this.changed[attr]
          }
          unset ? delete current[attr] : current[attr] = state
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

    unset: function(item, states, options) {
      if (typeof states === 'object') {
        options = states
        return this.set(item, void 0, _.extend({}, options, {unset: true}))
      } else {
        return this.set(item, states, _.extend({}, options, {unset: true}))
      }
    },

    reset: function(item, options) {
      options = options || {}
      if (!item) {
        if (!_.isEmpty(this.states)) {
          for (var key in this.states) {
            this.unset(key, {silent: true})
            if (this._initStates[key]) this.set(key, this._initStates[key], {silent: true})
          }
        } else {
          for (var key in this._initStates) {
            this.set(this._initStates, null, {silent: true})
          }
        }
      } else {
        this.unset(this.states[item], {silent: true})
        this.set(item, this._initStates[item], {silent: true})
      }
      if (!options.silent) this.trigger('reset:' + item)
      return this
    },

    clear: function(options) {
      var attrs = {}
      for (var key in this.states) attrs[key] = void 0
      return this.set(attrs, null, _.extend({}, options, {unset: true}))
    }

  })

  return StateModel

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

function objectify(arr, bool) {
  if (!arr) return bool
  if (!Array.isArray(arr) && typeof arr === 'object') return arr
  var obj = {}
  if (typeof arr === 'string') return obj[arr] = bool
  _.each(arr, function(item) {
    obj[item] = bool
  })
  return obj
}

