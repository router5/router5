import { NavigationOptions, State } from 'router5'
import * as actionTypes from './actionTypes'

export function navigateTo(
    name: string,
    params?: { [key: string]: any },
    opts: NavigationOptions = {}
) {
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

export function transitionStart(route: State, previousRoute: State | null) {
    return {
        type: actionTypes.TRANSITION_START,
        payload: {
            route,
            previousRoute
        }
    }
}

export function transitionSuccess(route: State, previousRoute: State | null) {
    return {
        type: actionTypes.TRANSITION_SUCCESS,
        payload: {
            route,
            previousRoute
        }
    }
}

export function transitionError(
    route: State,
    previousRoute: State | null,
    transitionError: any
) {
    return {
        type: actionTypes.TRANSITION_ERROR,
        payload: {
            route,
            previousRoute,
            transitionError
        }
    }
}

export function canActivate(name: string, canActivate: boolean) {
    return {
        type: actionTypes.CAN_ACTIVATE,
        payload: {
            name,
            canActivate
        }
    }
}

export function canDeactivate(name: string, canDeactivate: boolean) {
    return {
        type: actionTypes.CAN_DEACTIVATE,
        payload: {
            name,
            canDeactivate
        }
    }
}
