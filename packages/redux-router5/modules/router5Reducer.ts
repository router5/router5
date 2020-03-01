import { State } from 'router5'
import { Reducer } from 'redux'

import * as actionTypes from './actionTypes'

interface Router5ReducerState {
    route: State | null
    previousRoute: State | null
    transitionRoute: State | null
    transitionError: any | null
}

const initialState: Router5ReducerState = {
    route: null,
    previousRoute: null,
    transitionRoute: null,
    transitionError: null
}

const router5Reducer: Reducer<Router5ReducerState> = (
    state = initialState,
    action
) => {
    if (!action.type) {
        return state
    }

    switch (action.type) {
        case actionTypes.TRANSITION_START:
            return {
                ...state,
                transitionRoute: action.payload.route,
                transitionError: null
            }

        case actionTypes.TRANSITION_SUCCESS:
            return {
                ...state,
                transitionRoute: null,
                transitionError: null,
                previousRoute: action.payload.previousRoute,
                route: action.payload.route
            }

        case actionTypes.TRANSITION_ERROR:
            return {
                ...state,
                transitionRoute: action.payload.route,
                transitionError: action.payload.transitionError
            }

        case actionTypes.CLEAR_ERRORS:
            return {
                ...state,
                transitionRoute: null,
                transitionError: null
            }

        default:
            return state
    }
}

export default router5Reducer
