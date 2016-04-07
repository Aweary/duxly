"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mapActionsToReducers = mapActionsToReducers;
function mapActionsToReducers(actions) {
  return function (state, payload) {
    var returnDefaultState = function returnDefaultState() {
      return state;
    };
    var reducer = actions[payload.type] || returnDefaultState;
    reducer(state, payload);
  };
}
