import * as actions from './actions';

function reduxPluginFactory(dispatch) {
    return function reduxPlugin() {
        return {
            onTransitionStart(toState, fromState) {
                dispatch(actions.transitionStart(toState, fromState));
            },
            onTransitionSuccess(toState, fromState) {
                dispatch(actions.transitionSuccess(toState, fromState));
            },
            onTransitionError(toState, fromState, err) {
                dispatch(actions.transitionError(toState, fromState, err));
            }
        };
    };
}

export default reduxPluginFactory;
