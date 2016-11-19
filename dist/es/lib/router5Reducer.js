var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import * as actionTypes from './actionTypes';

var initialState = {
    route: null,
    previousRoute: null,
    transitionRoute: null,
    transitionError: null
};

function router5Reducer() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
    var action = arguments[1];

    switch (action.type) {
        case actionTypes.TRANSITION_START:
            return _extends({}, state, {
                transitionRoute: action.payload.route,
                transitionError: null
            });

        case actionTypes.TRANSITION_SUCCESS:
            return _extends({}, state, {
                transitionRoute: null,
                transitionError: null,
                previousRoute: action.payload.previousRoute,
                route: action.payload.route
            });

        case actionTypes.TRANSITION_ERROR:
            return _extends({}, state, {
                transitionRoute: action.payload.route,
                transitionError: action.payload.transitionError
            });

        case actionTypes.CLEAR_ERRORS:
            return _extends({}, state, {
                transitionRoute: null,
                transitionError: null
            });

        default:
            return state;
    }
}

export default router5Reducer;