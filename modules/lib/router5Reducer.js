import * as actionTypes from './actionTypes';

const initialState = {
    route: null,
    previousRoute: null,
    transitionRoute: null,
    transitionError: null
};

function router5Reducer(state = initialState, action) {
    switch(action.type) {
        case actionTypes.TRANSITION_START:
            return {
                ...state,
                transitionRoute: action.payload.route,
                transitionError: null
            };

        case actionTypes.TRANSITION_SUCCESS:
            return {
                ...state,
                transitionRoute: null,
                transitionError: null,
                previousRoute: action.payload.previousRoute,
                route: action.payload.route
            };

        case actionTypes.TRANSITION_ERROR:
            return {
                ...state,
                transitionRoute: action.payload.route,
                transitionError: action.payload.transitionError
            };

        case actionTypes.CLEAR_ERRORS:
            return {
                ...state,
                transitionRoute: null,
                transitionError: null
            };

        default:
            return state;
    }

}

export default router5Reducer;
