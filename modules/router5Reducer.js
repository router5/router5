import actionTypes from './actionTypes';

const initialState = {
    route: null,
    previousRoute: null,
    transitionRoute: null,
    transitionError: null
};

function router5Reducer(state = initialState, action) {
    switch(action.type) {
        case actionTypes.TRANSTION_START:
            return {
                ...state,
                transitionRoute: action.route,
                transitionError: null
            };

        case actionTypes.TRANSITION_SUCCESS:
            return {
                ...state,
                transitionRoute: null,
                transitionError: null,
                previousRoute: action.previousRoute,
                route: action.route
            };

        case actionTypes.TRANSITION_ERROR:
            return {
                ...state,
                transitionRoute: action.route,
                transitionError: action.transitionError
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
