import * as actionTypes from './actionTypes'

export function navigateTo(name, params = {}, opts = {}) {
    return {
        type: actionTypes.NAVIGATE_TO,
        payload: {
            name,
            params,
            opts
        }
    }
}

export function cancelTransition() {
    return {
        type: actionTypes.CANCEL_TRANSITION
    }
}

export function clearErrors() {
    return {
        type: actionTypes.CLEAR_ERRORS
    }
}

export function transitionStart(route, previousRoute) {
    return {
        type: actionTypes.TRANSITION_START,
        payload: {
            route,
            previousRoute
        }
    }
}

export function transitionSuccess(route, previousRoute) {
    return {
        type: actionTypes.TRANSITION_SUCCESS,
        payload: {
            route,
            previousRoute
        }
    }
}

export function transitionError(route, previousRoute, transitionError) {
    return {
        type: actionTypes.TRANSITION_ERROR,
        payload: {
            route,
            previousRoute,
            transitionError
        }
    }
}

export function canActivate(name, canActivate) {
    return {
        type: actionTypes.CAN_ACTIVATE,
        payload: {
            name,
            canActivate
        }
    }
}

export function canDeactivate(name, canDeactivate) {
    return {
        type: actionTypes.CAN_DEACTIVATE,
        payload: {
            name,
            canDeactivate
        }
    }
}
