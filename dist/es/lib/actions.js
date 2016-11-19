import * as actionTypes from './actionTypes';

export function navigateTo(name) {
    var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var opts = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    return {
        type: actionTypes.NAVIGATE_TO,
        payload: {
            name: name,
            params: params,
            opts: opts
        }
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
        payload: {
            route: route,
            previousRoute: previousRoute
        }
    };
}

export function transitionSuccess(route, previousRoute) {
    return {
        type: actionTypes.TRANSITION_SUCCESS,
        payload: {
            route: route,
            previousRoute: previousRoute
        }
    };
}

export function transitionError(route, previousRoute, transitionError) {
    return {
        type: actionTypes.TRANSITION_ERROR,
        payload: {
            route: route,
            previousRoute: previousRoute,
            transitionError: transitionError
        }
    };
}

export function canActivate(name, canActivate) {
    return {
        type: actionTypes.CAN_ACTIVATE,
        payload: {
            name: name,
            canActivate: canActivate
        }
    };
}

export function canDeactivate(name, canDeactivate) {
    return {
        type: actionTypes.CAN_DEACTIVATE,
        payload: {
            name: name,
            canDeactivate: canDeactivate
        }
    };
}