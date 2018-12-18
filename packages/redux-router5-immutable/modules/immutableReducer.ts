import { actionTypes } from 'redux-router5'
import { Record } from 'immutable'

const State = Record({
    route: null,
    previousRoute: null,
    transitionRoute: null,
    transitionError: null
})

function router5Reducer(state = new State(), action) {
    switch (action.type) {
        case actionTypes.TRANSITION_START:
            return state
                .set('transitionRoute', action.payload.route)
                .set('transitionError', null)

        case actionTypes.TRANSITION_SUCCESS:
            return state
                .set('transitionRoute', null)
                .set('transitionError', null)
                .set('previousRoute', action.payload.previousRoute)
                .set('route', action.payload.route)

        case actionTypes.TRANSITION_ERROR:
            return state
                .set('transitionRoute', action.payload.route)
                .set('transitionError', action.payload.transitionError)

        case actionTypes.CLEAR_ERRORS:
            return state
                .set('transitionRoute', null)
                .set('transitionError', null)

        default:
            return state
    }
}

export default router5Reducer
