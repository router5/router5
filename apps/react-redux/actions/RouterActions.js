export function updateState(toState, fromState) {
    return {
        type: 'UPDATE_STATE',
        toState,
        fromState
    };
}
