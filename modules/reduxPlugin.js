import * as actions from './actions';

const reduxPlugin = (dispatch) =>
    () => ({
        name: 'REDUX_PLUGIN',
        onTransitionStart(toState, fromState) {
            dispatch(actions.transitionStart(toState, fromState));
        },
        onTransitionSuccess(toState, fromState) {
            dispatch(actions.transitionSuccess(toState, fromState));
        },
        onTransitionError(toState, fromState, err) {
            dispatch(actions.transitionError(toState, fromState, err));
        }
    });

export default reduxPlugin;
