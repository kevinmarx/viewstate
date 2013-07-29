#ViewState: State Tracking For Backbone
![Build Status](https://travis-ci.org/kevinmarx/viewstate.png?branch=master)

ViewState adds model esque state tracking to your Backbone Views.

Without ViewState you might use a Backbone Model on the view to store the current state of the view.
But since `Backbone.Model.set` wipes out the currently set attributes you would be forced to constantly get and set your states
on the model.

## Why use ViewState?

ViewState simplifies state tracking by providing a simplified model on your view with an easy interface. ViewState, like
the Sith, only deals in absolute; either the state exists or it doesn't. This makes adding/removing states quick and easy
and simplifies getting the current state of an item. Also when a state changes, you usually want to tell others about it.
ViewState emits events for every change in data scoped all the way down to the nested items, passing itself and the change attribute
as arguments of the event.

For example:
```javascript
// single item
ViewState.add('spinner')
// which will emit change:spinner

// nested states on an item
ViewState.add('button', ['loading', 'spinner'])
// which will emit change:button:loading change:button:spinning
```
The `change` event is also triggered when removing states from the model.

ViewState is the ideal way for getting your state tracking out of your views and DOM and into a model where it belongs.

## Installation

Nodejs:
```shell
npm install viewstate
```
Browser Global:
```html
<script src="viewstate.js"></script>
```

## Usage

### Initialization
```javascript
var ViewState = require('viewstate')
var State = new ViewState()
```
You can also initialize ViewState with a hash of states
```javascript
var State = new ViewState({ button: { spinner: true, loading: true } })
```

### Adding States
Adding states onto ViewState can be done three ways.

Singular state:
```javascript
ViewState.add('singleItem')
```

Adding a single state to an item:
```javascript
ViewState.add('button', 'loading')
```

Adding multiple states to an item:
```javascript
ViewState.add('button', ['loading', 'spinner', 'disabled'])
```

### Removing States
Removing states can be done in two ways, either by removing an entire item, or by removing states from an item.

Removing a single state or an item with many states:
```javascript
ViewState.remove('button')
```

Removing a single state from an item:
```javascript
ViewState.remove('button', 'loading')
```

Removing multiple states from an item:
```javascript
ViewState.remove('button', ['loading', 'spinner'])
```

### Getting States
You get states from the model the same three ways as adding and removing.

Getting a single state will return its value, whereas getting an item will return a hash of its states.
```javascript
ViewState.get('singleState') // will return true or undefined
ViewState.get('item') // will return a hash of states set {spinner: true, loading: true}
```

You can also get states on an item by passing one or many as the second argument to `get`
```javascript
ViewState.get('item', 'spinner') // will return true or undefined
ViewState.get('item', ['disabled', 'loading']) // will return a hash of only currently set states {disabled: true}
```

### Resetting States
ViewState stores off its states when it is initialized, by using `reset` you can revert all or some of the states back to their initialization state.
This will trigger a `reset` event with ViewState as the argument.
Note: this will add states if they no longer exist or remove states if they weren't present at the time of initialization.

Reset all states to initialization state:
```javascript
ViewState.reset() // will reset all states
```

Reset a single state or an item back to its initialization state:
```javascript
ViewState.reset('button') // will reset only `button`
```

### Clearing States
If you find yourself ever needing to clear all states from ViewState you can just use the `clear` method. This will trigger a `clear` event with the ViewState as the argument.
```javascript
ViewState.clear() // will remove all states
```

### toJSON
If you find yourself ever needing to get the status of all the states that are active you can use the `toJSON` method to get a hash of the data.
```javascript
ViewState.toJSON()
```

### Options
As like Backbone you can pass `{silent: true}` into `add`, `remove`, `reset`, and `clear` to supress the event for that method
from being triggered.


