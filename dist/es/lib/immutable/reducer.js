import * as actionTypes from '../actionTypes';
import { Record } from 'immutable';

// eslint-disable-next-line new-cap
var State = Record({
  route: null,
  previousRoute: null,
  transitionRoute: null,
  transitionError: null
});

function router5Reducer() {
  var state = arguments.length <= 0 || arguments[0] === undefined ? new State() : arguments[0];
  var action = arguments[1];

  switch (action.type) {
    case actionTypes.TRANSITION_START:
      return state.set('transitionRoute', action.payload.route).set('transitionError', null);

    case actionTypes.TRANSITION_SUCCESS:
      return state.set('transitionRoute', null).set('transitionError', null).set('previousRoute', action.payload.previousRoute).set('route', action.payload.route);

    case actionTypes.TRANSITION_ERROR:
      return state.set('transitionRoute', action.payload.route).set('transitionError', action.payload.transitionError);

    case actionTypes.CLEAR_ERRORS:
      return state.set('transitionRoute', null).set('transitionError', null);

    default:
      return state;
  }
}

export default router5Reducer;