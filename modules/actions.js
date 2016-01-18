import * as actionTypes from './actionTypes';

export function navigateTo(name, params = {}, opts = {}) {
    return {
        type: actionTypes.NAVIGATE_TO,
        name,
        params,
        opts
    };
}

export function cancelTransition() {
    return {
        type: actionTypes.CANCEL_TRANSITION
    };
}

export function clearErrors() {
    return {
        type: actionTypes.CLEAR_ERRORS
    };
}

export function transitionStart(route, previousRoute) {
    return {
        type: actionTypes.TRANSITION_START,
        route,
        previousRoute
    };
}

export function transitionSuccess(route, previousRoute) {
    return {
        type: actionTypes.TRANSITION_SUCCESS,
        route,
        previousRoute
    };
}

export function transitionError(route, previousRoute, transitionError) {
    return {
        type: actionTypes.TRANSITION_ERROR,
        route,
        previousRoute,
        transitionError
    };
}
