module.exports = function() { "use strict"

  var Backbone = require('backbone')

  var Fixtures = {

    testObj: function() {
      return {
        'nestedState': {
          'spinning': true,
          'loading': true,
          'disabled': true
        },
        'singularState': true
      }
    },

    testModel: function(i) {
      return new Backbone.Model({ id: i || 1, foo: 'bar' })
    },

    testCollection: function(count) {
      var coll = []
      for (var i = 0; i < count; i++) {
        coll.push(this.testModel(count))
      }

      return new Backbone.Collection(coll)
    }

  }

  return Fixtures

}
