const initialState = {
    previousState: null,
    state: null
};

export default function router(state = initialState, action) {
    switch (action.type) {
        case 'UPDATE_STATE':
            return { previousState: action.fromState, routerState: action.toState };
        default:
            return state;
    }
}
