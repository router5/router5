import types from 'redux-react/constants/ActionTypes'

export function updateState(state) {
    return {
        types: types.UPDATE_STATE,
        state
    }
}
