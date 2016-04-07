'use strict';

var expect = require('chai').expect;
var mapActionsToReducers = require('./lib/index').mapActionsToReducers;
let called;

describe('duxly', () => {
  beforeEach(() => {
    called = false;
  });
  describe('mapActionsToReducers', () => {
    it('should be a function', () => {
      expect(mapActionsToReducers).to.be.a('function');
    });

    it('should return a function', () => {
      const returnValue = mapActionsToReducers({});
      expect(returnValue).to.be.a('function');
    });

    it('should call the reducer for the registered action', () => {

      const action = {
        type: 'TEST_ACTION',
        payload: 42
      }

      const reducer = (state, action) => {
        called = true;
      }

      const mappedFunction = mapActionsToReducers({
        'TEST_ACTION': reducer
      });

      mappedFunction(null, action);

      expect(called).to.equal(true);
    });
  });
});
