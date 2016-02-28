import * as actionTypes from './actionTypes';

var initialState = {
    route: null,
    previousRoute: null,
    transitionRoute: null,
    transitionError: null
};

function router5Reducer() {
    var state = arguments.length <= 0 || arguments[0] === undefined ? initialState : arguments[0];
    var action = arguments[1];

    switch (action.type) {
        case actionTypes.TRANSITION_START:
            return babelHelpers.extends({}, state, {
                transitionRoute: action.payload.route,
                transitionError: null
            });

        case actionTypes.TRANSITION_SUCCESS:
            return babelHelpers.extends({}, state, {
                transitionRoute: null,
                transitionError: null,
                previousRoute: action.payload.previousRoute,
                route: action.payload.route
            });

        case actionTypes.TRANSITION_ERROR:
            return babelHelpers.extends({}, state, {
                transitionRoute: action.payload.route,
                transitionError: action.payload.transitionError
            });

        case actionTypes.CLEAR_ERRORS:
            return babelHelpers.extends({}, state, {
                transitionRoute: null,
                transitionError: null
            });

        default:
            return state;
    }
}

export default router5Reducer;