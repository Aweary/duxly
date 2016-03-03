# duxly
A redux helper/pattern to simplify the mapping of action constants and sub-reducers [WIP]

# The Problem

Duxly is a simple tool and more generally a pattern for organizing your reducers. I think it fits well within the [ducks-moduler-redux](https://github.com/erikras/ducks-modular-redux) pattern, but no specific structure is enforced.

Often times you'll see a reducer function that looks like:

```js
export default function todos(state = initialState, action) {
  switch (action.type) {
    case ADD_TODO:
      return [
        {
          id: state.reduce((maxId, todo) => Math.max(todo.id, maxId), -1) + 1,
          completed: false,
          text: action.text
        }, 
        ...state
      ]

    case DELETE_TODO:
      return state.filter(todo =>
        todo.id !== action.id
      )

    case EDIT_TODO:
      return state.map(todo =>
        todo.id === action.id ?
          Object.assign({}, todo, { text: action.text }) :
          todo
      )

    case COMPLETE_TODO:
      return state.map(todo =>
        todo.id === action.id ?
          Object.assign({}, todo, { completed: !todo.completed }) :
          todo
      )

    case COMPLETE_ALL:
      const areAllMarked = state.every(todo => todo.completed)
      return state.map(todo => Object.assign({}, todo, {
        completed: !areAllMarked
      }))

    case CLEAR_COMPLETED:
      return state.filter(todo => todo.completed === false)

    default:
      return state
  }
}

```

All the business logic for each action is managed directly within the switch statement. If this pattern is continued for larger applications, the `reducer` function can get really tall and difficult to parse, visually.

One pattern `duxly` recommends is to use functions that have the same `(state, action) => state` signature that the `reducer` does. Duxly calls these "subreducers", since they're essentially reducers within reducers. This lets you break out your logic into named functions that you can more easily document and read. It also lets you break out your subreducers into another file and simply import them.


```js
import {
 addTodo,
 deleteTodo,
 editTodo,
 completeTodo,
 completeAll,
 clearCompleted
} from './subreducers';

export default function todos(state = initialState, action) {
  switch (action.type) {
    case ADD_TODO:
      return addTodo(state, action);
    case DELETE_TODO:
      return deleteTodo(state, action);
    case EDIT_TODO:
      return editTodo(state, action);
    case COMPLETE_TODO:
      return completeTodo(state, action);
    case COMPLETE_ALL:
      return completeAll(state, action);
    case CLEAR_COMPLETED:
      return clearCompleted(state, action);
    default:
      return state
  }
}
```

With this pattern all of the core logic is contained clearly within a named function that describes exactly what the action will do. `duxly` also recommends that your subreducer name be camel-cased version of your action name, e.g., `ADD_TODO` and `addTodo`.

# What Duxly Does

The final `todos` reducer above is pretty repetitive. Every case just returns the result of a function with the signature `(state, action) => state`. What `duxly` hopes to do is make that pattern a little more succinct. 

Currently `duxly` exports one function, `mapConstantsToReducers` which makes it easier to map your constants to your subreducers. Instead of having a `switch` statement with a `case` for each action returning the subreducer, you can just do:


```js


import {mapActionToReducers} from 'duxly';

import {
 ADD_TODO,
 EDIT_TODO,
 COMPLETE_TODO,
 COMPLETE_ALL,
 CLEAR_COMPLETED
} from './constants';

import {
 addTodo,
 deleteTodo,
 editTodo,
 completeTodo,
 completeAll,
 clearCompleted
} from './subreducers';

...
export default mapActionToReducers({
 [ADD_TODO]: addTodo,
 [EDIT_TODO]: editTodo,
 [COMPLETE_TODO]: completeTodo,
 [COMPLETE_ALL]: completeAll,
 [CLEAR_COMPLETED]:clearCompleted
})
```

The brackets around the property names are required so that the value of the constant is evaluated and used as the key. This creates a clear 1:1 mapping between actions and subreducers. `mapActionToReducers` automatically handles the default case by returning state, which is recommended by redux.



