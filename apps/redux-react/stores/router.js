import types from 'redux-react/constants/ActionTypes'

const initialState = {routerState: null}

export default function router(state = null, action) {
    switch (action.type) {
        case types.UPDATE_STATE:
            return {routerState: action.state}
        default
            return state
    }
}
