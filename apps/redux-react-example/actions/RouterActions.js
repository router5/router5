import types from 'redux-react-example/constants/ActionTypes'

export function updateState(state) {
    return {
        types: types.UPDATE_STATE,
        state
    }
}
